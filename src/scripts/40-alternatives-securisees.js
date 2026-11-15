    const DATA = {
      acts,
      rooms,
      actRooms: {
        ACT_I: ['hill_overlook', 'swift_street', 'greenest_keep', 'old_tunnel', 'mill_approach', 'sanctuary_approach', 'dragon_assault', 'duel_field'],
        ACT_II: Object.keys(ACT_II_ROOMS),
        ACT_III: ['elturel_road', 'elturel_tournament', 'northern_road', 'carnath_roadhouse', 'naerytar_swamp', 'castle_naerytar', 'portal_chamber', 'hunting_lodge', 'skyreach_castle', 'skyreach_chronicle', 'skyreach_command', 'skyreach_cultists', 'skyreach_dragon', 'act3_epilogue'],
        ACT_IV: ['waterdeep_council_hall', 'council_defense_floor', 'council_strategy_floor', 'diderius_chronicle', 'ice_sea_chronicle', 'iceberg_rebellion', 'second_council', 'metallic_dragon_audience', 'misty_forest_chronicle', 'neronvein_chronicle', 'neronvein_battle', 'thay_invitation', 'council_resolution', 'campaign_frontier'],
        ACT_V: ['war_council_tent', 'battle_plan_selection', 'supply_lines', 'warded_corridor', 'ritual_components', 'commander_tent', 'champion_confrontation', 'refugee_corridor', 'burning_streets_finale', 'ritual_chamber', 'campaign_end']
      },
      rosterTimeline: ROSTER_TIMELINE,
      scenes: {
        GREENEST_SIEGE: {
          onEnter: () => {},
          onExit: () => {},
          onTurn: () => {}
        }
      },
      characters,
      globalVariables: {
        flags,
        variables
      }
    };

    // Voies de secours What If: les deux issues avancent, le dé fixe le coût.
    const SAFE_ALTERNATIVES = [
  {
    "roomId": "mill_approach",
    "option": {
      "id": "moulin-garde-groupe",
      "label": "What If — Organiser une intervention avec les gardes pour sécuriser le moulin",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "persuasion",
      "resolution": {
        "difficulty": 12,
        "skill": "persuasion",
        "ability": "charisma",
        "risk": "cost",
        "dc": 12
      },
      "failForward": true,
      "intent": "Le groupe s’appuie sur les défenseurs pour protéger les réserves. Réussite: alerte +1. Échec: moulin sauvé tout de même, alerte +2 et moral -1.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "greenest_keep",
        "setFlags": {
          "moulinDone": true,
          "millSaved": true
        },
        "variableDelta": {
          "chaos": 1
        },
        "message": "Les compagnons coordonnent l’intervention avec les gardes. Les défenseurs tiennent les abords pendant que les pillards sont repoussés. Le moulin et ses réserves sont sécurisés, mais cette mobilisation donne l’alerte dans le quartier."
      },
      "onFailure": {
        "gotoRoom": "greenest_keep",
        "setFlags": {
          "moulinDone": true,
          "millSaved": true
        },
        "variableDelta": {
          "chaos": 2,
          "moraleGroupe": -1
        },
        "message": "La coordination est plus lente que prévu et les gardes doivent tenir le passage plus longtemps. Le Clan finit par sécuriser le moulin et ses réserves; les ordres criés augmentent l’alerte et l’effort éprouve le moral du groupe."
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "cha",
        "skillKey": "persuasion",
        "kind": "ability",
        "label": "Persuasion",
        "dc": 12
      }
    }
  },
  {
    "roomId": "sanctuary_approach",
    "option": {
      "id": "temple-garde-groupe",
      "label": "What If — Couvrir ensemble l’évacuation avec l’aide des défenseurs",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "persuasion",
      "resolution": {
        "difficulty": 12,
        "skill": "persuasion",
        "ability": "charisma",
        "risk": "cost",
        "dc": 12
      },
      "failForward": true,
      "intent": "Autre sauvetage possible, distinct du brouillard rapporté dans le journal. Réussite: alerte +1. Échec: habitants évacués malgré tout, alerte +2 et moral -1.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "greenest_keep",
        "setFlags": {
          "sanctuaireDone": true,
          "templeEvacuated": true
        },
        "variableDelta": {
          "chaos": 1
        },
        "message": "Le groupe organise avec les défenseurs une sortie couverte. Les habitants quittent le temple pendant que leurs protecteurs retiennent les pillards, puis rejoignent la forteresse. Leur déplacement attire l’attention des assaillants."
      },
      "onFailure": {
        "gotoRoom": "greenest_keep",
        "setFlags": {
          "sanctuaireDone": true,
          "templeEvacuated": true
        },
        "variableDelta": {
          "chaos": 2,
          "moraleGroupe": -1
        },
        "message": "Les pillards réagissent avant que la sortie soit entièrement dégagée. Les compagnons et les défenseurs prolongent leur couverture jusqu’au passage des derniers habitants. Tous rejoignent la forteresse, au prix d’une alerte accrue et d’un moral éprouvé."
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "cha",
        "skillKey": "persuasion",
        "kind": "ability",
        "label": "Persuasion",
        "dc": 12
      }
    }
  },
  {
    "roomId": "act2_confrontation",
    "option": {
      "id": "cyanwrath-diversion-groupe",
      "label": "What If — Attirer les gardes à l’écart et contourner leur salle ensemble",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "deception",
      "resolution": {
        "difficulty": 13,
        "skill": "deception",
        "ability": "charisma",
        "risk": "cost",
        "dc": 13
      },
      "failForward": true,
      "intent": "Contourner l’affrontement laisse Cyanwrath vivant. Réussite: alerte +1. Échec: détour plus difficile mais passage obtenu, alerte +2 et moral -1.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "roper_lair",
        "setFlags": {
          "confrontationDone": true
        },
        "variableDelta": {
          "chaos": 1
        },
        "message": "Le groupe attire l’attention des gardes vers une autre partie de la salle et profite de leur déplacement pour passer. Cyanwrath demeure vivant derrière lui; le Clan peut poursuivre l’exploration, désormais attendu par les occupants de la grotte."
      },
      "onFailure": {
        "gotoRoom": "roper_lair",
        "setFlags": {
          "confrontationDone": true
        },
        "variableDelta": {
          "chaos": 2,
          "moraleGroupe": -1
        },
        "message": "La diversion est remarquée et les adversaires cherchent à refermer le passage. Les compagnons doivent céder du terrain avant de trouver leur détour. Ils finissent par gagner la salle suivante, avec une alerte accrue et le moral éprouvé; Cyanwrath n’a pas été tué."
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "forbiddenFlag": "cyanwrathDead",
      "check": {
        "ability": "cha",
        "skillKey": "deception",
        "kind": "ability",
        "label": "Tromperie",
        "dc": 13
      }
    }
  },
  {
    "roomId": "roper_lair",
    "option": {
      "id": "roper-contournement-groupe",
      "label": "What If — Contenir les vrilles pendant que le groupe contourne l’enclos",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "athletics",
      "resolution": {
        "difficulty": 13,
        "skill": "athletics",
        "ability": "strength",
        "risk": "cost",
        "dc": 13
      },
      "failForward": true,
      "intent": "Une traversée collective remplace le duel avec la créature. Réussite: alerte +1. Échec: traversée obtenue après un long détour, alerte +2 et moral -1.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "egg_chamber",
        "setFlags": {},
        "variableDelta": {
          "chaos": 1
        },
        "message": "Les compagnons soutiennent leur progression et retiennent les vrilles le temps que chacun trouve un passage. Ils rejoignent la chambre voisine sans avoir à vaincre le tentaculeur. Le bruit de leur traversée résonne dans la grotte."
      },
      "onFailure": {
        "gotoRoom": "egg_chamber",
        "setFlags": {},
        "variableDelta": {
          "chaos": 2,
          "moraleGroupe": -1
        },
        "message": "Les vrilles obligent les compagnons à abandonner leur premier passage et à longer plus lentement l’enclos. Ils parviennent finalement à gagner la chambre des œufs. Le temps et les efforts dépensés augmentent l’alerte et éprouvent le moral du groupe."
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "str",
        "skillKey": "athletics",
        "kind": "ability",
        "label": "Athlétisme",
        "dc": 13
      }
    }
  },
  {
    "roomId": "supply_lines",
    "option": {
      "id": "sabotage-convoi-groupe",
      "label": "What If — Confier la reconnaissance du convoi au groupe et à ses alliés",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "investigation",
      "resolution": {
        "difficulty": 13,
        "skill": "investigation",
        "ability": "intelligence",
        "risk": "cost",
        "dc": 13
      },
      "failForward": true,
      "intent": "Utiliser des alliés pour poursuivre même sans Kairon. Réussite: rituel +1, force alliée -1. Échec: rituel +2, force alliée -1, chaos du front +1.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "warded_corridor",
        "setFlags": {
          "sabotageKeyKnown": true
        },
        "variableDelta": {},
        "message": "Les compagnons répartissent la recherche avec les alliés affectés au convoi. Ils reconnaissent les chargements utiles et atteignent l’accès protégé. Cette reconnaissance prend du temps et détourne des combattants du front.",
        "finalBattleDelta": {
          "ritualProgress": 1,
          "alliedStrength": -1
        }
      },
      "onFailure": {
        "gotoRoom": "warded_corridor",
        "setFlags": {
          "sabotageKeyKnown": false
        },
        "variableDelta": {},
        "message": "La recherche ne permet pas d’isoler immédiatement le bon chargement. Les alliés couvrent néanmoins l’avance du groupe jusqu’à l’accès protégé. Le retard profite au rituel et le front se désorganise pendant cette mobilisation.",
        "finalBattleDelta": {
          "ritualProgress": 2,
          "alliedStrength": -1,
          "battlefieldChaos": 1
        }
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "int",
        "skillKey": "investigation",
        "kind": "ability",
        "label": "Investigation",
        "dc": 13
      }
    }
  },
  {
    "roomId": "warded_corridor",
    "option": {
      "id": "sabotage-couloir-groupe",
      "label": "What If — Faire protéger la traversée des sceaux par les alliés",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "arcana",
      "resolution": {
        "difficulty": 13,
        "skill": "arcana",
        "ability": "intelligence",
        "risk": "cost",
        "dc": 13
      },
      "failForward": true,
      "intent": "Une traversée couverte permet d’avancer sans dépendre de Malar. Réussite: rituel +1. Échec: rituel +2 et chaos du front +1.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "ritual_components",
        "setFlags": {},
        "variableDelta": {},
        "message": "Les compagnons étudient les sceaux pendant que les alliés maintiennent les sentinelles à distance. Le groupe franchit le couloir et atteint les composants du rituel. La progression a donné aux cultistes le temps de poursuivre leur invocation.",
        "finalBattleDelta": {
          "ritualProgress": 1
        }
      },
      "onFailure": {
        "gotoRoom": "ritual_components",
        "setFlags": {},
        "variableDelta": {},
        "message": "Les sceaux réagissent au passage du groupe. Les alliés couvrent son avance malgré l’alarme, jusqu’à ce que les aventuriers atteignent les composants. Le retard et le désordre ont renforcé la pression du rituel.",
        "finalBattleDelta": {
          "ritualProgress": 2,
          "battlefieldChaos": 1
        }
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "int",
        "skillKey": "arcana",
        "kind": "ability",
        "label": "Arcanes",
        "dc": 13
      }
    }
  },
  {
    "roomId": "ritual_components",
    "option": {
      "id": "sabotage-relais-groupe",
      "label": "What If — Faire briser un relais par une attaque concertée",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "arcana",
      "resolution": {
        "difficulty": 14,
        "skill": "arcana",
        "ability": "intelligence",
        "risk": "cost",
        "dc": 14
      },
      "failForward": true,
      "intent": "Tentative collective sans dépendre de Darrin. Réussite: sabotage accompli, rituel -1 et force alliée -1. Échec: sabotage manqué, rituel +2 et force alliée -1; le groupe rejoint quand même le cercle.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "ritual_chamber",
        "setFlags": {
          "sabotageSuccess": true
        },
        "variableDelta": {},
        "message": "L’attaque concertée atteint un relais essentiel. Les compagnons et leurs alliés le brisent avant de rejoindre la chambre du rituel. Une partie des forces a été mobilisée loin du front, mais le sabotage ralentit l’invocation.",
        "finalBattleDelta": {
          "ritualProgress": -1,
          "alliedStrength": -1
        }
      },
      "onFailure": {
        "gotoRoom": "ritual_chamber",
        "setFlags": {
          "sabotageSuccess": false
        },
        "variableDelta": {},
        "message": "Les compagnons frappent un relais qui ne suffit pas à désorganiser l’invocation. Les alliés couvrent leur retrait vers la chambre du rituel. Le sabotage n’est pas accompli; il a coûté du temps et une partie des forces disponibles.",
        "finalBattleDelta": {
          "ritualProgress": 2,
          "alliedStrength": -1
        }
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "int",
        "skillKey": "arcana",
        "kind": "ability",
        "label": "Arcanes",
        "dc": 14
      }
    }
  },
  {
    "roomId": "commander_tent",
    "option": {
      "id": "commandement-percee-groupe",
      "label": "What If — Rallier les alliés pour ouvrir l’accès au commandement",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "persuasion",
      "resolution": {
        "difficulty": 13,
        "skill": "persuasion",
        "ability": "charisma",
        "risk": "cost",
        "dc": 13
      },
      "failForward": true,
      "intent": "Ouvrir l’accès ensemble sans dépendre de Bjolnir. Réussite: rituel +1 et force alliée -1. Échec: rituel +2, force alliée -1, chaos du front +1.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "champion_confrontation",
        "setFlags": {},
        "variableDelta": {},
        "message": "Les compagnons réunissent les alliés nécessaires pour ouvrir une brèche jusqu’à la tente du commandement. Le groupe atteint le champion, tandis que les combattants mobilisés manquent à leur position initiale.",
        "finalBattleDelta": {
          "ritualProgress": 1,
          "alliedStrength": -1
        }
      },
      "onFailure": {
        "gotoRoom": "champion_confrontation",
        "setFlags": {},
        "variableDelta": {},
        "message": "Les lignes ennemies résistent et les alliés doivent prolonger leur effort pour maintenir un passage. Les aventuriers atteignent le champion après ce retard, au prix d’un front plus dispersé et d’un rituel avancé.",
        "finalBattleDelta": {
          "ritualProgress": 2,
          "alliedStrength": -1,
          "battlefieldChaos": 1
        }
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "cha",
        "skillKey": "persuasion",
        "kind": "ability",
        "label": "Persuasion",
        "dc": 13
      }
    }
  },
  {
    "roomId": "champion_confrontation",
    "option": {
      "id": "commandement-fixer-groupe",
      "label": "What If — Fixer le lieutenant pendant qu’une attaque alliée le déborde",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "intimidation",
      "resolution": {
        "difficulty": 14,
        "skill": "intimidation",
        "ability": "charisma",
        "risk": "cost",
        "dc": 14
      },
      "failForward": true,
      "intent": "Une manœuvre collective remplace l’action de Kairon. Réussite: lieutenant neutralisé, élan cultiste -1, force alliée -1. Échec: lieutenant vivant, rituel +2, force alliée -1, chaos du front +1; le groupe gagne le cercle.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "ritual_chamber",
        "setFlags": {
          "lieutenantDefeated": true
        },
        "variableDelta": {},
        "message": "Les compagnons retiennent le lieutenant pendant que les alliés attaquent son flanc. La manœuvre le neutralise et désorganise une partie des troupes du Culte. Le Clan gagne ensuite la chambre du rituel avec moins de combattants disponibles sur le front.",
        "finalBattleDelta": {
          "cultMomentum": -1,
          "alliedStrength": -1
        }
      },
      "onFailure": {
        "gotoRoom": "ritual_chamber",
        "setFlags": {
          "lieutenantDefeated": false
        },
        "variableDelta": {},
        "message": "Le lieutenant se dégage de la manœuvre et conserve son commandement. Les alliés protègent néanmoins le passage du groupe vers la chambre du rituel. Cette tentative manquée laisse l’ennemi actif et lui a donné du temps.",
        "finalBattleDelta": {
          "ritualProgress": 2,
          "alliedStrength": -1,
          "battlefieldChaos": 1
        }
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "cha",
        "skillKey": "intimidation",
        "kind": "ability",
        "label": "Intimidation",
        "dc": 14
      }
    }
  },
  {
    "roomId": "refugee_corridor",
    "option": {
      "id": "evacuation-entraide-groupe",
      "label": "What If — Répartir la protection et le transport des réfugiés entre les alliés",
      "groupAction": true,
      "requiresAnyAvailableCharacter": true,
      "skill": "survival",
      "resolution": {
        "difficulty": 12,
        "skill": "survival",
        "ability": "wisdom",
        "risk": "cost",
        "dc": 12
      },
      "failForward": true,
      "intent": "Poursuivre l’évacuation sans dépendre de Bjolnir. Réussite: danger civil -1 et rituel +1. Échec: danger civil +1 et rituel +2; une sortie est atteinte et le choix de priorité reste à faire.",
      "riskText": "Cette approche permet de poursuivre dans les deux cas. Le D20 détermine le coût annoncé; aucun compagnon n’est blessé ou tué par ce choix.",
      "onSuccess": {
        "gotoRoom": "burning_streets_finale",
        "setFlags": {},
        "variableDelta": {},
        "message": "Les compagnons répartissent les habitants entre les groupes chargés de les guider et de les protéger. Une sortie est atteinte sans nouvelle cohue. Le rituel continue cependant de progresser pendant l’évacuation.",
        "finalBattleDelta": {
          "civilianRisk": -1,
          "ritualProgress": 1
        }
      },
      "onFailure": {
        "gotoRoom": "burning_streets_finale",
        "setFlags": {},
        "variableDelta": {},
        "message": "La foule se désorganise et ralentit les protecteurs. Les compagnons maintiennent malgré tout une sortie, mais les civils restent davantage exposés et le rituel a avancé. Le groupe doit maintenant choisir entre prolonger leur protection et rejoindre immédiatement le cercle.",
        "finalBattleDelta": {
          "civilianRisk": 1,
          "ritualProgress": 2
        }
      },
      "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée.",
      "check": {
        "ability": "wis",
        "skillKey": "survival",
        "kind": "ability",
        "label": "Survie",
        "dc": 12
      }
    }
  }
];
    SAFE_ALTERNATIVES.forEach(({roomId,option}) => rooms[roomId].options.push(option));

