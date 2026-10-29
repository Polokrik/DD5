// Outil de validation uniquement : aucune dépendance ajoutée au jeu.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('playwright');
const path = require('./campaign-path.cjs');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'));

(async () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html);
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const executablePath = process.env.DD5_CHROMIUM_PATH;
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const external = [];
    page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:')) external.push(r.url()); });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const input = page.locator('#commandInput');
    async function command(value) { await page.locator('#commandPanel').evaluate(e => e.open = true); await input.fill(value); await input.press('Enter'); }
    async function resume() {
      if (await page.locator('[data-choice="report-continue"]').count()) await page.locator('[data-choice="report-continue"]').click();
    }
    async function choose(id) {
      await resume();
      const selector = id.startsWith('@') ? `[data-direction="${id.slice(1)}"]` : `[data-choice="${id}"]`;
      assert.equal(await page.locator(selector).count(), 1, `${id} absent dans ${await page.evaluate(() => gameState.roomId)}`);
      await page.locator(selector).click();
    }
    assert.equal(await page.locator('#choiceList .choice-card').count(), 3);
    assert.equal(await page.locator('[data-choice="title-continue"]').isDisabled(), true);
    await page.screenshot({ path: '/tmp/dd5-ui-title.png', fullPage: true });
    await page.keyboard.press('3');
    assert.equal(await page.locator('#journalDialog').evaluate(e => e.open), true);
    assert.equal(await page.locator('#chapterList button').count(), 18);
    await page.locator('#chapterList button').last().click();
    assert.match(await page.locator('#chapterReader h3').innerText(), /L’histoire reste à écrire/);
    assert.doesNotMatch(await page.locator('#chapterReader').innerText(), /session|juin|MJ|pas encore été joués/);
    await page.keyboard.press('1');
    assert.equal(await page.evaluate(() => gameState.roomId), 'title_screen');
    await page.keyboard.press('Escape');
    await page.locator('[data-choice="title-new"]').click();
    assert.equal(await page.evaluate(() => gameState.roomId), 'hill_overlook');
    await page.screenshot({ path: '/tmp/dd5-ui-verdure.png', fullPage: true });
    await page.locator('[data-choice="charge-civils"]').click();
    assert.equal(await page.evaluate(() => gameState.roomId), 'swift_street');
    await page.screenshot({ path: '/tmp/dd5-ui-linan.png', fullPage: true });
    assert.equal(await page.locator('#sceneNarrative p').count(), 2);
    await choose('swift-diplomatie');
    assert.equal(await page.evaluate(() => flags.scene2Done), true);
    assert.match(await page.locator('#sceneNarrative').innerText(), /marteau.*Déposez vos armes/s);
    await page.screenshot({ path: '/tmp/dd5-ui-action.png', fullPage: true });
    await page.locator('#undoButton').click();
    assert.equal(await page.evaluate(() => gameState.roomId), 'swift_street');
    await command('undo');
    await page.locator('#saveMenu summary').click();
    await page.locator('[data-command="save"]').click();
    const saved = await page.evaluate(() => localStorage.getItem(SAVE_KEY));
    await page.locator('#saveMenu summary').click(); await page.locator('#openImportButton').click();
    await page.locator('#importPayload').fill('{invalid}'); await page.locator('#importButton').click();
    assert.match(await page.locator('#importResult').innerText(), /invalide/);
    assert.equal(await page.evaluate(() => localStorage.getItem(SAVE_KEY)), saved);
    await page.locator('#importPayload').fill(saved); await page.locator('#importButton').click();
    assert.equal(await page.locator('#importDialog').evaluate(e => e.open), false);
    assert.equal(await page.evaluate(() => gameState.roomId), 'hill_overlook');
    await command('go dragon');
    assert.equal(await page.evaluate(() => gameState.roomId), 'hill_overlook');
    assert.match(await page.locator('#sceneTitle').innerText(), /tentative a échoué/);
    assert.equal(await page.locator('[data-choice="report-continue"]').isVisible(), true);
    await choose('charge-civils'); await command('undo');
    assert.equal(await page.evaluate(() => gameState.roomId), 'hill_overlook');
    for (const id of [...path.opening.slice(1), ...path.camp, ...path.north, ...path.council,
      'plan-sabotage', 'sabotage-identify', 'sabotage-stealth', 'sabotage-arcana',
      'ritual-rally', 'ritual-rally', 'ritual-rally', 'ritual-resolve']) await choose(id);
    await resume();
    assert.equal(await page.evaluate(() => flags.campaignComplete && flags.actVCompleted), true);
    await command('save');
    const before = await page.evaluate(() => JSON.stringify({ characters, flags, variables, acts, room: gameState.roomId }));
    await page.reload();
    assert.equal(await page.evaluate(() => JSON.stringify({ characters, flags, variables, acts, room: gameState.roomId })), before);
    await command('help'); await input.press('ArrowUp'); assert.equal(await input.inputValue(), 'help');
    await input.fill('inv'); await input.press('Tab'); assert.match(await input.inputValue(), /^inventory/);
    await input.press('Escape'); assert.equal(await input.inputValue(), '');
    assert.equal(await page.evaluate(() => ctx.imageSmoothingEnabled), false);
    assert.equal(await page.evaluate(() => {
      gameState.tick = 4; render(); const first = canvas.toDataURL(); render(); return first === canvas.toDataURL();
    }), true);
    const positions = await page.evaluate(() => ['gameCanvas', 'context', 'commandInput'].map(id => document.getElementById(id).getBoundingClientRect().top));
    assert.ok(positions[0] < positions[1] && positions[1] < positions[2]);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await page.screenshot({ path: '/tmp/dd5-browser-smoke.png', fullPage: true });
    // Variante défavorable au clic, sans modifier les scores ni les états du groupe.
    await page.locator('#saveMenu summary').click(); await page.locator('#restartButton').click();
    for (const id of ['approche-riviere','swift-magie','mission-sanctuaire','tunnel-temple','sanctuaire-tunnel']) await choose(id);
    assert.equal(await page.evaluate(() => flags.sanctuaireDone), false);
    assert.match(await page.locator('#reportChanges').innerText(), /Sislay.*Blessé/);
    for (const id of ['mission-sanctuaire','tunnel-temple','temple-evacuation','mission-moulin','moulin-assaut']) await choose(id);
    assert.equal(await page.evaluate(() => flags.templeEvacuated), true);
    assert.equal(await page.evaluate(() => flags.moulinDone), false);
    assert.equal(await page.locator('[data-choice="report-continue"]').isVisible(), true);
    await page.locator('#undoButton').click();
    assert.equal(await page.evaluate(() => gameState.roomId), 'mill_approach');
    assert.equal(await page.evaluate(() => characters.drekthar.state), 'active');
    await page.locator('#saveMenu summary').click(); await page.locator('#titleButton').click();
    assert.equal(await page.locator('[data-choice="title-continue"]').isEnabled(), true);
    await choose('title-continue');
    assert.equal(await page.evaluate(() => gameState.roomId), 'mill_approach');
    // Deux divergences conservées: Cyanwrath vaincu tôt et œufs laissés dans la grotte.
    await page.locator('#saveMenu summary').click(); await page.locator('#restartButton').click();
    for (const id of [...path.opening.slice(1), ...path.camp.slice(0,-2)]) {
      await choose(({ 'duel-campagne':'duel-accept', 'revanche-drekthar':'confrontation-passee', 'voler-oeufs':'laisser-oeufs' })[id] ?? id);
    }
    await resume();
    assert.equal(await page.evaluate(() => flags.WHAT_IF_CYANWRATH_DEAD), true);
    assert.equal(await page.evaluate(() => flags.dragonetsHatched || gameState.inventory.includes('Boule')), false);
    assert.match(await page.locator('#sceneNarrative').innerText(), /sans les dragonnets/);
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    mobile.on('pageerror', e => errors.push(e.message));
    await mobile.goto(`http://127.0.0.1:${server.address().port}`);
    await mobile.locator('[data-choice="title-new"]').click();
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await mobile.evaluate(() => uiState.reducedMotion), true);
    assert.ok(await mobile.locator('#choiceList .choice-card').first().evaluate(e => e.getBoundingClientRect().height >= 44));
    await mobile.screenshot({ path: '/tmp/dd5-ui-mobile.png', fullPage: true });
    await mobile.locator('#companyButton').click();
    assert.equal(await mobile.locator('#companyRoster button').count(), 7);
    await mobile.locator('#companyRoster [data-character="drekthar"]').click();
    assert.match(await mobile.locator('#companyDetails').innerText(), /Demi-orc/);
    await mobile.locator('#companyRoster [data-character="malar"]').click();
    assert.match(await mobile.locator('#companyDetails').innerText(), /Demi-elfe.*marque.*cou/s);
    await mobile.screenshot({ path: '/tmp/dd5-ui-company.png', fullPage: true });
    await mobile.locator('[data-close="companyDialog"]').click();
    await mobile.locator('#commandPanel').evaluate(e => e.open = true);
    await mobile.locator('#commandInput').fill('1'); await mobile.locator('#commandInput').press('Enter');
    assert.equal(await mobile.evaluate(() => gameState.roomId), 'swift_street');
    const colors = await mobile.evaluate(() => {
      const pixels = ctx.getImageData(0, 0, 320, 200).data, unique = new Set();
      for (let i = 0; i < pixels.length; i += 4) unique.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]},${pixels[i+3]}`);
      return unique.size;
    });
    assert.ok(colors >= 20 && colors <= 48, `Palette pixel art: ${colors} couleurs`);
    for (const width of [320, 768, 1024]) {
      await mobile.setViewportSize({ width, height: 844 });
      assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Débordement à ${width}px`);
    }
    await mobile.setViewportSize({width:320,height:844});
    await mobile.locator('#companyButton').click();
    assert.equal(await mobile.locator('#companyRoster button').evaluateAll(buttons=>buttons.every(button=>{
      const r=button.getBoundingClientRect(); return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight;
    })),true,'Les sept personnages doivent être visibles sans défilement horizontal.');
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await mobile.close();
    console.log('Chromium : cinq actes, finale, rollback, sauvegarde/rechargement, clavier et rendu OK ; aucune erreur JS ni requête externe.');
    console.log('Parcours défavorable: échecs rivière, magie, temple et moulin; nouvelle tentative, undo, accueil et reprise OK.');
    console.log('Variantes au clic: Cyanwrath vaincu dès Verdure, confrontation adaptée et absence de dragonnets sans les œufs OK.');
    console.log('Interface : clics, raccourcis numériques, chronique 18 chapitres, portraits, mobile 390 px, mouvements réduits et palette ≤ 48 couleurs OK.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
