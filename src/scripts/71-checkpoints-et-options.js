    // Revenir à une vraie décision: les transitions « mission-* » portent aussi
    // le préfixe Avant décision, mais ne constituent pas des épreuves viables.
    function checkpointOptionIsDecision(option) {
      if (!option || ['navigation-back','navigation-home','navigation-restart','recover-checkpoint'].includes(option.id)) return false;
      const selection = option.onSelect ?? option.onSuccess?.onSelect ?? '';
      if (/^(silly_|serious_|title_|return_title$|restart_campaign$|recover_checkpoint$|decision_back$)/.test(selection)) return false;
      if (option.resolution || option.check || option.d20 || option.characterId || option.requiresCharacters?.length) return true;
      if (selection) return true;
      const effects = option.effects ?? {};
      if (Object.keys(effects).some(key => key !== 'message')) return true;
      return ['onSuccess','onFailure'].some(key => {
        const branch = option[key] ?? {};
        if (branch.characterChanges?.length || Object.keys(branch.variableDelta ?? {}).length) return true;
        return Object.keys(branch.setFlags ?? {}).some(flag => !/^act(?:I|II|III|IV|V)Completed$|Snapshot$/.test(flag));
      });
    }

    function checkpointSupportsOption(checkpoint, option) {
      if (!checkpoint?.gameState || !checkpoint.characters || !option) return false;
      const usable = id => ['active','injured'].includes(checkpoint.characters[id]?.state);
      if (!Object.keys(checkpoint.characters).some(usable)) return false;
      if (option.characterId && !usable(option.characterId)) return false;
      if (option.requiresCharacters && !option.requiresCharacters.every(usable)) return false;
      const snapshotFlags = checkpoint.flags ?? {}, snapshotVariables = checkpoint.variables ?? {};
      if (option.requiresFlag && !snapshotFlags[option.requiresFlag]) return false;
      if (option.forbiddenFlag && snapshotFlags[option.forbiddenFlag]) return false;
      if (option.requiresAllFlags && !option.requiresAllFlags.every(flag => snapshotFlags[flag])) return false;
      if (typeof option.requiresAlertMin === 'number' && (snapshotVariables.castleAlertLevel ?? 0) < option.requiresAlertMin) return false;
      if (option.requiresTrust && !Object.entries(option.requiresTrust).every(([faction, threshold]) => (snapshotVariables.factionTrust?.[faction] ?? 0) >= threshold)) return false;
      if (!option.repeatable && checkpoint.gameState.resolvedOptions?.includes(`${checkpoint.gameState.roomId}:${option.id}`)) return false;
      return true;
    }

    function findDecisionCheckpoint() {
      const checkpoints = gameState.checkpoints ?? [];
      for (let index = checkpoints.length - 1; index >= 0; index--) {
        const checkpoint = checkpoints[index];
        if (typeof checkpoint.reason !== 'string' || !checkpoint.reason.startsWith('Avant décision: ')) continue;
        const optionId = checkpoint.reason.slice('Avant décision: '.length);
        const option = rooms[checkpoint.gameState?.roomId]?.options?.find(candidate => candidate.id === optionId);
        if (checkpointOptionIsDecision(option) && checkpointSupportsOption(checkpoint, option)) return checkpoint;
      }
      // Anciennes sauvegardes et début de partie: accepter un point qui offre
      // au moins une vraie action, jamais une simple nav vers le même blocage.
      for (let index = checkpoints.length - 1; index >= 0; index--) {
        const checkpoint = checkpoints[index], room = rooms[checkpoint.gameState?.roomId];
        if (room?.options?.some(option => checkpointOptionIsDecision(option) && checkpointSupportsOption(checkpoint, option))) return checkpoint;
      }
      return null;
    }

    function restoreDecisionCheckpoint() {
      const target = findDecisionCheckpoint();
      if (!target) {
        writeContext('Aucune décision antérieure praticable ne peut être restaurée. Vous pouvez revenir à l’accueil ou commencer une nouvelle partie.');
        return false;
      }
      const restored = rollbackToLastCheckpoint(target);
      if (restored) {
        writeContext('Le groupe retrouve la situation qui précédait sa dernière décision praticable.');
        describeCurrentRoom();
      }
      return restored;
    }

    function withSafeNavigationOptions(roomId, options = []) {
      const result = options.slice();
      const useful = option => option.disabled !== true && option.locked !== true && option.available !== false
        && !/^(silly_|serious_)/.test(option.onSelect ?? '');
      const usefulCount = () => result.filter(useful).length;
      const add = option => { if (!result.some(existing => existing.id === option.id)) result.push(option); };
      if (usefulCount() < 2 && findDecisionCheckpoint() && !result.some(option => option.onSelect === 'decision_back')) {
        add({ id: 'navigation-back', label: 'Reconsidérer la dernière décision', onSelect: 'decision_back',
          intent: 'Rétablit les états et les ressources d’avant la dernière épreuve ou décision praticable.' });
      }
      if (usefulCount() < 2 && roomId !== 'title_screen' && !result.some(option => option.onSelect === 'return_title')) {
        add({ id: 'navigation-home', label: 'Revenir à l’accueil', onSelect: 'return_title',
          intent: 'Quitter cette scène sans effacer la progression enregistrée.' });
      }
      if (usefulCount() < 2 && !result.some(option => ['restart_campaign','title_new_game'].includes(option.onSelect))) {
        add({ id: 'navigation-restart', label: 'Commencer une nouvelle partie à Verdure', onSelect: 'restart_campaign',
          intent: 'Réinitialise la partie en cours et sa sauvegarde locale.' });
      }
      return result;
    }

    function computeAvailableOptions(roomId) {
      const room = rooms[roomId];
      if (!room?.options) return [];
      const canAct = Object.values(characters).some(c => ['active', 'injured'].includes(c.state));
      const candidates = room.options.map(option => {
        if (!option.groupAction) return option;
        const actors = Object.keys(characters).filter(id => isSkillAvailable(id));
        actors.sort((a,b) => getCheckPreview(option,b).bonus - getCheckPreview(option,a).bonus);
        return { ...option, characterId: actors[0] };
      });
      const available = candidates.filter(option => {
        if (!['title_screen', 'credits'].includes(roomId) && !option.onSelect && !canAct && option.id !== 'ritual-resolve') return false;
        if (option.requiresAnyAvailableCharacter && !option.characterId) return false;
        if (option.whatIfFinale && !WHAT_IF_FINALE) return false;
        if (!option.repeatable && gameState.resolvedOptions.includes(`${roomId}:${option.id}`)) return false;
        if (!isSkillAvailable(option.characterId, option.groupAction ? null : option.skill)) return false;
        if (option.requiresCharacters && !option.requiresCharacters.every(id => isSkillAvailable(id))) return false;
        if (option.requiresFlag && !flags[option.requiresFlag]) return false;
        if (option.forbiddenFlag && flags[option.forbiddenFlag]) return false;
        if (option.requiresAllFlags && !option.requiresAllFlags.every(flagName => flags[flagName])) return false;
        if (option.id === 'ritual-resolve' && variables.finalBattle.decisiveActions < 3 && canAct) return false;
        if (roomId === 'ritual_chamber' && option.resolution && variables.finalBattle.decisiveActions >= 3) return false;
        if (typeof option.requiresAlertMin === 'number' && variables.castleAlertLevel < option.requiresAlertMin) return false;
        if (option.requiresTrust && !Object.entries(option.requiresTrust).every(([faction, threshold]) => (variables.factionTrust?.[faction] ?? 0) >= threshold)) return false;
        return true;
      });
      return withSafeNavigationOptions(roomId, available);
    }

    function addCharacterToParty(characterId) {
      const character = characters[characterId];
      if (!character) return false;
      if (['active', 'injured', 'dead', 'down'].includes(character.state)) return false;
      character.state = 'active';
      return true;
    }

    function removeCharacterFromParty(characterId, state = 'absent') {
      const character = characters[characterId];
      if (!character) return false;
      const allowedStates = new Set(['absent', 'captured', 'retired', 'dead']);
      if (['active', 'injured', 'down'].includes(character.state)) character.departed = true;
      const nextState = allowedStates.has(state) ? state : 'absent';
      if (character.state === nextState) return false;
      character.state = nextState;
      return true;
    }

    function evaluateConditionalExpression(conditional = '') {
      const trimmed = conditional.trim();
      if (!trimmed) return true;
      if (!trimmed.startsWith('if ')) return false;
      const flagKey = trimmed.slice(3).trim();
      return Boolean(flags[flagKey]);
    }

    function fireRosterTimelineTrigger(trigger, context = {}) {
      const events = DATA.rosterTimeline.filter(entry => entry.trigger === trigger);
      events.forEach((entry, index) => {
        const timelineKey = `${trigger}:${index}`;
        if (gameState.timelineApplied.includes(timelineKey)) return;
        if (entry.conditional && !evaluateConditionalExpression(entry.conditional)) return;

        const changedCharacters = [];
        (entry.add ?? []).forEach(characterId => {
          if (addCharacterToParty(characterId)) changedCharacters.push(characters[characterId]?.name || characterId);
        });
        (entry.remove ?? []).forEach(characterId => {
          if (removeCharacterFromParty(characterId, entry.removeState ?? 'absent')) changedCharacters.push(characters[characterId]?.name || characterId);
        });

        gameState.timelineApplied.push(timelineKey);
        if (!changedCharacters.length && !entry.message) return;
        const narrativeMessage = entry.message || `Le groupe évolue (${changedCharacters.join(', ')}).`;
        writeContext(entry.narrativeHook || narrativeMessage);
      });
      if (context.characterId && trigger === 'CHARACTER_DEATH') {
        if (gameState.debugMode) showDebugState();
      updateStatusStrip();
      }
    }

    function peekCheckpoint() {
      return gameState.checkpoints.length > 0 ? gameState.checkpoints[gameState.checkpoints.length - 1] : null;
    }

    function saveGame() {
      try {
        const payload = {
          gameState: safeClone(gameState),
          characters: safeClone(characters),
          flags: safeClone(flags),
          variables: safeClone(variables),
          acts: safeClone(acts)
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
        return true;
      } catch {
        writeContext('Sauvegarde impossible pour le moment.');
        return false;
      }
    }

    function loadGame({ silent = false } = {}) {
      let raw;
      try {
        raw = localStorage.getItem(SAVE_KEY);
      } catch {
        if (!silent) writeContext('Chargement impossible pour le moment.');
        return false;
      }
      if (!raw) {
        if (!silent) writeContext('Aucune sauvegarde locale trouvée.');
        return false;
      }
      try {
        const parsed = JSON.parse(raw);
        if (!isValidSavePayload(parsed)) throw new Error('invalid');

        const restoredGameState = safeClone(parsed.gameState);
        gameState.roomId = restoredGameState.roomId ?? 'hill_overlook';
        gameState.inventory = restoredGameState.inventory ?? [];
        gameState.checkpoints = restoredGameState.checkpoints ?? [];
        gameState.gameOver = null;
        gameState.tick = restoredGameState.tick ?? 0;
        gameState.commandHistory = restoredGameState.commandHistory ?? [];
        gameState.historyCursor = gameState.commandHistory.length;
        gameState.timelineApplied = restoredGameState.timelineApplied ?? [];
        gameState.rollHistory = restoredGameState.rollHistory ?? [];
        gameState.observations = restoredGameState.observations ?? [];
        gameState.decisions = restoredGameState.decisions ?? [];
        gameState.resolvedOptions = restoredGameState.resolvedOptions ?? [];
        gameState.lastReport = restoredGameState.lastReport ?? null;
        uiState.effect = null;
        uiState.diceAnimation = null;
        gameState.adventureLevel = restoredGameState.adventureLevel ?? (DATA.actRooms.ACT_V.includes(restoredGameState.roomId) ? 12 : ADVENTURE_LEVELS[restoredGameState.roomId] ?? 1);

        Object.keys(characters).forEach(id => delete characters[id]);
        Object.assign(characters, safeClone(parsed.characters));
        Object.keys(flags).forEach(key => delete flags[key]);
        Object.assign(flags, safeClone(INITIAL_FLAGS), { dragonRepelled: Boolean(parsed.flags.actICompleted), templeEvacuated: Boolean(parsed.flags.sanctuaireDone), millSaved: Boolean(parsed.flags.moulinDone), confrontationDone: Boolean(parsed.flags.actIICompleted) }, safeClone(parsed.flags));
        Object.keys(variables).forEach(key => delete variables[key]);
        Object.assign(variables, safeClone(parsed.variables));
        Object.keys(acts).forEach(key => delete acts[key]);
        Object.assign(acts, safeClone(parsed.acts));
        updateStatusStrip();
        if (!silent) {
          writeContext('Sauvegarde chargée.');
          describeCurrentRoom();
        }
        return true;
      } catch {
        if (!silent) writeContext('Sauvegarde corrompue ou illisible.');
        return false;
      }
    }

    function clearSave() {
      try {
        localStorage.removeItem(SAVE_KEY);
        writeContext('Sauvegarde locale supprimée.');
        return true;
      } catch {
        writeContext('Impossible de supprimer la sauvegarde locale.');
        return false;
      }
    }

    function createCheckpoint(reason = 'Décision majeure') {
      const snapshot = {
        reason,
        timestamp: Date.now(),
        gameState: safeClone({ ...gameState, checkpoints: [] }),
        characters: safeClone(DATA.characters),
        flags: safeClone(flags),
        variables: safeClone(variables),
        acts: safeClone(acts)
      };
      gameState.checkpoints.push(snapshot);
      if (gameState.checkpoints.length > 30) {
        gameState.checkpoints.splice(0, gameState.checkpoints.length - 30);
      }
      updateStatusStrip();
      saveGame();
      return snapshot;
    }

    function rollbackToLastCheckpoint(checkpoint = null) {
      if (gameState.checkpoints.length === 0) return false;
      let restoredEntry = checkpoint;
      if (!restoredEntry) {
        restoredEntry = gameState.checkpoints.pop();
      } else {
        const idx = gameState.checkpoints.indexOf(restoredEntry);
        if (idx === -1) return false;
        gameState.checkpoints.splice(idx);
      }
      const remainingStack = safeClone(gameState.checkpoints);
      const restoredGameState = safeClone(restoredEntry.gameState);
      enterRoom(restoredGameState.roomId, restoredEntry.reason, {
        skipCheckpoint: true,
        skipDescribe: true,
        skipAutoSave: true,
        skipScene: true
      });
      gameState.inventory = restoredGameState.inventory;
      gameState.gameOver = null;
      gameState.tick = restoredGameState.tick;
      gameState.commandHistory = restoredGameState.commandHistory || [];
      gameState.historyCursor = gameState.commandHistory.length;
      gameState.timelineApplied = restoredGameState.timelineApplied || [];
      gameState.rollHistory = restoredGameState.rollHistory || [];
      gameState.observations = restoredGameState.observations || [];
      gameState.decisions = restoredGameState.decisions || [];
      gameState.resolvedOptions = restoredGameState.resolvedOptions || [];
      gameState.lastReport = null;
      uiState.effect = null;
      uiState.diceAnimation = null;
      gameState.adventureLevel = restoredGameState.adventureLevel ?? (DATA.actRooms.ACT_V.includes(restoredGameState.roomId) ? 12 : ADVENTURE_LEVELS[restoredGameState.roomId] ?? 1);
      gameState.checkpoints = remainingStack;

      Object.keys(DATA.characters).forEach(id => delete DATA.characters[id]);
      Object.assign(DATA.characters, safeClone(restoredEntry.characters));
      Object.keys(flags).forEach(key => delete flags[key]);
      Object.assign(flags, safeClone(INITIAL_FLAGS), { dragonRepelled: Boolean(restoredEntry.flags.actICompleted), templeEvacuated: Boolean(restoredEntry.flags.sanctuaireDone), millSaved: Boolean(restoredEntry.flags.moulinDone), confrontationDone: Boolean(restoredEntry.flags.actIICompleted) }, safeClone(restoredEntry.flags));
      Object.keys(variables).forEach(key => delete variables[key]);
      Object.assign(variables, safeClone(restoredEntry.variables));
      Object.keys(acts).forEach(key => delete acts[key]);
      Object.assign(acts, safeClone(restoredEntry.acts));
      updateStatusStrip();
      saveGame();
      return true;
    }

