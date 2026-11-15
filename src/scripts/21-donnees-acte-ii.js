    const ACT_II_ROOMS = {
  "cult_trail": {
    "id": "cult_trail",
    "title": "Traque vers le camp",
    "description": "Des pistes fraîches, des chariots lourds et des prisonniers entravés marquent la route des pillards.",
    "objects": [
      "pistes",
      "chariots",
      "prisonniers"
    ],
    "exits": {
      "nord": "cult_camp_exterior"
    },
    "options": [
      {
        "id": "suivre-discretement",
        "label": "Option – Sislay: Suivre discrètement la colonne",
        "characterId": "sislay",
        "skill": "stealth",
        "resolution": {
          "difficulty": 3,
          "skill": "stealth",
          "risk": "capture",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "Vous gardez la colonne en vue sans révéler votre présence."
        },
        "riskText": "Un échec peut entraîner sa capture."
      },
      {
        "id": "attaquer-arriere-garde",
        "label": "Option – Bjolnir: Attaquer l’arrière-garde",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 4,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "chaos": 1,
          "message": "L’arrière-garde cède, mais l’alerte monte dans les collines."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "deguisement-kobold",
        "label": "Option – Darrin: Se déguiser en kobold sans costume",
        "characterId": "darrin",
        "skill": "wild_magic",
        "onSelect": "silly_lennithon",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ],
    "chapter": 3
  },
  "cult_camp_exterior": {
    "id": "cult_camp_exterior",
    "title": "Abords du camp",
    "description": "Au-delà des pins noirs, des feux de garde tracent le périmètre du camp du Culte.",
    "objects": [
      "sentinelles",
      "palissades",
      "fumées de bivouac"
    ],
    "exits": {
      "sud": "cult_trail",
      "nord": "cult_camp"
    },
    "options": [
      {
        "id": "sonder-patrouilles",
        "label": "Option – Bjolnir: Lire la cadence des patrouilles",
        "characterId": "bjolnir",
        "skill": "strategy",
        "resolution": {
          "difficulty": 4,
          "skill": "strategy",
          "risk": "capture",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "Les relèves deviennent lisibles: vous trouvez une fenêtre vers la palissade."
        },
        "riskText": "Un échec peut entraîner sa capture."
      },
      {
        "id": "briser-ligne-garde",
        "label": "Option – Bjolnir: Briser une ligne de garde",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 5,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "chaos": 1,
          "message": "Le passage est ouvert, mais les alarmes grondent derrière vous."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      }
    ],
    "chapter": 3
  },
  "cult_camp": {
    "id": "cult_camp",
    "title": "Camp du Culte",
    "description": "Tentes cultistes, enclos de prisonniers et grande tente se partagent un terrain boueux et surveillé.",
    "objects": [
      "tentes cultistes",
      "enclos prisonniers",
      "grande tente",
      "passage hatchery"
    ],
    "exits": {
      "sud": "cult_camp_exterior"
    },
    "options": [
      {
        "id": "camp-liberation",
        "intent": "Suivre l’évasion rapportée dans le journal, puis ramener Leosin et les autres captifs à Verdure.",
        "requiresCharacters": ["darrin", "drekthar", "ellyjobell"],
        "label": "Darrin et Drek’Thar entrent dans le camp pendant la diversion",
        "source": "Tyranny of dragons!45:50",
        "effects": {
          "message": "La diversion couvre l'entrée de Darrin et Drek’Thar tandis qu'Ellyjobell progresse à couvert. Leosin et les autres prisonniers sont libérés."
        },
        "onSuccess": {
          "setFlags": {
            "leosinSaved": true
          },
          "gotoRoom": "leosin_return"
        }
      },
      {
        "id": "liberer-leosin",
        "forbiddenFlag": "leosinSaved",
        "label": "Option – Sislay: Libérer Leosin en silence",
        "characterId": "sislay",
        "skill": "stealth",
        "resolution": {
          "difficulty": 5,
          "skill": "stealth",
          "risk": "capture",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "chaos": -1,
          "message": "Leosin rejoint votre colonne et murmure un plan de retraite."
        },
        "onSuccess": {
          "setFlags": {
            "leosinSaved": true
          }
        },
        "riskText": "Un échec peut entraîner sa capture.",
        "intent": "Variante: Sislay approche seule des prisonniers. Si elle est repérée, elle risque d’être capturée."
      },
      {
        "id": "observer-leaders",
        "label": "Option – Bjolnir: Observer les meneurs du Culte",
        "characterId": "bjolnir",
        "skill": "strategy",
        "resolution": {
          "difficulty": 5,
          "skill": "strategy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "Vous relevez les ordres et les sceaux des chefs sous la grande tente."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "voler-informations",
        "label": "Option – Darrin: Voler des informations rituelles",
        "characterId": "darrin",
        "skill": "wild_magic",
        "resolution": {
          "difficulty": 6,
          "skill": "wild_magic",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "chaos": 1,
          "message": "Des cartes et un codex passent dans vos sacs."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "tiamat-reincarnee",
        "label": "Option – Darrin: Proclamer être Tiamat réincarné",
        "characterId": "darrin",
        "skill": "wild_magic",
        "onSelect": "silly_lennithon",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      },
      {
        "id": "camp-retour",
        "label": "Ramener Leosin à Verdure avant de revenir examiner la grotte",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "leosin_return"
        },
        "requiresFlag": "leosinSaved"
      }
    ],
    "chapter": 3
  },
  "leosin_return": {
    "id": "leosin_return",
    "title": "Le retour des prisonniers",
    "chapter": 3,
    "description": "Le Clan ramène Leosin et les prisonniers à Verdure. Le moine explique qu'il s'était volontairement laissé capturer pour étudier le Culte. Il demande aux aventuriers de surveiller ses déplacements et de rejoindre Ontharr Frume à Elturel.\n\nLorsqu'ils retournent observer le canyon, une grande partie du camp a été déménagée. Des chasseurs restent sur place et une grotte attire l'attention du groupe.",
    "paragraphs": [
      "Le Clan ramène Leosin et les prisonniers à Verdure. Le moine explique qu'il s'était volontairement laissé capturer pour étudier le Culte. Il demande aux aventuriers de surveiller ses déplacements et de rejoindre Ontharr Frume à Elturel.",
      "Lorsqu'ils retournent observer le canyon, une grande partie du camp a été déménagée. Des chasseurs restent sur place et une grotte attire l'attention du groupe."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "retour-grotte",
        "label": "Retourner au camp évacué et examiner l'entrée de la grotte",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "hatchery_entry"
        }
      }
    ],
    "source": "Tyranny of dragons!48:58"
  },
  "hatchery_entry": {
    "id": "hatchery_entry",
    "title": "La grotte des pillards",
    "description": "Une faille sombre souffle un air humide. Sans torches, chaque pas devient un pari aveugle.",
    "objects": [
      "caverne obscure",
      "torches",
      "rampe glissante"
    ],
    "exits": {
      "nord": "fungal_chamber"
    },
    "options": [
      {
        "id": "descendre-discretement",
        "label": "Option – Sislay: Descendre discrètement",
        "characterId": "sislay",
        "skill": "stealth",
        "resolution": {
          "difficulty": 6,
          "skill": "stealth",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "La colonne s’enfonce sans bruit dans les galeries."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "forcer-entree",
        "label": "Option – Bjolnir: Forcer l’entrée",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 6,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "chaos": 1,
          "message": "Le verrou cède dans un fracas qui réveille la hatchery."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      }
    ],
    "chapter": 4
  },
  "fungal_chamber": {
    "id": "fungal_chamber",
    "title": "Chambre fongique",
    "description": "Des champignons géants exhalent des spores laiteuses à chaque vibration.",
    "objects": [
      "spores",
      "mycélium",
      "passages latéraux"
    ],
    "exits": {
      "sud": "hatchery_entry",
      "nord": "act2_confrontation"
    },
    "options": [
      {
        "id": "traversee-prudente",
        "label": "Option – Bjolnir: Traversée lente et calculée",
        "characterId": "bjolnir",
        "skill": "strategy",
        "resolution": {
          "difficulty": 6,
          "skill": "strategy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "Vous contournez les nappes de spores dans un silence d’église."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "bruler-fonges",
        "label": "Option – Darrin: Brûler les fonges pour ouvrir un couloir",
        "characterId": "darrin",
        "skill": "wild_magic",
        "resolution": {
          "difficulty": 6,
          "skill": "wild_magic",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": 1,
          "message": "Les spores flambent; la voie est nette, et l’alerte aussi."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "adopter-oeuf-maintenant",
        "label": "Option – Darrin: Adopter immédiatement un œuf",
        "characterId": "darrin",
        "skill": "wild_magic",
        "onSelect": "silly_lennithon",
        "riskText": "Choix chaotique : sans gravité, mais il peut attirer l’attention."
      }
    ],
    "chapter": 4
  },
  "act2_confrontation": {
    "id": "act2_confrontation",
    "title": "La revanche de Drek’Thar",
    "description": "Après les premiers pièges et les salles occupées par les kobolds, le groupe retrouve Cyanwrath et deux berserkers. Drek’Thar demande un nouveau duel tandis que ses compagnons prennent en charge les autres adversaires. Les œufs ne sont découverts qu'après cet affrontement.",
    "objects": [
      "champion cultiste",
      "garde rapprochée",
      "passage étroit"
    ],
    "exits": {
      "sud": "fungal_chamber"
    },
    "options": [
      {
        "id": "revanche-drekthar",
        "requiresCharacters": ["bjolnir"],
        "label": "Drek’Thar affronte Cyanwrath pendant que le groupe combat les berserkers",
        "characterId": "drekthar",
        "skill": "duel",
        "forbiddenFlag": "cyanwrathDead",
        "source": "JDR DD5 2023.xlsx — Tyranny of dragons!71:72",
        "onSuccess": {
          "setFlags": {
            "cyanwrathDead": true,
            "confrontationDone": true
          },
          "message": "Drek’Thar décapite Langdedrosa. Le groupe vient à bout des berserkers.",
          "gotoRoom": "roper_lair",
          "characterChanges": [
            {
              "id": "bjolnir",
              "toState": "injured"
            }
          ]
        },
        "intent": "Suivre la revanche du journal: Cyanwrath est tué et Bjolnir reçoit des blessures dans le combat contre les berserkers."
      },
      {
        "id": "duel-bjolnir",
        "forbiddenFlag": "cyanwrathDead",
        "label": "What If — Bjolnir tente d'obtenir un passage sans tuer",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 8,
          "skill": "leadership",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "message": "Le champion recule d’un pas: assez pour offrir une issue au groupe."
        },
        "onSuccess": {
          "setFlags": {
            "confrontationDone": true
          },
          "gotoRoom": "roper_lair"
        },
        "onFailurePost": {
          "gotoRoom": "act2_confrontation",
          "message": "Le passage reste barré. Le groupe peut tenter une autre approche ou revenir avant cette décision."
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir."
      },
      {
        "id": "repli-furtif",
        "forbiddenFlag": "cyanwrathDead",
        "label": "What If — Sislay cherche à contourner Cyanwrath",
        "characterId": "sislay",
        "skill": "stealth",
        "resolution": {
          "difficulty": 8,
          "skill": "stealth",
          "risk": "capture",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "Vous glissez hors de portée et laissez les fanatiques se quereller."
        },
        "onSuccess": {
          "setFlags": {
            "confrontationDone": true
          },
          "gotoRoom": "roper_lair"
        },
        "onFailurePost": {
          "gotoRoom": "act2_confrontation",
          "message": "Le passage reste barré. Le groupe peut tenter une autre approche ou revenir avant cette décision."
        },
        "riskText": "Un échec peut entraîner sa capture."
      },
      {
        "id": "confrontation-passee",
        "label": "Poursuivre l'exploration après la défaite de Cyanwrath",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "roper_lair",
          "setFlags": {
            "confrontationDone": true
          }
        },
        "requiresFlag": "cyanwrathDead"
      }
    ],
    "chapter": 4
  },
  "roper_lair": {
    "id": "roper_lair",
    "title": "Antre du tentaculeur",
    "description": "Une masse pierreuse s’anime: le tentaculeur tend ses vrilles dans la pénombre.",
    "objects": [
      "tentacules",
      "stalagmites",
      "ossements"
    ],
    "exits": {
      "ouest": "act2_confrontation",
      "est": "egg_chamber"
    },
    "options": [
      {
        "id": "strategie-kairon",
        "label": "Option – Bjolnir: Neutraliser les vrilles par la stratégie",
        "characterId": "bjolnir",
        "skill": "strategy",
        "resolution": {
          "difficulty": 7,
          "skill": "strategy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "message": "Le tentaculeur est pris à contre-rythme et recule."
        },
        "riskText": "Un échec peut blesser l'intervenant."
      },
      {
        "id": "force-brute-roper",
        "label": "Option – Bjolnir: Forcer le passage en force brute",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 7,
          "skill": "leadership",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": 1,
          "message": "Le combat secoue la grotte, mais une brèche s’ouvre."
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir."
      },
      {
        "id": "sacrifice-calculé",
        "label": "Sislay attire les vrilles pour couvrir la traversée du groupe",
        "characterId": "sislay",
        "skill": "stealth",
        "resolution": {
          "difficulty": 7,
          "skill": "stealth",
          "risk": "death",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "Sislay attire les vrilles loin du passage pendant que ses compagnons gagnent l’autre côté. Lorsque la créature réoriente ses attaques, elle les rejoint à couvert."
        },
        "riskText": "L'intervenant risque une blessure grave; s'il est déjà blessé, il peut mourir."
      }
    ],
    "chapter": 4
  },
  "egg_chamber": {
    "id": "egg_chamber",
    "title": "Chambre des œufs",
    "description": "Des œufs de dragon reposent au cœur d’un nid rituel, entourés de marques profanées.",
    "objects": [
      "œufs",
      "autel",
      "chaînes"
    ],
    "exits": {
      "ouest": "roper_lair"
    },
    "options": [
      {
        "id": "detruire-oeufs",
        "label": "What If — Bjolnir: Détruire les œufs",
        "forbiddenFlag": "eggsDecided",
        "characterId": "bjolnir",
        "skill": "leadership",
        "resolution": {
          "difficulty": 7,
          "skill": "leadership",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "moraleGroupe": 1,
          "chaos": 1,
          "message": "Les coquilles éclatent; un cri rituel résonne dans tout le repaire."
        },
        "onSuccess": {
          "setFlags": {
            "eggsDecided": true,
            "eggsDestroyed": true,
            "eggsStolen": false,
            "eggsLeft": false
          },
          "gotoRoom": "mondath_chamber"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Variante: briser les œufs empêche leur éclosion et affecte le moral du groupe."
      },
      {
        "id": "voler-oeufs",
        "label": "Chronique — Emporter les deux œufs noirs",
        "forbiddenFlag": "eggsDecided",
        "source": "JDR DD5 2023.xlsx — Tyranny of dragons!75:82",
        "effects": {
          "message": "Les aventuriers emportent les deux œufs noirs et les mettent à l'abri avant de poursuivre vers les appartements de Frulam Mondath. Ils les ramèneront à Verdure au terme de l'exploration."
        },
        "onSuccess": {
          "setFlags": {
            "eggsDecided": true,
            "eggsStolen": true,
            "eggsDestroyed": false,
            "eggsLeft": false
          },
          "gotoRoom": "mondath_chamber"
        },
        "intent": "Emporter les deux œufs, qui écloront sur la route d’Elturel. Le groupe devra prendre en charge les dragonnets."
      },
      {
        "id": "laisser-oeufs",
        "label": "What If — Bjolnir: Laisser les œufs",
        "forbiddenFlag": "eggsDecided",
        "characterId": "bjolnir",
        "skill": "strategy",
        "resolution": {
          "difficulty": 6,
          "skill": "strategy",
          "risk": "injury",
          "deathType": "replaceable"
        },
        "effects": {
          "chaos": -1,
          "message": "Vous mémorisez le lieu et quittez le nid sans le toucher."
        },
        "onSuccess": {
          "setFlags": {
            "eggsDecided": true,
            "eggsLeft": true,
            "eggsStolen": false,
            "eggsDestroyed": false
          },
          "gotoRoom": "mondath_chamber"
        },
        "riskText": "Un échec peut blesser l'intervenant.",
        "intent": "Variante: poursuivre sans emporter les œufs. Boule et Bill ne rejoindront pas le groupe dans ce parcours."
      },
      {
        "id": "oeufs-suite",
        "label": "Quitter la chambre et chercher Frulam Mondath",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "mondath_chamber"
        },
        "requiresFlag": "eggsDecided"
      }
    ],
    "chapter": 4
  },
  "mondath_chamber": {
    "id": "mondath_chamber",
    "title": "Les appartements de Frulam Mondath",
    "chapter": 4,
    "description": "Après la découverte des œufs, des gardes et des occultistes viennent reconnaître les tunnels. Le Clan les affronte puis emprunte un passage secret vers les appartements de Frulam Mondath. La bataille qui suit laisse plusieurs aventuriers blessés.\n\nDans les papiers de la pièce, une carte désigne les villages attaqués et une note ordonne de transporter le butin vers Naerytar. Le groupe retourne à Verdure avec ces renseignements avant de préparer le voyage demandé par Leosin.",
    "paragraphs": [
      "Après la découverte des œufs, des gardes et des occultistes viennent reconnaître les tunnels. Le Clan les affronte puis emprunte un passage secret vers les appartements de Frulam Mondath. La bataille qui suit laisse plusieurs aventuriers blessés.",
      "Dans les papiers de la pièce, une carte désigne les villages attaqués et une note ordonne de transporter le butin vers Naerytar. Le groupe retourne à Verdure avec ces renseignements avant de préparer le voyage demandé par Leosin."
    ],
    "objects": [],
    "exits": {},
    "options": [
      {
        "id": "mondath-retour",
        "label": "Rapporter à Verdure les renseignements trouvés chez Mondath",
        "repeatable": true,
        "onSuccess": {
          "gotoRoom": "hatchery_exit"
        }
      }
    ],
    "source": "Tyranny of dragons!77:83"
  },
  "hatchery_exit": {
    "id": "hatchery_exit",
    "title": "Préparer la route d'Elturel",
    "description": "Les aventuriers rentrent à Verdure après avoir fouillé les appartements de Mondath. Ils remettent à Nighthill la carte des villages visés et la note qui désigne Naerytar comme destination du butin. Le gouverneur ne connaît pas ce lieu; Leosin est déjà parti faire son rapport à Elturel. Le Clan prépare à son tour le voyage pour le retrouver.",
    "objects": [
      "issue rocheuse",
      "poursuivants",
      "falaise forestière"
    ],
    "exits": {},
    "options": [
      {
        "id": "act2-end",
        "label": "Partir pour Elturel avec le message de Leosin",
        "effects": {
          "message": "Après avoir remis à Nighthill les renseignements trouvés chez Mondath, les aventuriers préparent leurs chariots et prennent la route d’Elturel pour retrouver Leosin et Ontharr Frume."
        },
        "onSuccess": {
          "setFlags": {
            "actIICompleted": true
          },
          "setAct": "ACT_III",
          "unlockActs": [
            "ACT_III"
          ],
          "gotoRoom": "elturel_road"
        }
      }
    ],
    "chapter": 4
  }
};

