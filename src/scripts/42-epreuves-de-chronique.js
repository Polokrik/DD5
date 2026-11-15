    const CHRONICLE_CHECKS = {
      'tunnel-temple': { actor:'darrin',skill:'arcana',ability:'int',skillKey:'investigation',label:'Ouvrir la porte du tunnel',dc:10,
        failure:'La porte résiste sous la rouille. Darrin finit par la dégager, mais les grincements portent au-delà du passage et donnent l’alerte.' },
      'temple-evacuation': { actor:'ellyjobell',skill:'stealth',ability:'dex',skillKey:'stealth',label:'Couvrir discrètement l’évacuation',dc:12,
        failure:'La brume masque les habitants, mais les appels des retardataires attirent l’attention. Le groupe les ramène à la forteresse au prix d’une retraite plus éprouvante.' },
      'dragon-defendre': { actor:'bjolnir',skill:'leadership',ability:'cha',skillKey:'persuasion',label:'Coordonner les défenseurs',dc:13,
        failure:'Les ordres se perdent entre les grondements. Le Clan et les gardes finissent par repousser le dragon, mais la défense désorganisée laisse le groupe éprouvé.' },
      'camp-liberation': { actor:'darrin',skill:'arcana',ability:'cha',skillKey:'deception',label:'Dissimuler l’infiltration',dc:12,
        failure:'La diversion ne couvre pas tous les mouvements. Darrin et Drek’Thar doivent hâter l’évasion; les prisonniers sont libérés, mais les cris donnent l’alerte dans le camp.' },
      'duel-campagne': { actor:'drekthar',skill:'duel',ability:'str',skillKey:'athletics',label:'Tenir jusqu’à la libération des otages',dc:15,
        failure:'Cyanwrath impose rapidement sa force. Drek’Thar tombe sous ses coups et survit; les otages sont libérés. Le Clan accueille son compagnon avec un moral éprouvé.' }
    };
    Object.values(rooms).forEach(room => room.options.forEach(option => {
      const config = CHRONICLE_CHECKS[option.id];
      if (config) {
        Object.assign(option,{ characterId:config.actor,skill:config.skill,failForward:true,
          resolution:{ dc:config.dc,risk:'cost' },
          check:{ ability:config.ability,skillKey:config.skillKey,kind:'ability',label:config.label,dc:config.dc } });
        option.onFailure = { ...safeClone(option.onSuccess),message:config.failure,variableDelta:{chaos:1,moraleGroupe:-1} };
        option.intent += ' Le D20 mesure la difficulté de l’exécution : l’objectif reste atteint; un échec ajoute 1 alerte et retire 1 moral, sans blessure supplémentaire.';
        option.riskText = 'Échec : alerte +1, moral −1. Le dé ne réécrit pas l’issue attestée de cette scène.';
      }
      if (option.id === 'revanche-drekthar') {
        option.resolution = {dc:17,risk:'injury'};
        option.check = {ability:'str',skillKey:null,kind:'attack',label:'Attaque contre Cyanwrath',dc:17};
        option.onFailure = {message:'Cyanwrath repousse l’assaut de Drek’Thar, qui reçoit une blessure. Le champion tient encore le passage; le groupe doit changer d’approche ou revenir avant l’affrontement.'};
        option.intent += ' Attaque contre CA 17. Un échec blesse Drek’Thar sans terminer l’affrontement.';
        option.riskText = 'Un échec blesse Drek’Thar; s’il est déjà blessé, il tombe à terre.';
      }
      if (option.id === 'duel-accept') option.check = {ability:'str',skillKey:null,kind:'attack',label:'Attaque contre Cyanwrath',dc:17};
      if (['bruler-fonges','naerytar-saboter','portal-saboter','sabotage-arcana'].includes(option.id)) option.check = {ability:'int',skillKey:'arcana',kind:'ability',label:'Arcanes'};
      if (option.id === 'voler-informations') option.check = {ability:'dex',skillKey:'stealth',kind:'ability',label:'Discrétion'};
      if (option.id === 'ritual-break-ward') option.check = {ability:'int',skillKey:'arcana',kind:'ability',label:'Désamorcer le sceau',dc:12};
      if (option.id === 'ritual-sacrifice-gear') option.intent = 'Kairon engage ses ressources pour affaiblir le cercle. Un échec le blesse gravement; s’il est déjà blessé, il peut mourir. Trois actions au total avant la conclusion.';
      if (option.id === 'ritual-rally') option.intent = 'Bjolnir tente de faire avancer les alliés. Un échec le blesse. Trois actions au total avant la conclusion.';
    }));

