    function triggerGameOver(type, message) {
      gameState.gameOver = { type, message };
      writeContext(`☠ GAME OVER (${type}) — ${message}`);
      const restored = rollbackToLastCheckpoint();
      if (!restored) { gameState.roomId = 'title_screen'; gameState.gameOver = null; configureTitleOptions(); }
      writeContext(restored ? '↩ Retour au dernier checkpoint.' : 'Aucun checkpoint disponible.');
      describeCurrentRoom();
      uiState.feedback = `☠ GAME OVER — ${message} ${restored ? 'Vous retrouvez votre dernière décision.' : 'Aucun checkpoint disponible.'}`;
      gameState.lastReport = { roomId: gameState.roomId, title: 'Cette tentative a échoué', paragraphs: [message, restored ? 'Le groupe revient à la situation qui précédait ce choix. Vous pouvez reprendre avec une autre approche ou consulter une décision antérieure.' : 'La tentative ne dispose pas de checkpoint. L’écran titre reste accessible pour commencer une nouvelle partie ou charger une sauvegarde.'], changes: [restored ? 'Les effets de cette tentative sont annulés.' : 'Retour à l’accueil; vous pourrez charger une sauvegarde ou commencer une partie.'], failed: true, rolledBack: restored };
      refreshInterface();
      renderFeedback();
    }

    function councilReputationTotal() {
      return Object.values(variables.councilReputation ?? {}).reduce((sum, value) => sum + (Number(value) || 0), 0)
        + Object.values(variables.factionTrust ?? {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
    }

    function computeFinalBattleBaseline() {
      const finalBattle = variables.finalBattle;
      let alliedStrength = 0;
      if (flags.strongAlliance) alliedStrength += 4;
      if (flags.fragileAlliance) alliedStrength += 2;
      if (flags.metallicAlliance) alliedStrength += 2;
      let cultMomentum = 2;
      if (flags.eggsDestroyed) cultMomentum -= 2;
      if (flags.eggsStolen) cultMomentum -= 1;
      if (flags.eggsLeft || flags.eggsSaved) cultMomentum += 1;
      if (flags.portalDamaged) cultMomentum -= 1;
      if (flags.cyanwrathDead) cultMomentum -= 1;
      const councilBonus = Math.max(-1, Math.min(2, Math.floor(councilReputationTotal() / 3)));
      alliedStrength += councilBonus;

      finalBattle.alliedStrength = Math.max(0, alliedStrength);
      finalBattle.cultMomentum = Math.max(0, cultMomentum);
      finalBattle.ritualProgress = Math.max(0, Math.min(10, 2 + Math.max(0, cultMomentum)));
      finalBattle.battlefieldChaos = Math.max(0, Math.min(10, 3 + Math.max(0, variables.chaos)));
      finalBattle.civilianRisk = Math.max(0, Math.min(10, 4 - Math.min(2, variables.moraleGroupe)));
      finalBattle.decisiveActions = 0;
      flags.finalBattleInitialized = true;
    }

    function applyFinalBattlePlanImpact(planId) {
      const finalBattle = variables.finalBattle;
      if (planId === 'plan-sabotage') {
        finalBattle.ritualProgress = Math.max(0, finalBattle.ritualProgress - 1);
        finalBattle.battlefieldChaos = Math.min(10, finalBattle.battlefieldChaos + 1);
        variables.moraleGroupe = Math.max(-5, variables.moraleGroupe + 1);
      } else if (planId === 'plan-decapitation') {
        finalBattle.ritualProgress = Math.min(10, finalBattle.ritualProgress + 1);
        finalBattle.battlefieldChaos = Math.min(10, finalBattle.battlefieldChaos + 2);
        finalBattle.alliedStrength = Math.max(0, finalBattle.alliedStrength + 1);
      } else if (planId === 'plan-evacuation') {
        finalBattle.civilianRisk = Math.max(0, finalBattle.civilianRisk - 3);
        finalBattle.alliedStrength = Math.max(0, finalBattle.alliedStrength - 1);
        finalBattle.ritualProgress = Math.min(10, finalBattle.ritualProgress + 1);
        variables.moraleGroupe = Math.max(-5, variables.moraleGroupe + 1);
      }
    }

    function applyRitualTick() {
      const finalBattle = variables.finalBattle;
      const tickGain = 1 + Math.floor((finalBattle.cultMomentum + finalBattle.battlefieldChaos) / 5);
      finalBattle.ritualProgress = Math.min(10, finalBattle.ritualProgress + tickGain);
    }

    function applyDecisiveAction(optionId, success) {
      const finalBattle = variables.finalBattle;
      finalBattle.decisiveActions += 1;
      if (optionId === 'ritual-break-ward') {
        finalBattle.ritualProgress = Math.max(0, finalBattle.ritualProgress - (success ? 3 : 1));
      } else if (optionId === 'ritual-rally') {
        finalBattle.alliedStrength = Math.max(0, finalBattle.alliedStrength + (success ? 2 : 0));
        finalBattle.battlefieldChaos = Math.max(0, finalBattle.battlefieldChaos - (success ? 2 : 0));
      } else if (optionId === 'ritual-sacrifice-gear') {
        finalBattle.ritualProgress = Math.max(0, finalBattle.ritualProgress - (success ? 2 : 1));
        finalBattle.battlefieldChaos = Math.max(0, finalBattle.battlefieldChaos - 1);
      }
      applyRitualTick();
    }

    function resolveFinalEnding() {
      const finalBattle = variables.finalBattle;
      flags.sealedForever = false;
      if (flags.sabotageSuccess && flags.strongAlliance && flags.metallicAlliance && finalBattle.ritualProgress <= 5) {
        flags.sealedForever = true;
        flags.finalBattleEnding = 'what_if';
        return 'What If — Les dragons métalliques scellent le portail pour toujours. Cette fin simulée n’est pas attestée par le journal.';
      }
      if (finalBattle.ritualProgress <= 4 && finalBattle.alliedStrength >= 5) {
        flags.finalBattleEnding = 'simulated_victory';
        return 'Fin simulée — Le rituel est interrompu avant l’émergence de Tiamat. Le journal fourni ne relate pas cette bataille.';
      }
      if (finalBattle.ritualProgress <= 8) {
        flags.finalBattleEnding = 'partial_victory';
        return 'Fin simulée — Victoire partielle: une manifestation de Tiamat est repoussée au prix du sang.';
      }
      flags.finalBattleEnding = 'failure';
      return 'Fin simulée — Échec: Tiamat émerge pleinement. Le monde chancelle sous la catastrophe draconique.';
    }

    // Initialisation des transitions ; une commande « look » ne change pas la partie.
    function prepareCurrentRoom() {
      const room = getCurrentRoom();
      if (!room) return;
      updateAdventureLevel();
      const actId = Object.keys(DATA.actRooms).find(id => DATA.actRooms[id].includes(room.id));
      if (actId) acts.current = actId;
      if (actId === 'ACT_V' && !flags.finalBattleInitialized) computeFinalBattleBaseline();
      if (room.id === 'waterdeep_council_hall') {
        initializeCouncilSessionIfNeeded();
      }
      if (room.id === 'greenest_keep' && variables.chaos > 5 && !flags.keepLossApplied) {
        flags.keepLossApplied = true;
        variables.moraleGroupe -= 1;
        writeContext('Des cris montent des faubourgs: trop de civils n’ont pas atteint la forteresse à temps.');
      }
      if (room.id === 'elturel_road' && flags.eggsStolen && !flags.dragonetsHatched) {
        flags.dragonetsHatched = true;
        gameState.inventory.push('Boule', 'Bill');
        writeContext('En route vers Elturel, les deux œufs noirs éclosent et les dragonnets adoptent Bjolnir.');
      }
      if (room.id === 'campaign_end') {
        flags.actVCompleted = true;
        flags.campaignComplete = true;
        resolveFinalEnding();
      }
    }

    function describeCurrentRoom() {
      const room = getCurrentRoom();
      if (!room) return;
      if (room.id === 'greenest_keep' && flags.cyanwrathDead) {
        writeContext('La nouvelle court: Cyanwrath est tombé. Les vétérans murmurent qu’un avenir différent vient de naître.');
      }
      if (room.id === 'greenest_keep' && flags.actICompleted) {
        if (variables.moraleGroupe >= 2) writeContext('Les défenseurs reprennent souffle. Une lueur d’espoir parcourt les remparts.');
        if (variables.chaos >= 6) writeContext('La victoire a un goût de cendre: Greenest survivra, mais marquée à jamais.');
      }
      if (room.id === 'castle_naerytar') {
        writeContext(flags.cyanwrathDead
          ? 'Les renseignements obtenus dans le château doivent permettre de suivre les chefs du Culte au-delà de Naerytar.'
          : 'Cyanwrath a survécu aux rencontres précédentes et demeure une menace pour le groupe.');
        if (variables.castleAlertLevel >= 3) writeContext(`Alerte du château: ${variables.castleAlertLevel}/5. La fuite vers le portail devient prioritaire.`);
      }

      if (room.id === 'waterdeep_council_hall') {
        writeContext('Chaque mot pèse comme un traité: Waterdeep écoute, juge et se souvient.');
      }
      if (room.id === 'war_council_tent') {
        writeContext(`Rapport stratégique — Force alliée: ${variables.finalBattle.alliedStrength}, Élan cultiste: ${variables.finalBattle.cultMomentum}, Réputation du Conseil: ${councilReputationTotal()}.`);
      }
      if (room.id === 'battle_plan_selection') {
        writeContext('Trois plans: sabotage précis, frappe de décapitation, ou évacuation défensive.');
      }
      if (room.id === 'champion_confrontation') {
        writeContext(flags.cyanwrathDead
          ? 'Cyanwrath est tombé: Severin dépêche son nouveau Champion pour tenir le front.'
          : 'Cyanwrath, encore vivant, observe la scène avec un rictus prédateur.');
      }
      if (room.id === 'ritual_chamber') {
        writeContext(`État du rituel — Progression: ${variables.finalBattle.ritualProgress}/10 | Force alliée: ${variables.finalBattle.alliedStrength} | Élan cultiste: ${variables.finalBattle.cultMomentum} | Chaos: ${variables.finalBattle.battlefieldChaos} | Risque civil: ${variables.finalBattle.civilianRisk}.`);
      }
      if (room.id === 'campaign_end') {
        const endingLabels = { what_if: 'scellement définitif du portail', simulated_victory: 'rituel interrompu', partial_victory: 'victoire partielle', failure: 'émergence de Tiamat' };
        writeContext(`Issue simulée: ${endingLabels[flags.finalBattleEnding] ?? 'indéterminée'}. La véritable campagne est toujours en cours.`);
        const fallen = Object.values(characters).filter(character => character.state === 'dead').map(character => character.name);
        writeContext(`Pertes du groupe: ${fallen.length ? fallen.join(', ') : 'aucune perte définitive recensée'}.`);
        writeContext(`Bilan moral: risque civil ${variables.finalBattle.civilianRisk}/10, moral du groupe ${variables.moraleGroupe}.`);
        if (flags.sealedForever) writeContext('Le sceau des dragons métalliques tient: le portail est fermé pour les ères à venir.');
      }
      clampTrackedVariables();
      if (gameState.debugMode) showDebugState();
      refreshInterface();
    }

    function normalizeDirection(token) {
      return DIRECTION_ALIASES[token] || null;
    }

    function moveTo(directionToken) {
      if (gameState.lastReport) {
        writeContext('Lisez le résultat puis poursuivez avant de vous déplacer.');
        return;
      }
      if (!Object.values(characters).some(c => ['active', 'injured'].includes(c.state))) {
        writeContext('Aucun compagnon ne peut poursuivre le déplacement. Revenez à la décision précédente ou à l’accueil.');
        return;
      }
      const direction = normalizeDirection(directionToken);
      if (!direction) {
        writeContext('Direction inconnue. Utilisez nord/sud/est/ouest.');
        return;
      }
      const room = rooms[gameState.roomId];
      const destinationId = room?.exits?.[direction];
      if (!destinationId) {
        writeContext('Impossible d’aller par là.');
        return;
      }
      createCheckpoint(`Déplacement: ${gameState.roomId} -> ${destinationId}`);
      enterRoom(destinationId, '', { skipCheckpoint: true });
    }

    function clampTrackedVariables() {
      variables.moraleGroupe = Math.max(-5, Math.min(5, variables.moraleGroupe));
      variables.chaos = Math.max(-5, Math.min(6, variables.chaos));
      variables.castleAlertLevel = Math.max(0, Math.min(5, variables.castleAlertLevel ?? 0));
      variables.ritualProgress = Math.max(-4, Math.min(8, variables.ritualProgress ?? 0));
      if (variables.finalBattle) {
        variables.finalBattle.ritualProgress = Math.max(0, Math.min(10, variables.finalBattle.ritualProgress ?? 0));
        variables.finalBattle.battlefieldChaos = Math.max(0, Math.min(10, variables.finalBattle.battlefieldChaos ?? 0));
        variables.finalBattle.civilianRisk = Math.max(0, Math.min(10, variables.finalBattle.civilianRisk ?? 0));
        variables.finalBattle.alliedStrength = Math.max(0, variables.finalBattle.alliedStrength ?? 0);
        variables.finalBattle.cultMomentum = Math.max(0, variables.finalBattle.cultMomentum ?? 0);
      }
    }

    function applyVariableDelta(delta = {}) {
      Object.entries(delta).forEach(([key, value]) => {
        if (['moraleGroupe', 'chaos', 'castleAlertLevel', 'ritualProgress', 'publicTrust'].includes(key)) {
          variables[key] = (variables[key] ?? 0) + (Number(value) || 0);
          return;
        }
        if (key === 'factionTrust' && value && typeof value === 'object') {
          Object.entries(value).forEach(([faction, shift]) => {
            variables.factionTrust[faction] = (variables.factionTrust[faction] ?? 0) + (Number(shift) || 0);
          });
        }
      });
    }

    function canTransitionState(fromState, toState) {
      const transitions = {
        active: new Set(['injured', 'captured']),
        injured: new Set(['down', 'captured']),
        down: new Set(['dead'])
      };
      return transitions[fromState]?.has(toState) ?? false;
    }

    function applyTransition(character, toState) {
      if (!character) return false;
      if (character.state === toState) return true;
      if (!canTransitionState(character.state, toState)) return false;
      character.state = toState;
      return true;
    }

    function computeActionScore(option, actorId, check = null) {
      if (!option?.resolution) return null;
      if (!isSkillAvailable(actorId)) return null;
      const resolved = check ?? performD20Check(option,actorId);
      return resolved.total;
    }

