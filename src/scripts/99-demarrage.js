    function bindInterface() {
      const onClick = (id, handler) => document.getElementById(id).addEventListener('click', handler);
      onClick('journalButton', () => openJournal('history'));
      onClick('companyButton', openCompany);
      onClick('ambianceButton',()=>{syncAmbianceControls();showDialog('ambianceDialog');});
      document.getElementById('diceSetting').addEventListener('change',event=>{uiState.preferences.diceAnimation=event.target.checked;applyAmbiancePreferences();});
      onClick('replayActionButton',()=>{startSceneEffect();document.getElementById('actionScene').scrollIntoView?.({block:'center',behavior:'auto'});});
      document.getElementById('effectsSetting').addEventListener('change',event=>{uiState.preferences.effects=event.target.checked;applyAmbiancePreferences();});
      document.getElementById('partySetting').addEventListener('change',event=>{uiState.preferences.party=event.target.checked;applyAmbiancePreferences();});
      document.getElementById('motionSetting').addEventListener('change',event=>{uiState.preferences.motion=event.target.value==='reduced'?'reduced':'auto';applyAmbiancePreferences();});
      document.getElementById('soundSetting').addEventListener('change',event=>{uiState.preferences.sound=event.target.checked;storePreferences();activateSound();});
      document.getElementById('volumeSetting').addEventListener('input',event=>{uiState.preferences.volume=Math.max(0,Math.min(1,Number(event.target.value)/100));soundscape.setVolume(uiState.preferences.volume);storePreferences();syncAmbianceControls();});
      document.addEventListener('pointerdown',()=>{if(uiState.preferences.sound && !uiState.audioReady) activateSound();});
      document.addEventListener('visibilitychange',()=>{if(document.hidden){uiState.soundRequest=(uiState.soundRequest ?? 0)+1;uiState.audioReady=false;soundscape.pause();}});
      window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change',event=>{uiState.systemReducedMotion=event.matches;uiState.reducedMotion=event.matches || uiState.preferences.motion==='reduced';uiState.effect=null;syncAmbianceControls();render();scheduleAnimation();});
      onClick('adventureButton', () => document.getElementById('context').scrollIntoView({ behavior: uiState.reducedMotion ? 'instant' : 'smooth' }));
      onClick('chronicleTab', () => openJournal('chronicle'));
      onClick('historyTab', () => openJournal('history'));
      onClick('decisionsTab', () => openJournal('decisions'));
      onClick('undoButton', () => dispatchCommand('undo'));
      onClick('titleButton', () => { document.getElementById('saveMenu').open = false; gameState.lastReport=null; handleSpecialSelection('return_title'); refreshInterface(); });
      onClick('restartButton', () => { document.getElementById('saveMenu').open = false; handleSpecialSelection('restart_campaign'); refreshInterface(); });
      onClick('openImportButton', () => { document.getElementById('saveMenu').open = false; showDialog('importDialog'); });
      onClick('importButton', () => {
        const valid = importSaveFromString(document.getElementById('importPayload').value);
        document.getElementById('importResult').textContent = valid ? 'Sauvegarde importée.' : 'Sauvegarde invalide. Votre partie est conservée.';
        if (valid && loadGame({ silent: true })) { document.getElementById('importDialog').close(); describeCurrentRoom(); }
      });
      document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
      document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
        document.getElementById('saveMenu').open = false; dispatchCommand(button.dataset.command);
      }));
      document.getElementById('promptLine').addEventListener('submit', event => {
        event.preventDefault(); dispatchCommand(inputEl.value); inputEl.value = '';
      });
      document.addEventListener('keydown', event => {
        if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || document.querySelector('dialog[open]')) return;
        if (event.target.closest('input, textarea, select, [contenteditable]')) return;
        if (/^[1-9]$/.test(event.key)) { event.preventDefault(); dispatchCommand(event.key); }
      });
    }

    inputEl.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault(); dispatchCommand(inputEl.value);
        inputEl.value = '';
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        navigateHistory(-1);
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        navigateHistory(1);
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        autocompleteInput();
        return;
      }
      if (event.key === 'Escape') {
        inputEl.value = '';
      }
    });

    bindInterface();
    configureTitleOptions();
    const shouldAutoload = hasSaveData() && URL_PARAMS.get('noautoload') !== '1';
    if (shouldAutoload) {
      const loaded = loadGame({ silent: true });
      writeContext(loaded ? 'Sauvegarde locale restaurée automatiquement.' : 'Sauvegarde illisible conservée. Vous pouvez lancer une nouvelle partie.');
    } else {
      gameState.roomId = 'title_screen';
      writeContext('Écran titre initialisé. Tapez "help" pour commencer.');
      uiState.feedback = '';
    }
    describeCurrentRoom();
    syncAmbianceControls();
    scheduleAnimation();
