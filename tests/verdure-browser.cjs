// QA ciblée de Verdure: vrais clics, rendu, accessibilité et audio volontaire.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('playwright');
const { opening, camp } = require('./campaign-path.cjs');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'));

(async () => {
  const server = http.createServer((req,res) => {
    if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); }
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);
  });
  let browser;
  const errors=[];
  try {
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    browser=await chromium.launch({headless:true,...(process.env.DD5_CHROMIUM_PATH?{executablePath:process.env.DD5_CHROMIUM_PATH}:{})});
    const url=`http://127.0.0.1:${server.address().port}`;
    const page=await browser.newPage({viewport:{width:1440,height:1100}});
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(()=>{
      const Native=window.AudioContext;
      window.__audio={contexts:[],gains:[],suspends:0,stops:0,oscillators:0};
      window.AudioContext=class extends Native {
        constructor(...args){super(...args);window.__audio.contexts.push(this);}
        createGain(){
          const gain=super.createGain(),set=gain.gain.setValueAtTime.bind(gain.gain);gain.__scheduledValues=[];
          gain.gain.setValueAtTime=(value,time)=>{gain.__scheduledValues.push(value);return set(value,time);};
          window.__audio.gains.push(gain);return gain;
        }
        createBufferSource(){const source=super.createBufferSource(),stop=source.stop.bind(source);source.stop=(...args)=>{window.__audio.stops++;return stop(...args);};return source;}
        createOscillator(){window.__audio.oscillators++;return super.createOscillator();}
        suspend(){window.__audio.suspends++;return super.suspend();}
      };
    });
    await page.goto(url);
    assert.equal(await page.evaluate(()=>uiState.preferences.sound),false);
    assert.equal(await page.evaluate(()=>window.__audio.contexts.length),0,'Aucun contexte audio avant activation volontaire.');
    async function resume(){if(await page.locator('[data-choice="report-continue"]').count()) await page.locator('[data-choice="report-continue"]').click();}
    async function choose(id){await resume();await page.locator(id.startsWith('@')?`[data-direction="${id.slice(1)}"]`:`[data-choice="${id}"]`).click();}
    async function palette(){
      const counts=await page.evaluate(()=>['gameCanvas','actionCanvas'].map(id=>{
        const canvas=document.getElementById(id),data=canvas.getContext('2d').getImageData(0,0,320,200).data,colors=new Set();
        for(let i=0;i<data.length;i+=4) colors.add(`${data[i]},${data[i+1]},${data[i+2]},${data[i+3]}`);
        return [id,colors.size];
      }));
      for(const [id,count] of counts) assert.ok(count<=48,`${id}: ${count} couleurs`);
    }
    async function replayChecks(){
      const snapshot=()=>page.evaluate(()=>JSON.stringify({characters,flags,variables,acts,room:gameState.roomId,
        inventory:gameState.inventory,checkpoints:gameState.checkpoints,report:gameState.lastReport,
        timeline:gameState.timelineApplied,resolved:gameState.resolvedOptions,saved:localStorage.getItem(SAVE_KEY)}));
      const before=await snapshot();await page.locator('#replayActionButton').click();
      assert.equal(await snapshot(),before,'Revoir ne doit pas rejouer la décision ni écrire la sauvegarde.');
      const check=await page.evaluate(()=>{
        const positions=()=>['sceneTitle','sceneNarrative','choiceList'].map(id=>{
          const r=document.getElementById(id).getBoundingClientRect();return [r.left+scrollX,r.top+scrollY,r.width,r.height];
        });
        const original=gameState.tick,start=uiState.effect.startedTick;
        gameState.tick=start+3;render();const first=document.getElementById('actionCanvas').toDataURL(),position=positions();
        render();const same=first===document.getElementById('actionCanvas').toDataURL();
        gameState.tick=start+9;render();const stable=JSON.stringify(position)===JSON.stringify(positions());
        gameState.tick=original;render();return {same,stable};
      });
      assert.equal(check.same,true,'Effet identique à tick fixé.');
      assert.equal(check.stable,true,'Les secousses ne déplacent pas le texte ni les boutons.');
      await palette();
    }
    const backgrounds=[];
    for(const id of opening.slice(0,opening.indexOf('fin-acte'))){
      await choose(id);
      if(id==='swift-diplomatie') await replayChecks();
      if(['mission-sanctuaire','tunnel-temple','mission-moulin','vers-duel'].includes(id)){
        await resume();
        const scene=await page.evaluate(()=>PRESENTATION.scenes[gameState.roomId].art);
        backgrounds.push(await page.evaluate(key=>getSceneArt(key).toDataURL(),scene));
        await palette();
        const capture={'tunnel-temple':'temple','mission-moulin':'mill','vers-duel':'duel'}[id];
        if(capture) await page.screenshot({path:`/tmp/dd5-v2-${capture}.png`,fullPage:true});
      }
      if(id==='temple-evacuation'){
        assert.equal(await page.locator('#actionScene').isVisible(),true);
        assert.match(await page.locator('#actionCaption').innerText(),/brouillard/);
        await replayChecks();
        await page.screenshot({path:'/tmp/dd5-v2-fog.png',fullPage:true});
      }
      if(['moulin-assaut','dragon-defendre','duel-campagne'].includes(id)) await replayChecks();
    }
    assert.equal(new Set(backgrounds).size,4,'Tunnel, temple, moulin et duel doivent avoir quatre fonds distincts.');
    const legacy=JSON.parse(await page.evaluate(()=>localStorage.getItem(SAVE_KEY)));
    delete legacy.gameState.lastReport.optionId;
    const legacyPage=await browser.newPage();legacyPage.on('pageerror',e=>errors.push(e.message));
    await legacyPage.addInitScript(saved=>localStorage.setItem('clanDestain.save.v1',saved),JSON.stringify(legacy));
    await legacyPage.goto(url);
    assert.equal(await legacyPage.evaluate(()=>gameState.roomId),legacy.gameState.roomId);
    assert.equal(await legacyPage.locator('#actionScene').isHidden(),true,'Un ancien résultat sans optionId reste lisible.');
    assert.equal(await legacyPage.locator('#sceneTitle').innerText(),legacy.gameState.lastReport.title);
    await legacyPage.close();
    // Sauvegarde importée avec acteur indisponible: aucune animation de combat trompeuse.
    const unavailable=JSON.parse(JSON.stringify(legacy));
    unavailable.gameState.lastReport.optionId='duel-campagne';unavailable.characters.drekthar.state='captured';
    const unavailablePage=await browser.newPage();unavailablePage.on('pageerror',e=>errors.push(e.message));
    await unavailablePage.addInitScript(saved=>localStorage.setItem('clanDestain.save.v1',saved),JSON.stringify(unavailable));
    await unavailablePage.goto(url);
    assert.equal(await unavailablePage.evaluate(()=>getActionDirection()),null);
    assert.equal(await unavailablePage.locator('#actionScene').isHidden(),true);
    await unavailablePage.close();
    for(const id of [...opening.slice(opening.indexOf('fin-acte')),...camp.slice(0,camp.indexOf('revanche-drekthar')+1)]) await choose(id);
    assert.equal(await page.evaluate(()=>PRESENTATION.scenes[gameState.lastReport.roomId].art),'cave_duel');
    await replayChecks();
    await page.screenshot({path:'/tmp/dd5-v2-cave-duel.png',fullPage:true});

    await page.locator('#ambianceButton').click();
    await page.locator('#effectsSetting').uncheck();
    await page.locator('#motionSetting').selectOption('reduced');
    await page.locator('[data-close="ambianceDialog"]').click();
    assert.equal(await page.locator('#actionScene').isHidden(),true);
    await page.reload();
    assert.deepEqual(await page.evaluate(()=>[uiState.preferences.effects,uiState.preferences.motion,uiState.reducedMotion]),[false,'reduced',true]);
    await page.locator('#ambianceButton').click();await page.locator('#effectsSetting').check();
    await page.locator('#motionSetting').selectOption('auto');
    await page.locator('#soundSetting').check();
    await page.waitForFunction(()=>uiState.audioReady===true);
    assert.equal(await page.evaluate(()=>window.__audio.contexts.length),1);
    await page.locator('[data-close="ambianceDialog"]').click();await page.locator('#replayActionButton').click();
    await page.waitForFunction(()=>window.__audio.oscillators>0);
    await page.locator('#ambianceButton').click();
    await page.locator('#soundSetting').uncheck();
    await page.waitForFunction(()=>!uiState.audioReady&&window.__audio.contexts[0].state==='suspended');
    assert.equal(await page.evaluate(()=>window.__audio.gains[0].__scheduledValues.at(-1)),0,'Muet planifie la coupure du gain principal avant suspension.');
    assert.ok(await page.evaluate(()=>window.__audio.stops)>=2,'Muet arrête les deux sources d’ambiance.');
    assert.ok(await page.evaluate(()=>window.__audio.suspends)>=1);
    await page.locator('#soundSetting').check();await page.waitForFunction(()=>uiState.audioReady===true);
    await page.reload();
    assert.equal(await page.evaluate(()=>window.__audio.contexts.length),0,'Recharger ne déclenche aucun autoplay.');
    assert.equal(await page.evaluate(()=>Boolean(uiState.audioReady)),false);
    assert.deepEqual(await page.evaluate(()=>[uiState.preferences.effects,uiState.preferences.motion]),[true,'auto']);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>uiState.reducedMotion);
    assert.equal(await page.evaluate(()=>effectProgress()),1,'La préférence système arrête la progression animée.');

    const refused=await browser.newPage();refused.on('pageerror',e=>errors.push(e.message));
    await refused.addInitScript(()=>{window.AudioContext=class{constructor(){throw new Error('Audio refusé pour le test');}};window.webkitAudioContext=undefined;});
    await refused.goto(url);await refused.locator('#ambianceButton').click();await refused.locator('#soundSetting').click();
    await refused.waitForFunction(()=>!uiState.preferences.sound&&document.getElementById('soundNotice').textContent.includes('n’a pas pu'));
    assert.equal(await refused.locator('#soundSetting').isChecked(),false);
    assert.equal(await refused.locator('#sceneNarrative').isVisible(),true);
    await refused.close();

    for(const width of [1440,390,320]){
      await page.setViewportSize({width,height:width===1440?1100:844});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Débordement à ${width}px`);
      await page.locator('#ambianceButton').click();
      const box=await page.locator('#ambianceDialog').boundingBox();
      assert.ok(box.x>=0&&box.x+box.width<=width,`Réglages hors écran à ${width}px`);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      if(width===1440) await page.screenshot({path:'/tmp/dd5-v2-ambiance.png',fullPage:true});
      await page.locator('[data-close="ambianceDialog"]').click();
    }
    assert.deepEqual(errors,[]);
    console.log('Verdure: cinq décors et deux duels au clic, brouillard et impacts, palette ≤48, effets déterministes et lecture stable OK.');
    console.log('Revoir sans mutation, anciens résultats, réglages persistants, mouvements réduits et écrans 320/390/1440px OK.');
    console.log('Audio: silence initial, activation volontaire, muet, reload sans autoplay et refus gracieux OK.');
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
