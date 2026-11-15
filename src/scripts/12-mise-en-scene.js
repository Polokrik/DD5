    const SCENE_DIRECTIONS = {
  "scenes": {
    "verdure": {
      "fires": [
        [
          141,
          102
        ],
        [
          203,
          115
        ],
        [
          224,
          95
        ],
        [
          294,
          111
        ],
        [
          180,
          125
        ]
      ],
      "dragon": true
    },
    "street": {
      "fires": [
        [
          31,
          95
        ],
        [
          284,
          95
        ],
        [
          66,
          113
        ]
      ]
    },
    "keep": {
      "fires": []
    },
    "wall": {
      "fires": [],
      "dragon": true
    },
    "tunnel": {
      "fires": [
        [
          178,
          105
        ]
      ]
    },
    "temple": {
      "fires": [
        [
          283,
          145
        ]
      ]
    },
    "mill": {
      "fires": [
        [
          166,
          144
        ]
      ]
    },
    "duel": {
      "fires": []
    },
    "cave_duel": {
      "fires": [
        [
          149,
          119
        ],
        [
          277,
          119
        ]
      ]
    }
  },
  "actions": {
    "charge-civils": {
      "kind": "advance",
      "actor": "bjolnir",
      "caption": "Le Clan rejoint les civils."
    },
    "approche-riviere": {
      "kind": "advance",
      "actor": "ellyjobell",
      "caption": "Le passage par la rivière."
    },
    "swift-diplomatie": {
      "kind": "hammer",
      "actor": "bjolnir",
      "caption": "Bjolnir obtient la reddition des survivants."
    },
    "swift-magie": {
      "kind": "magic",
      "actor": "darrin",
      "caption": "Darrin disperse les assaillants."
    },
    "swift-force": {
      "kind": "clash",
      "actor": "drekthar",
      "caption": "Drek’Thar ouvre le passage."
    },
    "tunnel-temple": {
      "kind": "door",
      "actor": "darrin",
      "caption": "Le chemin vers la rivière est dégagé."
    },
    "temple-evacuation": {
      "kind": "fog",
      "actor": "ellyjobell",
      "caption": "Le brouillard couvre la sortie des habitants."
    },
    "sanctuaire-tunnel": {
      "kind": "advance",
      "actor": "sislay",
      "caption": "Un passage est ouvert pour les occupants."
    },
    "sanctuaire-assaut": {
      "kind": "clash",
      "actor": "bjolnir",
      "caption": "La diversion éloigne les assaillants."
    },
    "moulin-furtif": {
      "kind": "advance",
      "actor": "ellyjobell",
      "caption": "Les guetteurs du moulin sont surpris."
    },
    "moulin-assaut": {
      "kind": "clash",
      "actor": "drekthar",
      "caption": "Le moulin est dégagé."
    },
    "dragon-defendre": {
      "kind": "dragon",
      "actor": "bjolnir",
      "caption": "Les défenseurs repoussent le dragon."
    },
    "duel-campagne": {
      "kind": "duel",
      "actor": "drekthar",
      "caption": "Les compagnons récupèrent Drek’Thar vivant.",
      "fallen": "hero"
    },
    "duel-accept": {
      "kind": "duel",
      "actor": "drekthar",
      "caption": "Le duel décide du sort des otages.",
      "fallen": "enemy"
    },
    "duel-refus": {
      "kind": "retreat",
      "caption": "Le Clan renonce au duel."
    },
    "revanche-drekthar": {
      "kind": "duel",
      "actor": "drekthar",
      "caption": "Drek’Thar a remporté sa revanche. Le Clan peut poursuivre.",
      "fallen": "enemy"
    }
  }
};

    const ACTION_NARRATION = {
  "swift-diplomatie": {
    "successTitle": "Les kobolds déposent leurs armes",
    "success": [
      "Après les premiers échanges de coups, Bjolnir avance entre les kobolds et la famille. Le paladin abat son marteau contre le sol pour attirer leurs regards, puis élève la voix: « Assez! Déposez vos armes. » Ses compagnons tiennent le passage pendant qu’il leur laisse le temps de comprendre qu’une reddition leur permettra de quitter le combat vivants.",
      "Les survivants hésitent, regardent leurs adversaires, puis finissent par renoncer. Bjolnir les laisse s’écarter et fait signe à Linan de rassembler sa famille. Le Clan peut reprendre la marche vers la forteresse avec les personnes qu’il vient de secourir."
    ],
    "failureTitle": "La reddition n’est pas obtenue",
    "failure": [
      "Bjolnir s’avance pour faire cesser le combat, mais les kobolds ne lâchent pas leurs armes. Le paladin doit encaisser leur riposte tandis que ses compagnons dégagent un passage pour Linan et les siens.",
      "La famille parvient à suivre le Clan jusqu’à la forteresse. L’évacuation a réussi au prix d’une blessure pour Bjolnir; les assaillants n’ont pas été convaincus de se rendre."
    ]
  },
  "charge-civils": {
    "successTitle": "Le Clan rejoint les premiers habitants",
    "success": [
      "Bjolnir et Drek’Thar dévalent les derniers pas qui les séparent des rues, suivis de leurs compagnons. Leur intervention ouvre une trouée parmi les assaillants et permet aux civils les plus proches de se replier derrière eux.",
      "Un autre groupe de kobolds retient encore une famille près d’une maison. Les aventuriers se dirigent vers elle avant de chercher à gagner la forteresse."
    ],
    "failureTitle": "L’entrée dans la ville se paie de blessures",
    "failure": [
      "Bjolnir et Drek’Thar s’élancent vers les premières maisons avec leurs compagnons, mais les assaillants les attendent au débouché de la rue. Le paladin reçoit des coups avant que le groupe parvienne à dégager un passage pour les habitants.",
      "La compagnie a rejoint la ville et peut avancer avec les civils. Une famille reste encerclée un peu plus loin; les aventuriers doivent encore la secourir pour gagner la forteresse."
    ]
  },
  "temple-evacuation": {
    "successTitle": "Les occupants du temple atteignent le tunnel",
    "success": [
      "Une illusion détourne les pillards qui préparaient l’incendie de la porte sud. Profitant de ce répit, Bjolnir persuade le prêtre et les paysans de quitter le bâtiment. Ellyjobell étend une nappe de brouillard pour dissimuler leur sortie et couvrir le passage du groupe.",
      "Les aventuriers ramènent tous les occupants à la forteresse par le chemin qu’ils ont reconnu. Les défenseurs peuvent accueillir ces nouveaux réfugiés, mais un garde vient déjà les avertir de la menace qui pèse sur le moulin."
    ]
  },
  "moulin-assaut": {
    "successTitle": "Les pillards sont repoussés du moulin",
    "success": [
      "Drek’Thar engage les assaillants pendant que le reste du Clan prend part au combat autour du bâtiment. L’embuscade est déjouée et les pillards sont repoussés avant de pouvoir détruire les réserves.",
      "Le moulin est sécurisé. Le groupe regagne la forteresse, où les défenseurs doivent bientôt faire face au retour du dragon."
    ],
    "failureTitle": "L’assaut ne suffit pas à sécuriser le moulin",
    "failure": [
      "Drek’Thar engage les pillards, mais ceux-ci résistent et le blessent. Le reste du Clan doit le dégager avant de se retrouver enfermé dans leur embuscade.",
      "Le groupe regagne la forteresse pour se réorganiser. Le moulin reste menacé et ne compte pas parmi les objectifs accomplis; une nouvelle approche demeure possible."
    ]
  },
  "duel-campagne": {
    "successTitle": "Drek’Thar survit au duel",
    "success": [
      "Drek’Thar s’avance pour affronter Langdedrosa Cyanwrath sous les regards des prisonniers et de ses compagnons. Le guerrier tient tête au demi-dragon, mais les coups de son adversaire finissent par l’emporter et le laissent à terre.",
      "Cyanwrath libère les otages. Les compagnons de Drek’Thar peuvent le récupérer vivant, blessé par l’affrontement, puis regagner la forteresse avec les rescapés."
    ]
  },
  "revanche-drekthar": {
    "successTitle": "Cyanwrath tombe dans la grotte",
    "success": [
      "Drek’Thar réclame sa revanche pendant que le reste du groupe affronte les deux berserkers. Bjolnir est assommé au cours du combat; le guerrier poursuit son duel et finit par décapiter Langdedrosa Cyanwrath.",
      "Il se retourne aussitôt pour aider ses compagnons à venir à bout des berserkers. Le passage est dégagé et le Clan peut poursuivre son exploration vers les gardiens des œufs."
    ]
  },
  "approche-riviere": {
    "successTitle": "La rivière permet de gagner les rues",
    "success": [
      "Ellyjobell guide ses compagnons le long de la rivière, où les berges les dissimulent aux regards des pillards. Le groupe laisse passer les silhouettes qui parcourent les rues avant de quitter son couvert.",
      "Les aventuriers atteignent les maisons sans attirer une nouvelle troupe à leur poursuite. Des cris leur signalent une famille retenue par des kobolds, qu’ils doivent encore dégager du passage vers la forteresse."
    ],
    "failureTitle": "Les pillards repèrent le passage",
    "failure": [
      "Une torche se tourne vers la berge au moment où Ellyjobell cherche à faire avancer ses compagnons. Les assaillants donnent l’alerte et la blessent avant que le Clan parvienne à rompre le contact.",
      "Le groupe gagne néanmoins les premières rues avec les civils. L’approche discrète a échoué et les pillards sont prévenus de sa présence; une famille encerclée demande encore son aide."
    ]
  },
  "swift-magie": {
    "successTitle": "Darrin ouvre une brèche dans l’encerclement",
    "success": [
      "Darrin prépare son sort tandis que Bjolnir et Drek’Thar retiennent les kobolds loin de la famille. La décharge frappe la ligne des assaillants et les force à s’écarter, donnant aux aventuriers le passage qu’ils cherchaient.",
      "Le Clan se rassemble autour de Linan et des siens, puis les accompagne jusqu’à la forteresse. La famille est sauvée par la magie."
    ],
    "failureTitle": "Le sort complique l’évacuation",
    "failure": [
      "Darrin tente de disperser les kobolds, mais son sort se propage mal dans l’espace étroit de la rue. L’ensorceleur est blessé et le désordre donne aux assaillants le temps de se rapprocher.",
      "Ses compagnons interviennent pour couvrir la famille et lui ouvrir un passage. Linan et les siens parviennent à la forteresse avec le Clan; le groupe doit désormais compter avec la blessure de Darrin et une alerte accrue."
    ]
  },
  "swift-force": {
    "successTitle": "Drek’Thar dégage le passage",
    "success": [
      "Drek’Thar s’interpose entre la famille et les kobolds, puis engage ceux qui lui barrent la route. Ses compagnons profitent de la pression qu’il exerce pour se rapprocher de Linan et former une escorte autour des siens.",
      "Lorsque le passage est suffisamment dégagé, le guerrier rejoint le repli du groupe vers la forteresse. La famille est sauvée par la force des armes."
    ],
    "failureTitle": "Drek’Thar couvre un repli difficile",
    "failure": [
      "Les kobolds résistent à l’attaque de Drek’Thar et le blessent avant qu’il puisse rompre leur ligne. Ses compagnons entrent à leur tour dans le combat pour empêcher les assaillants de rejoindre la famille.",
      "Linan et les siens finissent par être dégagés et gagnent la forteresse avec le Clan. Les compagnons doivent s’occuper des blessures de Drek’Thar et tenir compte de son état avant de le solliciter de nouveau."
    ]
  },
  "sanctuaire-tunnel": {
    "successTitle": "Une sortie discrète est ouverte",
    "success": [
      "Sislay examine les abords et s’approche d’un accès en profitant des déplacements des pillards. Elle parvient à ouvrir un passage sans entraîner la troupe qui surveille la porte principale.",
      "Ses compagnons conduisent les occupants hors du bâtiment, puis les ramènent à la forteresse. Le temple est évacué."
    ],
    "failureTitle": "La sortie ne peut pas être dégagée",
    "failure": [
      "Sislay est repérée avant d’avoir pu rendre le passage praticable. Blessée dans la tentative, elle doit rejoindre ses compagnons et abandonner cette approche.",
      "Le Clan revient à la forteresse pour se réorganiser. Les occupants attendent toujours dans le temple; le sauvetage reste disponible et peut être repris autrement."
    ]
  },
  "sanctuaire-assaut": {
    "successTitle": "La diversion éloigne les assaillants",
    "success": [
      "Bjolnir engage les pillards qui menacent la porte et les contraint à se tourner vers lui. Ses compagnons profitent de cette diversion pour rejoindre le prêtre et les habitants enfermés dans le bâtiment.",
      "Le groupe rassemble les occupants et les ramène derrière les remparts. L’attaque de diversion a permis d’évacuer le temple."
    ],
    "failureTitle": "Les pillards conservent leurs positions",
    "failure": [
      "Bjolnir tente d’attirer les assaillants loin du temple, mais leur ligne tient et sa tentative lui coûte des blessures. Le groupe doit couvrir son repli sans avoir pu rejoindre les occupants.",
      "Les aventuriers reviennent à la forteresse. Le sauvetage n’est pas accompli; ils peuvent repartir vers le temple avec une autre approche ou revenir avant cette décision."
    ]
  },
  "moulin-furtif": {
    "successTitle": "L’embuscade est déjouée",
    "success": [
      "Ellyjobell observe les abords du moulin et repère les guetteurs avant que les aventuriers s’engagent entre les bâtiments. Prévenus, ses compagnons se déploient pour surprendre les pillards qui comptaient les prendre au piège.",
      "Le combat permet de sécuriser le moulin et ses réserves. Les aventuriers regagnent la forteresse, où la menace du dragon les rappelle bientôt auprès des défenseurs."
    ],
    "failureTitle": "Les guetteurs prennent l’avantage",
    "failure": [
      "Ellyjobell est repérée pendant sa reconnaissance. Les guetteurs donnent l’alerte et la blessent avant que ses compagnons puissent lui assurer un repli.",
      "La compagnie revient derrière les remparts sans avoir sécurisé le moulin. Les pillards le menacent toujours: le groupe doit préparer une nouvelle intervention ou revenir avant cette tentative."
    ]
  },
  "camp-liberation": {
    "successTitle": "Leosin et les captifs quittent le camp",
    "success": [
      "La diversion occupe les gardes pendant que Darrin et Drek’Thar progressent parmi les tentes. Ellyjobell avance à couvert dans les buissons pour soutenir leur intervention. Le groupe rejoint les captifs et leur ouvre un chemin de fuite.",
      "Leosin et les autres prisonniers sont ramenés vers Verdure. Le moine explique qu’il s’était laissé capturer pour enquêter sur le Culte; sa libération met fin à cette observation, mais lui permet de transmettre ce qu’il a appris."
    ]
  },
  "dragon-defendre": {
    "successTitle": "Le dragon abandonne son assaut",
    "success": [
      "Le Clan rejoint les gardes sur les remparts et concentre ses attaques contre le dragon. Les défenseurs tiennent leurs positions pendant que les aventuriers unissent leurs efforts pour contraindre la créature à s’éloigner.",
      "L’assaut est repoussé et la forteresse demeure aux mains de ses défenseurs. Le répit permet de s’occuper des blessés avant qu’au matin Cyanwrath ne se présente avec ses otages."
    ]
  },
  "plan-sabotage": {
    "successTitle": "Le groupe se dirige vers les composants du rituel",
    "success": [
      "Les aventuriers choisissent de frapper les moyens qui alimentent l’invocation. Ils devront reconnaître les composants essentiels dans les lignes de ravitaillement, puis franchir leurs protections pour atteindre le relais.",
      "Dans cette bataille hypothétique, le sabotage affaiblit le dispositif ennemi avant l’affrontement final. Des erreurs pendant l’approche laisseront cependant le rituel progresser."
    ]
  },
  "plan-decapitation": {
    "successTitle": "La troupe cherche le commandement du Culte",
    "success": [
      "Le Clan rassemble ses appuis pour percer jusqu’à la tente de commandement. Neutraliser le lieutenant doit désorganiser les troupes qui protègent le rituel et faciliter l’avance des alliés.",
      "Le groupe s’engage dans une confrontation directe. Cette variante expose ses combattants aux coups et ne prévoit pas de détour préalable pour évacuer les civils."
    ]
  },
  "plan-evacuation": {
    "successTitle": "Le Clan donne la priorité aux réfugiés",
    "success": [
      "Le groupe se porte vers les civils pour dégager un passage hors des rues menacées. Les alliés affectés à cette protection devront tenir les assaillants à distance pendant que les réfugiés se rassemblent.",
      "Ce choix diminue leur exposition immédiate, mais mobilise des forces qui manqueront devant le cercle. Le rituel continuera de progresser pendant l’évacuation."
    ]
  },
  "evacuation-save-more": {
    "successTitle": "Les alliés prolongent l’évacuation",
    "success": [
      "Les aventuriers maintiennent le passage ouvert pour laisser sortir d’autres réfugiés. Une partie des combattants reste avec eux afin de protéger les derniers groupes contre les assaillants.",
      "Davantage de civils sont mis à l’abri, tandis que l’assaut contre le cercle perd des renforts et du temps. Le Clan doit maintenant rejoindre le rituel, dont la progression s’est accélérée."
    ]
  },
  "evacuation-secure-objective": {
    "successTitle": "Le groupe se reporte sur le cercle",
    "success": [
      "Le Clan quitte le passage des réfugiés pour concentrer ses forces sur le rituel. Les combattants rejoignent l’assaut et gênent les cultistes avant qu’ils puissent mener leurs préparatifs à leur terme.",
      "Cette intervention ralentit le cercle, mais les civils encore dans les rues disposent de moins de protection. Le danger qui pèse sur eux augmentera dans le bilan de cette variante."
    ]
  },
  "voler-oeufs": {
    "successTitle": "Le Clan emporte les deux œufs noirs",
    "success": [
      "Les gardiens vaincus, les aventuriers s’approchent des œufs de dragon noir et en récupèrent deux. Ils les protègent pour pouvoir les transporter hors de la grotte, en veillant à ne pas briser les coquilles.",
      "Le groupe doit encore examiner les appartements de Frulam Mondath avant de rentrer à Verdure. Les œufs seront ensuite chargés sur des chariots pour le voyage; leur naissance fera de Bjolnir le parent adoptif de Boule et Bill, comme dans le récit de la campagne."
    ]
  },
  "tunnel-temple": {
    "successTitle": "Le passage vers la rivière est dégagé",
    "success": [
      "Ellyjobell s’adresse aux rats qui encombrent le tunnel et accompagne ses paroles d’une illusion. Les bêtes finissent par s’écarter, laissant aux aventuriers la place de poursuivre sans avoir à les combattre. Le Clan avance alors jusqu’à la porte rouillée qui ferme l’autre extrémité du passage.",
      "Darrin vient à bout de la porte et l’ouvre pour ses compagnons. Le groupe rejoint la rivière, puis gagne les abords du temple. Les pillards y occupent encore les accès; la compagnie doit maintenant reconnaître leurs positions et préparer la sortie des habitants."
    ],
    "source": "JDR DD5 2023.xlsx — Tyranny of dragons!A24:A26"
  },
  "duel-accept": {
    "successTitle": "Drek’Thar abat Cyanwrath",
    "success": [
      "Drek’Thar engage le duel et soutient les attaques du demi-dragon sans lui laisser imposer le combat. Le guerrier profite des ouvertures qui se présentent pour riposter, jusqu’à porter les coups qui font tomber Cyanwrath. Son adversaire ne se relève pas.",
      "Les otages sont libérés et rejoignent les défenseurs de la forteresse. Drek’Thar revient auprès du Clan, vainqueur d’un affrontement qui se terminait autrement dans la campagne. Cyanwrath est mort à Verdure; le groupe ne pourra pas le retrouver vivant dans la grotte des pillards."
    ],
    "failureTitle": "Drek’Thar tombe sous les coups de Cyanwrath",
    "failure": [
      "Drek’Thar tente de prendre l’avantage sur le demi-dragon, mais Cyanwrath reprend l’initiative et finit par le jeter à terre. Le guerrier ne peut plus poursuivre le duel. Ses compagnons attendent que l’affrontement soit terminé pour venir le dégager.",
      "Cyanwrath ordonne la libération des otages. Le Clan ramène Drek’Thar vivant et blessé derrière les remparts, avec ceux pour lesquels il s’était avancé. Le groupe devra tenir compte de son état avant de l’exposer à un nouveau combat."
    ],
    "failureByState": {
      "dead": {
        "title": "Drek’Thar ne survit pas au duel",
        "paragraphs": [
          "Déjà blessé, Drek’Thar s’avance néanmoins contre Cyanwrath. Le guerrier tente de lui tenir tête, mais les coups du demi-dragon aggravent ses blessures jusqu’à l’abattre. Lorsque ses compagnons peuvent enfin le rejoindre, il est mort.",
          "Cyanwrath ordonne la libération des otages, que le Clan reconduit à la forteresse. Cette variante a coûté la vie à Drek’Thar: il ne pourra plus participer aux décisions suivantes. Le retour au checkpoint permet de reprendre avant le choix qui l’a exposé à ce risque mortel."
        ]
      }
    },
    "source": "What If du jeu, non attesté: respecter le résultat effectif des états, duelDone et cyanwrathDead. Ne sélectionner death que si characters.drekthar.state === 'dead'."
  }
};

