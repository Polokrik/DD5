    function writeContext(text) {
      const line = document.createElement('div');
      line.textContent = text;
      const log = document.getElementById('eventLog');
      log.appendChild(line);
      uiState.log.push(String(text));
      if (uiState.log.length > 200) { uiState.log.shift(); log.firstElementChild?.remove(); }
      if (!String(text).startsWith('>') && !String(text).startsWith('[DEBUG]')) {
        uiState.feedback = text;
        renderFeedback();
      }
    }

    function updateStatusStrip() {
      const morale = variables.moraleGroupe >= 2 ? 'Le groupe garde confiance' : variables.moraleGroupe < 0 ? 'Le groupe est éprouvé' : 'Le groupe reste uni';
      const moralPct = Math.round((variables.moraleGroupe + 5) * 10), alertPct = Math.round(Math.max(0, Math.min(6, variables.chaos)) / 6 * 100);
      statusEl.textContent = `Moral ${moralPct} % · Alerte ${alertPct} % · ${morale} · Niveau ${getAdventureLevel()} · ${hasSaveData() ? 'Progression enregistrée localement' : 'Votre aventure vous attend'}`;
      document.getElementById('undoButton').disabled = !findDecisionCheckpoint();
    }

    function renderFeedback() {
      const feedback = document.getElementById('feedback');
      feedback.textContent = uiState.feedback;
      feedback.hidden = !uiState.feedback || Boolean(gameState.lastReport);
      feedback.classList.toggle('failure', /GAME OVER|impossible|refusé|corrompu|Aucun checkpoint/.test(uiState.feedback));
    }

    function portraitImage(id) {
      const img = document.createElement('img');
      img.src = getPortrait(id); img.alt = ''; img.className = 'portrait'; img.width = 32; img.height = 48;
      return img;
    }

    const FEMALE_COMPANIONS = new Set(['ellyjobell', 'sislay']);
    const agree = (id, masculine, feminine) => FEMALE_COMPANIONS.has(id) ? feminine : masculine;
    const stateLabel = (id, state) => FEMALE_COMPANIONS.has(id)
      ? { injured: 'Blessée', captured: 'Capturée', dead: 'Décédée', retired: 'Retirée' }[state] ?? PRESENTATION.states[state]
      : PRESENTATION.states[state];
    const HEALTH_POINTS = { active: 3, injured: 2, down: 1, dead: 0 };

    function renderParty() {
      const list = document.getElementById('partyList');
      list.replaceChildren();
      const present = Object.entries(characters).filter(([, c]) => ['active', 'injured', 'down'].includes(c.state));
      document.getElementById('partyCount').textContent = `${present.length} compagnons`;
      present.forEach(([id, c]) => {
        const button = document.createElement('button'); button.className = 'party-person'; button.dataset.state = c.state;
        button.setAttribute('aria-label', `${c.name}, ${stateLabel(id, c.state)}. Voir la compagnie`);
        const text = document.createElement('span'), name = document.createElement('strong'), state = document.createElement('small');
        name.textContent = PRESENTATION.people[id]?.short ?? c.name; state.textContent = `N${getAdventureLevel()} · ${stateLabel(id, c.state)}`;
        const health = HEALTH_POINTS[c.state] ?? 0, bar = document.createElement('span'), stack = document.createElement('span');
        bar.className = 'health'; bar.dataset.health = String(health); bar.setAttribute('role', 'img');
        const saves = c.state === 'down' ? ` Jets de mort : ${c.deathSaves?.s ?? 0} réussite(s), ${c.deathSaves?.f ?? 0} échec(s).` : '';
        bar.setAttribute('aria-label', `Santé ${health} sur 3.${saves}`); bar.title = `Santé ${health}/3.${saves}`;
        for (let i = 0; i < 3; i++) bar.appendChild(document.createElement('i'));
        stack.className = 'portrait-stack'; stack.append(portraitImage(id), bar);
        text.append(name, state); button.append(stack, text);
        button.addEventListener('click', () => openCompany(id)); list.appendChild(button);
      });
    }

    // Les marques de méthode (« What If », « Chronique ») deviennent un repère discret plutôt qu'un préfixe du titre.
    const CHOICE_TAG = /^(Option absurde|What If|Chronique)\s*[–—-]\s*/;
    const CHOICE_BADGES = { 'What If': 'Et si…', 'Option absurde': 'Provocation' };
    const EXIT_LABELS = { nord: 'Continuer vers le nord', sud: 'Revenir vers le sud', est: 'Aller vers l’est', ouest: 'Aller vers l’ouest' };

    function getPresentedChoices() {
      if (gameState.lastReport) {
        const pending = getD20AnimationPending(), back = findDecisionCheckpoint(), restart = !back && gameState.roomId === 'title_screen';
        return [
          { option: { id: pending ? 'dice-skip' : 'report-continue', label: pending ? 'Afficher le résultat maintenant' : gameState.lastReport.rolledBack ? 'Reprendre avant cette décision' : `Poursuivre : ${getCurrentRoom().title}` }, continuation: !pending, skipDice: pending, shortcut: 1 },
          { option: { id: back ? 'report-back' : restart ? 'report-restart' : 'report-home', label: back ? 'Revenir avant une décision' : restart ? 'Commencer une nouvelle partie' : 'Revenir à l’accueil', intent: back ? 'Annule les conséquences de cette tentative en restaurant une décision praticable.' : restart ? 'Repartir à Verdure avec tous les compagnons du début.' : 'Conserver la sauvegarde et quitter la scène.' }, decisionBack: Boolean(back), restart, home: !back && !restart, shortcut: 2 }
        ];
      }
      const options = getAvailableOptions(gameState.roomId);
      if (gameState.roomId !== 'title_screen') {
        const choices = options.map((option,index) => ({ option,index,shortcut:index+1 }));
        const canTravel = Object.values(characters).some(c => ['active', 'injured'].includes(c.state));
        Object.keys(canTravel ? getCurrentRoom()?.exits ?? {} : {}).forEach(direction => choices.push({
          direction, index: -2, shortcut: choices.length + 1,
          option: { id: `exit-${direction}`, label: EXIT_LABELS[direction] ?? `Aller vers ${direction}`,
            intent: direction === 'sud' ? 'Quitter la scène et revenir sur ses pas. Rien n’est perdu.' : 'Quitter la scène et poursuivre le chemin, sans autre épreuve.' } }));
        return choices;
      }
      return [
        { option: { id:'title-new',label:'Commencer l’aventure' },index:options.findIndex(o=>o.id==='title-new'),shortcut:1 },
        { option: { id:'title-continue',label:'Reprendre ma partie' },index:options.findIndex(o=>o.id==='title-continue'),shortcut:2 },
        { option: { id:'read-chronicle',label:'Lire la chronique' },journal:true,shortcut:3 }
      ];
    }

    function executePresentedChoice(shortcut) {
      const choice = getPresentedChoices().find(c => c.shortcut === Number(shortcut));
      if (!choice || choice.index === -1) return;
      if (choice.skipDice) { finishD20Animation(); return; }
      if (choice.direction) { handleCommand(`go ${choice.direction}`); return; }
      if (choice.restart) { handleSpecialSelection('restart_campaign'); refreshInterface(); focusNarrative(); return; }
      if (choice.decisionBack) { restoreDecisionCheckpoint(); saveGame(); refreshInterface(); focusNarrative(); return; }
      if (choice.home) { handleSpecialSelection('return_title'); refreshInterface(); focusNarrative(); return; }
      if (choice.continuation) {
        gameState.lastReport = null; uiState.effect = null; uiState.diceAnimation = null; uiState.feedback = '';
        refreshInterface(); if (gameState.roomId !== 'title_screen') saveGame(); focusNarrative(); return;
      }
      if (choice.journal) { openJournal('chronicle'); return; }
      chooseOption(String(choice.index+1));
    }

    // Effets chiffrés : chaque point de jauge est converti en pourcentage pour que le joueur voie ce qui change.
    const FX_POINTS = { moraleGroupe: { label: 'Moral', pct: 10, good: 1 }, chaos: { label: 'Alerte', pct: 17, good: -1 },
      castleAlertLevel: { label: 'Alerte du château', pct: 20, good: -1 }, publicTrust: { label: 'Confiance publique', pct: 5, good: 1 } };
    const FACTION_LABELS = { harpers: 'Ménestrels', zhentarim: 'Zhentarim', cult: 'Culte', gauntlet: 'Gantelet', enclave: 'Enclave d’Émeraude', lords: 'Alliance des Seigneurs' };
    const signedPct = value => `${value > 0 ? '+' : '−'}${Math.abs(value)} %`;

    function chipsFromDeltas(delta) {
      const chips = [];
      Object.entries(FX_POINTS).forEach(([key, unit]) => {
        const points = Number(delta[key]) || 0;
        if (points) chips.push({ label: unit.label, text: signedPct(points * unit.pct), tone: points * unit.good > 0 ? 'good' : 'bad' });
      });
      Object.entries(delta.factions ?? {}).forEach(([faction, points]) => {
        if (points) chips.push({ label: FACTION_LABELS[faction] ?? faction, text: signedPct(points * 5), tone: points > 0 ? 'good' : 'bad' });
      });
      return chips;
    }

    // Lit les variations annoncées par une option (effets immédiats, branche de réussite ou d'échec).
    function collectDeltas(...sources) {
      const total = { factions: {} };
      sources.filter(Boolean).forEach(source => {
        const delta = source.variableDelta ?? {};
        ['moraleGroupe', 'chaos', 'publicTrust', 'castleAlertLevel'].forEach(key => {
          total[key] = (total[key] ?? 0) + (Number(source[key]) || 0) + (Number(delta[key]) || 0);
        });
        [source.councilReputation, delta.councilReputation, source.factionTrust, delta.factionTrust].forEach(group => {
          Object.entries(group ?? {}).forEach(([faction, points]) => { total.factions[faction] = (total.factions[faction] ?? 0) + (Number(points) || 0); });
        });
      });
      return total;
    }

    function effectChips(option) {
      const chaotic = CHAOTIC_CHOICES[option.onSelect];
      if (chaotic) return { always: chipsFromDeltas(collectDeltas(chaotic)), success: [], failure: [] };
      if (!option.resolution) return { always: chipsFromDeltas(collectDeltas(option.effects, option.onSuccess)), success: [], failure: [] };
      return { always: [], success: chipsFromDeltas(collectDeltas(option.effects, option.onSuccess)), failure: chipsFromDeltas(collectDeltas(option.onFailure)) };
    }

    function chipElement(chip) {
      const element = document.createElement('span'); element.className = `fx ${chip.tone}`;
      const label = document.createElement('small'); label.textContent = chip.label;
      element.append(label, document.createTextNode ? document.createTextNode(chip.text) : chip.text);
      return element;
    }

    function effectsDiff(before) {
      const factions = {};
      ['councilReputation', 'factionTrust'].forEach(key => Object.entries(variables[key] ?? {}).forEach(([faction, value]) => {
        const previous = (key === 'councilReputation' ? before.reputation : before.trust)?.[faction] ?? 0;
        if (value !== previous) factions[faction] = (factions[faction] ?? 0) + value - previous;
      }));
      return chipsFromDeltas({ moraleGroupe: variables.moraleGroupe - before.morale, chaos: variables.chaos - before.chaos,
        castleAlertLevel: (variables.castleAlertLevel ?? 0) - (before.castleAlert ?? 0), publicTrust: variables.publicTrust - (before.publicTrust ?? variables.publicTrust), factions });
    }

    // Les descriptions écrites en points deviennent des pourcentages à l'affichage.
    function pointsToPercent(text) {
      const unit = { moral: 10, alerte: 17, chaos: 17, confiance: 5 };
      return text
        .replace(/\b(moral|alerte|chaos)(\s+)([+−-])(\d+)(?![\d%])/gi, (m, word, gap, sign, n) => `${word.toLowerCase() === 'chaos' ? 'alerte' : word}${gap}${sign}${Number(n) * unit[word.toLowerCase()]} %`)
        .replace(/\b(Ménestrels|Gantelet|Enclave|Seigneurs|Zhentarim|Culte|confiance(?: publique| générale)?)(\s+)([+−-])(\d+)(?![\d%])/g, (m, word, gap, sign, n) => `${word}${gap}${sign}${Number(n) * 5} %`);
    }

    // Les descriptions de choix sont écrites pour l'équipe; le joueur lit une version sans référence au journal ni au jeu.
    function inWorldText(text) {
      if (typeof text !== 'string') return text;
      return pointsToPercent(text)
        .replace(/^(?:What If|Chronique)\s*[—–-]\s*/, '')
        .replace(/^(?:Variante|Suivre le journal|Suivre le récit|Suivre la route du journal|Suivre l’accès rapporté au journal|Suivre le déroulé attesté|Suivre le duel rapporté dans la chronique|Suivre la rencontre du journal dans le château volant|Lire la libération attestée des elfes|Recueillir les exigences attestées)\s*:\s*/, '')
        .replace(/\b(rapport[ée]e?s?|décrit|présent[ée]) (?:dans|par) (?:le journal|la chronique)/g, 'vécu dans la campagne')
        .replace(/\bdu journal(?! de Neronvein)/g, 'de la campagne').replace(/\ble journal(?! de Neronvein)/g, 'la campagne')
        .replace(/\bdans la chronique\b/g, 'dans la campagne')
        .replace(/\battest(ées|és|ée|é)(?![a-zà-ÿ])/g, (m, e) => ({ 'é': 'réel', 'ée': 'réelle', 'és': 'réels', 'ées': 'réelles' })[e])
        .replace(/ dans l’adaptation/g, '').replace(/Pas de montant d’or inventé : /g, '')
        .replace(/\bvariantes collectives?\b/g, m => m.endsWith('s') ? 'approches collectives' : 'approche collective')
        .replace(/\bcette variante\b/g, 'cette approche').replace(/\bles variantes\b/g, 'les approches').replace(/\bune variante\b/g, 'une approche')
        .replace(/^(.)/, c => c.toUpperCase());
    }


    function renderChoices() {
      renderDecisionStrip();
      const list = document.getElementById('choiceList'); list.replaceChildren();
      getPresentedChoices().forEach((choice, slot) => {
        const { option } = choice;
        const card = document.createElement('button'); card.type = 'button'; card.className = `choice-card${slot === 0 && (gameState.roomId === 'title_screen' || gameState.lastReport) ? ' primary' : ''}`;
        card.dataset.choice = option.id; card.dataset.shortcut = choice.shortcut; card.disabled = choice.index === -1;
        if (choice.direction) card.dataset.direction = choice.direction;
        const number = document.createElement('span'); number.className = 'choice-number'; number.textContent = String(choice.shortcut).padStart(2, '0');
        const content = document.createElement('span'), title = document.createElement('span'), detail = document.createElement('span');
        content.className = 'choice-content'; title.className = 'choice-label'; detail.className = 'choice-detail';
        const rawTitle = PRESENTATION.choices[option.id]?.title ?? option.label, tag = rawTitle.match(CHOICE_TAG);
        title.textContent = rawTitle.replace(CHOICE_TAG, '').replace(/^(Option|Mission|Décision|Scène \d+)\s*[–—-]\s*/, '');
        let badge = null;
        if (tag && CHOICE_BADGES[tag[1]]) { badge = document.createElement('span'); badge.className = 'choice-tag'; badge.textContent = CHOICE_BADGES[tag[1]]; }
        const skill = PRESENTATION.skills[option.skill] ?? '';
        detail.textContent = inWorldText(option.intent) ?? PRESENTATION.choices[option.id]?.detail ?? (option.characterId ? `${PRESENTATION.people[option.characterId]?.short ?? ''} · ${skill}`
          : { 'title-new': 'Commencer avec le groupe à son arrivée à Verdure.', 'title-continue': choice.index === -1 ? 'Aucune sauvegarde disponible.' : 'Reprendre la progression enregistrée.', 'read-chronicle': 'Lire les dix-huit chapitres du récit de campagne.' }[option.id] ?? '');
        content.append(...(badge ? [badge] : []), title, detail); card.appendChild(number);
        if (option.characterId) card.appendChild(portraitImage(option.characterId));
        card.appendChild(content);
        if (option.resolution && option.characterId) {
          const preview = getCheckPreview(option,option.characterId), hint = document.createElement('span');
          hint.className = 'check-preview';
          hint.textContent = `${characters[preview.actorId].name} · niveau ${preview.level} · ${preview.label} : D20 ${preview.bonus < 0 ? '−' : '+'}${Math.abs(preview.bonus)} · ${preview.kind === 'attack' ? 'CA' : 'DD'} ${preview.dc}`;
          content.appendChild(hint);
        }
        if (option.riskText) { const risk = document.createElement('span'); risk.className = 'choice-risk'; risk.textContent = inWorldText(option.riskText); content.appendChild(risk); }
        const fxGroups = effectChips(option);
        if (fxGroups.always.length || fxGroups.success.length || fxGroups.failure.length) {
          const row = document.createElement('span'); row.className = 'choice-fx';
          [['', fxGroups.always], ['Réussite', fxGroups.success], ['Échec', fxGroups.failure]].forEach(([title, chips]) => {
            if (!chips.length) return;
            if (title) { const tag = document.createElement('span'); tag.className = 'choice-fx-label'; tag.textContent = title; row.appendChild(tag); }
            chips.forEach(chip => row.appendChild(chipElement(chip)));
          });
          content.appendChild(row);
        }
        const arrow = document.createElement('span'); arrow.className = 'choice-arrow'; arrow.textContent = '→'; arrow.setAttribute('aria-hidden', 'true'); card.appendChild(arrow);
        card.addEventListener('click', () => dispatchCommand(String(choice.shortcut))); list.appendChild(card);
      });
    }

    function focusNarrative() {
      const heading = document.getElementById('sceneTitle');
      heading.setAttribute('tabindex', '-1');
      heading.focus?.({ preventScroll: true });
      document.getElementById('context').scrollIntoView?.({ block: 'start', behavior: 'auto' });
    }

    function getSceneObservations(roomId = gameState.roomId) {
      if (roomId === 'act2_confrontation' && flags.WHAT_IF_CYANWRATH_DEAD) return [];
      return (rooms[roomId]?.observations ?? []).filter(observation =>
        (!observation.requiresFlag || flags[observation.requiresFlag])
        && (roomId !== 'northern_road' || flags.eggsStolen || !/Boule|Bill|dragonnet/i.test(observation.paragraphs.join(' '))));
    }

    function observeScene(observationId) {
      if (gameState.lastReport || !getSceneObservations().some(entry => entry.id === observationId)) return false;
      const key = `${gameState.roomId}:${observationId}`;
      if (!gameState.observations.includes(key)) {
        gameState.observations.push(key);
        saveGame();
      }
      return true;
    }

    function renderObservations() {
      const panel = document.getElementById('observationPanel');
      panel.replaceChildren();
      const entries = gameState.lastReport ? [] : getSceneObservations();
      const roomId = gameState.roomId;
      panel.hidden = !entries.length;
      if (!entries.length) return;
      const heading = document.createElement('h3'); heading.textContent = 'Observer les lieux';
      const hint = document.createElement('p'); hint.textContent = 'Prenez le temps de regarder ce qui peut éclairer votre décision.';
      panel.append(heading,hint);
      entries.forEach(entry => {
        const details = document.createElement('details'), summary = document.createElement('summary');
        details.className = 'scene-observation'; details.dataset.observation = entry.id;
        details.dataset.read = String(gameState.observations.includes(`${gameState.roomId}:${entry.id}`));
        summary.textContent = entry.title; details.appendChild(summary);
        entry.paragraphs.forEach(paragraph => {
          const p = document.createElement('p'); p.textContent = paragraph; details.appendChild(p);
        });
        details.addEventListener('toggle',() => {
          if (details.open && gameState.roomId === roomId && observeScene(entry.id)) details.dataset.read = 'true';
        });
        panel.appendChild(details);
      });
    }

    function getSceneMemories(roomId = gameState.roomId) {
      const memories = (typeof SCENE_MEMORIES === 'undefined' ? [] : SCENE_MEMORIES).filter(rule =>
        rule.rooms.includes(roomId) && Object.entries(rule.flags).every(([key,value]) => Boolean(flags[key]) === value));
      return memories.map(rule => ({id:rule.id,paragraphs:rule.paragraphs}));
    }

    function renderSceneMemories() {
      const panel = document.getElementById('sceneMemories');
      panel.replaceChildren();
      const entries = gameState.lastReport ? [] : getSceneMemories();
      panel.hidden = !entries.length;
      entries.forEach(entry => entry.paragraphs.forEach(paragraph => {
        const p = document.createElement('p'); p.textContent = paragraph; panel.appendChild(p);
      }));
    }

    function getScenePresentation(room) {
      const view = PRESENTATION.scenes[room.id];
      if (room.id === 'northern_road' && !flags.eggsStolen) return {...view,paragraphs:view.paragraphs.map(paragraph => /Boule|Bill|dragonnet/i.test(paragraph)
        ? 'Aucun dragonnet ne doit être confié à la guilde. Bjolnir voyage avec les autres compagnons; le Clan partage les emplois d’escorte et suit les chariots du Culte vers le nord.' : paragraph)};
      if (room.id === 'act2_confrontation' && flags.WHAT_IF_CYANWRATH_DEAD) return { ...view, hero: 'Le passage\nvers les œufs', heading: 'Le passage gardé dans la grotte', paragraphs: ['Cyanwrath est mort lors du duel de Verdure. Il ne peut donc pas attendre les aventuriers dans la grotte. Le Clan poursuit son exploration au-delà de la salle gardée, en direction des œufs.'], chapterNumber: 4 };
      if (room.id === 'elturel_road' && !flags.eggsStolen) return { heading: room.title, paragraphs: ['Le Clan quitte Verdure après avoir transmis les renseignements trouvés dans la grotte. Un message de Leosin oriente les aventuriers vers Elturel, où ils doivent retrouver le moine et rencontrer Ontharr Frume.', flags.eggsDestroyed ? 'Les œufs ont été détruits. Aucun dragonnet ne naît pendant le voyage.' : 'Les œufs sont restés dans la grotte. Le voyage se poursuit sans les dragonnets Boule et Bill.'], chapterNumber: 5 };
      if (room.id === 'campaign_end') {
        const conclusions = {
          simulated_victory: ['Le Clan et ses alliés parviennent à interrompre le rituel avant que Tiamat puisse franchir le portail. Les forces rassemblées devant le cercle ont donné aux aventuriers le temps d’atteindre les cultistes et de mettre fin à leur invocation.', 'Cette victoire conclut votre bataille hypothétique. Les décisions prises pour rassembler les alliés, affaiblir le Culte et protéger les civils ont déterminé cette issue.'],
          partial_victory: ['Les aventuriers n’ont pas arrêté le rituel à temps pour empêcher toute manifestation de Tiamat. Ils parviennent cependant à la repousser, au terme d’un affrontement qui laisse les troupes alliées éprouvées.', 'Cette victoire partielle conclut votre bataille hypothétique. Le groupe a contenu la menace, mais le temps accordé au rituel et la dispersion des forces ont rendu la victoire plus coûteuse.'],
          failure: ['Le rituel atteint son terme avant que le Clan puisse briser le cercle. Tiamat franchit le portail et les alliés ne disposent plus des moyens nécessaires pour contenir son arrivée.', 'Cette défaite clôt une variante de la bataille. Vous pouvez revenir avant la dernière décision pour tenter une autre action, ou remonter aux checkpoints précédents afin de changer le plan du groupe.'],
          what_if: ['Le sabotage du Clan affaiblit le rituel au moment où les forces alliées atteignent le cercle. Les dragons métalliques profitent de cette ouverture pour sceller le portail et empêcher Tiamat de le franchir.', 'Cette fin appartient entièrement aux chemins What If. Elle suppose une alliance et un scellement que la campagne jouée n’a pas encore établis.']
        };
        return { heading: 'L’issue de votre bataille', paragraphs: conclusions[flags.finalBattleEnding] ?? ['La bataille est terminée.'], chapterNumber: null };
      }
      if (room.id !== 'greenest_keep') return view;
      const briefings = [
        { until: 'sanctuaireDone', heading: 'Le temple doit être évacué', paragraphs: ['Les réfugiés sont conduits à l’intérieur de la forteresse. Le gouverneur Nighthill, qui porte lui-même les blessures de l’attaque, demande aux aventuriers d’aider les habitants encore pris dans la ville. Escobert leur indique un ancien tunnel qui rejoint la rivière.', 'Un prêtre et des paysans sont enfermés dans le temple. Des pillards en surveillent les accès et cherchent à mettre le feu à la porte sud. Le Clan doit dégager une sortie, couvrir l’évacuation et ramener les occupants derrière les remparts.'] },
        { until: 'moulinDone', heading: 'Les pillards menacent le moulin', paragraphs: ['Le prêtre et les habitants évacués du temple ont rejoint la forteresse. Un garde apprend alors à Nighthill que les pillards se préparent à incendier le moulin, dont dépendent les réserves de nourriture de la ville.', 'Les aventuriers doivent repartir et empêcher cette destruction. Les récits de la campagne signalent une embuscade près du bâtiment; approcher sans observer les guetteurs peut exposer le groupe aux premiers coups.'] },
        { until: 'dragonRepelled', heading: 'Les défenseurs appellent le Clan sur les remparts', paragraphs: ['Le moulin a été sécurisé lorsque le dragon revient attaquer la forteresse. Les gardes se préparent à soutenir un nouvel assaut et le Clan les rejoint pour tenter de repousser la créature.', 'La menace concerne maintenant tous ceux qui ont trouvé refuge derrière les murs. Le groupe doit concentrer son intervention sur le dragon pour obtenir un répit.'] },
        { until: 'duelDone', heading: 'Cyanwrath exige un adversaire', paragraphs: ['Le dragon a été chassé. Au petit matin, Langdedrosa Cyanwrath se présente avec des otages et exige d’affronter un champion. Drek’Thar se porte volontaire dans le récit de la campagne.', 'Le duel doit permettre la libération des prisonniers. Le guerrier peut être vaincu et blessé sans que l’aventure s’arrête; les autres approches proposées ouvrent des variantes de cet événement.'] },
        { until: 'actICompleted', heading: 'Retrouver le camp des pillards', paragraphs: ['Le défi de Cyanwrath a pris fin. Nighthill demande au Clan de suivre les assaillants pour découvrir leurs intentions et retrouver les richesses volées à la ville.', 'Un apprenti de Leosin Erlanthar signale également la disparition du moine. La piste des pillards doit conduire les aventuriers à leur camp et aux prisonniers qu’ils y détiennent.'] }
      ];
      return { ...view, ...(briefings.find(b => !flags[b.until]) ?? {heading:'Les instructions sont prises',paragraphs:['Le groupe peut maintenant suivre la piste des pillards et rechercher Leosin. Les habitants secourus restent à l’abri de la forteresse.']}) };
    }

    function refreshInterface() {
      const room = getCurrentRoom(); if (!room) return;
      const pending = getD20AnimationPending();
      const report = gameState.lastReport, shownRoom = report ? rooms[report.roomId] : room;
      const view = getScenePresentation(shownRoom);
      const text = (id, value) => { document.getElementById(id).textContent = value; };
      text('heroTitle', view?.hero ?? shownRoom.title);
      document.getElementById('heroTitle').classList.toggle('long-title', !view);
      const sceneAct = Object.keys(DATA.actRooms).find(a => DATA.actRooms[a].includes(shownRoom.id)) ?? acts.current;
      text('heroEyebrow', view?.eyebrow ?? (sceneAct === 'ACT_V' ? 'What If · Une bataille hypothétique' : `Acte ${sceneAct.slice(4)} · ${shownRoom.title}`));
      text('heroTagline', view?.tagline ?? '');
      document.getElementById('heroTagline').hidden = !view?.tagline;
      text('sceneCoordinate', view?.location ?? shownRoom.title);
      text('sceneTitle', pending ? 'Le groupe passe à l’action' : report?.title ?? view?.heading ?? room.title);
      const chapter = view?.chapterNumber ?? shownRoom.chapter;
      text('chapterLabel', chapter ? `Chapitre ${CHRONICLE_CHAPTERS[chapter - 1].title}` : 'Récit alternatif · La bataille finale');
      text('pageNumber', chapter ? String(chapter).padStart(2,'0') : '◇');
      text('decisionTitle', pending ? 'Le D20 roule…' : report ? 'La suite' : room.id === 'title_screen' ? 'Ouvrir le récit' : 'Que faites-vous ?');
      const narrative = document.getElementById('sceneNarrative'); narrative.replaceChildren();
      (pending ? [`${characters[report.check.actorId]?.name ?? 'Le compagnon'} tente cette épreuve. Le résultat et ses conséquences apparaîtront dès que le dé sera arrêté.`] : report?.paragraphs ?? view?.paragraphs ?? room.paragraphs ?? [room.description]).forEach(paragraph => { const p = document.createElement('p'); p.textContent = paragraph; narrative.appendChild(p); });
      const effectsBox = document.getElementById('reportEffects'); effectsBox.replaceChildren();
      (report?.effects ?? []).forEach(chip => effectsBox.appendChild(chipElement(chip)));
      effectsBox.hidden = !report || pending || !(report.effects ?? []).length;
      const changes = document.getElementById('reportChanges'); changes.replaceChildren(); changes.hidden = !report || pending || !(report.changes ?? []).length;
      changes.classList.toggle('failure', Boolean(report?.failed));
      (report?.changes ?? []).forEach(change => { const li = document.createElement('li'); li.textContent = change; changes.appendChild(li); });
      document.getElementById('undoButton').hidden = ['title_screen', 'credits'].includes(room.id);
      canvas.setAttribute('aria-label', view?.location ? `Illustration en pixel art: ${view.location}` : `Illustration d’ambiance: ${shownRoom.title}`);
      canvas.dataset.scene = PRESENTATION.scenes[shownRoom.id]?.art ?? 'keep';
      const direction = getActionDirection();
      document.getElementById('actionScene').hidden = pending || !direction || !uiState.preferences.effects;
      text('actionCaption', pending ? '' : direction?.caption ?? '');
      document.getElementById('actionCanvas').setAttribute('aria-label', direction?.caption ?? 'Illustration du résultat de votre action');
      soundscape.setScene((view?.art === 'wall' ? 'verdure' : view?.art) ?? 'keep');
      renderChoices(); renderParty(); renderFeedback(); updateStatusStrip(); render();
      renderObservations(); renderSceneMemories();
    }

    function showDialog(id) { const dialog = document.getElementById(id); if (!dialog.open) dialog.showModal(); }

    function openJournal(tab = 'history') {
      const chronicle = tab === 'chronicle', decisions = tab === 'decisions';
      document.getElementById('chroniclePanel').hidden = !chronicle;
      document.getElementById('decisionsPanel').hidden = !decisions;
      document.getElementById('eventLog').hidden = chronicle || decisions;
      document.getElementById('chronicleTab').setAttribute('aria-pressed', String(chronicle));
      document.getElementById('decisionsTab').setAttribute('aria-pressed', String(decisions));
      document.getElementById('historyTab').setAttribute('aria-pressed', String(!chronicle && !decisions));
      if (chronicle) renderChapter(uiState.chapter);
      if (decisions) renderDecisions();
      showDialog('journalDialog');
    }

    function renderChapter(index) {
      uiState.chapter = index;
      const list = document.getElementById('chapterList'); list.replaceChildren();
      CHRONICLE_CHAPTERS.forEach((chapter, i) => {
        const button = document.createElement('button'); button.textContent = chapter.title;
        button.setAttribute('aria-current', String(i === index)); button.addEventListener('click', () => renderChapter(i)); list.appendChild(button);
      });
      const reader = document.getElementById('chapterReader'); reader.replaceChildren();
      const heading = document.createElement('h3'); heading.textContent = CHRONICLE_CHAPTERS[index].title; reader.appendChild(heading);
      CHRONICLE_CHAPTERS[index].paragraphs.forEach(text => { const p = document.createElement('p'); p.textContent = text; reader.appendChild(p); });
      reader.scrollTop = 0;
    }

    function openCompany(selected = 'bjolnir') {
      if (typeof selected !== 'string' || !PRESENTATION.people[selected]) selected = 'bjolnir';
      const roster = document.getElementById('companyRoster'); roster.replaceChildren();
      Object.entries(characters).forEach(([id, c]) => {
        const button = document.createElement('button'); button.dataset.character = id; button.setAttribute('aria-current', String(id === selected));
        const name = document.createElement('span'); name.textContent = PRESENTATION.people[id].short;
        button.append(portraitImage(id), name); button.addEventListener('click', () => openCompany(id)); roster.appendChild(button);
      });
      const person = PRESENTATION.people[selected], list = document.getElementById('companyDetails'); list.replaceChildren();
      const heading = document.createElement('div'); heading.className = 'profile-heading';
      const name = document.createElement('h3'); name.textContent = person.name ?? characters[selected].name;
      const meta = document.createElement('div'); meta.className = 'profile-meta'; meta.textContent = `${person.race} · ${person.role} · ${stateLabel(selected, characters[selected].state)}`;
      const identity = document.createElement('div'); identity.append(name, meta); heading.append(portraitImage(selected), identity); list.appendChild(heading);
      const prose = document.createElement('div'); prose.className = 'profile-prose';
      [person.personality,...(person.biography??[])].forEach(text => {const p = document.createElement('p');p.textContent=text;prose.appendChild(p);}); list.appendChild(prose);
      const equipment = document.createElement('div'); equipment.className = 'profile-equipment';
      const title = document.createElement('h4'); title.textContent = 'Équipement'; equipment.appendChild(title);
      const items = document.createElement('p'); items.textContent = (person.equipment??[]).join(', '); equipment.appendChild(items);
      if (person.laterEquipment?.length) {const later=document.createElement('p');later.textContent=`Objets portés plus tard dans la campagne : ${person.laterEquipment.join(', ')}.`;equipment.appendChild(later);}
      const note=document.createElement('p');note.textContent='Tout cela n’est pas en leur possession dès l’arrivée à Verdure : certains objets ne viendront que plus tard.';equipment.appendChild(note);list.appendChild(equipment);
      renderCharacterStats(list,selected);
      const sources=document.createElement('details');sources.className='profile-sources';const sourcesTitle=document.createElement('summary');sourcesTitle.textContent='Sources de la chronique (hors récit)';const sourcesText=document.createElement('p');sourcesText.textContent=(person.sources??[]).join(' · ');sources.append(sourcesTitle,sourcesText);list.appendChild(sources);
      list.scrollTop=0;
      showDialog('companyDialog');
    }

