    const CHAOTIC_CHOICES = {
      silly_cult_password: { text: 'Bjolnir réclame poliment le mot de passe aux sentinelles. L’une d’elles consulte vraiment sa liste. Le Clan s’éloigne avant qu’elle ne trouve.', moraleGroupe: 1, chaos: 1 },
      silly_knock_door: { text: 'Drek’Thar frappe à la porte et attend qu’on lui ouvre. Personne ne vient, mais le silence qui suit est étrangement gêné.', chaos: 1 },
      silly_taste_mushroom: { text: 'Darrin goûte un champignon luminescent et déclare le goût « étonnamment mémorable ». Il voit des couleurs jusqu’à la fin de la salle.', moraleGroupe: 1 },
      silly_name_roper: { text: 'Ellyjobell donne un nom à la créature du couloir. Elle ne répond pas, mais ses vrilles se calment un instant, au grand étonnement de tous.', moraleGroupe: 1 },
      silly_egg_lullaby: { text: 'Ellyjobell chante une berceuse aux œufs. Une coquille semble frémir, ce que chacun préfère mettre sur le compte de la fatigue.', moraleGroupe: 1 },
      silly_knock_portal: { text: 'Darrin demande poliment au portail de s’ouvrir. Il ne se passe rien, puis une étincelle rétorque d’un air presque vexé.', chaos: 1 },
      silly_giant_tea: { text: 'Darrin demande du thé, à la mesure des géants. On lui apporte une cuve; il faudra un moment pour en finir une gorgée.', moraleGroupe: 1, chaos: 1 },
      silly_flour_charge: { text: 'Drek’Thar charge en criant « Pour la farine ! ». Les pillards n’y comprennent rien, et les gardes du moulin non plus.', moraleGroupe: 1, chaos: 1 },
      silly_rat_scout: { text: 'Ellyjobell nomme un rat éclaireur officiel. Il s’en va, sérieux comme un messager, et ne reviendra jamais.', moraleGroupe: 1 },
      silly_lennithon: { text: 'Votre diversion tourne à la farce. Les sentinelles se regardent, perplexes, puis reprennent leur ronde; le Clan retient un fou rire.', moraleGroupe: 1, chaos: 1 },
      silly_wave_lennithon: { text: 'Vous saluez Lennithon. Il lève un sourcil, grogne et détourne le regard.', moraleGroupe: 1 },
      silly_join_cult: { text: 'Votre offre de service enthousiasme les kobolds, qui exigent aussitôt un serment d’allégeance. Vous le bredouillez si mal qu’ils vous chassent d’un geste.', chaos: 1 },
      silly_dance_cyanwrath: { text: 'Vous lancez un pas de danse martial. Cyanwrath vous toise sans un mot, tandis que ses hommes ricanent.', chaos: 1 },
      silly_king_waterdeep: { text: 'Vous réclamez la couronne de Waterdeep. Le protocole vous écoute avec une politesse glaciale, puis passe à l’ordre du jour.', moraleGroupe: 1, publicTrust: -1 },
      silly_dragon_selfie: { text: 'Vous exigez de poser pour un portrait en selle. Le dragon d’airain soupire, ce qui suffit à vous rappeler la gravité de l’audience.', publicTrust: -1 },
      silly_accuse_dragons: { text: 'Vous accusez toute la caravane d’être draconique. Les marchands s’écartent, vexés, et le convoi vous regarde de travers pour le reste du trajet.', chaos: 1 },
      silly_swamp_duck: { text: 'Le canard réclame un tribut en pain sec. Vous n’en avez pas; il s’éloigne, vexé, en cancanant bruyamment.', chaos: 1 },
      silly_tax_inspection: { text: 'Votre inspection fiscale draconique ne révèle aucun reçu. Les cultistes vous regardent, interloqués, et leur vigilance flotte un instant.', moraleGroupe: 1 },
      silly_riddle_duel: { text: 'Vous posez une énigme à voix haute. Personne ne répond, et l’écho s’en charge à votre place.', chaos: 1 },
      silly_shout_stop: { text: 'Vous criez STOP. Le portail répond par un écho moqueur.', chaos: 1 }
    };

    function handleSpecialSelection(selectionKey, option = null) {
      if (selectionKey === 'start_rescue') return startRescue(option);
      if (selectionKey === 'rescue_success') return endRescue(true);
      if (selectionKey === 'rescue_abandon') return endRescue(false);
      if (selectionKey === 'rest_company') return restCompany();
      if (['recover_checkpoint','decision_back'].includes(selectionKey)) {
        restoreDecisionCheckpoint();
        return { endedByGameOver: false, handled: true };
      }
      const seriousMessages = {
        serious_reckless_bridge: 'Le pont cède sous la foule. Catastrophe stratégique: la manœuvre était explicitement insensée.'
      };
      if (seriousMessages[selectionKey]) {
        triggerGameOver('definitive', seriousMessages[selectionKey]);
        return { endedByGameOver: true, handled: true };
      }
      if (CHAOTIC_CHOICES[selectionKey]) {
        const choice = CHAOTIC_CHOICES[selectionKey];
        variables.moraleGroupe += choice.moraleGroupe ?? 0; variables.chaos += choice.chaos ?? 0; variables.publicTrust += choice.publicTrust ?? 0;
        clampTrackedVariables();
        uiState.feedback = choice.text;
        return { endedByGameOver: false, handled: true };
      }
      if (selectionKey === 'route_after_strategy') {
        ensureCouncilVariables();
        gameState.roomId = 'diderius_chronicle';
        writeContext('Le Clan part sur la piste de Varam. Les choix du Conseil ont modifié le soutien des factions; l’audience des dragons viendra après les missions rapportées dans le journal.');
        return { endedByGameOver: false, handled: true };
      }
      if (selectionKey === 'resolve_council') {
        ensureCouncilVariables();
        const totalSupport = Object.values(variables.councilReputation).reduce((sum, value) => sum + value, 0);
        variables.totalSupport = totalSupport;
        flags.strongAlliance = false;
        flags.fragileAlliance = false;
        flags.fracturedAlliance = false;
        flags.limitedMilitarySupport = false;

        if (totalSupport >= 9) {
          variables.allianceStrength = 'high';
          flags.strongAlliance = true;
          writeContext('Vos choix obtiennent un soutien important.');
        } else if (totalSupport >= 3) {
          variables.allianceStrength = 'medium';
          flags.fragileAlliance = true;
          writeContext('Vos choix réunissent une coalition partielle.');
        } else {
          variables.allianceStrength = 'low';
          flags.fracturedAlliance = true;
          flags.limitedMilitarySupport = true;
          writeContext('Vos choix divisent les factions.');
        }
        flags.actIVCompleted = true;
        gameState.roomId = 'campaign_frontier';
        return { endedByGameOver: false, handled: true };
      }

      if (selectionKey === 'title_new_game' || selectionKey === 'restart_campaign') {
        clearSave();
        resetCampaignState();
        createCheckpoint('Début de partie');
        writeContext('Nouvelle campagne lancée.');
        return { endedByGameOver: false, handled: true };
      }
      if (selectionKey === 'title_continue') {
        if (!loadGame({ silent: true })) writeContext('Aucune sauvegarde à reprendre.');
        return { endedByGameOver: false, handled: true };
      }
      if (selectionKey === 'title_clear_save') {
        clearSave();
        configureTitleOptions();
        return { endedByGameOver: false, handled: true };
      }
      if (selectionKey === 'title_export_save') {
        exportSaveToClipboard();
        return { endedByGameOver: false, handled: true };
      }
      if (selectionKey === 'title_import_save') {
        writeContext('Utilisez: import <json>');
        return { endedByGameOver: false, handled: true };
      }
      if (selectionKey === 'return_title') {
        gameState.lastReport = null;
        uiState.effect = null;
        uiState.diceAnimation = null;
        gameState.roomId = 'title_screen';
        configureTitleOptions();
        return { endedByGameOver: false, handled: true };
      }
      return { endedByGameOver: false, handled: false };
    }

    function applyOptionEffects(option, check = null) {
      if (option.id === 'ritual-resolve' && variables.finalBattle.decisiveActions < 3 && Object.values(characters).some(c => ['active','injured'].includes(c.state))) {
        writeContext('Le cercle tient encore: prenez au moins trois actions décisives avant de conclure.');
        return { endedByGameOver: false, success: false };
      }
      if (option.onSelect) {
        const special = handleSpecialSelection(option.onSelect, option);
        if (special.handled) {
          if (!special.endedByGameOver) prepareCurrentRoom();
          return { endedByGameOver: special.endedByGameOver, success: !special.endedByGameOver };
        }
      }
      if (option.onSelect) throw new Error(`Sélection inconnue: ${option.onSelect}`);

      if (option.resolution && !check && isSkillAvailable(option.characterId)) check = performD20Check(option,option.characterId);
      const score = computeActionScore(option, option.characterId, check);
      const outcome = resolveOutcome(option, score, check);
      const result = applyOutcome(outcome);
      if (!result?.endedByGameOver) {
        if (['plan-sabotage', 'plan-decapitation', 'plan-evacuation'].includes(option.id)) {
          applyFinalBattlePlanImpact(option.id);
        }
        if (option.id === 'sabotage-identify' && !outcome.success) {
          variables.finalBattle.ritualProgress = Math.min(10, variables.finalBattle.ritualProgress + 1);
        }
        if (option.id === 'sabotage-stealth' && !outcome.success) {
          variables.finalBattle.battlefieldChaos = Math.min(10, variables.finalBattle.battlefieldChaos + 1);
        }
        if (option.id === 'sabotage-arcana' && !outcome.success) {
          variables.finalBattle.ritualProgress = Math.min(10, variables.finalBattle.ritualProgress + 2);
        }
        if (option.id === 'decapitation-strike') {
          if (outcome.success) {
            variables.finalBattle.cultMomentum = Math.max(0, variables.finalBattle.cultMomentum - 2);
            variables.finalBattle.alliedStrength = Math.max(0, variables.finalBattle.alliedStrength + 1);
          } else {
            variables.finalBattle.battlefieldChaos = Math.min(10, variables.finalBattle.battlefieldChaos + 2);
            variables.finalBattle.ritualProgress = Math.min(10, variables.finalBattle.ritualProgress + 1);
          }
        }
        if (option.id === 'evacuation-save-more') {
          variables.finalBattle.civilianRisk = Math.max(0, variables.finalBattle.civilianRisk - 3);
          variables.finalBattle.alliedStrength = Math.max(0, variables.finalBattle.alliedStrength - 1);
          variables.finalBattle.ritualProgress = Math.min(10, variables.finalBattle.ritualProgress + 2);
        }
        if (option.id === 'evacuation-secure-objective') {
          variables.finalBattle.civilianRisk = Math.min(10, variables.finalBattle.civilianRisk + 2);
          variables.finalBattle.ritualProgress = Math.max(0, variables.finalBattle.ritualProgress - 1);
        }
        if (['ritual-break-ward', 'ritual-rally', 'ritual-sacrifice-gear'].includes(option.id)) {
          applyDecisiveAction(option.id, Boolean(outcome.success));
        }
      }
      if (!result.endedByGameOver && !result.success && option.onFailurePost) {
        applyPostEffects(option.onFailurePost);
      }
      if (!result.endedByGameOver) prepareCurrentRoom();
      return { ...result, check, message: outcome.message, successWithCost: Boolean(option.failForward && !outcome.success),
        success: Boolean(result.success || (option.failForward && !result.endedByGameOver)) };
    }

    function chooseOption(indexToken) {
      if (gameState.lastReport) {
        writeContext('Lisez le résultat puis poursuivez, ou revenez à une décision précédente.');
        return;
      }
      const index = Number.parseInt(indexToken, 10), options = getAvailableOptions(gameState.roomId);
      if (Number.isNaN(index) || index < 1 || index > options.length) {
        writeContext('Choix invalide. Utilisez choose <numéro>.'); return;
      }
      const option = options[index - 1], origin = gameState.roomId;
      const utility = ['return_title','restart_campaign','decision_back','recover_checkpoint'].includes(option.onSelect);
      const menu = ['title_screen','credits'].includes(origin) || utility;
      let check = null;
      try { if (option.resolution) check = performD20Check(option,option.characterId); }
      catch (error) { writeContext(error.message); return; }
      uiState.feedback = ''; uiState.effect = null; uiState.diceAnimation = null;
      const before = { characters: safeClone(characters), flags: safeClone(flags), morale: variables.moraleGroupe, chaos: variables.chaos, reputation: safeClone(variables.councilReputation), trust: safeClone(variables.factionTrust), castleAlert: variables.castleAlertLevel ?? 0, publicTrust: variables.publicTrust };
      if (!menu) createCheckpoint(`Avant décision: ${option.id}`);
      const result = applyOptionEffects(option,check), message = result?.message ?? uiState.feedback;
      if (!menu && !result?.endedByGameOver) recordDecision(option, origin, check ? check.success : Boolean(result?.success));
      if (!menu && !option.repeatable && !result?.endedByGameOver && (result?.success || option.resolution)) gameState.resolvedOptions.push(`${origin}:${option.id}`);
      if (check) gameState.rollHistory = [...(gameState.rollHistory ?? []),safeClone(check)].slice(-100);
      if (!result?.endedByGameOver) describeCurrentRoom();
      if (!menu && !result?.endedByGameOver && (option.resolution || option.effects?.message || option.onSuccess?.message || ACTION_NARRATION[option.id])) {
        gameState.lastReport = buildActionReport(option,origin,result,before,message);
      }
      if (check && gameState.lastReport) {
        gameState.lastReport.check = safeClone(check);
        startD20Animation(check);
      } else if (gameState.lastReport) startSceneEffect();
      if (!menu || option.onSelect === 'decision_back' || option.onSelect === 'recover_checkpoint') saveGame();
      refreshInterface(); focusNarrative();
    }

    // Échec sans récit propre : annonce l'approche tentée, son coût, puis rappelle qu'elle est épuisée.
    function failureParagraphs(option, actor, message) {
      const approach = option.label.replace(/^(Option|What If|Chronique|Mission|Décision)\s*[–—-]\s*(?:[^:]{1,30}:\s*)?/, '').trim();
      const lowered = approach.charAt(0).toLowerCase() + approach.slice(1);
      const who = PRESENTATION.people[option.characterId]?.short ?? actor.name;
      return [`${who} échoue dans sa tentative : ${lowered}.`,
        message || 'La tentative n’aboutit pas.',
        'Cette approche ne peut plus être rejouée dans cette scène; une autre reste possible, ou le Clan peut poursuivre sa route.'];
    }

    // Journal des décisions du Clan : chaque choix pris, par qui, avec quelle issue, rangé par chapitre.
    // Il suit les checkpoints (un retour efface la décision annulée) et la sauvegarde.
    function recordDecision(option, roomId, won) {
      if (!option?.label || /^(navigation-|point-|report-|dice-)/.test(option.id)) return;
      const raw = PRESENTATION.choices[option.id]?.title ?? option.label;
      const kind = /^What If/.test(raw) ? 'etsi' : /^Option absurde/.test(raw) || String(option.onSelect).startsWith('silly_') ? 'chaos' : option.id.startsWith('repos-') ? 'repos' : 'normal';
      const title = raw.replace(CHOICE_TAG, '').replace(/^(Option|Mission|Décision|Scène \d+)\s*[–—-]\s*/, '').slice(0, 140);
      gameState.decisions = [...(gameState.decisions ?? []), { room: roomId, chapter: rooms[roomId]?.chapter ?? 0, id: option.id, title, actor: option.characterId ?? '',
        won: option.resolution || option.check ? Boolean(won) : null, kind }].slice(-200);
    }

    function decisionTags(entry) {
      return [entry.kind === 'etsi' ? 'Et si…' : entry.kind === 'chaos' ? 'Provocation' : entry.kind === 'repos' ? 'Repos' : '', entry.won === true ? '✓ Réussi' : entry.won === false ? '✗ Échoué' : ''].filter(Boolean);
    }

    function decisionChip(entry) {
      const chip = document.createElement('button'); chip.type = 'button'; chip.className = 'decision-chip'; chip.dataset.kind = entry.kind;
      if (entry.actor && characters[entry.actor]) chip.appendChild(portraitImage(entry.actor));
      const text = document.createElement('span'); text.textContent = entry.title; chip.appendChild(text);
      decisionTags(entry).forEach(tag => { const mark = document.createElement('small'); mark.textContent = tag; chip.appendChild(mark); });
      chip.addEventListener('click', () => openJournal('decisions'));
      return chip;
    }

    // Les trois derniers choix du groupe restent visibles au-dessus des propositions.
    function renderDecisionStrip() {
      const strip = document.getElementById('decisionStrip'); strip.replaceChildren();
      const recent = (gameState.decisions ?? []).slice(-3);
      strip.hidden = !recent.length || Boolean(gameState.lastReport) || ['title_screen', 'credits'].includes(gameState.roomId);
      if (strip.hidden) return;
      const label = document.createElement('span'); label.className = 'decision-strip-label'; label.textContent = 'Le Clan a choisi'; strip.appendChild(label);
      recent.forEach(entry => strip.appendChild(decisionChip(entry)));
    }

    function renderDecisions() {
      const panel = document.getElementById('decisionsPanel'); panel.replaceChildren();
      const all = gameState.decisions ?? [], count = kind => all.filter(entry => entry.kind === kind).length;
      const summary = document.createElement('p'); summary.className = 'decisions-summary';
      summary.textContent = all.length ? `${all.length} décisions · ${count('etsi')} choix « Et si… » (parcours alternatif) · ${count('chaos')} provocations · ${count('repos')} repos` : 'Aucune décision prise pour le moment. Les choix du Clan apparaîtront ici, chapitre par chapitre.';
      panel.appendChild(summary);
      const chapters = [...new Set(all.map(entry => entry.chapter))];
      chapters.forEach(chapter => {
        const heading = document.createElement('h3'); heading.textContent = chapter ? `Chapitre ${CHRONICLE_CHAPTERS[chapter - 1]?.title ?? chapter}` : 'Avant la chronique'; panel.appendChild(heading);
        const list = document.createElement('ol'); list.className = 'decisions-list';
        all.filter(entry => entry.chapter === chapter).forEach(entry => { const item = document.createElement('li'); item.appendChild(decisionChip(entry)); list.appendChild(item); });
        panel.appendChild(list);
      });
    }

    function buildActionReport(option, roomId, result, before, message) {
      const success = Boolean(result?.success), story = ACTION_NARRATION[option.id];
      const actor = characters[option.characterId];
      const stateStory = success ? null : story?.failureByState?.[actor?.state] ?? (actor?.state === 'dead' ? {title: `${actor.name} ne survit pas à cette tentative`, paragraphs: [`${actor.name} ne parvient pas à mener son action à bien. Déjà blessé, il reçoit des coups auxquels il ne survit pas.`, 'Le groupe doit désormais compter avec sa mort: il ne pourra plus participer aux actions suivantes. Le retour à la décision précédente permet de reprendre avant cette tentative.']} : null);
      const paragraphs = result?.successWithCost ? [message] : stateStory?.paragraphs ?? story?.[success ? 'success' : 'failure'] ?? (!success && actor && option.label ? failureParagraphs(option, actor, message) : null) ?? [message || (success ? 'Le groupe accomplit cette action.' : 'La tentative échoue; le groupe doit choisir une autre approche.')];
      const changes = [];
      Object.entries(characters).forEach(([id, c]) => {
        if (before.characters[id]?.state !== c.state) changes.push(`${c.name}: ${stateLabel(id, c.state)}.`);
      });
      const effects = effectsDiff(before);
      const objectives = { templeEvacuated: 'Les occupants du temple sont à l’abri.', millSaved: 'Le moulin est sécurisé.', dragonRepelled: 'Le dragon est repoussé de la forteresse.', leosinSaved: 'Leosin et les prisonniers sont libérés.', cyanwrathDead: 'Cyanwrath est mort; il ne participera plus à la suite du récit.', eggsStolen: 'Le groupe emporte les deux œufs noirs.', eggsDestroyed: 'Les œufs sont détruits: ils ne pourront pas éclore.', eggsLeft: 'Les œufs restent dans la grotte.', portalDamaged: 'Le portail est endommagé.', metallicAlliance: 'Les dragons ont accepté votre proposition.' };
      Object.entries(objectives).forEach(([flag, description]) => { if (flags[flag] && !before.flags[flag]) changes.push(description); });
      const factions = { harpers: 'les Ménestrels', zhentarim: 'le Zhentarim', cult: 'le Culte', gauntlet: 'le Gantelet', enclave: 'l’Enclave d’Émeraude', lords: 'l’Alliance des Seigneurs' };
      if (gameState.reinforcement) { changes.push(gameState.reinforcement); gameState.reinforcement = null; }
      if (gameState.roomId !== roomId) changes.push(`Suite du parcours: ${rooms[gameState.roomId].title}.`);
      if (!changes.length && !effects.length) changes.push(success ? 'L’action est accomplie. Le groupe peut poursuivre.' : 'L’objectif n’est pas encore atteint. Une autre approche ou un retour au checkpoint reste possible.');
      return { roomId, optionId: option.id, effects, check: result?.check ?? null, successWithCost: Boolean(result?.successWithCost), title: result?.successWithCost ? option.costTitle ?? 'L’objectif est atteint, au prix d’un effort supplémentaire' : stateStory?.title ?? story?.[success ? 'successTitle' : 'failureTitle'] ?? (success ? 'Le résultat de votre action' : 'La tentative rencontre un obstacle'), paragraphs, changes, failed: !success };
    }

