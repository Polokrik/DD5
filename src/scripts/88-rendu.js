    function drawBookAmbience(g,key,phase) {
      if (key === 'marsh') {
        for (let i=0;i<8;i++) {
          const x=26+i*37%270,y=173+i*11%24;
          paint(g,ART.waterLight,x+phase%4,y,8+i%4,1);
        }
      }
      if (['ice_sea','ice_cave'].includes(key)) {
        for (let i=0;i<18;i++) {
          const x=(173+i*37+phase*2)%320,y=(79+i*23+phase)%200;
          paint(g,ART.blueLight,x,y,1,1);
        }
      }
      if (key === 'skyreach') {
        for (let i=0;i<4;i++) {
          const x=(196+i*61+phase)%360-20,y=176+i%2*11;
          paint(g,ART.blueLight,x,y,34,1);paint(g,ART.waterLight,x+9,y+2,26,1);
        }
      }
    }

    function render() {
      renderD20();
      const key = PRESENTATION.scenes[gameState.lastReport?.roomId ?? gameState.roomId]?.art ?? 'keep';
      const phase = uiState.reducedMotion ? 0 : Math.floor(Math.max(0,gameState.tick) / 14);
      const direction=getActionDirection(), progress=effectProgress();
      ctx.imageSmoothingEnabled=false;
      const lightning = key === 'verdure' && !uiState.reducedMotion ? lightningLevel(gameState.tick) : 0;
      ctx.drawImage(lightning ? getLitScene(key, lightning) : getSceneArt(key),0,0);
      const shownRoom = gameState.lastReport?.roomId ?? gameState.roomId;
      if (shownRoom === 'egg_chamber' && !flags.eggsStolen && !flags.eggsDestroyed) drawHatcheryEggs(ctx, uiState.reducedMotion ? 0 : gameState.tick);
      if (key === 'caravan' && flags.dragonetsHatched && !uiState.reducedMotion) drawWyrmlingPeek(ctx, gameState.tick);
      if (key === 'portal' && flags.portalDamaged) drawPortalDamage(ctx);
      drawBookAmbience(ctx,key,phase);
      if (key !== 'verdure') drawSceneLife(ctx, key, uiState.reducedMotion ? 0 : gameState.tick);
      if (uiState.preferences.party && !['duel', 'cave_duel'].includes(key) && !direction && !['title_screen', 'credits'].includes(shownRoom)) drawPartyPresence(ctx, uiState.reducedMotion ? 0 : gameState.tick);
      if (key === 'verdure') drawVerdureLife(ctx, uiState.reducedMotion ? 0 : gameState.tick);
      else if (SCENE_DIRECTIONS.scenes[key]?.dragon) {
        if (direction?.kind === 'dragon') {
          const layer=getSceneArt('dragon-flight'), g=layer.getContext('2d');
          g.clearRect(0,0,320,200); drawLennithon(g, uiState.reducedMotion ? 0 : gameState.tick, false); ctx.drawImage(layer,Math.round(progress*155),-Math.round(progress*20));
        } else drawLennithon(ctx, uiState.reducedMotion ? 0 : gameState.tick, false);
      }
      if (key !== 'verdure') (SCENE_DIRECTIONS.scenes[key]?.fires ?? []).forEach(([x,y],i)=>{
        const t = uiState.reducedMotion ? 0 : gameState.tick;
        drawFlame(ctx,x,y,t,i,.8);
      });
      if (key==='duel') drawDuelBackdrop(ctx, uiState.reducedMotion ? 0 : gameState.tick);
      if (key==='duel' || (key==='cave_duel' && (!flags.cyanwrathDead || direction?.kind==='duel'))) {
        drawDuelActors(ctx,direction,progress,key==='cave_duel');
        if (key==='duel') drawDuelForeground(ctx, uiState.reducedMotion ? 0 : gameState.tick);
        if(key==='cave_duel') [148,294].forEach((x,i)=>drawBerserker(ctx,x,175,uiState.reducedMotion ? 0 : gameState.tick,direction?.kind==='duel' && progress>.55,i ? -1 : 1));
      }
      if (key==='temple' && (!gameState.lastReport || gameState.lastReport.failed)) for(let i=0;i<3;i++) {
        paint(ctx,ART.wall,243+i*4,135+i%2,2,2);paint(ctx,ART.cloak,242+i*4,137+i%2,4,9);
      }
      if (!direction || !uiState.preferences.effects) return;
      if (!uiState.actionFrame) { uiState.actionFrame=document.createElement('canvas'); uiState.actionFrame.width=320;uiState.actionFrame.height=200; }
      const frame=uiState.actionFrame,g=frame.getContext('2d');g.imageSmoothingEnabled=false;
      g.drawImage(canvas,0,0);drawSceneAction(g,direction,progress);
      const action=document.getElementById('actionCanvas').getContext('2d');action.imageSmoothingEnabled=false;
      const shake=!uiState.reducedMotion && progress<.22 && ['hammer','clash','duel','dragon'].includes(direction.kind) ? [0,1,0,-1,0,1,0,-1][Math.floor(progress*132/3)%8] : 0;
      action.drawImage(frame,127+shake,68,192,120,0,0,320,200);
    }

    function scheduleAnimation() {
      if (uiState.framePending || uiState.reducedMotion) return;
      uiState.framePending=true;requestAnimationFrame(animationLoop);
    }

    function animationLoop() {
      uiState.framePending=false;
      if (!uiState.reducedMotion) gameState.tick+=1;
      if (gameState.tick%3===0 || uiState.reducedMotion) render();
      scheduleAnimation();
    }

    function dispatchCommand(command) {
      uiState.feedback = '';
      handleCommand(command); callSceneTurn();
      if (gameState.roomId === 'title_screen') configureTitleOptions();
      refreshInterface();
    }

    function syncAmbianceControls() {
      document.getElementById('diceSetting').checked=uiState.preferences.diceAnimation;
      document.getElementById('effectsSetting').checked=uiState.preferences.effects;
      document.getElementById('partySetting').checked=uiState.preferences.party;
      document.getElementById('motionSetting').value=uiState.preferences.motion;
      document.getElementById('soundSetting').checked=uiState.preferences.sound;
      const volume=document.getElementById('volumeSetting');volume.value=Math.round(uiState.preferences.volume*100);
      volume.setAttribute('aria-valuetext',`${volume.value} %`);
      document.getElementById('motionNotice').textContent=uiState.systemReducedMotion ? 'Votre appareil demande des mouvements réduits: les illustrations restent fixes.' : 'Les secousses restent limitées à l’illustration. Le texte et les commandes restent immobiles.';
      if(uiState.preferences.sound && !uiState.audioReady) document.getElementById('soundNotice').textContent='Le son reprendra à votre prochaine action.';
    }

    function storePreferences() {
      try { localStorage.setItem(PREFERENCES_KEY,JSON.stringify(uiState.preferences)); }
      catch { document.getElementById('soundNotice').textContent='Ces réglages sont appliqués pour cette session.'; }
    }

    async function activateSound() {
      const request=(uiState.soundRequest ?? 0)+1;uiState.soundRequest=request;
      const wanted=uiState.preferences.sound;
      const enabled=await soundscape.enable(wanted,uiState.preferences.volume);
      if(request!==uiState.soundRequest) return false;
      uiState.audioReady=wanted && enabled;
      if(wanted && !enabled) { uiState.preferences.sound=false;storePreferences();syncAmbianceControls(); }
      document.getElementById('soundNotice').textContent=wanted && !enabled ? 'Le navigateur n’a pas pu activer le son. La lecture reste disponible.' : uiState.audioReady ? 'Ambiance sonore activée. Vous pouvez couper le son à tout moment.' : 'Le son est désactivé. Le récit reste entièrement compréhensible sans lui.';
      return uiState.audioReady;
    }

    function applyAmbiancePreferences() {
      uiState.reducedMotion=uiState.systemReducedMotion || uiState.preferences.motion==='reduced';
      uiState.effect=null;storePreferences();syncAmbianceControls();refreshInterface();scheduleAnimation();
    }

