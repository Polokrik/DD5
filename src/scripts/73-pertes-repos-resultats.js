    // Perte d'un compagnon : le Clan reste jouable avec moins d'options. S'il ne reste que deux compagnons,
    // un ancien compagnon parti du groupe revient, choisi parmi ceux dont les caractéristiques sont les plus proches.
    function reinforceAfterLoss() {
      const standing = Object.values(characters).filter(c => ['active', 'injured', 'down'].includes(c.state));
      const fallen = Object.entries(characters).filter(([, c]) => c.state === 'dead' && !c.replacedBy);
      const candidates = Object.entries(characters).filter(([, c]) => c.state === 'absent' && c.departed);
      if (standing.length >= 3 || !fallen.length || !candidates.length) return '';
      const vector = id => { const abilities = getAdventureStats(id)?.abilities ?? {}; return ['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => abilities[key] ?? 10); };
      const [lostId, lost] = fallen[0], lostVector = vector(lostId);
      const family = id => ({ paladin: 'martial', fighter: 'martial', ranger: 'hybrid', rogue: 'skill', druid: 'caster', sorcerer: 'caster', warlock: 'caster' })[getAdventureStats(id)?.classKey] ?? 'hybrid';
      const classGap = (a, b) => a === b ? 0 : [a, b].includes('caster') ? ([a, b].includes('hybrid') ? 8 : 12) : [a, b].includes('hybrid') ? 4 : 8;
      const distance = id => vector(id).reduce((sum, value, index) => sum + Math.abs(value - lostVector[index]), 0) + classGap(family(id), family(lostId));
      const [backId, back] = candidates.sort((a, b) => distance(a[0]) - distance(b[0]))[0];
      back.state = 'active'; back.departed = false; lost.replacedBy = backId;
      return `${back.name} retrouve le Clan, appelé par la perte de ${lost.name}.`;
    }

    // Défaite totale : seulement quand plus aucun compagnon présent n'est vivant.
    function checkTotalDefeat() {
      const alive = Object.values(characters).some(c => ['active', 'injured', 'down', 'captured'].includes(c.state));
      if (alive || !Object.values(characters).some(c => c.state === 'dead')) return false;
      triggerGameOver('definitive', 'Tous les compagnons sont tombés.');
      return true;
    }

    // Repos du Clan : un par chapitre. Jets de mort pour les compagnons à terre, soins, puis un événement
    // tiré au D20. Chaque tirage est conservé dans le compte rendu; relire ou recharger ne relance rien.
    function restCompany() {
      const chapter = rooms[gameState.roomId]?.chapter ?? 0, lines = [];
      const name = id => characters[id].name;
      Object.entries(characters).filter(([, c]) => c.state === 'down').forEach(([id, c]) => {
        const natural = rollD20(), saves = c.deathSaves = { s: c.deathSaves?.s ?? 0, f: c.deathSaves?.f ?? 0 };
        if (natural === 20) { saves.s = 0; saves.f = 0; c.state = 'injured'; lines.push(`${name(id)} se redresse (jet de mort : 20).`); return; }
        if (natural === 1) saves.f += 2; else if (natural >= 10) saves.s += 1; else saves.f += 1;
        if (saves.f >= 3) { c.state = 'dead'; lines.push(`${name(id)} succombe (jet de mort : ${natural}, trois échecs).`); fireRosterTimelineTrigger('CHARACTER_DEATH', { characterId: id, deathType: 'replaceable' }); }
        else if (saves.s >= 3) { saves.s = 0; saves.f = 0; c.state = 'injured'; lines.push(`${name(id)} est ${agree(id, 'stabilisé', 'stabilisée')} (jet de mort : ${natural}, trois réussites).`); }
        else lines.push(`${name(id)} lutte à terre (jet de mort : ${natural}; ${saves.s} réussite(s), ${saves.f} échec(s)).`);
      });
      Object.entries(characters).forEach(([id, c]) => { if (c.state === 'injured') { c.state = 'active'; lines.push(`${name(id)} reprend des forces.`); } });
      const event = rollD20(), standing = Object.entries(characters).filter(([, c]) => ['active', 'injured'].includes(c.state));
      if (event <= 5 && standing.length) {
        const [id, c] = standing[event % standing.length];
        c.state = c.state === 'active' ? 'injured' : 'down';
        lines.push(`Événement de repos (D20 : ${event}) : des cultistes isolés surprennent le camp. ${name(id)} est ${c.state === 'injured' ? agree(id, 'blessé', 'blessée') : agree(id, 'mis', 'mise') + ' à terre'} avant que l’attaque soit repoussée.`);
      } else if (event <= 8) {
        variables.chaos += 1;
        lines.push(`Événement de repos (D20 : ${event}) : un bruit suspect trahit la présence du groupe. L’alerte monte.`);
      } else if (event <= 14) lines.push(`Événement de repos (D20 : ${event}) : la nuit est calme.`);
      else {
        variables.moraleGroupe += 1;
        const helped = Object.entries(characters).find(([, c]) => c.state === 'down');
        if (helped) { helped[1].state = 'injured'; helped[1].deathSaves = { s: 0, f: 0 }; }
        lines.push(`Événement de repos (D20 : ${event}) : des alliés de passage partagent leurs vivres${helped ? ` et soignent ${name(helped[0])}` : ''}. Le moral du groupe se renforce.`);
      }
      flags[`rested_${chapter}`] = true;
      clampTrackedVariables();
      const reinforcement = reinforceAfterLoss();
      if (reinforcement) lines.push(reinforcement);
      uiState.feedback = lines.join(' ');
      if (checkTotalDefeat()) return { endedByGameOver: true, handled: true };
      return { endedByGameOver: false, handled: true };
    }

    function handleDeath(characterId, deathType) {
      const character = characters[characterId];
      if (!character) return { message: 'Personnage introuvable.', endedByGameOver: false };
      if (deathType === 'definitive' && character.mainStory) {
        triggerGameOver('definitive', `${character.name} tombe et le destin du groupe se brise.`);
        return { message: null, endedByGameOver: true };
      }
      character.state = 'dead';
      fireRosterTimelineTrigger('CHARACTER_DEATH', { characterId, deathType });
      return { message: `${character.name} meurt au combat.`, endedByGameOver: false };
    }

    function mergeBranchEffects(outcome, branch = {}) {
      if (!branch) return outcome;
      const merged = safeClone(outcome);
      merged.variableDelta.moraleGroupe += branch.variableDelta?.moraleGroupe ?? 0;
      merged.variableDelta.chaos += branch.variableDelta?.chaos ?? 0;
      merged.variableDelta.publicTrust += branch.variableDelta?.publicTrust ?? branch.publicTrust ?? 0;
      merged.variableDelta.castleAlertLevel = (merged.variableDelta.castleAlertLevel ?? 0) + (branch.variableDelta?.castleAlertLevel ?? 0);
      merged.variableDelta.ritualProgress = (merged.variableDelta.ritualProgress ?? 0) + (branch.variableDelta?.ritualProgress ?? 0);

      if (branch.councilReputation) {
        Object.entries(branch.councilReputation).forEach(([key, value]) => {
          if (typeof value !== 'number') return;
          merged.variableDelta.councilReputation[key] = (merged.variableDelta.councilReputation[key] ?? 0) + value;
        });
      }
      if (branch.variableDelta?.councilReputation) {
        Object.entries(branch.variableDelta.councilReputation).forEach(([key, value]) => {
          if (typeof value !== 'number') return;
          merged.variableDelta.councilReputation[key] = (merged.variableDelta.councilReputation[key] ?? 0) + value;
        });
      }
      if (branch.variableDelta?.factionTrust) {
        merged.variableDelta.factionTrust = merged.variableDelta.factionTrust ?? {};
        Object.entries(branch.variableDelta.factionTrust).forEach(([faction, shift]) => {
          merged.variableDelta.factionTrust[faction] = (merged.variableDelta.factionTrust[faction] ?? 0) + (Number(shift) || 0);
        });
      }
      if (branch.message) merged.message = branch.message;
      if (branch.characterChanges?.length) merged.characterChanges.push(...branch.characterChanges);
      merged.post = {
        setFlags: branch.setFlags ?? {},
        gotoRoom: branch.gotoRoom ?? null,
        checkpoint: branch.checkpoint ?? null,
        unlockActs: branch.unlockActs ?? [],
        setAct: branch.setAct ?? null,
        timelineTrigger: branch.timelineTrigger ?? null,
        onSelect: branch.onSelect ?? null,
        setFlagFromState: branch.setFlagFromState ?? {},
        finalBattleDelta: branch.finalBattleDelta ?? {}
      };
      return merged;
    }

    function resolveOutcome(option, score, check = null) {
      if (!option?.resolution) {
        return mergeBranchEffects({
          success: true,
          endedByGameOver: false,
          message: option.effects?.message ?? null,
          variableDelta: {
            moraleGroupe: option.effects?.moraleGroupe ?? 0,
            chaos: option.effects?.chaos ?? 0,
            publicTrust: option.effects?.publicTrust ?? 0,
            councilReputation: safeClone(option.effects?.councilReputation ?? {}),
            castleAlertLevel: option.effects?.castleAlertLevel ?? 0,
            factionTrust: safeClone(option.effects?.factionTrust ?? {}),
            ritualProgress: option.effects?.ritualProgress ?? 0
          },
          characterChanges: []
        }, option.onSuccess);
      }
      const character = characters[option.characterId];
      if (!character) {
        return { success: false, endedByGameOver: false, message: 'Aucun personnage valide pour cette action.', variableDelta: { moraleGroupe: 0, chaos: 0, publicTrust: 0, councilReputation: {}, castleAlertLevel: 0, factionTrust: {}, ritualProgress: 0 }, characterChanges: [] };
      }
      if (score === null) {
        return { success: false, endedByGameOver: false, message: `${character.name} ne peut pas agir.`, variableDelta: { moraleGroupe: 0, chaos: 0, publicTrust: 0, councilReputation: {}, castleAlertLevel: 0, factionTrust: {}, ritualProgress: 0 }, characterChanges: [] };
      }

      if ((check ? check.success : score >= getCheckDefinition(option).dc)) {
        return mergeBranchEffects({
          success: true,
          endedByGameOver: false,
          message: option.effects?.message ?? null,
          variableDelta: {
            moraleGroupe: option.effects?.moraleGroupe ?? 0,
            chaos: option.effects?.chaos ?? 0,
            publicTrust: option.effects?.publicTrust ?? 0,
            councilReputation: safeClone(option.effects?.councilReputation ?? {}),
            castleAlertLevel: option.effects?.castleAlertLevel ?? 0,
            factionTrust: safeClone(option.effects?.factionTrust ?? {}),
            ritualProgress: option.effects?.ritualProgress ?? 0
          },
          characterChanges: []
        }, option.onSuccess);
      }

      let baseOutcome = { success: false, endedByGameOver: false, message: 'Échec sans conséquence définie.', variableDelta: { moraleGroupe: 0, chaos: 0, publicTrust: 0, councilReputation: {}, castleAlertLevel: 0, factionTrust: {}, ritualProgress: 0 }, characterChanges: [] };
      if (option.resolution.risk === 'injury') {
        if (character.state === 'active') baseOutcome = { ...baseOutcome, message: `${character.name} est ${agree(option.characterId, 'blessé', 'blessée')}.`, characterChanges: [{ id: option.characterId, toState: 'injured' }] };
        else if (character.state === 'injured') baseOutcome = { ...baseOutcome, message: `${character.name} est à terre.`, characterChanges: [{ id: option.characterId, toState: 'down' }] };
        else baseOutcome = { ...baseOutcome, message: `${character.name} succombe à ses blessures.`, characterChanges: [{ id: option.characterId, toState: 'dead', deathType: option.resolution.deathType ?? 'replaceable' }] };
      } else if (option.resolution.risk === 'capture') {
        baseOutcome = { ...baseOutcome, message: `${character.name} est ${agree(option.characterId, 'capturé', 'capturée')}.`, characterChanges: [{ id: option.characterId, toState: 'captured' }] };
      } else if (option.resolution.risk === 'death') {
        if (character.state === 'active') baseOutcome = { ...baseOutcome, message: `${character.name} est ${agree(option.characterId, 'grièvement blessé', 'grièvement blessée')}.`, characterChanges: [{ id: option.characterId, toState: 'injured' }] };
        else baseOutcome = { ...baseOutcome, message: `${character.name} affronte un risque mortel.`, characterChanges: [{ id: option.characterId, toState: 'dead', deathType: option.resolution.deathType ?? 'replaceable' }] };
      }

      return mergeBranchEffects(baseOutcome, option.onFailure);
    }

    function applyPostEffects(post = {}) {
      Object.entries(post.finalBattleDelta ?? {}).forEach(([key, delta]) => {
        if (Object.hasOwn(variables.finalBattle, key) && Number.isFinite(delta)) variables.finalBattle[key] += delta;
      });
      clampTrackedVariables();
      if (post.message) writeContext(post.message);
      Object.entries(post.setFlags ?? {}).forEach(([key, value]) => {
        flags[key] = value;
      });
      Object.entries(post.setFlagFromState ?? {}).forEach(([targetFlag, source]) => {
        if (source === 'cyanwrathDead') flags[targetFlag] = Boolean(flags.cyanwrathDead);
        if (source === 'eggsOutcome') flags[targetFlag] = flags.eggsDestroyed ? 'destroyed'
          : flags.eggsStolen ? 'taken' : flags.eggsLeft ? 'left' : flags.eggsSaved ? 'saved' : 'unknown';
        if (source === 'castleAlertLevel') flags[targetFlag] = variables.castleAlertLevel;
        if (source === 'factionTrust') flags[targetFlag] = JSON.stringify(variables.factionTrust);
      });
      (post.unlockActs ?? []).forEach(actId => {
        if (!acts.unlocked.includes(actId)) acts.unlocked.push(actId);
      });
      if (post.setAct) acts.current = post.setAct;
      if (post.gotoRoom) gameState.roomId = post.gotoRoom;
      if (post.setFlags?.actICompleted) fireRosterTimelineTrigger('END_ACT_I');
      if (post.setFlags?.actIICompleted) fireRosterTimelineTrigger('END_ACT_II');
      if (post.timelineTrigger) fireRosterTimelineTrigger(post.timelineTrigger);
      if (post.onSelect) handleSpecialSelection(post.onSelect);
    }

    function applyOutcome(outcome) {
      let endedByGameOver = false;
      outcome.characterChanges.forEach(change => {
        const character = characters[change.id];
        if (!character) return;
        if (change.toState === 'dead') {
          const deathResult = handleDeath(change.id, change.deathType ?? 'replaceable');
          if (deathResult.endedByGameOver) endedByGameOver = true;
          return;
        }
        applyTransition(character, change.toState);
      });
      if (endedByGameOver) return { endedByGameOver: true };

      applyVariableDelta(outcome.variableDelta);
      applyCouncilReputationDelta(outcome.variableDelta.councilReputation ?? {});
      variables.publicTrust = Math.max(-10, Math.min(10, variables.publicTrust));
      clampTrackedVariables();
      if (outcome.message) writeContext(outcome.message);
      applyPostEffects(outcome.post);
      updateStatusStrip();
      if (outcome.characterChanges.length) {
        const reinforcement = reinforceAfterLoss();
        if (reinforcement) { outcome.message = [outcome.message, reinforcement].filter(Boolean).join(' '); writeContext(reinforcement); gameState.reinforcement = reinforcement; }
        if (checkTotalDefeat()) return { endedByGameOver: true };
      }
      return { endedByGameOver: false, success: outcome.success };
    }


