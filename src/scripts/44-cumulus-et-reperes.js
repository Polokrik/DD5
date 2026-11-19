    // Cumulus découpé en trois scènes : la porte et les commandes, l'assaut, puis Glazael.
    const CUMULUS_ROOMS = {
      "skyreach_command": {
        "id": "skyreach_command",
        "title": "Eskarotha et la fierté des géants",
        "chapter": 9,
        "description": "Les runes se déplacent dans la chambre. Bjolnir en reconnaît la langue et peut s’adresser à l’esprit d’Eskarotha, qui habite les commandes de Cumulus. Le château répond à des signes d’altitude, de direction, d’ancrage et de défense; derrière cette puissance, il y a toujours celle que Blagothkus a perdue.\n\nPour le paladin, la décision du géant porte une contradiction dont il faut se servir. Blagothkus prétend rendre leur grandeur aux siens en dominant les dragons, mais il a pour l’instant mis son château au service de ceux qui veulent rappeler Tiamat. Bjolnir entend aussi lui faire considérer qu’Eskarotha n’approuverait probablement pas ce ralliement.\n\nLa compagnie peut retourner auprès du maître de Cumulus et chercher à l’amener devant les runes. Il ne s’agit pas de prendre possession du château ni de soumettre le géant par la magie : le Clan veut qu’il entende sa femme et renonce à soutenir le Culte.",
        "objects": [
          "Les runes qui conduisent le château",
          "Le raisonnement de Blagothkus"
        ],
        "exits": {},
        "options": [
          {
            "id": "skyreach-convaincre",
            "label": "Bjolnir amène Blagothkus à entendre Eskarotha",
            "characterId": "bjolnir",
            "skill": "leadership",
            "failForward": true,
            "resolution": {
              "dc": 14,
              "risk": "cost"
            },
            "check": {
              "ability": "cha",
              "skillKey": "persuasion",
              "kind": "ability",
              "label": "Faire renoncer le géant au Culte",
              "dc": 14
            },
            "intent": "S’appuyer sur la fierté des géants et sur l’opposition probable d’Eskarotha, puis conduire Blagothkus auprès d’elle. Le ralliement suit la chronique; le D20 mesure le coût de la discussion. Échec : moral −1 et chaos +1.",
            "riskText": "Blagothkus se retourne contre le Culte dans les deux cas. Le jet ne lui fait pas abandonner son projet de capturer des dragons.",
            "source": "JDR DD5 2023.xlsx — Tyranny of dragons!233:239; précision du MJ, 30 octobre 2026",
            "onSuccess": {
              "gotoRoom": "skyreach_cultists",
              "setFlags": {
                "skyreachGiantAllied": true
              },
              "message": "Blagothkus accepte d’aller entendre Eskarotha. Leur conversation l’amène à renoncer au retour de Tiamat et à se retourner contre les cultistes."
            },
            "onFailure": {
              "gotoRoom": "skyreach_cultists",
              "setFlags": {
                "skyreachGiantAllied": true
              },
              "variableDelta": {
                "moraleGroupe": -1,
                "chaos": 1
              },
              "message": "La discussion est difficile et éprouve le Clan, mais Blagothkus finit par aller entendre Eskarotha. Il renonce à soutenir le retour de Tiamat et se retourne contre les cultistes."
            }
          }
        ],
        "source": "JDR DD5 2023.xlsx — Tyranny of dragons!228:239; précision du MJ, 30 octobre 2026"
      },
      "skyreach_cultists": {
        "id": "skyreach_cultists",
        "title": "L’assaut contre les partisans du Culte",
        "chapter": 9,
        "description": "Blagothkus a renoncé à soutenir le retour de Tiamat. Avec le géant retourné contre eux, les cultistes ne disposent plus du même appui à bord de Cumulus. Le Clan doit maintenant descendre dans les niveaux qu’ils occupent et les empêcher de poursuivre leur projet depuis le château.\n\nAvant l’affrontement, Bjolnir cherche à tenir les kobolds à l’écart des combats. Il les convainc de ne pas y prendre part, espérant ainsi épargner des vies. Il ne sait pas encore quel sort Blagothkus réserve à certains d’entre eux.\n\nLa compagnie s’organise pour affronter les mages rouges et atteindre Rezmir. Les couloirs du château ne laissent plus la même place aux détours qu’au début de l’exploration; il faut faire agir les compagnons ensemble et conserver ce qui pourra révéler les desseins du Culte.",
        "objects": [
          "Les kobolds écartés de la bataille",
          "Les occupants des niveaux inférieurs"
        ],
        "exits": {},
        "options": [
          {
            "id": "skyreach-rezmir",
            "label": "Coordonner l’assaut contre les mages rouges et Rezmir",
            "groupAction": true,
            "requiresAnyAvailableCharacter": true,
            "failForward": true,
            "resolution": {
              "dc": 14,
              "risk": "cost"
            },
            "check": {
              "ability": "cha",
              "skillKey": "persuasion",
              "kind": "ability",
              "label": "Coordonner l’assaut du Clan",
              "dc": 14
            },
            "intent": "Suivre l’affrontement rapporté : vaincre les adversaires, capturer Rezmir et interroger le mage rouge survivant. Le D20 mesure la coordination, pas un nouveau résultat de bataille. Échec : moral −1 et chaos +1; l’enquête se poursuit.",
            "riskText": "Cette lecture conserve les issues attestées : Rezmir est capturé puis se suicide, un mage rouge survit comme prisonnier. Le jet n’ajoute aucune mort de compagnon.",
            "source": "JDR DD5 2023.xlsx — Tyranny of dragons!240:251",
            "onSuccess": {
              "gotoRoom": "skyreach_dragon",
              "message": "Le Clan vainc les gardiens et capture Rezmir. Le mage rouge prisonnier révèle les divisions de son ordre; le livre Derrière la Porte de Fer décrit le sacrifice préparant le retour de Tiamat. Rezmir se suicide pendant sa captivité."
            },
            "onFailure": {
              "gotoRoom": "skyreach_dragon",
              "variableDelta": {
                "moraleGroupe": -1,
                "chaos": 1
              },
              "message": "L’assaut manque de coordination et éprouve le Clan. Les adversaires sont néanmoins vaincus; Rezmir est capturé puis se suicide. Le mage rouge survivant et le livre Derrière la Porte de Fer livrent les renseignements nécessaires à la poursuite de l’enquête."
            }
          }
        ],
        "source": "JDR DD5 2023.xlsx — Tyranny of dragons!238:251"
      },
      "skyreach_dragon": {
        "id": "skyreach_dragon",
        "title": "Glazael et le trésor de Cumulus",
        "chapter": 9,
        "description": "Le Clan descend vers la caverne où se tient Glazael. Dans les parois gelées, des objets et des restes rappellent que le dragon est nourri par les occupants du château. Au centre, une masse de richesses s’amoncelle sous la créature, repue, tandis que des traces de fourrure de kobolds demeurent alentour.\n\nLes hommes de Blagothkus viennent maîtriser le dragon pour leur maître. Le changement d’alliance du géant ne l’a pas détourné de l’idée de posséder des dragons. Pour Bjolnir, les kobolds qu’il espérait protéger et la captivité qui se prépare donnent à la victoire un autre visage.\n\nLes compagnons s’intéressent aux trophées et aux objets du trésor. Bjolnir cherche, lui, à empêcher qu’on touche au dragon et à ses richesses. Avant de négocier le départ vers Waterdeep, le Clan doit décider de la place qu’il prendra dans ce partage.",
        "objects": [
          "Le dragon nourri dans la caverne",
          "La limite du ralliement de Blagothkus"
        ],
        "exits": {},
        "options": [
          {
            "id": "skyreach-proteger",
            "label": "Chronique — Défendre Glazael et refuser le partage de son trésor",
            "characterId": "bjolnir",
            "skill": "leadership",
            "intent": "Bjolnir défend une autre relation avec le dragon et s’oppose à la prise du trésor. Aucun jet : cette position suit le journal. Confiance des Ménestrels +1 dans l’adaptation; Glazael reste captif et Blagothkus ne renonce pas à d’autres captures.",
            "riskText": "Défendre le dragon ne signifie pas obtenir sa libération. Le désaccord avec Blagothkus reste ouvert lorsque le Clan repart.",
            "source": "JDR DD5 2023.xlsx — Tyranny of dragons!255:259",
            "onSuccess": {
              "gotoRoom": "act3_epilogue",
              "setFlags": {
                "skyreachDragonProtected": true
              },
              "variableDelta": {
                "factionTrust": {
                  "harpers": 1
                }
              },
              "message": "Bjolnir tente d’empêcher le prélèvement de trophées et défend une relation différente avec les dragons. Blagothkus garde Glazael captif et ne renonce pas à son projet. Le Clan négocie finalement une dépose près de Secomber."
            }
          },
          {
            "id": "skyreach-partage",
            "label": "What If — Prélever une part du trésor avant de partir",
            "intent": "Accepter que la compagnie se serve dans le trésor pendant que les hommes du géant maîtrisent Glazael. Pas de montant d’or inventé : cette variante donne moral +1, confiance des Ménestrels −1 et conserve la décision de prélèvement. Le dragon reste captif.",
            "riskText": "Ce choix assume une variante du désaccord rapporté dans le journal. Il n’obtient ni la liberté du dragon ni la propriété de Cumulus.",
            "source": "Variante de jeu inspirée de JDR DD5 2023.xlsx — Tyranny of dragons!255:259; le journal (!257) indique que les compagnons autres que Bjolnir tentent d’obtenir des trophées, sans en rapporter le résultat",
            "onSuccess": {
              "gotoRoom": "act3_epilogue",
              "setFlags": {
                "dragonTreasureClaimed": true
              },
              "variableDelta": {
                "moraleGroupe": 1,
                "factionTrust": {
                  "harpers": -1
                }
              },
              "message": "La compagnie prélève une part des richesses et des trophées avant le départ. Glazael reste captif de Blagothkus. Le géant dépose ensuite les aventuriers près de Secomber, à quelques jours de Waterdeep."
            }
          }
        ],
        "source": "JDR DD5 2023.xlsx — Tyranny of dragons!253:259"
      }
    };
    Object.entries(CUMULUS_ROOMS).forEach(([id,room]) => { rooms[id] = room; });
    rooms.skyreach_command.options.push({ id: 'chaos-the', label: 'Option absurde — Darrin: Demander du thé à la mesure des géants', onSelect: 'silly_giant_tea',
      intent: 'Rester courtois chez son hôte.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' });
    Object.entries(BOOK_EXPANSION.rooms).forEach(([id,detail]) => {
      Object.assign(rooms[id],detail,{description:detail.paragraphs.join('\n\n')});
      PRESENTATION.scenes[id] = {...PRESENTATION.scenes[id],heading:rooms[id].title,paragraphs:detail.paragraphs,chapterNumber:rooms[id].chapter};
    });
    Object.entries(BOOK_EXPANSION.actions).forEach(([id,detail]) => {
      ACTION_NARRATION[id] = {...ACTION_NARRATION[id],...detail};
    });
    Object.values(rooms).forEach(room => room.options.forEach(option => {
      const patch = BOOK_EXPANSION.options[option.id];
      if (!patch) return;
      Object.assign(option,patch);
      if (patch.label) PRESENTATION.choices[option.id] = {...PRESENTATION.choices[option.id],title:patch.label};
    }));
    BOOK_EXPANSION.proposals.forEach(({roomId,option}) => rooms[roomId].options.push(option));
    // Scènes de chronique à un seul choix : un second choix réel, sans jet ni coût, pour ne pas
    // obliger à revenir en arrière. Il reprend les observations sourcées de la scène.
    Object.values(rooms).forEach(room => room.options.filter(option => String(option.onSelect).startsWith('silly_')).forEach(option => {
      option.effects = { ...option.effects, message: 'Un choix pour le moins inattendu.' };
      delete option.riskText; // les joueurs comprennent seuls que le choix est farfelu
      ACTION_NARRATION[option.id] = { successTitle: 'Un choix pour le moins inattendu' };
    }));
    const POINT_ROOMS = ['leosin_return','mondath_chamber','hatchery_exit','elturel_road','elturel_tournament','carnath_roadhouse',
      'hunting_lodge','skyreach_castle','skyreach_chronicle','diderius_chronicle','ice_sea_chronicle','iceberg_rebellion',
      'second_council','misty_forest_chronicle','neronvein_chronicle','neronvein_battle','thay_invitation'];
    ['greenest_keep','cult_trail','northern_road','waterdeep_council_hall','supply_lines',...POINT_ROOMS].forEach(roomId => {
      const room = rooms[roomId];
      if (!room || !Number.isInteger(room.chapter) || room.options.some(option => option.onSelect === 'rest_company')) return;
      room.options.push({ id: `repos-${roomId}`, label: 'Prendre un repos (une fois par chapitre)', onSelect: 'rest_company',
        forbiddenFlag: `rested_${room.chapter}`, effects: { message: 'Le Clan se repose.' },
        intent: 'Soigne les blessés et fait lutter ceux qui sont à terre (jets de mort : trois échecs, mort définitive). Un D20 décide d’un événement : attaque de cultistes, alerte, nuit calme ou aide.',
        riskText: 'Un seul repos par chapitre. Le tirage est conservé; relire ou recharger ne le relance pas.' });
      ACTION_NARRATION[`repos-${roomId}`] = { successTitle: 'Le Clan prend du repos' };
    });
    POINT_ROOMS.forEach(roomId => {
      const room = rooms[roomId], titles = (room?.observations ?? []).map(observation => observation.title);
      if (!titles.length) return;
      const id = `point-${roomId}`, recalled = room.observations.slice(0, 2).flatMap(observation => observation.paragraphs);
      room.options.push({ id, label: `Faire le point : ${titles[0]}`, requiresFlag: `rested_${room.chapter}`,
        intent: `Revenir sur ${titles.slice(0, 2).map(title => `« ${title} »`).join(' et ')}. Aucun jet, aucun coût; la scène reste ouverte.`,
        effects: { message: recalled[0] } });
      ACTION_NARRATION[id] = { successTitle: 'Le Clan fait le point', success: recalled };
    });
    const BOOK_ART = {
  "cult_trail": "cult_camp",
  "cult_camp_exterior": "cult_camp",
  "cult_camp": "cult_camp",
  "leosin_return": "keep",
  "hatchery_entry": "hatchery",
  "fungal_chamber": "hatchery",
  "roper_lair": "hatchery",
  "egg_chamber": "hatchery",
  "mondath_chamber": "hatchery",
  "hatchery_exit": "keep",
  "elturel_road": "caravan",
  "elturel_tournament": "keep",
  "northern_road": "caravan",
  "carnath_roadhouse": "carnath",
  "naerytar_swamp": "marsh",
  "castle_naerytar": "marsh",
  "portal_chamber": "portal",
  "hunting_lodge": "lodge",
  "skyreach_castle": "skyreach",
  "skyreach_chronicle": "skyreach",
  "skyreach_command": "skyreach",
  "skyreach_cultists": "skyreach",
  "skyreach_dragon": "ice_cave",
  "act3_epilogue": "keep",
  "waterdeep_council_hall": "council",
  "council_defense_floor": "council",
  "council_strategy_floor": "council",
  "diderius_chronicle": "tomb",
  "ice_sea_chronicle": "ice_sea",
  "iceberg_rebellion": "ice_cave",
  "second_council": "council",
  "metallic_dragon_audience": "dragon_audience",
  "misty_forest_chronicle": "forest",
  "neronvein_chronicle": "forest",
  "neronvein_battle": "forest",
  "thay_invitation": "council",
  "council_resolution": "council"
};
    Object.entries(BOOK_ART).forEach(([id,art]) => {
      PRESENTATION.scenes[id] = {...PRESENTATION.scenes[id],art,location:rooms[id].title};
    });
    Object.assign(SCENE_DIRECTIONS.scenes,{
  "cult_camp": {
    "fires": [
      [
        198,
        159
      ]
    ],
    "dragon": false
  },
  "hatchery": {
    "fires": [
      [
        178,
        111
      ]
    ],
    "dragon": false
  },
  "caravan": {
    "fires": [],
    "dragon": false
  },
  "carnath": {
    "fires": [],
    "dragon": false
  },
  "marsh": {
    "fires": [],
    "dragon": false
  },
  "skyreach": {
    "fires": [],
    "dragon": false
  },
  "lodge": {
    "fires": [],
    "dragon": false
  },
  "portal": {
    "fires": [
      [
        152,
        116
      ],
      [
        278,
        113
      ]
    ],
    "dragon": false
  },
  "council": {
    "fires": [],
    "dragon": false
  },
  "tomb": {
    "fires": [],
    "dragon": false
  },
  "ice_sea": {
    "fires": [],
    "dragon": false
  },
  "ice_cave": {
    "fires": [],
    "dragon": false
  },
  "forest": {
    "fires": [],
    "dragon": false
  },
  "dragon_audience": {
    "fires": [],
    "dragon": false
  }
});
    const SCENE_MEMORIES = [
      {id:'cyanwrath-verdure',rooms:['act2_confrontation'],flags:{WHAT_IF_CYANWRATH_DEAD:true},
        paragraphs:['Dans votre parcours, Cyanwrath est mort à Verdure. Aucun nouveau duel contre lui ne peut avoir lieu dans cette grotte.']},
      {id:'cyanwrath-vivant',rooms:['roper_lair','egg_chamber'],flags:{confrontationDone:true,cyanwrathDead:false},
        paragraphs:['Vous avez obtenu le passage sans tuer Cyanwrath. Le champion demeure vivant derrière le Clan; la revanche de la chronique n’a pas eu lieu dans ce parcours.']},
      {id:'oeufs-emportes',rooms:['elturel_road'],flags:{eggsStolen:true},
        paragraphs:['Vous avez emporté les deux œufs noirs. Leur transport et la protection des petits dragons feront désormais partie du voyage du Clan.']},
      {id:'oeufs-detruits',rooms:['elturel_road','northern_road'],flags:{eggsDestroyed:true},
        paragraphs:['Vous avez détruit les œufs. Boule et Bill ne peuvent pas éclore ni accompagner le Clan.']},
      {id:'oeufs-laisses',rooms:['elturel_road','northern_road'],flags:{eggsLeft:true},
        paragraphs:['Vous avez laissé les œufs dans la grotte. Le Clan poursuit sa route sans dragonnets à protéger ou à confier à la guilde.']},
      {id:'portail-sabote',rooms:['hunting_lodge','skyreach_castle'],flags:{portalDamaged:true},
        paragraphs:['Vous avez endommagé les glyphes du portail avant de partir. Cette variante conserve la trace du sabotage dans le bilan de votre passage à Naerytar.']},
      {id:'portail-releve',rooms:['hunting_lodge'],flags:{portalObserved:true},
        paragraphs:['Vos relevés du cercle sont conservés. Vous avez choisi d’étudier le passage et de le laisser intact.']},
      {id:'alliance-metallique',rooms:['misty_forest_chronicle','council_resolution'],flags:{metallicAlliance:true},
        paragraphs:['Dans ce parcours alternatif, votre plaidoyer a obtenu l’alliance des dragons métalliques. Cet appui compte dans le soutien disponible pour la bataille hypothétique.']},
      {id:'dragon-protege',rooms:['act3_epilogue'],flags:{skyreachDragonProtected:true},
        paragraphs:['Au trésor de Glazael, vous avez privilégié la protection du captif. Cette décision renforce la confiance des Ménestrels dans votre parcours.']},
      {id:'dragon-butin',rooms:['act3_epilogue'],flags:{dragonTreasureClaimed:true},
        paragraphs:['Vous avez choisi de prélever du butin. Le moral du groupe s’en trouve renforcé, au prix de la confiance des Ménestrels.']}
    ];
    // Un retrait volontaire ne constitue pas une épreuve physique.
    const leaveEggs = rooms.egg_chamber.options.find(option => option.id === 'laisser-oeufs');
    delete leaveEggs.resolution; delete leaveEggs.check;
    leaveEggs.effects = {};
    rooms.cult_camp_exterior.objects = ['canyon','tentes','sentinelles'];
    rooms.hatchery_entry.objects = ['ouverture de la grotte','gardes','galerie'];
    rooms.egg_chamber.objects = ['deux œufs noirs','enclos','passage vers les appartements'];
    rooms.hatchery_entry.options.find(option => option.id === 'forcer-entree').effects.message = 'Le Clan repousse les gardes et franchit l’entrée de la grotte.';
    ['descendre-discretement','forcer-entree'].forEach(id => {
      const option = rooms.hatchery_entry.options.find(option => option.id === id);
      option.onSuccess = {...option.onSuccess,gotoRoom:'fungal_chamber'};
    });
    ['traversee-prudente','bruler-fonges'].forEach(id => {
      const option = rooms.fungal_chamber.options.find(option => option.id === id);
      option.onSuccess = {...option.onSuccess,gotoRoom:'act2_confrontation'};
    });
    ['strategie-kairon','force-brute-roper','sacrifice-calculé'].forEach(id => {
      const option = rooms.roper_lair.options.find(option => option.id === id);
      option.onSuccess = {...option.onSuccess,gotoRoom:'egg_chamber'};
    });

    const ADVENTURE_LEVELS = {
  "title_screen": 1,
  "credits": 1,
  "hill_overlook": 1,
  "swift_street": 1,
  "greenest_keep": 1,
  "old_tunnel": 1,
  "mill_approach": 1,
  "sanctuary_approach": 1,
  "dragon_assault": 1,
  "duel_field": 1,
  "cult_trail": 2,
  "cult_camp_exterior": 2,
  "cult_camp": 2,
  "leosin_return": 3,
  "hatchery_entry": 3,
  "fungal_chamber": 3,
  "act2_confrontation": 3,
  "roper_lair": 3,
  "egg_chamber": 3,
  "mondath_chamber": 3,
  "hatchery_exit": 4,
  "elturel_road": 4,
  "elturel_tournament": 4,
  "northern_road": 4,
  "carnath_roadhouse": 5,
  "naerytar_swamp": 5,
  "castle_naerytar": 5,
  "portal_chamber": 5,
  "hunting_lodge": 6,
  "skyreach_castle": 7,
  "skyreach_chronicle": 7,
  "skyreach_command": 7,
  "skyreach_cultists": 7,
  "skyreach_dragon": 7,
  "act3_epilogue": 8,
  "waterdeep_council_hall": 8,
  "council_defense_floor": 8,
  "council_strategy_floor": 8,
  "diderius_chronicle": 8,
  "ice_sea_chronicle": 9,
  "iceberg_rebellion": 9,
  "second_council": 10,
  "metallic_dragon_audience": 10,
  "misty_forest_chronicle": 10,
  "neronvein_chronicle": 11,
  "neronvein_battle": 11,
  "thay_invitation": 12,
  "council_resolution": 12,
  "campaign_frontier": 12,
  "war_council_tent": 14,
  "battle_plan_selection": 14,
  "supply_lines": 14,
  "warded_corridor": 14,
  "ritual_components": 14,
  "commander_tent": 14,
  "champion_confrontation": 14,
  "refugee_corridor": 14,
  "burning_streets_finale": 14,
  "ritual_chamber": 14,
  "campaign_end": 14
};

