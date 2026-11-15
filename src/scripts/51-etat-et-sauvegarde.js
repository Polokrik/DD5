    const gameState = {
      roomId: 'title_screen',
      inventory: ['torche'],
      checkpoints: [],
      gameOver: null,
      tick: 0,
      commandHistory: [],
      historyCursor: -1,
      timelineApplied: [],
      resolvedOptions: [],
      lastReport: null,
      adventureLevel: 1,
      rollHistory: [],
      observations: [],
      decisions: [],
      debugMode: URL_PARAMS.get('debug') === '1'
    };

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const statusEl = document.getElementById('statusStrip');
    const inputEl = document.getElementById('commandInput');
    const uiState = { feedback: '', log: [], chapter: 0, portraits: {}, art: {}, effect: null, framePending: false,
      systemReducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
      reducedMotion: false, preferences: readPreferences() };
    uiState.reducedMotion = uiState.systemReducedMotion || uiState.preferences.motion === 'reduced';

    function readPreferences() {
      const defaults = { effects: true, motion: 'auto', sound: false, volume: 0.25, diceAnimation: true, party: true };
      try {
        const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY));
        if (!saved || typeof saved !== 'object') return defaults;
        return { effects: typeof saved.effects === 'boolean' ? saved.effects : true,
          motion: saved.motion === 'reduced' ? 'reduced' : 'auto', sound: saved.sound === true,
          diceAnimation: saved.diceAnimation !== false, party: saved.party !== false,
          volume: typeof saved.volume === 'number' && Number.isFinite(saved.volume) ? Math.max(0, Math.min(1,saved.volume)) : 0.25 };
      } catch { return defaults; }
    }

    function safeClone(value) {
      return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
    }

    function getCurrentRoom() {
      return DATA.rooms[gameState.roomId];
    }

    function getAvailableOptions(roomId) {
      return computeAvailableOptions(roomId);
    }

    function callSceneHook(hook) {
      DATA.scenes[getCurrentRoom()?.sceneId]?.[hook]?.();
    }

    function callSceneTurn() {
      callSceneHook('onTurn');
    }

    function enterRoom(roomId, reason = 'Déplacement', options = {}) {
      if (!DATA.rooms[roomId]) throw new Error(`Salle inconnue: ${roomId}`);
      if (!options.skipCheckpoint) createCheckpoint(reason);
      if (!options.skipScene) callSceneHook('onExit');
      gameState.roomId = roomId;
      gameState.lastReport = null;
      uiState.effect = null;
      if (!options.skipScene) prepareCurrentRoom();
      uiState.diceAnimation = null;
      if (!options.skipScene) callSceneHook('onEnter');
      if (!options.skipDescribe) describeCurrentRoom();
      if (!options.skipAutoSave) saveGame();
    }

    const INITIAL_CHARACTERS = safeClone(characters);
    const INITIAL_FLAGS = safeClone(flags);
    const INITIAL_VARIABLES = safeClone(variables);
    const INITIAL_ACTS = safeClone(acts);

    function hasSaveData() {
      try { return Boolean(localStorage.getItem(SAVE_KEY)); } catch { return false; }
    }

    function isValidSavePayload(parsed) {
      const record = value => value && typeof value === 'object' && !Array.isArray(value);
      const strings = value => Array.isArray(value) && value.every(v => typeof v === 'string');
      const safeKeys = value => !value || typeof value !== 'object' || Object.keys(value).every(k =>
        !['__proto__', 'constructor', 'prototype'].includes(k) && safeKeys(value[k]));
      const compatible = (value, template) => {
        if (typeof template === 'number') return Number.isFinite(value);
        if (Array.isArray(template)) return strings(value);
        if (record(template)) return record(value) && Object.keys(template).every(k => compatible(value[k], template[k]));
        return typeof value === typeof template;
      };
      const validState = payload => {
        if (!record(payload)) return false;
        const state = payload.gameState;
        if (!record(state) || !Object.hasOwn(rooms, state.roomId)) return false;
        if (!strings(state.inventory) || !strings(state.commandHistory) || !strings(state.timelineApplied)) return false;
        if (state.resolvedOptions !== undefined && !strings(state.resolvedOptions)) return false;
        if (state.decisions !== undefined && (!Array.isArray(state.decisions) || state.decisions.length > 300 || !state.decisions.every(entry => record(entry)
          && ['room', 'id', 'title', 'actor', 'kind'].every(key => typeof entry[key] === 'string') && Number.isInteger(entry.chapter) && (entry.won === null || typeof entry.won === 'boolean')))) return false;
        if (state.observations !== undefined && (!strings(state.observations) || state.observations.length > 300
          || !state.observations.every(key => {
            const [roomId,id] = key.split(':');
            return key === `${roomId}:${id}` && rooms[roomId]?.observations?.some(entry => entry.id === id);
          }))) return false;
        if (state.adventureLevel !== undefined && (!Number.isInteger(state.adventureLevel) || state.adventureLevel < 1 || state.adventureLevel > 20)) return false;
        const validCheck = check => record(check) && typeof check.id === 'string'
          && Object.hasOwn(INITIAL_CHARACTERS, check.actorId)
          && Number.isInteger(check.level) && check.level >= 1 && check.level <= 20
          && Number.isInteger(check.natural) && check.natural >= 1 && check.natural <= 20
          && Number.isInteger(check.dc) && check.dc >= 1 && check.dc <= 50
          && ['str','dex','con','int','wis','cha'].includes(check.ability)
          && ['ability','attack'].includes(check.kind) && typeof check.label === 'string'
          && ['bonus','abilityModifier','proficiencyBonus','otherBonus','total'].every(key => Number.isFinite(check[key]))
          && check.bonus === check.abilityModifier + check.proficiencyBonus + check.otherBonus
          && check.total === check.natural + check.bonus && typeof check.success === 'boolean'
          && check.critical === (check.kind === 'attack' ? check.natural === 20 ? 'success' : check.natural === 1 ? 'failure' : null : null)
          && check.success === (check.critical === 'success' || (check.critical !== 'failure' && check.total >= check.dc));
        if (state.rollHistory !== undefined && (!Array.isArray(state.rollHistory) || state.rollHistory.length > 100 || !state.rollHistory.every(validCheck))) return false;
        if (state.lastReport?.check != null && !validCheck(state.lastReport.check)) return false;
        if (state.lastReport != null && (!record(state.lastReport) || !Object.hasOwn(rooms, state.lastReport.roomId)
          || typeof state.lastReport.title !== 'string' || !strings(state.lastReport.paragraphs)
          || !strings(state.lastReport.changes) || typeof state.lastReport.failed !== 'boolean'
          || (state.lastReport.optionId !== undefined && typeof state.lastReport.optionId !== 'string'))) return false;
        if (!Number.isFinite(state.tick) || !Array.isArray(state.checkpoints)) return false;
        if (!record(payload.characters) || Object.keys(payload.characters).length !== Object.keys(INITIAL_CHARACTERS).length || !Object.keys(INITIAL_CHARACTERS).every(id => {
          const c = payload.characters[id];
          return record(c) && ['active', 'injured', 'down', 'absent', 'captured', 'retired', 'dead'].includes(c.state)
            && typeof c.name === 'string' && strings(c.skills);
        })) return false;
        if (!compatible({ dragonRepelled: Boolean(payload.flags?.actICompleted), templeEvacuated: Boolean(payload.flags?.sanctuaireDone), millSaved: Boolean(payload.flags?.moulinDone), confrontationDone: Boolean(payload.flags?.actIICompleted), ...payload.flags }, INITIAL_FLAGS) || !compatible(payload.variables, INITIAL_VARIABLES)) return false;
        return record(payload.acts) && ['ACT_I', 'ACT_II', 'ACT_III', 'ACT_IV', 'ACT_V'].includes(payload.acts.current)
          && strings(payload.acts.unlocked) && payload.acts.unlocked.every(a => /^ACT_(I|II|III|IV|V)$/.test(a));
      };
      if (!safeKeys(parsed) || !validState(parsed) || parsed.gameState.checkpoints.length > 30) return false;
      return parsed.gameState.checkpoints.every(cp => validState(cp)
        && cp.gameState.checkpoints.length === 0 && typeof cp.reason === 'string' && Number.isFinite(cp.timestamp));
    }

    function configureTitleOptions() {
      const canContinue = hasSaveData();
      rooms.title_screen.options = [
        { id: 'title-new', label: 'Nouvelle partie', onSelect: 'title_new_game' },
        ...(canContinue ? [{ id: 'title-continue', label: 'Reprendre', onSelect: 'title_continue' }] : []),
        { id: 'title-clear', label: 'Effacer la sauvegarde', onSelect: 'title_clear_save' },
        { id: 'title-export', label: 'Exporter la sauvegarde', onSelect: 'title_export_save' },
        { id: 'title-import', label: 'Importer une sauvegarde', onSelect: 'title_import_save' },
        { id: 'title-credits', label: 'Crédits', onSuccess: { gotoRoom: 'credits' } }
      ];
    }

    function resetCampaignState() {
      Object.keys(characters).forEach(id => delete characters[id]);
      Object.assign(characters, safeClone(INITIAL_CHARACTERS));
      Object.keys(flags).forEach(key => delete flags[key]);
      Object.assign(flags, safeClone(INITIAL_FLAGS));
      Object.keys(variables).forEach(key => delete variables[key]);
      Object.assign(variables, safeClone(INITIAL_VARIABLES));
      Object.keys(acts).forEach(key => delete acts[key]);
      Object.assign(acts, safeClone(INITIAL_ACTS));
      gameState.roomId = 'hill_overlook';
      gameState.inventory = ['torche'];
      gameState.checkpoints = [];
      gameState.gameOver = null;
      gameState.timelineApplied = [];
      gameState.resolvedOptions = [];
      gameState.lastReport = null;
      uiState.effect = null;
      uiState.diceAnimation = null;
      gameState.adventureLevel = 1;
      gameState.rollHistory = [];
      gameState.observations = [];
      gameState.decisions = [];
    }

    function exportSaveToClipboard() {
      try {
        const payload = localStorage.getItem(SAVE_KEY);
        if (!payload) return writeContext('Aucune sauvegarde à exporter.');
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(payload).catch(() => writeContext('Accès au presse-papiers refusé.'));
        writeContext('Sauvegarde exportée (copiée dans le presse-papiers si autorisé).');
      } catch {
        writeContext('Export impossible pour le moment.');
      }
    }

    function importSaveFromString(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!isValidSavePayload(parsed)) {
          writeContext('Import refusé: structure de sauvegarde invalide.');
          return false;
        }
        localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
        writeContext('Import réussi.');
        return true;
      } catch {
        writeContext('Import refusé: JSON corrompu.');
        return false;
      }
    }

    function showDebugState() {
      if (!gameState.debugMode) return;
      writeContext(`[DEBUG] flags=${JSON.stringify(flags)}`);
      writeContext(`[DEBUG] variables=${JSON.stringify(variables)}`);
      writeContext(`[DEBUG] roster=${JSON.stringify(Object.fromEntries(Object.entries(characters).map(([k,v]) => [k, v.state])))}`);
      writeContext(`[DEBUG] factionTrust=${JSON.stringify(variables.factionTrust ?? {})}`);
      writeContext(`[DEBUG] councilReputation=${JSON.stringify(variables.councilReputation ?? {})}`);
      writeContext(`[DEBUG] ritualProgress=${variables.ritualProgress ?? 0}`);
    }

