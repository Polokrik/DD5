    const rooms = {
      ...ACT_II_ROOMS,
  "hill_overlook": {
    "id": "hill_overlook",
    "title": "Verdure en flammes",
    "description": "Du promontoire, Greenest n’est qu’un brasier. Lennithon fend le ciel, et les survivants appellent au secours.",
    "objects": [
      "ville en flammes",
      "Lennithon",
      "groupe actif"
    ],
    "exits": {},
    "options": [
      {
        "id": "charge-civils",
        "requiresCharacters": ["drekthar"],
        "label": "Option – Charge directe vers les civils",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 2,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "chaos": -1,
          "message": "Votre charge ouvre une trouée; des civils se replient derrière vos boucliers."
        },
        "onSuccess": {
          "setFlags": {
            "scene1Done": true
          },
          "gotoRoom": "swift_street",
          "checkpoint": "Scène 1 résolue — Approche de Greenest"
        },
        "onFailurePost": {
          "gotoRoom": "swift_street",
          "setFlags": {
            "scene1Done": true
          },
          "message": "La progression coûte des blessures au groupe, qui atteint néanmoins la famille encerclée."
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Bjolnir et Drek’Thar ouvrent la marche pour rejoindre les civils; le groupe s’expose aux assaillants."
      },
      {
        "id": "approche-riviere",
        "label": "Option – Approche furtive par la rivière",
        "characterId": "ellyjobell",
        "skill": "stealth",
        "resolution": {
          "difficulty": 3,
          "skill": "stealth",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "L’eau noire étouffe vos pas; vous atteignez les ruelles sans alerter la horde."
        },
        "onFailure": {
          "variableDelta": {
            "chaos": 1
          },
          "message": "Une torche accroche votre silhouette. L’alarme éclate dans la nuit."
        },
        "onSuccess": {
          "setFlags": {
            "scene1Done": true
          },
          "gotoRoom": "swift_street",
          "checkpoint": "Scène 1 résolue — Approche de Greenest"
        },
        "onFailurePost": {
          "setFlags": {
            "scene1Done": true
          },
          "gotoRoom": "swift_street",
          "checkpoint": "Scène 1 résolue — Approche de Greenest"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Ellyjobell cherche un accès à couvert. En cas de repérage, le groupe gagnera la ville avec une blessure et davantage d’alerte."
      },
      {
        "id": "signe-dragon",
        "label": "Option – Faire un signe au dragon",
        "onSelect": "silly_wave_lennithon",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ],
    "chapter": 1
  },
  "swift_street": {
    "id": "swift_street",
    "title": "Linan et sa famille",
    "description": "Huit kobolds encerclent la famille Swift devant une porte fracassée.",
    "objects": [
      "famille Swift",
      "8 kobolds",
      "toits en feu"
    ],
    "exits": {},
    "options": [
      {
        "id": "swift-diplomatie",
        "label": "Option – Bjolnir: Diplomatie sous pression",
        "characterId": "bjolnir",
        "skill": "diplomacy",
        "resolution": {
          "difficulty": 2,
          "skill": "diplomacy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "source": "Précisions du MJ — entretien sur Verdure et Linan",
        "effects": {
          "moraleGroupe": 1,
          "message": "Bjolnir refuse de tuer. Son charisme convainc les kobolds survivants d’abandonner le combat; la famille peut rejoindre le Clan."
        },
        "onSuccess": {
          "setFlags": {
            "scene2Done": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 2 résolue — Famille Swift"
        },
        "onFailurePost": {
          "setFlags": {
            "scene2Done": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 2 résolue — Famille Swift",
          "message": "Le groupe parvient à dégager la famille et rejoint la forteresse, mais cette tentative a blessé son intervenant."
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Après les premiers échanges de coups, Bjolnir demande aux survivants de déposer les armes pour laisser partir la famille."
      },
      {
        "id": "swift-magie",
        "label": "Option – Darrin: Magie sauvage",
        "characterId": "darrin",
        "skill": "wild_magic",
        "resolution": {
          "difficulty": 3,
          "skill": "wild_magic",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "message": "Un arc fulgurant éclate; les kobolds rompent la ligne dans un cri."
        },
        "onFailure": {
          "variableDelta": {
            "chaos": 1
          },
          "message": "L’onde magique ricoche et la rue bascule dans la confusion."
        },
        "onSuccess": {
          "setFlags": {
            "scene2Done": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 2 résolue — Famille Swift"
        },
        "onFailurePost": {
          "setFlags": {
            "scene2Done": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 2 résolue — Famille Swift",
          "message": "Le groupe parvient à dégager la famille et rejoint la forteresse, mais cette tentative a blessé son intervenant."
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Variante: Darrin lance un sort pour disperser les kobolds. La famille sera évacuée, mais un échec le blessera et augmentera le désordre."
      },
      {
        "id": "swift-force",
        "label": "Option – Drek’Thar: Force brute",
        "characterId": "drekthar",
        "skill": "might",
        "resolution": {
          "difficulty": 2,
          "skill": "might",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "message": "Drek’Thar traverse les assaillants comme un bélier vivant."
        },
        "onSuccess": {
          "setFlags": {
            "scene2Done": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 2 résolue — Famille Swift"
        },
        "onFailurePost": {
          "setFlags": {
            "scene2Done": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 2 résolue — Famille Swift",
          "message": "Le groupe parvient à dégager la famille et rejoint la forteresse, mais cette tentative a blessé son intervenant."
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Variante: Drek’Thar combat pour dégager la famille. Un échec le blessera pendant que ses compagnons couvrent le repli."
      },
      {
        "id": "swift-culte",
        "label": "Option – Négocier avec les kobolds pour rejoindre le culte",
        "onSelect": "silly_join_cult",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ],
    "chapter": 1
  },
  "greenest_keep": {
    "id": "greenest_keep",
    "title": "La forteresse de Verdure",
    "description": "Le gouverneur Nighthill vous reçoit au pas de course: « Le moulin et le sanctuaire tombent. Choisissez vite. »",
    "objects": [
      "Nighthill",
      "moulin",
      "sanctuaire"
    ],
    "exits": {},
    "options": [
      {
        "id": "mission-moulin",
        "label": "Empêcher les pillards d'incendier le moulin",
        "requiresFlag": "sanctuaireDone",
        "forbiddenFlag": "moulinDone",
        "onSuccess": {
          "gotoRoom": "mill_approach",
          "checkpoint": "Mission engagée — Moulin"
        },
        "repeatable": true
      },
      {
        "id": "mission-sanctuaire",
        "label": "Gagner le temple pour évacuer le prêtre et les habitants",
        "requiresFlag": "scene2Done",
        "forbiddenFlag": "sanctuaireDone",
        "onSuccess": {
          "gotoRoom": "old_tunnel",
          "checkpoint": "Mission engagée — Sanctuaire"
        },
        "repeatable": true
      },
      {
        "id": "vers-duel",
        "label": "Rejoindre Cyanwrath pour faire libérer les otages",
        "requiresFlag": "moulinDone",
        "requiresAllFlags": [
          "moulinDone",
          "sanctuaireDone",
          "dragonRepelled"
        ],
        "forbiddenFlag": "duelDone",
        "onSuccess": {
          "gotoRoom": "duel_field",
          "checkpoint": "Scène 5 engagée — Duel de Cyanwrath"
        },
        "repeatable": true
      },
      {
        "id": "fin-acte",
        "label": "Prendre les instructions de Nighthill pour retrouver les pillards",
        "requiresAllFlags": [
          "moulinDone",
          "sanctuaireDone",
          "dragonRepelled",
          "duelDone"
        ],
        "forbiddenFlag": "actICompleted",
        "onSuccess": {
          "setFlags": {
            "actICompleted": true
          },
          "unlockActs": [
            "ACT_II"
          ],
          "checkpoint": "End Act I",
          "gotoRoom": "greenest_keep"
        },
        "repeatable": true
      },
      {
        "id": "vers-conseil-waterdeep",
        "label": "Acte IV — Convocation au Conseil de Waterdeep",
        "requiresFlag": "actIIICompleted",
        "forbiddenFlag": "actIVCompleted",
        "onSuccess": {
          "setAct": "ACT_IV",
          "unlockActs": [
            "ACT_IV"
          ],
          "gotoRoom": "waterdeep_council_hall",
          "checkpoint": "Début Act IV — Conseil de Waterdeep"
        },
        "repeatable": true
      },
      {
        "id": "depart-camp",
        "label": "Acte II — Suivre la piste des pillards",
        "requiresFlag": "actICompleted",
        "forbiddenFlag": "actIICompleted",
        "onSuccess": {
          "setAct": "ACT_II",
          "gotoRoom": "cult_trail"
        },
        "repeatable": true
      },
      {
        "id": "depart-nord",
        "label": "Acte III — Rejoindre la caravane du Nord",
        "requiresFlag": "actIICompleted",
        "forbiddenFlag": "actIIICompleted",
        "onSuccess": {
          "unlockActs": [
            "ACT_III"
          ],
          "gotoRoom": "northern_road",
          "checkpoint": "Départ pour l’Acte III"
        },
        "repeatable": true
      },
      {
        "id": "repousser-dragon",
        "label": "Rejoindre les défenseurs pour chasser le dragon",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "dragon_assault"
        },
        "requiresAllFlags": [
          "sanctuaireDone",
          "moulinDone"
        ],
        "forbiddenFlag": "dragonRepelled"
      }
    ],
    "chapter": 2
  },
  "mill_approach": {
    "id": "mill_approach",
    "title": "L'embuscade du moulin",
    "description": "Un garde a rejoint Nighthill pour lui annoncer que les pillards tentent maintenant de mettre le feu au moulin. Les habitants du temple viennent à peine de retrouver la sécurité des remparts et le Clan doit déjà repartir. Si le bâtiment est détruit, Verdure perdra une part des réserves de nourriture dont elle aura besoin au lendemain de l’attaque.\n\nLes aventuriers approchent du moulin en cherchant les assaillants parmi ses abords. Une troupe qui vient secourir le bâtiment peut elle-même être prise au piège; avant d’engager le combat, le groupe doit choisir entre reconnaître les positions des guetteurs et forcer le passage. Ellyjobell peut ouvrir la marche à couvert, tandis que Drek’Thar peut mener l’assaut avec le soutien de ses compagnons.\n\nL’objectif est de chasser les pillards et de sécuriser le moulin. Un repli préserverait les aventuriers d’un combat devenu trop dangereux, mais laisserait le bâtiment menacé et obligerait la compagnie à préparer une nouvelle intervention.",
    "objects": [
      "foyer d’incendie",
      "pillards",
      "sacs de grain"
    ],
    "exits": {},
    "options": [
      {
        "id": "moulin-furtif",
        "label": "Repérer les guetteurs et approcher le moulin à couvert",
        "characterId": "ellyjobell",
        "skill": "stealth",
        "resolution": {
          "difficulty": 3,
          "skill": "stealth",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Ellyjobell repère les guetteurs dissimulés près du moulin et les désigne à ses compagnons. Le Clan les surprend avant que leur embuscade puisse se refermer, puis repousse les pillards du bâtiment."
        },
        "onFailure": {
          "variableDelta": {
            "chaos": 2
          },
          "message": "Les guetteurs repèrent Ellyjobell avant que le groupe ait pu les surprendre. La compagnie doit rompre le combat; les pillards restent en position près du moulin."
        },
        "onSuccess": {
          "setFlags": {
            "moulinDone": true,
            "millSaved": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 4A résolue — Moulin"
        },
        "onFailurePost": {
          "gotoRoom": "greenest_keep",
          "message": "L'assaut n'a pas sécurisé le moulin. Les défenseurs ont encore besoin d'aide; une autre approche reste possible."
        },
        "riskText": "L'intervenant s'expose aux coups; un échec oblige à revenir préparer l'assaut.",
        "intent": "Ellyjobell repère les guetteurs pour permettre au groupe de les surprendre. Un échec laisse le moulin menacé."
      },
      {
        "id": "moulin-assaut",
        "label": "Charger les pillards pour les éloigner du moulin",
        "characterId": "drekthar",
        "skill": "might",
        "resolution": {
          "difficulty": 2,
          "skill": "might",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "L’assaut fracasse la ligne ennemie; les meuniers reprennent le contrôle."
        },
        "onFailure": {
          "variableDelta": {
            "chaos": 2
          },
          "message": "Les pillards résistent à la charge et blessent Drek’Thar. Ses compagnons couvrent son repli vers la forteresse; il faudra revenir pour sécuriser le moulin."
        },
        "onSuccess": {
          "setFlags": {
            "moulinDone": true,
            "millSaved": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 4A résolue — Moulin"
        },
        "onFailurePost": {
          "gotoRoom": "greenest_keep",
          "message": "L'assaut n'a pas sécurisé le moulin. Les défenseurs ont encore besoin d'aide; une autre approche reste possible."
        },
        "riskText": "Un échec peut blesser Drek’Thar. S’il est déjà blessé, il peut mourir. Le moulin reste alors menacé.",
        "intent": "Drek’Thar engage les pillards avec le soutien du Clan pour sécuriser le bâtiment. Un échec impose un repli."
      }
    ],
    "chapter": 2,
    "paragraphs": [
      "Un garde a rejoint Nighthill pour lui annoncer que les pillards tentent maintenant de mettre le feu au moulin. Les habitants du temple viennent à peine de retrouver la sécurité des remparts et le Clan doit déjà repartir. Si le bâtiment est détruit, Verdure perdra une part des réserves de nourriture dont elle aura besoin au lendemain de l’attaque.",
      "Les aventuriers approchent du moulin en cherchant les assaillants parmi ses abords. Une troupe qui vient secourir le bâtiment peut elle-même être prise au piège; avant d’engager le combat, le groupe doit choisir entre reconnaître les positions des guetteurs et forcer le passage. Ellyjobell peut ouvrir la marche à couvert, tandis que Drek’Thar peut mener l’assaut avec le soutien de ses compagnons.",
      "L’objectif est de chasser les pillards et de sécuriser le moulin. Un repli préserverait les aventuriers d’un combat devenu trop dangereux, mais laisserait le bâtiment menacé et obligerait la compagnie à préparer une nouvelle intervention."
    ],
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!A29:A30; le choix de méthode et ses risques sont l’adaptation interactive"
  },
  "sanctuary_approach": {
    "id": "sanctuary_approach",
    "title": "Les occupants du temple",
    "description": "À l’approche du temple, les aventuriers découvrent les groupes de pillards qui en surveillent les accès. Près de la porte sud, certains se préparent à mettre le feu au bâtiment. Le prêtre et les paysans réfugiés à l’intérieur ne pourront pas attendre que les assaillants se lassent; leur abri risque de brûler avant qu’ils puissent rejoindre la forteresse.\n\nLe Clan doit dégager une sortie et la maintenir ouverte pendant que les occupants quittent le sanctuaire. Une illusion pourrait détourner les incendiaires et laisser à Bjolnir le temps de convaincre les habitants de sortir. Ellyjobell dispose du brouillard nécessaire pour dissimuler leur fuite. Une approche discrète ou une attaque de diversion pourrait aussi ouvrir un passage, mais ferait courir un autre risque à celui qui s’en charge.\n\nLe chemin du tunnel est reconnu. Une fois les habitants hors du temple, les aventuriers devront les y conduire ensemble et les accompagner jusqu’aux remparts. Tant que les pillards conservent leurs positions, personne n’est encore à l’abri.",
    "objects": [
      "barricades",
      "bélier",
      "fidèles terrifiés"
    ],
    "exits": {},
    "options": [
      {
        "id": "temple-evacuation",
        "intent": "Suivre le journal: une illusion détourne les incendiaires, Bjolnir conduit les habitants et Ellyjobell couvre leur fuite.",
        "requiresCharacters": [
          "bjolnir",
          "ellyjobell"
        ],
        "label": "Détourner les incendiaires et évacuer les habitants sous le brouillard",
        "source": "Tyranny of dragons!26:28",
        "effects": {
          "message": "L'illusion détourne les incendiaires de la porte sud. Bjolnir fait sortir les occupants et Ellyjobell couvre leur fuite de brouillard. Le prêtre et les paysans atteignent la forteresse."
        },
        "onSuccess": {
          "setFlags": {
            "sanctuaireDone": true,
            "templeEvacuated": true
          },
          "gotoRoom": "greenest_keep"
        }
      },
      {
        "id": "sanctuaire-tunnel",
        "label": "Ouvrir un passage discret pour faire sortir les occupants",
        "characterId": "sislay",
        "skill": "stealth",
        "resolution": {
          "difficulty": 3,
          "skill": "stealth",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vous ouvrez les verrous de l’intérieur et brisez l’élan du bélier."
        },
        "onFailure": {
          "variableDelta": {
            "chaos": 3,
            "moraleGroupe": -2
          },
          "message": "Le tunnel s’effondre; le bélier frappe encore, implacable."
        },
        "onSuccess": {
          "setFlags": {
            "sanctuaireDone": true,
            "templeEvacuated": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 4B résolue — Sanctuaire",
          "message": "Le passage est dégagé et les habitants sont accompagnés jusqu'à la forteresse."
        },
        "onFailurePost": {
          "gotoRoom": "greenest_keep",
          "message": "L'évacuation n'est pas achevée. Le groupe se replie à la forteresse pour préparer une autre approche."
        },
        "riskText": "Un échec blesse l'intervenant et laisse l'évacuation à préparer.",
        "intent": "Variante: Sislay cherche à dégager une sortie sans affronter la troupe. Un échec laisse les habitants à l’intérieur."
      },
      {
        "id": "sanctuaire-assaut",
        "label": "Éloigner les assaillants de la porte par une attaque de diversion",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 2,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Votre cri rallie la ligne; les assaillants reculent du portail."
        },
        "onFailure": {
          "variableDelta": {
            "chaos": 3,
            "moraleGroupe": -2
          },
          "message": "L’assaut se brise et la foule panique autour du temple."
        },
        "onSuccess": {
          "setFlags": {
            "sanctuaireDone": true,
            "templeEvacuated": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 4B résolue — Sanctuaire",
          "message": "Le passage est dégagé et les habitants sont accompagnés jusqu'à la forteresse."
        },
        "onFailurePost": {
          "gotoRoom": "greenest_keep",
          "message": "L'évacuation n'est pas achevée. Le groupe se replie à la forteresse pour préparer une autre approche."
        },
        "riskText": "Un échec blesse l'intervenant et laisse l'évacuation à préparer.",
        "intent": "Variante: Bjolnir attire les assaillants loin de la porte. Un échec impose un repli avant une nouvelle tentative."
      }
    ],
    "chapter": 2,
    "paragraphs": [
      "À l’approche du temple, les aventuriers découvrent les groupes de pillards qui en surveillent les accès. Près de la porte sud, certains se préparent à mettre le feu au bâtiment. Le prêtre et les paysans réfugiés à l’intérieur ne pourront pas attendre que les assaillants se lassent; leur abri risque de brûler avant qu’ils puissent rejoindre la forteresse.",
      "Le Clan doit dégager une sortie et la maintenir ouverte pendant que les occupants quittent le sanctuaire. Une illusion pourrait détourner les incendiaires et laisser à Bjolnir le temps de convaincre les habitants de sortir. Ellyjobell dispose du brouillard nécessaire pour dissimuler leur fuite. Une approche discrète ou une attaque de diversion pourrait aussi ouvrir un passage, mais ferait courir un autre risque à celui qui s’en charge.",
      "Le chemin du tunnel est reconnu. Une fois les habitants hors du temple, les aventuriers devront les y conduire ensemble et les accompagner jusqu’aux remparts. Tant que les pillards conservent leurs positions, personne n’est encore à l’abri."
    ],
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!A23:A28; les approches discrète et d’assaut restent des variantes du jeu"
  },
  "duel_field": {
    "id": "duel_field",
    "title": "Le défi de Cyanwrath",
    "description": "Au petit matin, alors que Verdure porte encore les traces des combats de la nuit, Langdedrosa Cyanwrath se présente avec des otages. La créature draconique réclame un adversaire pour un duel. Les prisonniers demeurent sous sa garde pendant que le défi est adressé aux défenseurs de la ville.\n\nLe Clan a combattu jusqu’ici en réunissant les forces de ses membres. Cyanwrath demande maintenant qu’un seul adversaire s’avance pour obtenir la libération des captifs. Drek’Thar sait se battre et peut représenter la compagnie, mais il devra affronter la créature qui les attend au-dehors. Le groupe doit décider s’il relève le défi ou refuse les conditions imposées, sans garantie pour les prisonniers.",
    "objects": [
      "Cyanwrath",
      "otages",
      "culte du dragon"
    ],
    "exits": {},
    "options": [
      {
        "id": "duel-campagne",
        "label": "Drek’Thar accepte le duel pour libérer les otages",
        "characterId": "drekthar",
        "skill": "duel",
        "source": "JDR DD5 2023.xlsx — Tyranny of dragons!33:35",
        "onSuccess": {
          "setFlags": {
            "duelDone": true
          },
          "characterChanges": [
            {
              "id": "drekthar",
              "toState": "injured"
            }
          ],
          "gotoRoom": "greenest_keep",
          "message": "Drek’Thar tombe sous les coups de Cyanwrath. Les otages sont libérés; le champion du Clan survit."
        },
        "repeatable": true,
        "intent": "Suivre le duel rapporté dans la chronique: Drek’Thar sera vaincu mais survivra."
      },
      {
        "id": "duel-accept",
        "label": "What If — Vaincre Cyanwrath dès Greenest (Drek’Thar)",
        "characterId": "drekthar",
        "skill": "duel",
        "resolution": {
          "difficulty": 2,
          "skill": "duel",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 2,
          "message": "Le duel tourne à votre avantage; les otages sont relâchés sous les huées."
        },
        "onSuccess": {
          "setFlags": {
            "duelDone": true,
            "cyanwrathDead": true,
            "WHAT_IF_CYANWRATH_DEAD": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 5 résolue — Duel de Cyanwrath"
        },
        "onFailure": {
          "message": "Drek’Thar est vaincu et ne peut poursuivre le duel. Cyanwrath ordonne la libération des otages."
        },
        "onFailurePost": {
          "setFlags": {
            "duelDone": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 5 résolue — Duel de Cyanwrath"
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir."
      },
      {
        "id": "duel-refus",
        "label": "What If — Refuser le duel et renoncer à cette libération des otages",
        "effects": {
          "chaos": 2,
          "moraleGroupe": -2,
          "message": "Le refus glace la foule. Cyanwrath ricane et marque Greenest au fer rouge."
        },
        "onSuccess": {
          "setFlags": {
            "duelDone": true
          },
          "gotoRoom": "greenest_keep",
          "checkpoint": "Scène 5 résolue — Duel de Cyanwrath"
        }
      },
      {
        "id": "duel-danse",
        "label": "Option – Proposer une danse",
        "onSelect": "silly_dance_cyanwrath",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ],
    "chapter": 2,
    "paragraphs": [
      "Au petit matin, alors que Verdure porte encore les traces des combats de la nuit, Langdedrosa Cyanwrath se présente avec des otages. La créature draconique réclame un adversaire pour un duel. Les prisonniers demeurent sous sa garde pendant que le défi est adressé aux défenseurs de la ville.",
      "Le Clan a combattu jusqu’ici en réunissant les forces de ses membres. Cyanwrath demande maintenant qu’un seul adversaire s’avance pour obtenir la libération des captifs. Drek’Thar sait se battre et peut représenter la compagnie, mais il devra affronter la créature qui les attend au-dehors. Le groupe doit décider s’il relève le défi ou refuse les conditions imposées, sans garantie pour les prisonniers."
    ],
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!A33:A35; conditions détaillées d’intervention du groupe encore à confirmer par le MJ"
  },
  "waterdeep_council_hall": {
    "id": "waterdeep_council_hall",
    "title": "Conseil de Waterdeep",
    "description": "Sous les bannières des cités libres, Harpers, Gantelet, Enclave, Zhentarim et Alliance des Seigneurs attendent votre version des faits.",
    "objects": [
      "table du conseil",
      "scribes",
      "sceaux des factions"
    ],
    "exits": {},
    "options": [
      {
        "id": "council-open-session",
        "label": "Scène 1 — Ouvrir la convocation",
        "forbiddenFlag": "councilConvocationDone",
        "effects": {
          "message": "Les regards se lèvent. Le Conseil exige des comptes sur les œufs, Cyanwrath et les pertes civiles.",
          "publicTrust": 1
        },
        "onSuccess": {
          "setFlags": {
            "councilConvocationDone": true
          },
          "gotoRoom": "council_defense_floor",
          "checkpoint": "Scène 1 résolue — Convocation du Conseil"
        }
      },
      {
        "id": "council-crown-self",
        "label": "Option absurde — Se déclarer Roi de Waterdeep",
        "onSelect": "silly_king_waterdeep",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ],
    "chapter": 10
  },
  "council_defense_floor": {
    "id": "council_defense_floor",
    "title": "Accusations et Défense",
    "description": "On vous accuse d’avoir joué avec les œufs, le portail et les infiltrations. Chaque mot peut gagner des alliés — ou en perdre.",
    "objects": [
      "registre des pertes",
      "scellés draconiques",
      "protocole arcane"
    ],
    "exits": {},
    "options": [
      {
        "id": "defense-honnete",
        "label": "Ton honnête (Leadership)",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 2,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vous assumez chaque décision et ses cicatrices. Le Conseil note une franchise rare.",
          "councilReputation": {
            "harpers": 2,
            "gauntlet": 1,
            "enclave": 1,
            "zhentarim": -1,
            "lords": 1
          },
          "publicTrust": 2
        },
        "onFailure": {
          "message": "Votre sincérité paraît maladroite. Les factions restent divisées.",
          "councilReputation": {
            "harpers": 1,
            "gauntlet": 0,
            "enclave": 0,
            "zhentarim": 0,
            "lords": 0
          },
          "publicTrust": 0
        },
        "onSuccess": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense honnête"
        },
        "onFailurePost": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense honnête"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Exposer les décisions du groupe sans les dissimuler. Cette réponse peut renforcer la confiance de certaines factions."
      },
      {
        "id": "defense-pragmatique",
        "label": "Ton pragmatique (Stratégie)",
        "characterId": "bjolnir",
        "skill": "strategy",
        "resolution": {
          "difficulty": 3,
          "skill": "strategy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vous détaillez des choix froids mais efficaces. Les militaires approuvent, les idéalistes grincent.",
          "councilReputation": {
            "harpers": -1,
            "gauntlet": 2,
            "enclave": 0,
            "zhentarim": 1,
            "lords": 2
          },
          "publicTrust": 0
        },
        "onFailure": {
          "message": "Votre logique paraît sèche. Les objections s’accumulent.",
          "councilReputation": {
            "harpers": -1,
            "gauntlet": 1,
            "enclave": 0,
            "zhentarim": 0,
            "lords": 0
          },
          "publicTrust": -1
        },
        "onSuccess": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense pragmatique"
        },
        "onFailurePost": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense pragmatique"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Défendre l’efficacité des décisions. Le Gantelet peut l’approuver, tandis que l’Enclave d’Émeraude peut s’en détourner."
      },
      {
        "id": "defense-manipulateur",
        "label": "Ton manipulateur (Arcane)",
        "characterId": "darrin",
        "skill": "arcana",
        "resolution": {
          "difficulty": 3,
          "skill": "arcana",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vous présentez des preuves arcanes impeccables, orientées juste assez pour troubler vos rivaux.",
          "councilReputation": {
            "harpers": -1,
            "gauntlet": 0,
            "enclave": 1,
            "zhentarim": 2,
            "lords": -1
          },
          "publicTrust": -1
        },
        "onFailure": {
          "message": "Les mages du Conseil démontent vos artifices. La salle se refroidit.",
          "councilReputation": {
            "harpers": -1,
            "gauntlet": -1,
            "enclave": -1,
            "zhentarim": 1,
            "lords": -1
          },
          "publicTrust": -2
        },
        "onSuccess": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense manipulatrice"
        },
        "onFailurePost": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense manipulatrice"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Présenter des preuves orientées. Si la manœuvre est découverte, elle détériorera la confiance du Conseil."
      },
      {
        "id": "defense-arrogant",
        "label": "Ton arrogant (Diplomatie)",
        "characterId": "bjolnir",
        "skill": "diplomacy",
        "resolution": {
          "difficulty": 4,
          "skill": "diplomacy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Votre assurance frôle l’insulte. Quelques puissants aiment, la plupart n’oublieront pas.",
          "councilReputation": {
            "harpers": -2,
            "gauntlet": 0,
            "enclave": -1,
            "zhentarim": 2,
            "lords": -2
          },
          "publicTrust": -2
        },
        "onFailure": {
          "message": "Le Conseil coupe votre tirade. Vous venez de perdre une partie de la salle.",
          "councilReputation": {
            "harpers": -2,
            "gauntlet": -1,
            "enclave": -1,
            "zhentarim": 0,
            "lords": -2
          },
          "publicTrust": -3
        },
        "onSuccess": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense arrogante"
        },
        "onFailurePost": {
          "setFlags": {
            "councilDefenseDone": true
          },
          "gotoRoom": "council_strategy_floor",
          "checkpoint": "Scène 2 résolue — Défense arrogante"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Imposer votre version avec assurance. Cette attitude risque de vous aliéner plusieurs représentants."
      }
    ],
    "chapter": 10
  },
  "council_strategy_floor": {
    "id": "council_strategy_floor",
    "title": "Propositions stratégiques",
    "description": "Le Conseil exige un cap clair avant d’engager ses armées.",
    "objects": [
      "cartes de guerre",
      "routes de ravitaillement",
      "rapports d’espionnage"
    ],
    "exits": {},
    "options": [
      {
        "id": "strategy-metallic",
        "label": "Vote — Priorité aux dragons métalliques",
        "effects": {
          "message": "Vous placez la diplomatie draconique au cœur de la campagne.",
          "councilReputation": {
            "harpers": 1,
            "gauntlet": 0,
            "enclave": 2,
            "zhentarim": -1,
            "lords": 1
          },
          "publicTrust": 1
        },
        "onSuccess": {
          "setFlags": {
            "councilProposalsDone": true
          },
          "onSelect": "route_after_strategy",
          "checkpoint": "Scène 3 résolue — Vote stratégique"
        },
        "intent": "Soutenir une future alliance avec les dragons. Ce choix modifie les relations au Conseil; les missions du journal restent dans leur ordre."
      },
      {
        "id": "strategy-assault",
        "label": "Vote — Assaut frontal coordonné",
        "effects": {
          "message": "Vous réclamez une frappe massive pour briser le culte sans attendre.",
          "councilReputation": {
            "harpers": -1,
            "gauntlet": 2,
            "enclave": -1,
            "zhentarim": 0,
            "lords": 2
          },
          "publicTrust": 0
        },
        "onSuccess": {
          "setFlags": {
            "councilProposalsDone": true
          },
          "onSelect": "route_after_strategy",
          "checkpoint": "Scène 3 résolue — Vote stratégique"
        },
        "intent": "Privilégier une offensive militaire, au risque de diviser les factions."
      },
      {
        "id": "strategy-espionnage",
        "label": "Vote — Espionnage et infiltration",
        "effects": {
          "message": "Vous privilégiez les réseaux, les doubles agents et les frappes ciblées.",
          "councilReputation": {
            "harpers": 2,
            "gauntlet": -1,
            "enclave": 0,
            "zhentarim": 1,
            "lords": 0
          },
          "publicTrust": 1
        },
        "onSuccess": {
          "setFlags": {
            "councilProposalsDone": true
          },
          "onSelect": "route_after_strategy",
          "checkpoint": "Scène 3 résolue — Vote stratégique"
        },
        "intent": "Accorder davantage de poids aux Ménestrels et au Zhentarim pour préparer des infiltrations."
      },
      {
        "id": "strategy-sabotage",
        "label": "Vote — Sabotage des lignes du culte",
        "effects": {
          "message": "Vous voulez ruiner la logistique ennemie avant toute bataille ouverte.",
          "councilReputation": {
            "harpers": 0,
            "gauntlet": 1,
            "enclave": 1,
            "zhentarim": 2,
            "lords": -1
          },
          "publicTrust": -1
        },
        "onSuccess": {
          "setFlags": {
            "councilProposalsDone": true
          },
          "onSelect": "route_after_strategy",
          "checkpoint": "Scène 3 résolue — Vote stratégique"
        },
        "intent": "Proposer d’attaquer les transports du Culte avant la bataille; certaines factions peuvent contester cette priorité."
      }
    ],
    "chapter": 10
  },
  "metallic_dragon_audience": {
    "id": "metallic_dragon_audience",
    "title": "Audience des dragons métalliques",
    "description": "Argent, bronze et or observent vos gestes avec une patience millénaire.",
    "objects": [
      "trône draconique",
      "serment ancien",
      "écaille d’or"
    ],
    "exits": {},
    "options": [
      {
        "id": "dragons-conditions",
        "label": "Écouter les conditions posées par les dragons métalliques",
        "effects": {
          "message": "Les dragons demandent la destruction des masques, des excuses des elfes et des nains ainsi que la restitution d'une dépouille. Leur soutien reste lié à ces conditions."
        },
        "onSuccess": {
          "setFlags": {
            "metallicAudienceDone": true
          },
          "gotoRoom": "misty_forest_chronicle"
        },
        "intent": "Suivre la rencontre du journal: recueillir les exigences des dragons sans prétendre que leur soutien est déjà acquis."
      },
      {
        "id": "dragons-persuade",
        "label": "What If — Plaider pour l’alliance (Diplomatie)",
        "characterId": "bjolnir",
        "skill": "diplomacy",
        "resolution": {
          "difficulty": 3,
          "skill": "diplomacy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Votre plaidoyer lie honneur et nécessité. Les anciens dragons acquiescent.",
          "councilReputation": {
            "harpers": 1,
            "gauntlet": 1,
            "enclave": 2,
            "zhentarim": 0,
            "lords": 2
          },
          "publicTrust": 2
        },
        "onSuccess": {
          "setFlags": {
            "metallicAlliance": true,
            "metallicAudienceDone": true
          },
          "gotoRoom": "misty_forest_chronicle",
          "checkpoint": "Scène 4 résolue — Alliance métallique"
        },
        "onFailure": {
          "message": "Votre voix ne suffit pas. Les dragons restent neutres.",
          "councilReputation": {
            "enclave": -1,
            "lords": -1
          }
        },
        "onFailurePost": {
          "setFlags": {
            "metallicAlliance": false,
            "metallicAudienceDone": true
          },
          "gotoRoom": "misty_forest_chronicle",
          "checkpoint": "Scène 4 résolue — Dragons neutres"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Variante: demander immédiatement une alliance. Un échec laisse les dragons neutres et éprouve Bjolnir."
      },
      {
        "id": "dragons-offer-alliance",
        "label": "What If — Offrir un pacte militaire (Leadership)",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 2,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Votre serment de campagne convainc les dragons de soutenir la coalition.",
          "councilReputation": {
            "harpers": 1,
            "gauntlet": 1,
            "enclave": 1,
            "zhentarim": 0,
            "lords": 2
          },
          "publicTrust": 1
        },
        "onSuccess": {
          "setFlags": {
            "metallicAlliance": true,
            "metallicAudienceDone": true
          },
          "gotoRoom": "misty_forest_chronicle",
          "checkpoint": "Scène 4 résolue — Alliance métallique"
        },
        "onFailure": {
          "message": "Le pacte est jugé prématuré. Les dragons diffèrent leur décision.",
          "councilReputation": {
            "lords": -1
          }
        },
        "onFailurePost": {
          "setFlags": {
            "metallicAlliance": false,
            "metallicAudienceDone": true
          },
          "gotoRoom": "misty_forest_chronicle",
          "checkpoint": "Scène 4 résolue — Dragons neutres"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Variante: proposer un engagement militaire immédiat au lieu de recueillir les conditions rapportées dans le journal."
      },
      {
        "id": "dragons-threaten-cult",
        "label": "What If — Menacer le culte par démonstration (Stratégie)",
        "characterId": "bjolnir",
        "skill": "strategy",
        "resolution": {
          "difficulty": 3,
          "skill": "strategy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Votre plan d’encerclement rassure les dragons quant au coût de leur engagement.",
          "councilReputation": {
            "gauntlet": 1,
            "enclave": 1,
            "zhentarim": 1,
            "lords": 1
          },
          "publicTrust": 0
        },
        "onSuccess": {
          "setFlags": {
            "metallicAlliance": true,
            "metallicAudienceDone": true
          },
          "gotoRoom": "misty_forest_chronicle",
          "checkpoint": "Scène 4 résolue — Alliance métallique"
        },
        "onFailure": {
          "message": "Les dragons rejettent toute pression. Ils resteront neutres pour l’instant.",
          "councilReputation": {
            "enclave": -1,
            "lords": -1
          }
        },
        "onFailurePost": {
          "setFlags": {
            "metallicAlliance": false,
            "metallicAudienceDone": true
          },
          "gotoRoom": "misty_forest_chronicle",
          "checkpoint": "Scène 4 résolue — Dragons neutres"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Variante: présenter un plan d’encerclement pour obtenir un soutien immédiat. Son rejet laisse les dragons neutres."
      },
      {
        "id": "dragons-ride-selfie",
        "label": "Option absurde — Exiger un portrait à dos de dragon",
        "onSelect": "silly_dragon_selfie",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ],
    "chapter": 14
  },
  "council_resolution": {
    "id": "council_resolution",
    "title": "Résolution du Conseil",
    "description": "Les factions votent l’effort de guerre final. Le poids de votre réputation décide de l’ampleur du soutien.",
    "objects": [
      "urne de vote",
      "sceaux d’alliance",
      "registre de campagne"
    ],
    "exits": {},
    "options": [
      {
        "id": "resolve-council-session",
        "label": "Scène 5 — Clore le Conseil et calculer le soutien",
        "forbiddenFlag": "actIVCompleted",
        "onSelect": "resolve_council"
      }
    ],
    "chapter": 17
  },
  "northern_road": {
    "id": "northern_road",
    "title": "Route du Nord — Caravane",
    "description": "À Baldur's Gate, les aventuriers se font engager dans une caravane de onze chariots. Les hommes du Culte restent à l'écart et protègent leur chargement. Le groupe doit les surveiller pendant le voyage jusqu'à Waterdeep sans perdre la confiance des marchands.",
    "objects": [
      "marchands",
      "gardes fatigués",
      "caisses scellées"
    ],
    "exits": {},
    "options": [
      {
        "id": "caravane-marchands",
        "label": "Option – Se mêler aux marchands",
        "effects": {
          "message": "Vous partagez le feu et les comptes: les Harpistes notent votre prudence."
        },
        "onSuccess": {
          "variableDelta": {
            "factionTrust": {
              "harpers": 1,
              "zhentarim": 0,
              "cult": -1
            }
          },
          "setFlags": {
            "caravanMidpointDone": true
          },
          "checkpoint": "Mi-parcours de la caravane"
        }
      },
      {
        "id": "caravane-espionner",
        "label": "Option – Espionner discrètement",
        "characterId": "ellyjobell",
        "skill": "stealth",
        "resolution": {
          "difficulty": 2,
          "skill": "stealth",
          "risk": "capture",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Des lettres codées changent de mains. Les Zhentarim jugent votre efficacité."
        },
        "onSuccess": {
          "variableDelta": {
            "factionTrust": {
              "harpers": 0,
              "zhentarim": 1,
              "cult": -1
            }
          },
          "setFlags": {
            "caravanMidpointDone": true
          },
          "checkpoint": "Mi-parcours de la caravane"
        },
        "onFailure": {
          "variableDelta": {
            "castleAlertLevel": 1,
            "factionTrust": {
              "cult": 0
            }
          },
          "message": "Un guetteur cultiste repère votre manège. Les rumeurs vous précèdent déjà."
        },
        "onFailurePost": {
          "setFlags": {
            "caravanMidpointDone": true
          },
          "checkpoint": "Mi-parcours de la caravane"
        },
        "riskText": "Un échec peut entraîner sa capture."
      },
      {
        "id": "caravane-confronter",
        "label": "Option – Confronter un agent suspect",
        "characterId": "bjolnir",
        "skill": "diplomacy",
        "resolution": {
          "difficulty": 3,
          "skill": "diplomacy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "L’agent plie sans bruit. Le Culte vous craint, mais ne vous oubliera pas."
        },
        "onSuccess": {
          "variableDelta": {
            "factionTrust": {
              "harpers": 1,
              "cult": -1
            },
            "castleAlertLevel": 1
          },
          "setFlags": {
            "caravanMidpointDone": true
          },
          "checkpoint": "Mi-parcours de la caravane"
        },
        "onFailure": {
          "variableDelta": {
            "factionTrust": {
              "cult": 2
            },
            "castleAlertLevel": 2
          },
          "message": "La confrontation tourne au scandale. Les wagons bruissent de votre nom."
        },
        "onFailurePost": {
          "setFlags": {
            "caravanMidpointDone": true
          },
          "checkpoint": "Mi-parcours de la caravane"
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "caravane-dragon",
        "label": "Option – Accuser tout le monde d’être un dragon déguisé",
        "onSelect": "silly_accuse_dragons",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      },
      {
        "id": "caravane-arrivee",
        "label": "Suivre le chargement au nord de Waterdeep jusqu'au relais Carnath",
        "requiresFlag": "caravanMidpointDone",
        "onSuccess": {
          "gotoRoom": "carnath_roadhouse",
          "checkpoint": "Arrivée à Naerytar"
        },
        "repeatable": true
      }
    ],
    "chapter": 6
  },
  "naerytar_swamp": {
    "id": "naerytar_swamp",
    "title": "Marais de Naerytar",
    "description": "La brume avale les sentiers. Au loin, un château isolé se découpe comme une menace immobile.",
    "objects": [
      "eaux stagnantes",
      "ruines noyées",
      "silhouette du château"
    ],
    "exits": {},
    "options": [
      {
        "id": "naerytar-reco",
        "label": "Option – Observer les patrouilles dans les roseaux",
        "characterId": "ellyjobell",
        "skill": "stealth",
        "resolution": {
          "difficulty": 3,
          "skill": "stealth",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vous notez les relèves et les angles morts des tours."
        },
        "onSuccess": {
          "variableDelta": {
            "castleAlertLevel": -1
          },
          "checkpoint": "Repérage de Naerytar"
        },
        "onFailure": {
          "variableDelta": {
            "castleAlertLevel": 1
          },
          "message": "Un cri de guetteur fend la brume. La paranoïa grimpe."
        },
        "onFailurePost": {
          "checkpoint": "Repérage de Naerytar"
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "naerytar-canard",
        "label": "Option – Négocier avec un canard du marais",
        "onSelect": "silly_swamp_duck",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      },
      {
        "id": "naerytar-entree",
        "label": "Entrer dans le château de Naerytar",
        "onSuccess": {
          "gotoRoom": "castle_naerytar",
          "checkpoint": "Entrée au château Naerytar"
        },
        "repeatable": true
      }
    ],
    "chapter": 7
  },
  "castle_naerytar": {
    "id": "castle_naerytar",
    "title": "Le château Naerytar",
    "description": "Cour, tours, quartiers cultistes et trésor convergent vers un passage secret menant au portail.",
    "objects": [
      "cour",
      "tours",
      "quartiers cultistes",
      "salle du trésor",
      "passage secret"
    ],
    "exits": {},
    "options": [
      {
        "id": "naerytar-allie",
        "label": "Option – Se faire passer pour des alliés du Culte",
        "resolution": {
          "difficulty": 2,
          "skill": "diplomacy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "characterId": "bjolnir",
        "effects": {
          "message": "Vos sceaux volés et vos salutations froides suffisent à tromper la première ligne."
        },
        "onSuccess": {
          "variableDelta": {
            "factionTrust": {
              "cult": 2
            },
            "castleAlertLevel": -1,
            "moraleGroupe": -1
          }
        },
        "onFailure": {
          "variableDelta": {
            "castleAlertLevel": 1
          },
          "message": "Un intendant hésite, puis ordonne une surveillance rapprochée."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "naerytar-factions",
        "label": "Option – Exploiter les réseaux des factions",
        "requiresTrust": {
          "harpers": 2
        },
        "effects": {
          "message": "Un contact harpiste ouvre une poterne et détourne deux patrouilles."
        },
        "onSuccess": {
          "variableDelta": {
            "castleAlertLevel": -1
          },
          "setFlags": {
            "harpersAidReady": true
          }
        }
      },
      {
        "id": "naerytar-saboter",
        "label": "Option – Saboter le transport du trésor",
        "characterId": "darrin",
        "skill": "wild_magic",
        "resolution": {
          "difficulty": 3,
          "skill": "wild_magic",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Les essieux se fendent dans un éclair bleuâtre; les convois sont retardés."
        },
        "onSuccess": {
          "variableDelta": {
            "castleAlertLevel": 1,
            "moraleGroupe": 1
          },
          "setFlags": {
            "treasureSabotaged": true
          }
        },
        "onFailure": {
          "variableDelta": {
            "castleAlertLevel": 2,
            "chaos": 1
          },
          "message": "L’explosion arcane attire toute la garnison vers la cour."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "naerytar-prisonniers",
        "label": "Option – Libérer les prisonniers",
        "characterId": "drekthar",
        "skill": "might",
        "resolution": {
          "difficulty": 2,
          "skill": "might",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Les chaînes tombent. Les survivants jurent de témoigner contre le Culte."
        },
        "onSuccess": {
          "variableDelta": {
            "moraleGroupe": 1,
            "castleAlertLevel": 1
          },
          "setFlags": {
            "prisonersFreed": true
          }
        },
        "onFailure": {
          "variableDelta": {
            "castleAlertLevel": 2
          },
          "message": "Le fracas des grilles réveille les tours."
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir."
      },
      {
        "id": "naerytar-bouffon",
        "label": "Option – Déclarer une inspection fiscale draconique",
        "onSelect": "silly_tax_inspection",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      },
      {
        "id": "naerytar-escape",
        "label": "Séquence forcée – Fuir vers le passage secret",
        "requiresAlertMin": 4,
        "onSuccess": {
          "gotoRoom": "portal_chamber",
          "checkpoint": "Fuite forcée vers le portail"
        },
        "repeatable": true
      },
      {
        "id": "naerytar-portal",
        "label": "Rejoindre la chambre du portail",
        "onSuccess": {
          "gotoRoom": "portal_chamber",
          "checkpoint": "Approche du portail"
        },
        "repeatable": true
      }
    ],
    "chapter": 7
  },
  "portal_chamber": {
    "id": "portal_chamber",
    "title": "Chambre du Portail",
    "description": "Des runes pulsent dans la pierre noire. Le passage vers l’inconnu attend votre verdict.",
    "objects": [
      "cercle runique",
      "caisses du culte",
      "leviers anciens"
    ],
    "exits": {},
    "options": [
      {
        "id": "portal-traverse",
        "label": "Décision – Traverser immédiatement",
        "effects": {
          "message": "Le groupe franchit le seuil avant que le château ne referme ses mâchoires."
        },
        "onSuccess": {
          "setFlags": {
            "portalIntact": true,
            "portalDamaged": false
          },
          "gotoRoom": "hunting_lodge",
          "checkpoint": "Décision du portail — Traversée"
        }
      },
      {
        "id": "portal-saboter",
        "label": "Décision – Saboter le portail",
        "characterId": "darrin",
        "skill": "wild_magic",
        "resolution": {
          "difficulty": 3,
          "skill": "wild_magic",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Les glyphes se fissurent. Le portail survivra, mais affaibli pour la suite."
        },
        "onSuccess": {
          "setFlags": {
            "portalDamaged": true,
            "portalIntact": false
          },
          "gotoRoom": "hunting_lodge",
          "checkpoint": "Décision du portail — Sabotage"
        },
        "onFailure": {
          "variableDelta": {
            "castleAlertLevel": 1
          },
          "message": "Le sabotage échoue partiellement; l’onde attire des renforts."
        },
        "onFailurePost": {
          "setFlags": {
            "portalIntact": true,
            "portalDamaged": false
          },
          "gotoRoom": "hunting_lodge",
          "checkpoint": "Décision du portail — Échec sabotage"
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "portal-observer",
        "label": "Décision – Observer et consigner",
        "effects": {
          "message": "Vous mémorisez chaque rune et gardez l’option d’un retour stratégique."
        },
        "onSuccess": {
          "setFlags": {
            "portalIntact": true,
            "portalDamaged": false,
            "portalObserved": true
          },
          "gotoRoom": "hunting_lodge",
          "checkpoint": "Décision du portail — Observation"
        }
      }
    ],
    "chapter": 7
  },
  "hunting_lodge": {
    "id": "hunting_lodge",
    "title": "Le pavillon de Talis",
    "description": "Le portail mène au froid et au pavillon de Talis, amie d’enfance d’Ellyjobell. Talis accepte de trahir le Culte et indique Parnast et le château volant.",
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!189:205",
    "objects": [
      "Talis",
      "bannière",
      "route de Parnast"
    ],
    "exits": {},
    "options": [
      {
        "id": "lodge-reunion",
        "label": "Rejoindre Kairon, puis gagner Parnast",
        "onSuccess": {
          "timelineTrigger": "LODGE_REUNION",
          "gotoRoom": "skyreach_castle"
        },
        "repeatable": true
      }
    ],
    "chapter": 8
  },
  "skyreach_castle": {
    "id": "skyreach_castle",
    "title": "À bord de Cumulus",
    "description": "Le groupe embarque à Parnast. Malar rejoint la compagnie dans le château volant.",
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!203:226",
    "objects": [
      "Malar",
      "Blagothkus",
      "Eskarotha"
    ],
    "exits": {},
    "options": [
      {
        "id": "skyreach-reunion",
        "label": "Accueillir Malar et poursuivre la chronique",
        "onSuccess": {
          "timelineTrigger": "SKYREACH_REUNION",
          "gotoRoom": "skyreach_chronicle"
        },
        "repeatable": true
      }
    ],
    "chapter": 8
  },
  "skyreach_chronicle": {
    "id": "skyreach_chronicle",
    "title": "Du château volant à Waterdeep",
    "description": "Eskarotha convainc Blagothkus de combattre le Culte. Rezmir est capturé puis se suicide. Les hommes de Blagothkus capturent Glazael. Le groupe repart vers Waterdeep, via Secomber.",
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!229:259",
    "objects": [
      "chronique du château volant"
    ],
    "exits": {},
    "options": [
      {
        "id": "skyreach-return",
        "label": "Reprendre la route de Waterdeep",
        "onSuccess": {
          "gotoRoom": "act3_epilogue"
        },
        "repeatable": true
      }
    ],
    "chapter": 9
  },
  "act3_epilogue": {
    "id": "act3_epilogue",
    "title": "La route de Waterdeep",
    "description": "Blagothkus a déposé la compagnie près de Secomber. Les aventuriers terminent leur voyage à pied vers Waterdeep, où les renseignements sur le Culte doivent être transmis à ceux qui cherchent à organiser la résistance. Sur la route, les attaques des pillards et un message de Leosin annoncent les urgences qui attendent le Clan.",
    "objects": [
      "journal de campagne",
      "routes vers le Nord profond"
    ],
    "exits": {},
    "options": [
      {
        "id": "act3-end",
        "label": "Clore l’Acte III",
        "forbiddenFlag": "actIIICompleted",
        "onSuccess": {
          "setFlags": {
            "actIIICompleted": true
          },
          "setFlagFromState": {
            "factionTrustSnapshot": "factionTrust",
            "cyanwrathDeadSnapshot": "cyanwrathDead",
            "eggsOutcomeSnapshot": "eggsOutcome",
            "castleAlertLevelSnapshot": "castleAlertLevel"
          },
          "unlockActs": [
            "ACT_IV"
          ],
          "checkpoint": "End Act III",
          "gotoRoom": "act3_epilogue"
        },
        "repeatable": true
      },
      {
        "id": "act5-muster",
        "label": "Rejoindre le Conseil de Waterdeep (Acte IV)",
        "requiresFlag": "actIIICompleted",
        "onSuccess": {
          "setAct": "ACT_IV",
          "unlockActs": [
            "ACT_IV"
          ],
          "gotoRoom": "waterdeep_council_hall",
          "checkpoint": "Transition vers l’Acte IV"
        },
        "repeatable": true
      }
    ],
    "chapter": 9
  },
  "campaign_frontier": {
    "id": "campaign_frontier",
    "title": "La chronique reste ouverte",
    "description": "Les pages suivantes sont encore blanches. Le voyage du Clan d'Estain continue; la suite de son histoire reste à écrire.",
    "source": "JDR DD5 2023.xlsx — Rise of Tiamat!264:274; campagne en cours confirmée par le MJ",
    "objects": [
      "chronique inachevée"
    ],
    "exits": {},
    "options": [
      {
        "id": "simulate-finale",
        "whatIfFinale": true,
        "label": "What If — Explorer une bataille finale hypothétique",
        "onSuccess": {
          "setAct": "ACT_V",
          "unlockActs": [
            "ACT_V"
          ],
          "gotoRoom": "war_council_tent"
        },
        "repeatable": true
      },
      {
        "id": "frontier-title",
        "label": "Revenir au titre",
        "onSelect": "return_title"
      }
    ],
    "chapter": 18
  },
  "war_council_tent": {
    "id": "war_council_tent",
    "title": "Tente du Conseil de Guerre",
    "description": "Cartes déployées, bougies tremblantes et messagers haletants: la bataille finale se dessine.",
    "objects": [
      "table stratégique",
      "messagers alliés",
      "rapports du front"
    ],
    "exits": {},
    "options": [
      {
        "id": "finale-plan-room",
        "label": "Passer à la sélection du plan de bataille",
        "onSuccess": {
          "gotoRoom": "battle_plan_selection",
          "checkpoint": "Finale Start"
        },
        "repeatable": true
      }
    ]
  },
  "credits": {
    "id": "credits",
    "title": "Crédits",
    "description": "D’après D&D 5e — Tyranny of Dragons, adapté pour le Clan d’Estain. Journal de campagne fourni par le MJ. Cette version abrège les événements.",
    "objects": [
      "rideau"
    ],
    "exits": {},
    "options": [
      {
        "id": "credits-back",
        "label": "Retour au titre",
        "onSelect": "return_title"
      }
    ]
  },
  "title_screen": {
    "id": "title_screen",
    "title": "Clan d’Estain — Tyranny of Dragons",
    "description": "La chronique du Clan d’Estain, telle qu’elle a été vécue jusqu’à l’invitation à Thay. Les choix « Chronique » suivent ce qui s’est réellement passé; les « What If » explorent ce qui aurait pu arriver.",
    "objects": [
      "menu principal"
    ],
    "exits": {},
    "options": []
  },
  "battle_plan_selection": {
    "id": "battle_plan_selection",
    "title": "Sélection du Plan",
    "description": "Trois stratégies se disputent les dernières minutes avant le rituel.",
    "objects": [
      "officiers fatigués",
      "sabliers de campagne",
      "sceaux draconiques"
    ],
    "exits": {},
    "options": [
      {
        "id": "plan-sabotage",
        "label": "Plan — Saboter les composants du rituel",
        "onSuccess": {
          "setFlags": {
            "finalBattlePlan": "sabotage"
          },
          "gotoRoom": "supply_lines",
          "checkpoint": "Plan choisi — Sabotage"
        },
        "repeatable": true,
        "intent": "Chercher le composant essentiel et franchir ses protections pour ralentir le rituel; les échecs donneront du temps au Culte."
      },
      {
        "id": "plan-decapitation",
        "label": "Plan — Frappe de décapitation contre un lieutenant",
        "onSuccess": {
          "setFlags": {
            "finalBattlePlan": "decapitation"
          },
          "gotoRoom": "commander_tent",
          "checkpoint": "Plan choisi — Décapitation"
        },
        "repeatable": true,
        "intent": "Percer jusqu’au commandement ennemi pour affaiblir ses troupes; cette voie expose directement les combattants."
      },
      {
        "id": "plan-evacuation",
        "label": "Plan — Défense et évacuation des civils",
        "onSuccess": {
          "setFlags": {
            "finalBattlePlan": "evacuation"
          },
          "gotoRoom": "refugee_corridor",
          "checkpoint": "Plan choisi — Évacuation"
        },
        "repeatable": true,
        "intent": "Dégager une sortie pour les civils. Leur protection mobilisera des alliés et laissera davantage de temps au rituel."
      },
      {
        "id": "plan-riddles",
        "label": "Option – Défier Tiamat à un duel d’énigmes",
        "onSelect": "silly_riddle_duel",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ]
  },
  "supply_lines": {
    "id": "supply_lines",
    "title": "Lignes de ravitaillement",
    "description": "Des caisses runiques circulent sous escorte; un seul chariot alimente le cœur du rituel.",
    "objects": [
      "chariots glyphés",
      "notes codées",
      "patrouilles cultistes"
    ],
    "exits": {},
    "options": [
      {
        "id": "sabotage-identify",
        "label": "Option – Identifier le composant critique (Stratégie)",
        "characterId": "kairon",
        "skill": "strategy",
        "resolution": {
          "difficulty": 2,
          "skill": "strategy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vous isolez la caisse portant les sceaux de transfert d’âmes."
        },
        "onSuccess": {
          "setFlags": {
            "sabotageKeyKnown": true
          },
          "gotoRoom": "warded_corridor",
          "checkpoint": "Sabotage — composant identifié"
        },
        "onFailure": {
          "message": "Faute de certitude, vous avancez à l’aveugle et perdez un temps précieux."
        },
        "onFailurePost": {
          "gotoRoom": "warded_corridor",
          "checkpoint": "Sabotage — progression sous pression"
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "sabotage-trial",
        "label": "Option – Tenter un sabotage sans toutes les notes",
        "onSuccess": {
          "gotoRoom": "warded_corridor",
          "checkpoint": "Sabotage — tentative risquée"
        },
        "repeatable": true
      }
    ]
  },
  "warded_corridor": {
    "id": "warded_corridor",
    "title": "Corridor Gardé de Sceaux",
    "description": "Des runes sentinelles vibrent au moindre souffle.",
    "objects": [
      "sceaux d’alarme",
      "arches gravées"
    ],
    "exits": {},
    "options": [
      {
        "id": "sabotage-stealth",
        "label": "Option – Faufiler l’équipe entre les sentinelles (Furtivité)",
        "characterId": "malar",
        "skill": "stealth",
        "resolution": {
          "difficulty": 3,
          "skill": "stealth",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Votre groupe glisse entre deux scans runiques sans déclencher l’alarme."
        },
        "onSuccess": {
          "gotoRoom": "ritual_components",
          "checkpoint": "Sabotage — couloir franchi"
        },
        "onFailure": {
          "message": "Une rune claque comme un fouet et fracture votre timing."
        },
        "onFailurePost": {
          "gotoRoom": "ritual_components",
          "checkpoint": "Sabotage — couloir forcé"
        },
        "riskText": "Un échec peut blesser l'intervenant."
      }
    ]
  },
  "ritual_components": {
    "id": "ritual_components",
    "title": "Composants du Rituel",
    "description": "Trois reliquaires battent à l’unisson du portail. Un seul sabotage les fera vaciller.",
    "objects": [
      "reliquaire d’obsidienne",
      "cœur de braise",
      "fiole d’âme"
    ],
    "exits": {},
    "options": [
      {
        "id": "sabotage-arcana",
        "label": "Option – Briser le bon relais rituel (Arcane)",
        "characterId": "darrin",
        "skill": "wild_magic",
        "resolution": {
          "difficulty": 3,
          "skill": "wild_magic",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Le relais principal explose en silence, et la cadence du rituel se casse."
        },
        "onSuccess": {
          "setFlags": {
            "sabotageSuccess": true
          },
          "gotoRoom": "ritual_chamber",
          "checkpoint": "Sabotage accompli"
        },
        "onFailure": {
          "message": "Le mauvais relais cède: le rituel vacille à peine et les cultistes hurlent."
        },
        "onFailurePost": {
          "setFlags": {
            "sabotageSuccess": false
          },
          "gotoRoom": "ritual_chamber",
          "checkpoint": "Sabotage compromis"
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir."
      }
    ]
  },
  "commander_tent": {
    "id": "commander_tent",
    "title": "Tente du Commandement Cultiste",
    "description": "Le lieutenant final coordonne les vagues d’assaut à la lueur d’un brasero vert.",
    "objects": [
      "cartes tactiques",
      "étendards du culte"
    ],
    "exits": {},
    "options": [
      {
        "id": "decapitation-approach",
        "label": "Option – Forcer une approche de commandement (Leadership)",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 2,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vos ordres brefs ouvrent un corridor vers la tente centrale."
        },
        "onSuccess": {
          "gotoRoom": "champion_confrontation",
          "checkpoint": "Décapitation — approche réussie"
        },
        "onFailure": {
          "message": "Les lignes se referment et l’ennemi gagne de précieuses minutes."
        },
        "onFailurePost": {
          "gotoRoom": "champion_confrontation",
          "checkpoint": "Décapitation — approche coûteuse"
        },
        "riskText": "Un échec peut blesser l'intervenant."
      }
    ]
  },
  "champion_confrontation": {
    "id": "champion_confrontation",
    "title": "Confrontation du Champion",
    "description": "Le champion du culte vous attend entre les bannières noires et les flammes rituelles.",
    "objects": [
      "champion draconique",
      "gardes d’élite"
    ],
    "exits": {},
    "options": [
      {
        "id": "decapitation-strike",
        "label": "Option – Neutraliser le lieutenant (Duel tactique)",
        "characterId": "kairon",
        "skill": "strategy",
        "resolution": {
          "difficulty": 3,
          "skill": "strategy",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Le lieutenant tombe, et la chaîne de commandement cultiste se disloque."
        },
        "onSuccess": {
          "setFlags": {
            "lieutenantDefeated": true
          },
          "gotoRoom": "ritual_chamber",
          "checkpoint": "Décapitation réussie"
        },
        "onFailure": {
          "message": "Le lieutenant survit et relance la pression sur tous les fronts."
        },
        "onFailurePost": {
          "setFlags": {
            "lieutenantDefeated": false
          },
          "gotoRoom": "ritual_chamber",
          "checkpoint": "Décapitation échouée"
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir."
      }
    ]
  },
  "refugee_corridor": {
    "id": "refugee_corridor",
    "title": "Couloir des Réfugiés",
    "description": "Les familles se serrent contre les murs tandis que les cloches d’alarme battent sans relâche.",
    "objects": [
      "blessés",
      "escorte improvisée",
      "issues bouchées"
    ],
    "exits": {},
    "options": [
      {
        "id": "evacuation-bjolnir",
        "label": "Option – Bjolnir organise une évacuation disciplinée",
        "characterId": "bjolnir",
        "skill": "redemption",
        "resolution": {
          "difficulty": 2,
          "skill": "redemption",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Bjolnir tient la ligne et chaque groupe civil trouve une sortie viable."
        },
        "onSuccess": {
          "gotoRoom": "burning_streets_finale",
          "checkpoint": "Évacuation — corridor sécurisé"
        },
        "onFailure": {
          "message": "La cohue vous ralentit; le rituel n’attendra pas."
        },
        "onFailurePost": {
          "gotoRoom": "burning_streets_finale",
          "checkpoint": "Évacuation — corridor sous pression"
        },
        "riskText": "Un échec peut blesser l'intervenant."
      }
    ]
  },
  "burning_streets_finale": {
    "id": "burning_streets_finale",
    "title": "Rues en Feu — Finale",
    "description": "Un choix final s’impose: sauver davantage de vies ou foncer sur l’objectif rituel.",
    "objects": [
      "pont effondré",
      "foule paniquée",
      "éclairs pourpres du rituel"
    ],
    "exits": {},
    "options": [
      {
        "id": "evacuation-save-more",
        "label": "Choix – Sauver le plus de civils possible (retard stratégique)",
        "onSuccess": {
          "setFlags": {
            "evacuationSuccess": true
          },
          "gotoRoom": "ritual_chamber",
          "checkpoint": "Évacuation prioritaire accomplie"
        },
        "repeatable": true,
        "intent": "Réduire le danger pour les civils en détournant des alliés et du temps de l’assaut contre le rituel."
      },
      {
        "id": "evacuation-secure-objective",
        "label": "Choix – Sécuriser l’objectif rituel immédiatement",
        "onSuccess": {
          "setFlags": {
            "evacuationSuccess": false
          },
          "gotoRoom": "ritual_chamber",
          "checkpoint": "Objectif prioritaire sécurisé"
        },
        "repeatable": true,
        "intent": "Freiner le rituel immédiatement, en laissant davantage de civils exposés pendant l’opération."
      },
      {
        "id": "evacuation-reckless",
        "label": "Choix manifestement périlleux — Forcer un pont en flammes avec la foule",
        "onSelect": "serious_reckless_bridge"
      }
    ]
  },
  "ritual_chamber": {
    "id": "ritual_chamber",
    "title": "Chambre du Rituel Final",
    "description": "Le portail de Tiamat pulse dans un grondement qui déforme la pierre.",
    "objects": [
      "sceaux de garde",
      "nexus draconique",
      "alliés à bout de souffle"
    ],
    "exits": {},
    "options": [
      {
        "id": "ritual-break-ward",
        "repeatable": true,
        "label": "Action décisive – Briser un sceau de garde (Arcane)",
        "characterId": "darrin",
        "skill": "wild_magic",
        "resolution": {
          "difficulty": 3,
          "skill": "wild_magic",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Un sceau éclate; la poussée du rituel ralentit enfin."
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Darrin tente de détruire une protection du cercle. Un échec le blessera sans obtenir le même ralentissement."
      },
      {
        "id": "ritual-rally",
        "repeatable": true,
        "label": "Action décisive – Rallier les alliés pour une poussée",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 2,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Les lignes alliées avancent en bloc et grignotent le cercle ennemi."
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Bjolnir fait avancer les alliés vers le cercle. L’action peut être répétée, mais chaque échec l’expose aux coups."
      },
      {
        "id": "ritual-sacrifice-gear",
        "repeatable": true,
        "label": "Action décisive – Sacrifier équipement et temps pour affaiblir le rituel",
        "characterId": "kairon",
        "skill": "strategy",
        "resolution": {
          "difficulty": 2,
          "skill": "strategy",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "message": "Vos ressources partent en cendres, mais les runes perdent en cohérence."
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir.",
        "intent": "Consumer des ressources dans le cercle pour ralentir le rituel, avec un risque de blessure pour Darrin."
      },
      {
        "id": "ritual-shout-stop",
        "label": "Option – Crier « STOP ! » très fort au portail",
        "onSelect": "silly_shout_stop",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      },
      {
        "id": "ritual-resolve",
        "label": "Conclure la bataille et juger l’issue",
        "onSuccess": {
          "gotoRoom": "campaign_end",
          "checkpoint": "Campaign End"
        },
        "repeatable": true,
        "intent": "Évaluer la bataille après au moins trois actions décisives. Le résultat dépend du rituel, des alliés et du danger pour les civils."
      }
    ]
  },
  "campaign_end": {
    "id": "campaign_end",
    "title": "Épilogue de Campagne",
    "description": "La poussière retombe sur le dernier champ de bataille. Les chroniques se ferment.",
    "objects": [
      "étendards brisés",
      "serments survivants"
    ],
    "exits": {},
    "options": [
      {
        "id": "restart-campaign",
        "label": "Recommencer la campagne",
        "onSelect": "restart_campaign"
      },
      {
        "id": "return-title",
        "label": "Retour au titre",
        "onSelect": "return_title"
      }
    ]
  },
  "old_tunnel": {
    "id": "old_tunnel",
    "title": "Le tunnel vers la rivière",
    "chapter": 2,
    "description": "Escobert a indiqué aux aventuriers un ancien tunnel qui relie la forteresse à la rivière. Après un court repos, le Clan s’y engage pour gagner les abords du temple sans traverser les rues occupées par les pillards. Derrière les murs qu’ils viennent de quitter, les habitants secourus attendent avec les défenseurs; d’autres sont encore enfermés dans le sanctuaire.\n\nDes rats encombrent le passage et obligent la compagnie à interrompre son avancée. Ellyjobell peut tenter de les éloigner en leur parlant et en s’aidant d’une illusion, avant que Darrin s’occupe de la porte rouillée qui ferme l’autre extrémité du tunnel. Il faut dégager ce chemin pour rejoindre la rivière, puis reconnaître les accès du temple.",
    "paragraphs": [
      "Escobert a indiqué aux aventuriers un ancien tunnel qui relie la forteresse à la rivière. Après un court repos, le Clan s’y engage pour gagner les abords du temple sans traverser les rues occupées par les pillards. Derrière les murs qu’ils viennent de quitter, les habitants secourus attendent avec les défenseurs; d’autres sont encore enfermés dans le sanctuaire.",
      "Des rats encombrent le passage et obligent la compagnie à interrompre son avancée. Ellyjobell peut tenter de les éloigner en leur parlant et en s’aidant d’une illusion, avant que Darrin s’occupe de la porte rouillée qui ferme l’autre extrémité du tunnel. Il faut dégager ce chemin pour rejoindre la rivière, puis reconnaître les accès du temple."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "tunnel-temple",
        "label": "Éloigner les rats et ouvrir la porte vers la rivière",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "sanctuary_approach"
        },
        "intent": "Ellyjobell écarte les rats avec une illusion, puis Darrin dégage la porte rouillée pour permettre le passage du Clan.",
        "requiresCharacters": [
          "ellyjobell",
          "darrin"
        ]
      }
    ],
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!A17:A18; A23:A25"
  },
  "dragon_assault": {
    "id": "dragon_assault",
    "title": "Le dragon attaque la forteresse",
    "chapter": 2,
    "description": "Le temple a été évacué et le moulin sécurisé. Les aventuriers regagnent la forteresse en espérant pouvoir enfin s’y reposer, lorsque le dragon qui survolait Verdure revient attaquer. Les défenseurs sont rappelés sur les remparts, au-dessus des habitants qu’ils ont rassemblés derrière les murs.\n\nLe Clan doit les rejoindre et concentrer ses efforts contre la créature. Les assauts menés dans les rues n’ont pas suffi à mettre fin au siège: tant que le dragon maintient sa pression sur la place forte, les réfugiés restent menacés dans leur dernier abri. Les compagnons disposent de leurs armes, de leurs sorts et de l’appui des gardes pour tenter de le contraindre à s’éloigner.",
    "paragraphs": [
      "Le temple a été évacué et le moulin sécurisé. Les aventuriers regagnent la forteresse en espérant pouvoir enfin s’y reposer, lorsque le dragon qui survolait Verdure revient attaquer. Les défenseurs sont rappelés sur les remparts, au-dessus des habitants qu’ils ont rassemblés derrière les murs.",
      "Le Clan doit les rejoindre et concentrer ses efforts contre la créature. Les assauts menés dans les rues n’ont pas suffi à mettre fin au siège: tant que le dragon maintient sa pression sur la place forte, les réfugiés restent menacés dans leur dernier abri. Les compagnons disposent de leurs armes, de leurs sorts et de l’appui des gardes pour tenter de le contraindre à s’éloigner."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "dragon-defendre",
        "label": "Soutenir les gardes et concentrer les attaques sur le dragon",
        "effects": {
          "message": "Les attaques combinées du groupe repoussent le dragon. Les remparts tiennent et les défenseurs peuvent s'occuper des blessés."
        },
        "onSuccess": {
          "setFlags": {
            "dragonRepelled": true
          },
          "gotoRoom": "greenest_keep"
        },
        "intent": "Suivre le récit: le Clan unit ses attaques à celles des défenseurs pour contraindre le dragon à s’éloigner."
      }
    ],
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!A28:A32"
  },
  "elturel_road": {
    "id": "elturel_road",
    "title": "Le voyage vers Elturel",
    "chapter": 5,
    "description": "Le chemin de Beregost est bloqué et un message de Leosin presse le Clan de rejoindre Elturel. Les aventuriers voyagent avec leurs chariots, affrontent les dangers de la route et traversent un pont fragile en allégeant les chargements.",
    "paragraphs": [
      "Le chemin de Beregost est bloqué et un message de Leosin presse le Clan de rejoindre Elturel. Les aventuriers voyagent avec leurs chariots, affrontent les dangers de la route et traversent un pont fragile en allégeant les chargements."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "elturel-arrivee",
        "label": "Rejoindre Leosin à la taverne des Black Antlers",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "elturel_tournament"
        }
      }
    ],
    "source": "Tyranny of dragons!85:104"
  },
  "elturel_tournament": {
    "id": "elturel_tournament",
    "title": "Le tournoi du Gantelet",
    "chapter": 5,
    "description": "À Elturel, le tournoi donne aux aventuriers l'occasion de se mesurer aux représentants du Gantelet. Bjolnir gagne l'épreuve de force après la demi-finale contre Drek’Thar; Darrin remporte l'épreuve de magie et le groupe s'impose dans l'arène.\n\nOntharr et Leosin exposent ensuite leur plan. Le Clan doit gagner Baldur's Gate et se faire engager dans une caravane qui remonte vers Waterdeep. Drek’Thar rejoint le Gantelet, Darrin les Ménestrels.",
    "paragraphs": [
      "À Elturel, le tournoi donne aux aventuriers l'occasion de se mesurer aux représentants du Gantelet. Bjolnir gagne l'épreuve de force après la demi-finale contre Drek’Thar; Darrin remporte l'épreuve de magie et le groupe s'impose dans l'arène.",
      "Ontharr et Leosin exposent ensuite leur plan. Le Clan doit gagner Baldur's Gate et se faire engager dans une caravane qui remonte vers Waterdeep. Drek’Thar rejoint le Gantelet, Darrin les Ménestrels."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "tournoi-caravane",
        "label": "Gagner Baldur's Gate pour infiltrer la caravane du Culte",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "northern_road"
        }
      }
    ],
    "source": "Tyranny of dragons!105:127"
  },
  "carnath_roadhouse": {
    "id": "carnath_roadhouse",
    "title": "Le relais Carnath",
    "chapter": 7,
    "description": "Le relais est tenu par Bog Luck. Durant la nuit, Bjolnir entend une activité au sous-sol; Ellyjobell reconnaît des hommes-lézards occupés près des réserves. Après le combat et l'interrogatoire, le groupe découvre qu'ils transportent les richesses pillées jusqu'à Naerytar.\n\nPressegueule devient le guide du Clan. Le tunnel du relais conduit aux marais, où les hommes-lézards expliquent comment les brutaciens et leurs maîtres les oppriment.",
    "paragraphs": [
      "Le relais est tenu par Bog Luck. Durant la nuit, Bjolnir entend une activité au sous-sol; Ellyjobell reconnaît des hommes-lézards occupés près des réserves. Après le combat et l'interrogatoire, le groupe découvre qu'ils transportent les richesses pillées jusqu'à Naerytar.",
      "Pressegueule devient le guide du Clan. Le tunnel du relais conduit aux marais, où les hommes-lézards expliquent comment les brutaciens et leurs maîtres les oppriment."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "carnath-marais",
        "label": "Prendre le tunnel avec Pressegueule pour gagner Naerytar",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "naerytar_swamp"
        }
      }
    ],
    "source": "Tyranny of dragons!154:170"
  },
  "diderius_chronicle": {
    "id": "diderius_chronicle",
    "title": "À la recherche de Varam",
    "chapter": 11,
    "description": "Le Conseil envoie le Clan sur la piste de Varam le Blanc, qui recherche son masque près de Boareskyr. Dans la tombe de Diderius, les aventuriers affrontent les gardiens et les pillards avant de gagner le repaire des Yuan-ti.\n\nLa négociation avec la prêtresse échoue. Elle tue Varam et s'échappe au cours du combat. Le groupe retrouve Ilda et obtient une vision de Severin, qui possède désormais le masque blanc; les aventuriers retournent à Waterdeep avec la tête de Varam.",
    "paragraphs": [
      "Le Conseil envoie le Clan sur la piste de Varam le Blanc, qui recherche son masque près de Boareskyr. Dans la tombe de Diderius, les aventuriers affrontent les gardiens et les pillards avant de gagner le repaire des Yuan-ti.",
      "La négociation avec la prêtresse échoue. Elle tue Varam et s'échappe au cours du combat. Le groupe retrouve Ilda et obtient une vision de Severin, qui possède désormais le masque blanc; les aventuriers retournent à Waterdeep avec la tête de Varam."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "diderius-retour",
        "label": "Rapporter au Conseil le sort de Varam et la vision de Severin",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "ice_sea_chronicle"
        }
      }
    ],
    "source": "Rise of Tiamat!18:95"
  },
  "ice_sea_chronicle": {
    "id": "ice_sea_chronicle",
    "title": "La recherche de Maccath",
    "chapter": 12,
    "description": "Le Conseil confie une nouvelle recherche au Clan: retrouver Maccath l'Écarlate, disparue dans les glaces du nord. Le capitaine Lerustah conduit les aventuriers à Oyaviggaton à bord du Frostskimmr. Après avoir repoussé des pieuvres géantes, les voyageurs atteignent le village des chasseurs de glace.\n\nBjolnir perd son duel contre Cœur-d'Orc, mais le combat fait place à une estime réciproque. Le chef du village demande au groupe de repartir. Les aventuriers reviennent discrètement et découvrent sous la tente principale un tunnel qui descend dans l'iceberg.",
    "paragraphs": [
      "Le Conseil confie une nouvelle recherche au Clan: retrouver Maccath l'Écarlate, disparue dans les glaces du nord. Le capitaine Lerustah conduit les aventuriers à Oyaviggaton à bord du Frostskimmr. Après avoir repoussé des pieuvres géantes, les voyageurs atteignent le village des chasseurs de glace.",
      "Bjolnir perd son duel contre Cœur-d'Orc, mais le combat fait place à une estime réciproque. Le chef du village demande au groupe de repartir. Les aventuriers reviennent discrètement et découvrent sous la tente principale un tunnel qui descend dans l'iceberg."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "glace-explorer",
        "label": "Descendre dans l'iceberg pour chercher Maccath",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "iceberg_rebellion"
        }
      }
    ],
    "source": "Rise of Tiamat!96:136"
  },
  "iceberg_rebellion": {
    "id": "iceberg_rebellion",
    "title": "Une armée sous la glace",
    "chapter": 13,
    "description": "Les galeries abritent les serviteurs d'Arauthator et les connaissances volées à la Confrérie de l'Arcane. Maccath veut récupérer ces ouvrages avant de quitter les lieux.",
    "paragraphs": [
      "Les aventuriers progressent dans les galeries et découvrent les serviteurs d'Arauthator. Après les combats contre les trolls, ils rencontrent les kobolds et les crapauds des glaces. Malar obtient l'adhésion des kobolds; le Clan convainc ensuite Marfulb et les habitants du village de se soulever. Maccath accepte de les aider, à condition de récupérer les connaissances volées à sa confrérie.",
      "Le soulèvement réunit ces peuples autour des aventuriers et permet de tuer le dragon blanc. Il reste à tenir les promesses faites avant le combat: les kobolds veulent un bateau, tandis que Maccath et Marfulb doivent s'accorder sur le sort des archives. Le Clan propose que le chef des crapauds rejoigne la Confrérie de l'Arcane, puis prépare le retour vers Waterdeep."
    ],
    "objects": [],
    "exits": {},
    "options": [{"id":"glace-victoire","label":"Revenir à Waterdeep avec Maccath après la victoire contre Arauthator","repeatable":true,"onSuccess":{"gotoRoom":"second_council"}}],
    "source": "Rise of Tiamat!133:157"
  },
  "second_council": {
    "id": "second_council",
    "title": "La seconde session du Conseil",
    "chapter": 14,
    "description": "À leur retour, les aventuriers retrouvent un Conseil dont la composition a changé. Laeral Silverhand dirige désormais Waterdeep. Maccath confirme le soutien de sa confrérie; les conseillers veulent aussi approfondir les renseignements obtenus sur Varam.\n\nElia, qui est en réalité Otaaryliakkarnos, invite le Clan au conseil des dragons métalliques. Cette audience précède le départ vers la Forêt Brumeuse.",
    "paragraphs": [
      "À leur retour, les aventuriers retrouvent un Conseil dont la composition a changé. Laeral Silverhand dirige désormais Waterdeep. Maccath confirme le soutien de sa confrérie; les conseillers veulent aussi approfondir les renseignements obtenus sur Varam.",
      "Elia, qui est en réalité Otaaryliakkarnos, invite le Clan au conseil des dragons métalliques. Cette audience précède le départ vers la Forêt Brumeuse."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "conseil-dragons",
        "label": "Accompagner Elia au conseil des dragons métalliques",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "metallic_dragon_audience"
        }
      }
    ],
    "source": "Rise of Tiamat!159:176"
  },
  "misty_forest_chronicle": {
    "id": "misty_forest_chronicle",
    "title": "Dans la Forêt Brumeuse",
    "chapter": 15,
    "description": "Le Clan enquête sur les attaques autour d'Altorn. Ellyjobell interroge le corbeau de Galin et Kairon le confronte à ce qu'ils ont appris: le gardien a révélé l'emplacement d'autres villages pour épargner le sien.\n\nLes aventuriers suivent ensuite la piste du dragon. Après avoir secouru une vieille femme, ils reçoivent des amulettes qui les dissimulent aux animaux espions. Le chemin les conduit derrière une cascade, vers le temple occupé par Neronvein et ses alliés.",
    "paragraphs": [
      "Le Clan enquête sur les attaques autour d'Altorn. Ellyjobell interroge le corbeau de Galin et Kairon le confronte à ce qu'ils ont appris: le gardien a révélé l'emplacement d'autres villages pour épargner le sien.",
      "Les aventuriers suivent ensuite la piste du dragon. Après avoir secouru une vieille femme, ils reçoivent des amulettes qui les dissimulent aux animaux espions. Le chemin les conduit derrière une cascade, vers le temple occupé par Neronvein et ses alliés."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "foret-temple",
        "label": "Entrer dans le temple pour retrouver les elfes prisonniers",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "neronvein_chronicle"
        }
      }
    ],
    "source": "Rise of Tiamat!183:210"
  },
  "neronvein_chronicle": {
    "id": "neronvein_chronicle",
    "title": "Les prisonniers de Neronvein",
    "chapter": 16,
    "description": "Dans le temple, le Clan délivre les elfes et leur rend l'équipement nécessaire à leur fuite. Les documents de Neronvein révèlent que son masque a été envoyé à Severin. Le groupe emprunte un passage secret pour rejoindre le dragon.",
    "paragraphs": [
      "Dans le temple, le Clan retrouve les elfes prisonniers. Bjolnir les presse de fuir, mais ils ne disposent pas de leur équipement. Les aventuriers repartent le chercher et le leur apportent par téléportation; un mage et un chevalier restent avec leurs libérateurs.",
      "Une bataille contre les cultistes révèle que Neronvein est un fils du roi Melandrach. Dans ses appartements, Ellyjobell trouve un journal indiquant que le masque a été envoyé à Severin. Un passage secret rejoint la tanière du dragon; le Clan s'y engage et découvre Neronvein dans une vaste salle, près du trésor."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "foret-affrontement",
        "label": "Rejoindre le récit de l'affrontement contre Neronvein et le dragon",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "neronvein_battle"
        }
      }
    ],
    "source": "Rise of Tiamat!211:250"
  },
  "neronvein_battle": {
    "id": "neronvein_battle",
    "title": "La forêt reprend souffle",
    "chapter": 17,
    "description": "Le dragon et Neronvein affrontent le Clan dans la caverne. Leur défaite permettra aux villages de sortir de la menace qui pesait sur eux.",
    "paragraphs": [
      "Le combat oppose le Clan au dragon, à Neronvein et à leurs serviteurs. Le Dragophone est tué par un sort du dragon lui-même. Lorsque la créature tente de fuir, Darrin poursuit ses attaques et l'abat. Sa chute provoque l'effondrement de la caverne; l'arbre qui reprend vie protège les survivants contre les pierres.",
      "Les aventuriers récupèrent ce qu'ils peuvent dans les décombres, dont l'épée de Neronvein. Ils regagnent ensuite le village elfe pour annoncer la mort du dragon. La forêt peut commencer à guérir, et les troupes affectées à sa protection pourront désormais être mobilisées sur d'autres fronts."
    ],
    "objects": [],
    "exits": {},
    "options": [{"id":"foret-retour","label":"Revenir au Conseil pour annoncer la mort du dragon","repeatable":true,"onSuccess":{"gotoRoom":"thay_invitation"}}],
    "source": "Rise of Tiamat!251:262"
  },
  "thay_invitation": {
    "id": "thay_invitation",
    "title": "L'invitation de Thay",
    "chapter": 17,
    "description": "De retour à Waterdeep, le Clan apprend que Talis s'est rendue. Melandrach accepte de présenter les excuses demandées par les dragons, à condition que le roi des nains fasse de même.\n\nLeosin vient ensuite chercher les aventuriers pour une nouvelle réunion: le Conseil a reçu une proposition de négociation des mages rouges de Thay. Lady Silverhand leur demande de représenter le Conseil ou d'escorter ses délégués. Islabus Gloomward, le maître de Darrin devenu mage rouge, explique les inquiétudes de Szass Tam. La compagnie doit encore décider comment répondre à cette invitation.",
    "paragraphs": [
      "De retour à Waterdeep, le Clan apprend que Talis s'est rendue. Melandrach accepte de présenter les excuses demandées par les dragons, à condition que le roi des nains fasse de même.",
      "Leosin vient ensuite chercher les aventuriers pour une nouvelle réunion: le Conseil a reçu une proposition de négociation des mages rouges de Thay. Lady Silverhand leur demande de représenter le Conseil ou d'escorter ses délégués. Islabus Gloomward, le maître de Darrin devenu mage rouge, explique les inquiétudes de Szass Tam. La compagnie doit encore décider comment répondre à cette invitation."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "thay-conseil",
        "label": "Faire le point sur les alliances avant de refermer ce récit",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "council_resolution"
        }
      }
    ],
    "source": "Rise of Tiamat!259:274"
  }
    };

