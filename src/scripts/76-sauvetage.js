    // ───────────────────────── Mission de sauvetage ─────────────────────────
    // Un compagnon capturé n'est pas perdu : tant qu'il est retenu, chaque scène propose de partir à sa rescousse.
    // La mission est un embranchement générique (une seule salle, réutilisée) : trois approches, un échec qui coûte,
    // puis retour à la scène quittée. C'est une règle de jeu, pas un épisode de la campagne.
    rooms.rescue_mission = {
      id: 'rescue_mission', title: 'Au secours d’un compagnon', chapter: 0, exits: {}, objects: ['Les geôliers', 'Les liens du captif'],
      description: 'Un compagnon est retenu par le Culte. Le Clan cherche comment le délivrer.',
      source: 'Règle de jeu : sauvetage d’un compagnon capturé. Aucun épisode de la campagne jouée n’est décrit ici.',
      options: [
        { id: 'rescue-stealth', label: 'What If — Se glisser jusqu’au captif à la faveur de l’ombre', groupAction: true, requiresAnyAvailableCharacter: true, skill: 'stealth',
          resolution: { difficulty: 4, skill: 'stealth', risk: 'injury', deathType: 'replaceable', dc: 13 },
          check: { ability: 'dex', skillKey: 'stealth', kind: 'ability', label: 'Discrétion', dc: 13 },
          onSuccess: { onSelect: 'rescue_success', variableDelta: { chaos: -1 } }, onFailure: { variableDelta: { chaos: 1 } },
          riskText: 'Un échec blesse celui qui s’y risque et resserre la garde.' },
        { id: 'rescue-force', label: 'What If — Forcer le passage jusqu’au captif', groupAction: true, requiresAnyAvailableCharacter: true, skill: 'might',
          resolution: { difficulty: 5, skill: 'might', risk: 'injury', deathType: 'replaceable', dc: 14 },
          check: { ability: 'str', skillKey: 'athletics', kind: 'ability', label: 'Athlétisme', dc: 14 },
          onSuccess: { onSelect: 'rescue_success', variableDelta: { chaos: 1, moraleGroupe: 1 } }, onFailure: { variableDelta: { chaos: 2 } },
          riskText: 'Un échec blesse celui qui s’y risque et donne l’alerte. Même réussie, la force fait du bruit.' },
        { id: 'rescue-parley', label: 'What If — Parlementer avec les geôliers', groupAction: true, requiresAnyAvailableCharacter: true, skill: 'diplomacy',
          resolution: { difficulty: 5, skill: 'diplomacy', risk: 'cost', deathType: 'replaceable', dc: 15 },
          check: { ability: 'cha', skillKey: 'persuasion', kind: 'ability', label: 'Persuasion', dc: 15 },
          onSuccess: { onSelect: 'rescue_success', variableDelta: { moraleGroupe: 1 } }, onFailure: { variableDelta: { moraleGroupe: -1 } },
          riskText: 'Épreuve difficile, mais sans blessure : un échec n’entame que le moral.' },
        { id: 'rescue-later', label: 'Remettre le sauvetage à plus tard', onSelect: 'rescue_abandon', repeatable: true,
          intent: 'Revenir à la scène quittée. Le compagnon reste captif; une nouvelle tentative restera possible.' }
      ]
    };
    PRESENTATION.scenes.rescue_mission = { art: 'keep', heading: 'Au secours d’un compagnon', paragraphs: [rooms.rescue_mission.description] };

    const captiveIds = () => Object.keys(characters).filter(id => characters[id].state === 'captured');

    // Texte et décor de la mission, d'après le compagnon retenu et la scène quittée.
    function prepareRescueRoom() {
      const rescue = gameState.rescue, captive = characters[rescue?.id], room = rooms.rescue_mission;
      if (!captive) return;
      const name = PRESENTATION.people[rescue.id]?.short ?? captive.name, f = (m, fem) => agree(rescue.id, m, fem), origin = rooms[rescue.from];
      room.title = `Au secours de ${name}`; room.chapter = origin?.chapter ?? 0;
      const paragraphs = [
        `${name} a été ${f('pris', 'prise')} par les hommes du Culte, qui ${f('le', 'la')} retiennent à l’écart, sous bonne garde. Le Clan n’a pas l’intention de ${f('le', 'la')} laisser entre leurs mains.`,
        'Trois approches se présentent : se glisser dans l’ombre jusqu’aux liens, forcer le passage, ou parlementer avec les geôliers. Chaque tentative manquée resserre la garde, et celui qui s’y risque peut y laisser des plumes.'
      ];
      room.description = paragraphs.join('\n\n'); room.paragraphs = paragraphs;
      PRESENTATION.scenes.rescue_mission = { ...PRESENTATION.scenes[rescue.from], heading: room.title, paragraphs, tagline: '', hero: `Au secours\nde ${name}`, chapterNumber: room.chapter };
      const texts = {
        'rescue-stealth': ['Un compagnon profite de l’ombre pour atteindre les liens.', `${name} est ${f('délivré', 'délivrée')} sans un bruit. Le Clan se replie avant que les geôliers ne s’en aperçoivent; ${f('il', 'elle')} est ${f('éprouvé', 'éprouvée')}, mais libre.`, 'Un geôlier se retourne au mauvais moment. Il faut rompre le contact, et la garde se resserre.'],
        'rescue-force': ['Le Clan charge les geôliers pour ouvrir un chemin.', `Les geôliers reculent sous le choc et ${name} est ${f('arraché', 'arrachée')} à ses liens. Le vacarme a porté loin, mais ${f('il', 'elle')} est libre.`, 'Les geôliers tiennent bon et donnent l’alerte. Le Clan doit reculer.'],
        'rescue-parley': ['Un compagnon s’avance, mains ouvertes, pour négocier la libération.', `Les geôliers hésitent, puis s’écartent. ${name} rejoint le Clan sans qu’une arme ait été tirée.`, 'Les geôliers rient au nez du négociateur. Le Clan repart, la mine basse.']
      };
      room.options.forEach(option => {
        const text = texts[option.id]; if (!text) return;
        option.intent = `${text[0]} Réussite : ${name} est libre, ${f('blessé', 'blessée')} mais de retour dans le groupe. Échec : ${f('il', 'elle')} reste ${f('captif', 'captive')}; une autre approche reste possible.`;
        option.onSuccess.message = text[1]; option.onFailure.message = text[2];
      });
    }

    // Proposition ajoutée à chaque scène tant qu'un compagnon est retenu.
    function rescueEntryOptions(roomId) {
      if (['title_screen', 'credits', 'rescue_mission', 'campaign_end', 'campaign_frontier'].includes(roomId)) return [];
      if (!Object.values(characters).some(c => ['active', 'injured'].includes(c.state))) return [];
      return captiveIds().map(id => {
        const name = PRESENTATION.people[id]?.short ?? characters[id].name;
        return { id: `rescue-start-${id}`, label: `Partir à la rescousse de ${name}`, onSelect: 'start_rescue', rescueId: id, repeatable: true,
          intent: `${name} est ${agree(id, 'retenu', 'retenue')} par le Culte. Quitter cette scène pour tenter de ${agree(id, 'le', 'la')} délivrer : trois approches, et retour ici ensuite.`,
          riskText: 'Un échec peut blesser celui qui s’y risque.' };
      });
    }

    function startRescue(option) {
      if (!characters[option?.rescueId] || characters[option.rescueId].state !== 'captured') return { endedByGameOver: false, handled: true };
      gameState.rescue = { id: option.rescueId, from: gameState.roomId };
      gameState.resolvedOptions = gameState.resolvedOptions.filter(key => !key.startsWith('rescue_mission:'));
      gameState.roomId = 'rescue_mission';
      prepareRescueRoom();
      return { endedByGameOver: false, handled: true };
    }

    function endRescue(freed) {
      const rescue = gameState.rescue, captive = characters[rescue?.id];
      if (freed && captive?.state === 'captured') { captive.state = 'injured'; captive.deathSaves = { s: 0, f: 0 }; }
      gameState.roomId = rooms[rescue?.from] ? rescue.from : 'greenest_keep';
      gameState.rescue = null;
      return { endedByGameOver: false, handled: true };
    }
