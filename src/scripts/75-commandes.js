    function showInventory() {
      writeContext(gameState.inventory.length ? `Inventaire: ${gameState.inventory.join(', ')}` : 'Inventaire vide.');
    }

    function undoToCheckpoint() {
      const restored = restoreDecisionCheckpoint();
      writeContext(restored ? '↩ Annulation: retour au dernier checkpoint.' : 'Aucun checkpoint à restaurer.');
      if (restored) describeCurrentRoom();
    }

    function showSheet(targetName = '') {
      const normalized = targetName.trim().toLowerCase();
      const entries = Object.entries(characters);
      if (!normalized) {
        writeContext('Feuille du groupe:');
        entries.forEach(([, character]) => writeContext(`- ${character.name}: ${character.state}`));
        return;
      }
      const found = entries.find(([, character]) => character.name.toLowerCase() === normalized || character.name.toLowerCase().includes(normalized));
      if (!found) {
        writeContext('Personnage introuvable pour sheet.');
        return;
      }
      const [, character] = found;
      writeContext(`${character.name} — état: ${character.state}`);
      writeContext(`Compétences: ${character.skills.join(', ') || 'aucune'}`);
      const personality = PRESENTATION.people[found[0]]?.personality;
      if (personality) writeContext(personality);
      else writeContext(`Tags narratifs: ${character.narrativeTags?.join(', ') || 'aucun'}`);
    }

    function showParty() {
      const groups = {
        active: 'Actifs',
        injured: 'Blessés',
        dead: 'Morts',
        absent: 'Absents'
      };
      writeContext('État de la compagnie:');
      Object.entries(groups).forEach(([stateKey, label]) => {
        const members = Object.values(characters)
          .filter(character => character.state === stateKey)
          .map(character => character.name);
        writeContext(`- ${label}: ${members.length ? members.join(', ') : 'aucun'}`);
      });
    }

    function autocompleteTokens() {
      const room = getCurrentRoom();
      const exits = Object.keys(room?.exits ?? {});
      const objects = room?.objects ?? [];
      const options = getAvailableOptions(gameState.roomId).map((_, idx) => String(idx + 1));
      const tokens = [...VERBS, ...Object.keys(DIRECTION_ALIASES), ...exits, ...objects, ...options, 'dragon'];
      return Array.from(new Set(tokens));
    }

    function autocompleteInput() {
      const raw = inputEl.value.trim().toLowerCase();
      if (!raw) return;
      const candidates = autocompleteTokens().filter(token => token.startsWith(raw));
      if (candidates.length === 1) {
        inputEl.value = candidates[0];
      } else if (candidates.length > 1) {
        writeContext(`Suggestions: ${candidates.slice(0, 8).join(', ')}`);
      }
    }

    function pushHistory(command) {
      gameState.commandHistory.push(command);
      gameState.historyCursor = gameState.commandHistory.length;
    }

    function navigateHistory(direction) {
      if (!gameState.commandHistory.length) return;
      gameState.historyCursor += direction;
      if (gameState.historyCursor < 0) gameState.historyCursor = 0;
      if (gameState.historyCursor > gameState.commandHistory.length) gameState.historyCursor = gameState.commandHistory.length;
      inputEl.value = gameState.historyCursor === gameState.commandHistory.length
        ? ''
        : gameState.commandHistory[gameState.historyCursor];
    }

    function parseCommand(rawInput) {
      const input = rawInput.trim().toLowerCase();
      if (!input) return { verb: '', args: [] };
      const tokens = input.split(/\s+/);
      const first = tokens[0];
      const directionOnly = normalizeDirection(first);
      if (directionOnly && tokens.length === 1) {
        return { verb: 'go', args: [first] };
      }
      if (first === '?') return { verb: 'help', args: [] };
      if (['l', 'examine', 'x'].includes(first)) return { verb: 'look', args: tokens.slice(1) };
      if (first === 'walk') return { verb: 'go', args: tokens.slice(1) };
      if (first === 'i') return { verb: 'inventory', args: [] };
      return { verb: first, args: tokens.slice(1) };
    }

    function handleCommand(rawInput) {
      const input = rawInput.trim();
      if (!input) return;
      pushHistory(input);
      writeContext(`> ${input.toLowerCase()}`);
      if (/^\d+$/.test(input)) { executePresentedChoice(input); return; }

      if (input.toLowerCase().startsWith('import ')) {
        const jsonString = input.slice(7).trim();
        if (importSaveFromString(jsonString)) {
          configureTitleOptions();
        }
        return;
      }

      const parsed = parseCommand(input);
      const directionVerb = parsed.verb === 'go' && parsed.args[0] ? parsed.args[0] : '';
      const normalizedDirection = normalizeDirection(directionVerb);
      if (parsed.verb === 'help') {
        writeContext('Commandes: help|?, look|l|examine|x, go|walk <direction>, n/s/e/w, inventory|i, choose <num>, undo, save, load, clear, export, import <json>, debug on/off, set <variable> <value>, flag <name> true/false, sheet [nom], party');
        return;
      }
      if (parsed.verb === 'look') {
        describeCurrentRoom();
        return;
      }
      if (parsed.verb === 'inventory') {
        showInventory();
        return;
      }
      if (parsed.verb === 'undo') {
        undoToCheckpoint();
        return;
      }
      if (parsed.verb === 'save') {
        if (saveGame()) writeContext('Sauvegarde locale enregistrée.');
        return;
      }
      if (parsed.verb === 'load') {
        loadGame();
        return;
      }
      if (parsed.verb === 'clear') {
        clearSave();
        configureTitleOptions();
        return;
      }
      if (parsed.verb === 'export') {
        exportSaveToClipboard();
        return;
      }
      if (parsed.verb === 'debug') {
        gameState.debugMode = parsed.args[0] === 'on' ? true : parsed.args[0] === 'off' ? false : gameState.debugMode;
        writeContext(`Debug mode: ${gameState.debugMode ? 'ON' : 'OFF'}`);
        showDebugState();
        return;
      }
      if (parsed.verb === 'set') {
        const key = parsed.args[0];
        const value = Number(parsed.args[1]);
        if (!gameState.debugMode || !key || !Number.isFinite(value) || typeof variables[key] !== 'number') return writeContext('En mode debug: set <variable numérique> <valeur>');
        variables[key] = value;
        clampTrackedVariables();
        showDebugState();
        return;
      }
      if (parsed.verb === 'flag') {
        const key = parsed.args[0];
        const val = parsed.args[1];
        if (!gameState.debugMode || !key || !['true','false'].includes(val) || typeof flags[key] !== 'boolean') return writeContext('En mode debug: flag <nom> true/false');
        flags[key] = val === 'true';
        showDebugState();
        return;
      }
      if (parsed.verb === 'sheet') {
        showSheet(parsed.args.join(' '));
        return;
      }
      if (parsed.verb === 'party') {
        showParty();
        return;
      }
      if (parsed.verb === 'choose') {
        executePresentedChoice(parsed.args[0]);
        return;
      }
      if (parsed.verb === 'go') {
        if (gameState.lastReport) {
          writeContext('Lisez le résultat puis poursuivez avant de vous déplacer.');
          return;
        }
        if (directionVerb === 'dragon') {
          triggerGameOver('silly', 'Vous provoquez un dragon avec panache.');
          return;
        }
        if (!normalizedDirection) {
          writeContext('Usage: go <nord|sud|est|ouest>.');
          return;
        }
        moveTo(directionVerb);
        saveGame();
        return;
      }
      writeContext('Commande non reconnue. Essayez "help".');

    }

