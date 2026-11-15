    // Approches supplémentaires confiées à d'autres compagnons : une blessure ou une capture ne doit pas
    // laisser une seule porte ouverte. Ce sont des variantes de jeu; elles n'ajoutent aucun fait à la chronique.
    const EXTRA_APPROACHES = [
      { roomId: 'cult_trail', option: {
        id: 'piste-betes', label: 'Option – Ellyjobell: Interroger les bêtes du sentier sur la colonne',
        characterId: 'ellyjobell', skill: 'nature',
        resolution: { difficulty: 2, skill: 'nature', risk: 'cost', deathType: 'replaceable' },
        onFailure: { variableDelta: { chaos: 1 }, message: 'Les bêtes s’égaillent à l’approche d’Ellyjobell et leur envol signale la présence du groupe.' },
        effects: { chaos: -1, message: 'Les bêtes ne disent pas tout, mais Ellyjobell comprend par où la colonne est passée et comment la suivre à distance sans éveiller les sentinelles.' },
        intent: 'Ellyjobell se fie aux oiseaux et aux renards du sentier pour reconstituer le trajet de la colonne. Réussite: la piste se précise sans alerter le Culte. Échec: les bêtes s’enfuient et l’alerte monte, sans blessure.',
        riskText: 'Approche prudente : un échec augmente seulement l’alerte.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'cult_trail', option: {
        id: 'suivre-a-distance', label: 'Option – Sislay: Suivre la piste à distance',
        characterId: 'sislay', skill: 'tracking',
        resolution: { difficulty: 3, skill: 'tracking', risk: 'cost', deathType: 'replaceable' },
        effects: { chaos: -1, message: 'Sislay garde la colonne à la limite de la vue, note les fumées du camp au sud et ramène le groupe sans quitter le couvert.' },
        onFailure: { variableDelta: { chaos: 1 }, message: 'Sislay perd la trace un moment. Le groupe rattrape son retard en hâte et fait assez de bruit pour que des pillards se retournent.' },
        intent: 'Sislay suit les traces sans se montrer, loin derrière la colonne. Réussite: le groupe approche du camp sans éveiller de soupçon. Échec: la piste est perdue un moment et l’alerte monte, sans que personne soit blessé ni capturé.',
        riskText: 'Approche prudente : un échec augmente seulement l’alerte.',
        source: 'Variante de jeu proposée; le survivant interrogé (Tyranny of dragons!42:43) situe le camp au sud, près des falaises.' } },
      { roomId: 'cult_trail', option: {
        id: 'observer-crete', label: 'Option – Bjolnir: Observer la colonne depuis une crête',
        characterId: 'bjolnir', skill: 'strategy',
        resolution: { difficulty: 3, skill: 'strategy', risk: 'cost', deathType: 'replaceable' },
        effects: { moraleGroupe: 1, message: 'Depuis la crête, Bjolnir compte les hommes et l’ordre de marche, puis redescend avant que le soleil ne le trahisse.' },
        onFailure: { variableDelta: { chaos: 1 }, message: 'La silhouette de Bjolnir se découpe un instant sur le ciel. Personne ne donne l’alerte, mais la colonne accélère.' },
        intent: 'Bjolnir étudie la colonne depuis les hauteurs, puis rejoint ses compagnons. Réussite: le Clan sait à quoi s’attendre et son moral se renforce. Échec: il est aperçu et l’alerte monte, sans blessure.',
        riskText: 'Approche prudente : un échec augmente seulement l’alerte.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'cult_camp_exterior', option: {
        id: 'glisser-entre-rondes', label: 'Option – Sislay: Se glisser entre deux rondes',
        characterId: 'sislay', skill: 'stealth',
        resolution: { difficulty: 5, skill: 'stealth', risk: 'capture', deathType: 'replaceable' },
        effects: { chaos: -2, message: 'Entre deux passages de sentinelles, Sislay repère une brèche dans la ligne des feux et y guide le groupe.' },
        intent: 'Sislay attend le changement de garde pour trouver la brèche. Réussite: le groupe approche sans bruit et l’alerte baisse nettement. Échec: elle peut être capturée par les sentinelles. Épreuve plus difficile que les autres approches.',
        riskText: 'Un échec peut entraîner sa capture.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'cult_camp_exterior', option: {
        id: 'couvert-vegetal', label: 'Option – Ellyjobell: Mener le groupe par le couvert des pins',
        characterId: 'ellyjobell', skill: 'nature',
        resolution: { difficulty: 4, skill: 'nature', risk: 'injury', deathType: 'replaceable' },
        effects: { chaos: -1, message: 'Ellyjobell conduit le groupe de fossé en taillis, là où la lueur des feux de garde ne porte pas.' },
        intent: 'Ellyjobell choisit un chemin sous les branches, loin des feux. Réussite: le groupe se rapproche du camp à couvert. Échec: elle se blesse dans l’obscurité et fait du bruit.',
        riskText: 'Un échec peut blesser l’intervenante.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'hatchery_entry', option: {
        id: 'entree-magie', label: 'Option – Darrin: Faire sauter le verrou d’un trait de magie',
        characterId: 'darrin', skill: 'wild_magic',
        resolution: { difficulty: 6, skill: 'wild_magic', risk: 'injury', deathType: 'replaceable' },
        effects: { chaos: 1, message: 'Un trait de magie fait sauter le verrou. L’éclat résonne dans la grotte, mais la voie est ouverte.' },
        intent: 'Darrin libère l’entrée par la magie sauvage. Réussite: la porte s’ouvre, au prix d’un vacarme qui accroît l’alerte. Échec: le sort lui échappe et le blesse.',
        riskText: 'Un échec peut blesser l’intervenant.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'hatchery_entry', option: {
        id: 'entree-epaule', label: 'Option – Drek’Thar: Enfoncer l’entrée à l’épaule',
        characterId: 'drekthar', skill: 'might',
        resolution: { difficulty: 4, skill: 'might', risk: 'injury', deathType: 'replaceable' },
        effects: { chaos: 1, message: 'La porte cède sous l’épaule de Drek’Thar. Le fracas se répercute dans les galeries.' },
        intent: 'Drek’Thar force le passage sans attendre. Réussite: la voie est ouverte, mais l’alerte monte. Épreuve plus facile que les autres approches. Échec: il se blesse contre le battant.',
        riskText: 'Un échec peut blesser l’intervenant.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'fungal_chamber', option: {
        id: 'fonges-reconnaitre', label: 'Option – Ellyjobell: Reconnaître les nappes dangereuses',
        characterId: 'ellyjobell', skill: 'nature',
        resolution: { difficulty: 4, skill: 'nature', risk: 'injury', deathType: 'replaceable' },
        effects: { chaos: -1, message: 'Ellyjobell distingue les nappes inoffensives de celles qui libèrent des spores et indique où poser le pied.' },
        intent: 'Ellyjobell se fie à sa connaissance des plantes et des champignons pour tracer un passage. Réussite: le groupe traverse sans réveiller la salle. Échec: elle inhale des spores et se blesse.',
        riskText: 'Un échec peut blesser l’intervenante.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'fungal_chamber', option: {
        id: 'fonges-eclaireur', label: 'Option – Sislay: Ouvrir la marche entre les spores',
        characterId: 'sislay', skill: 'tracking',
        resolution: { difficulty: 6, skill: 'tracking', risk: 'injury', deathType: 'replaceable' },
        effects: { moraleGroupe: 1, message: 'Sislay avance la première, éprouve chaque appui et le groupe suit ses pas sans soulever de nuage.' },
        intent: 'Sislay éclaire la route en testant le sol avant chaque pas. Réussite: le groupe passe en silence et prend confiance. Échec: elle dérange les spores et se blesse.',
        riskText: 'Un échec peut blesser l’intervenante.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'egg_chamber', option: {
        id: 'detruire-oeufs-drekthar', label: 'What If — Drek’Thar: Détruire les œufs',
        forbiddenFlag: 'eggsDecided', characterId: 'drekthar', skill: 'might',
        resolution: { difficulty: 7, skill: 'might', risk: 'injury', deathType: 'replaceable' },
        effects: { moraleGroupe: 1, chaos: 1, message: 'Drek’Thar brise les coquilles d’un coup d’épée; un cri rituel résonne dans tout le repaire.' },
        onSuccess: { setFlags: { eggsDecided: true, eggsDestroyed: true, eggsStolen: false, eggsLeft: false }, gotoRoom: 'mondath_chamber' },
        riskText: 'Un échec peut blesser l’intervenant.',
        intent: 'Variante: Drek’Thar brise les œufs pour empêcher leur éclosion. Boule et Bill ne rejoindront pas le groupe dans ce parcours.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'egg_chamber', option: {
        id: 'laisser-oeufs-ellyjobell', label: 'What If — Ellyjobell: Laisser les œufs',
        forbiddenFlag: 'eggsDecided', characterId: 'ellyjobell', skill: 'nature',
        resolution: { difficulty: 6, skill: 'nature', risk: 'injury', deathType: 'replaceable' },
        effects: { chaos: -1, message: 'Ellyjobell referme le nid comme elle l’a trouvé et ramène le groupe dehors sans laisser de trace.' },
        onSuccess: { setFlags: { eggsDecided: true, eggsLeft: true, eggsStolen: false, eggsDestroyed: false }, gotoRoom: 'mondath_chamber' },
        riskText: 'Un échec peut blesser l’intervenante.',
        intent: 'Variante: poursuivre sans emporter les œufs. Boule et Bill ne rejoindront pas le groupe dans ce parcours.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } },
      { roomId: 'naerytar_swamp', option: {
        id: 'naerytar-piste', label: 'Option – Sislay: Repérer le sentier des relèves',
        characterId: 'sislay', skill: 'tracking',
        resolution: { difficulty: 3, skill: 'tracking', risk: 'injury', deathType: 'replaceable' },
        effects: { message: 'Sislay relève les traces des gardes dans la vase et en déduit l’heure des relèves.' },
        onSuccess: { variableDelta: { castleAlertLevel: -1 }, checkpoint: 'Repérage de Naerytar' },
        onFailure: { variableDelta: { castleAlertLevel: 1 }, message: 'Une branche casse sous la botte de Sislay. Un guetteur lève sa lanterne et la paranoïa grimpe.' },
        onFailurePost: { checkpoint: 'Repérage de Naerytar' },
        intent: 'Sislay étudie les empreintes pour comprendre les rondes. Réussite: l’alerte du château diminue. Échec: elle est repérée, elle se blesse et l’alerte monte.',
        riskText: 'Un échec peut blesser l’intervenante.',
        source: 'Variante de jeu proposée; événement non attesté dans la campagne jouée.' } }
      ,{ roomId: 'old_tunnel', option: {
        id: 'tunnel-epaule', label: 'What If — Drek’Thar: Forcer la porte rouillée et chasser les rats',
        characterId: 'drekthar', skill: 'might', failForward: true, repeatable: true,
        resolution: { difficulty: 4, skill: 'might', risk: 'cost', dc: 12 },
        check: { ability: 'str', skillKey: 'athletics', kind: 'ability', label: 'Athlétisme', dc: 12 },
        intent: 'Sans attendre qu’Ellyjobell et Darrin soient prêts, Drek’Thar avance en tête, repousse les rats et enfonce la porte. Réussite: le passage s’ouvre sans bruit inutile. Échec: le vacarme porte jusqu’aux pillards et l’alerte monte, mais le Clan atteint tout de même la rivière.',
        riskText: 'Le Clan avance dans les deux cas. Le D20 fixe seulement le coût annoncé.',
        onSuccess: { gotoRoom: 'sanctuary_approach', message: 'Drek’Thar dégage le tunnel et la porte cède. Le Clan rejoint la rivière.' },
        onFailure: { gotoRoom: 'sanctuary_approach', variableDelta: { chaos: 1 }, message: 'La porte cède dans un fracas qui résonne sous la forteresse. Le Clan rejoint la rivière, mais les pillards ont pu l’entendre.' },
        source: 'Variante de jeu proposée; le journal (Tyranny of dragons!24:25) rapporte une autre méthode.' } }
      ,{ roomId: 'old_tunnel', option: {
        id: 'tunnel-crochetage', label: 'What If — Sislay: Crocheter la porte rouillée',
        characterId: 'sislay', skill: 'stealth', failForward: true, repeatable: true,
        resolution: { difficulty: 4, skill: 'stealth', risk: 'cost', dc: 12 },
        check: { ability: 'dex', skillKey: null, kind: 'ability', label: 'Outils de voleur', dc: 12 },
        intent: 'Sislay prend ses outils de voleur et s’attaque à la serrure pendant que les autres tiennent les rats à distance. Réussite: la porte s’ouvre sans un bruit. Échec: la serrure cède après de longs essais et le groupe perd du temps.',
        riskText: 'Le Clan avance dans les deux cas. Le D20 fixe seulement le coût annoncé.',
        onSuccess: { gotoRoom: 'sanctuary_approach', message: 'La serrure cède sous les outils de Sislay. Le Clan rejoint la rivière.' },
        onFailure: { gotoRoom: 'sanctuary_approach', variableDelta: { chaos: 1 }, message: 'La serrure résiste longtemps avant de céder. Le Clan rejoint la rivière après un délai qui laisse aux pillards le temps de resserrer leurs lignes.' },
        source: 'Variante de jeu proposée; le journal (Tyranny of dragons!24:25) rapporte une autre méthode.' } }
      ,{ roomId: 'dragon_assault', option: {
        id: 'dragon-brouillard', label: 'What If — Ellyjobell: Voiler les remparts pour désorienter le dragon',
        characterId: 'ellyjobell', skill: 'arcana', failForward: true,
        resolution: { difficulty: 4, skill: 'arcana', risk: 'cost', dc: 12 },
        check: { ability: 'int', skillKey: 'arcana', kind: 'ability', label: 'Arcanes', dc: 12 },
        intent: 'Ellyjobell étend un brouillard sur les remparts pendant que les gardes tirent à couvert. Réussite: le dragon perd ses cibles et s’éloigne. Échec: le brouillard gêne aussi les défenseurs; le dragon est chassé, mais le moral du groupe en souffre.',
        riskText: 'Le dragon est repoussé dans les deux cas, comme dans le journal. Le D20 fixe seulement le coût annoncé.',
        onSuccess: { gotoRoom: 'greenest_keep', setFlags: { dragonRepelled: true }, message: 'Le brouillard d’Ellyjobell égare le dragon, qui s’éloigne sous les tirs des défenseurs.' },
        onFailure: { gotoRoom: 'greenest_keep', setFlags: { dragonRepelled: true }, variableDelta: { moraleGroupe: -1 }, message: 'Le brouillard gêne autant les défenseurs que le dragon. L’assaut est repoussé, mais au prix d’une défense confuse qui éprouve le groupe.' },
        source: 'Variante de jeu proposée; le journal (Tyranny of dragons!32) ne détaille pas la méthode.' } }
      ,{ roomId: 'dragon_assault', option: {
        id: 'dragon-magie', label: 'What If — Darrin: Frapper le dragon de magie sauvage depuis les remparts',
        characterId: 'darrin', skill: 'wild_magic', failForward: true,
        resolution: { difficulty: 4, skill: 'wild_magic', risk: 'cost', dc: 14 },
        check: { ability: 'cha', skillKey: null, kind: 'attack', label: 'Attaque de sort', dc: 14 },
        intent: 'Darrin concentre ses sorts sur le dragon pendant que les gardes tirent. Réussite: l’assaut contraint la créature à s’éloigner. Échec: la magie sauvage dévie sur les remparts; le dragon est tout de même chassé, mais l’alerte monte.',
        riskText: 'Le dragon est repoussé dans les deux cas, comme dans le journal. Le D20 fixe seulement le coût annoncé.',
        onSuccess: { gotoRoom: 'greenest_keep', setFlags: { dragonRepelled: true }, message: 'Les sorts de Darrin frappent le dragon, qui renonce à son assaut.' },
        onFailure: { gotoRoom: 'greenest_keep', setFlags: { dragonRepelled: true }, variableDelta: { chaos: 1 }, message: 'Un sort dévie et frappe les remparts. Les défenseurs finissent pourtant par chasser le dragon, mais le désordre laisse des traces.' },
        source: 'Variante de jeu proposée; le journal (Tyranny of dragons!32) ne détaille pas la méthode.' } },
      { roomId: 'cult_camp_exterior', option: { id: 'chaos-mot-de-passe', label: 'Option absurde — Bjolnir: Réclamer poliment le mot de passe', onSelect: 'silly_cult_password',
        intent: 'Aborder les sentinelles comme si l’on était attendu.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      { roomId: 'hatchery_entry', option: { id: 'chaos-frapper', label: 'Option absurde — Drek’Thar: Frapper à la porte et attendre', onSelect: 'silly_knock_door',
        intent: 'Respecter les usages, même ici.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      { roomId: 'fungal_chamber', option: { id: 'chaos-champignon', label: 'Option absurde — Darrin: Goûter un champignon luminescent', onSelect: 'silly_taste_mushroom',
        intent: 'La curiosité l’emporte sur la prudence.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      { roomId: 'roper_lair', option: { id: 'chaos-nommer', label: 'Option absurde — Ellyjobell: Donner un nom à la créature', onSelect: 'silly_name_roper',
        intent: 'Parler d’abord, combattre ensuite.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      { roomId: 'egg_chamber', option: { id: 'chaos-berceuse', label: 'Option absurde — Ellyjobell: Chanter une berceuse aux œufs', onSelect: 'silly_egg_lullaby',
        intent: 'Un instant de douceur au milieu de la grotte.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      { roomId: 'portal_chamber', option: { id: 'chaos-portail', label: 'Option absurde — Darrin: Demander poliment au portail de s’ouvrir', onSelect: 'silly_knock_portal',
        intent: 'On ne sait jamais.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      { roomId: 'mill_approach', option: { id: 'chaos-farine', label: 'Option absurde — Drek’Thar: Charger en criant « Pour la farine ! »', onSelect: 'silly_flour_charge',
        intent: 'Un cri de guerre inattendu.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      { roomId: 'old_tunnel', option: { id: 'chaos-rat', label: 'Option absurde — Ellyjobell: Nommer un rat éclaireur officiel', onSelect: 'silly_rat_scout',
        intent: 'Les rats méritent des égards.', riskText: 'Choix chaotique : sans gravité, mais il peut attirer l’attention.' } },
      {
        "roomId": "cult_trail",
        "option": {
          "id": "piste-faux-feu",
          "label": "What If — Darrin: Faire naître un faux feu de camp à l’écart de la piste",
          "characterId": "darrin",
          "skill": "arcana",
          "resolution": {
            "difficulty": 3,
            "skill": "arcana",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "chaos": -1,
            "moraleGroupe": 1,
            "message": "Darrin fait naître un feu de camp qui n’existe pas. Deux traînards s’y précipitent, et le Clan avance sans bruit pendant qu’ils cherchent la braise."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "L’illusion crépite beaucoup trop fort. Une sentinelle se retourne, perplexe, puis hausse les épaules; la tension monte quand même."
          },
          "intent": "Darrin crée l’illusion d’un feu de camp loin de la piste. Réussite: les traînards s’y précipitent et le Clan passe sans bruit. Échec: l’illusion crépite trop fort et attire l’attention.",
          "riskText": "Approche prudente : un échec augmente seulement l’alerte.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "cult_trail",
        "option": {
          "id": "piste-eau-blesse",
          "label": "What If — Bjolnir: Offrir de l’eau à un pillard blessé laissé en arrière",
          "characterId": "bjolnir",
          "skill": "diplomacy",
          "resolution": {
            "difficulty": 3,
            "skill": "diplomacy",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "chaos": -1,
            "moraleGroupe": 1,
            "message": "Surpris par tant de douceur, le pillard blessé confirme que le camp est au sud, près des falaises, puis s’endort sans résister. Le Clan repart plus léger."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "Le blessé crie au secours avant que Bjolnir ait pu le calmer. L’alerte se répand dans les collines."
          },
          "intent": "Bjolnir refuse de laisser un blessé sans soin et lui tend sa gourde. Réussite: le pillard confirme le camp au sud, près des falaises, et le Clan reprend confiance. Échec: le blessé appelle à l’aide.",
          "riskText": "Approche prudente : un échec augmente seulement l’alerte.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "cult_camp_exterior",
        "option": {
          "id": "camp-mirage-releve",
          "label": "What If — Darrin: Projeter l’image d’une relève qui s’éloigne",
          "characterId": "darrin",
          "skill": "arcana",
          "resolution": {
            "difficulty": 4,
            "skill": "arcana",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "chaos": -1,
            "message": "Une relève fantôme s’éloigne au fond du chemin. Les sentinelles quittent leur poste pour l’inspecter, et le Clan se rapproche à couvert."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "L’image se déchire au milieu du chemin. Les sentinelles se regardent, resserrent leur garde et font signe aux autres."
          },
          "intent": "Darrin projette une relève fantôme au fond du chemin. Réussite: les sentinelles quittent leur poste pour l’inspecter. Échec: l’image vacille et les rend méfiantes.",
          "riskText": "Approche prudente : un échec augmente seulement l’alerte.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "cult_camp_exterior",
        "option": {
          "id": "camp-bras-de-fer",
          "label": "What If — Drek’Thar: Défier une sentinelle à un bras de fer silencieux",
          "characterId": "drekthar",
          "skill": "might",
          "resolution": {
            "difficulty": 4,
            "skill": "might",
            "risk": "injury",
            "deathType": "replaceable"
          },
          "effects": {
            "moraleGroupe": 1,
            "chaos": 1,
            "message": "Sur un tronc couché, Drek’Thar plaque le bras de la sentinelle sans que personne prononce un mot. Elle s’incline, beau joueur, et les compagnons reprennent confiance."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "Le tronc craque et Drek’Thar se tord l’épaule en perdant. La sentinelle ricane trop fort : l’alerte monte."
          },
          "intent": "Drek’Thar défie une sentinelle à un bras de fer, sans un mot. Réussite: il l’emporte et le Clan reprend confiance, au prix d’un peu de bruit. Échec: il se blesse.",
          "riskText": "Un échec peut blesser l’intervenant.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "hatchery_entry",
        "option": {
          "id": "entree-chauves-souris",
          "label": "What If — Ellyjobell: Demander aux chauves-souris du seuil de les guider",
          "characterId": "ellyjobell",
          "skill": "nature",
          "resolution": {
            "difficulty": 4,
            "skill": "nature",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "chaos": -1,
            "message": "Ellyjobell siffle, et les chauves-souris s’envolent en une spirale qui masque l’ouverture. Le Clan se glisse dans leur ombre."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "Les chauves-souris s’égaillent en criant, et leur envol trahit la présence du groupe à l’entrée."
          },
          "intent": "Ellyjobell siffle aux chauves-souris du seuil. Réussite: elles s’envolent en spirale et masquent l’entrée du Clan. Échec: elles s’égaillent en criant.",
          "riskText": "Approche prudente : un échec augmente seulement l’alerte.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "hatchery_entry",
        "option": {
          "id": "entree-priere",
          "label": "What If — Bjolnir: Prier Eldath avant de descendre",
          "characterId": "bjolnir",
          "skill": "redemption",
          "resolution": {
            "difficulty": 4,
            "skill": "redemption",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "moraleGroupe": 1,
            "message": "Bjolnir s’agenouille et prie Eldath pour que la paix accompagne ceux qui descendent. Le Clan avance, plus serein."
          },
          "onFailure": {
            "variableDelta": {
              "moraleGroupe": -1
            },
            "message": "Sa prière résonne trop fort dans la grotte. Chacun se demande qui d’autre l’a entendue."
          },
          "intent": "Bjolnir s’agenouille devant l’entrée et prie Eldath pour que la paix accompagne ceux qui descendent. Réussite: le moral du Clan se renforce. Échec: la prière résonne trop fort dans la grotte.",
          "riskText": "Approche prudente : un échec n’affecte que le moral.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "fungal_chamber",
        "option": {
          "id": "fonges-epee",
          "label": "What If — Drek’Thar: Tailler la voie à grands coups d’épée dans les fonges",
          "characterId": "drekthar",
          "skill": "might",
          "resolution": {
            "difficulty": 5,
            "skill": "might",
            "risk": "injury",
            "deathType": "replaceable"
          },
          "effects": {
            "moraleGroupe": 1,
            "chaos": 1,
            "message": "Les fonges tombent sous l’épée de Drek’Thar dans un nuage de spores violettes. Le couloir s’ouvre, et le Clan avance en toussant."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "Un nuage de spores lui saute au visage. Drek’Thar titube, et le bruit de sa quinte résonne dans la salle."
          },
          "intent": "Drek’Thar tranche les fonges à grands coups d’épée. Réussite: un couloir s’ouvre et le Clan reprend confiance, mais les spores donnent l’alerte. Échec: il se blesse dans le nuage.",
          "riskText": "Un échec peut blesser l’intervenant.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "fungal_chamber",
        "option": {
          "id": "fonges-lueur",
          "label": "What If — Darrin: Allumer une lueur froide qui fait reculer les spores",
          "characterId": "darrin",
          "skill": "arcana",
          "resolution": {
            "difficulty": 4,
            "skill": "arcana",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "chaos": -1,
            "message": "Une lueur froide jaillit du focalisateur de Darrin. Les nappes de spores reculent d’un pas, et le passage se dégage sans un bruit."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "La lueur fait gonfler les champignons au lieu de les repousser. Un grondement sourd court sous la voûte."
          },
          "intent": "Darrin allume une lueur froide au bout de son focalisateur. Réussite: les nappes de spores reculent et le passage se dégage sans bruit. Échec: la lueur attire les champignons.",
          "riskText": "Approche prudente : un échec augmente seulement l’alerte.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "naerytar_swamp",
        "option": {
          "id": "naerytar-heron",
          "label": "What If — Ellyjobell: Charmer un héron pour qu’il guette les rondes",
          "characterId": "ellyjobell",
          "skill": "nature",
          "resolution": {
            "difficulty": 3,
            "skill": "nature",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "castleAlertLevel": -1,
            "message": "Le héron, perché sur une souche, bat des ailes à l’approche de chaque patrouille. Ellyjobell n’a plus qu’à regarder l’oiseau."
          },
          "onFailure": {
            "variableDelta": {
              "castleAlertLevel": 1
            },
            "message": "Le héron s’envole en criant. Une lanterne se tourne lentement vers les roseaux."
          },
          "intent": "Ellyjobell charme un héron pour qu’il guette les rondes. Réussite: il bat des ailes dès qu’une patrouille approche, l’alerte du château baisse. Échec: il s’envole en criant.",
          "riskText": "Approche prudente : un échec augmente seulement l’alerte du château.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "castle_naerytar",
        "option": {
          "id": "naerytar-pelerins",
          "label": "What If — Bjolnir: Faire passer le Clan pour des pèlerins d’Eldath égarés",
          "characterId": "bjolnir",
          "skill": "diplomacy",
          "resolution": {
            "difficulty": 5,
            "skill": "diplomacy",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "castleAlertLevel": -1,
            "message": "Bjolnir bénit les gardes d’un geste large et les remercie de leur accueil. Gênés, ils détournent le regard et laissent passer le groupe."
          },
          "onFailure": {
            "variableDelta": {
              "castleAlertLevel": 2,
              "moraleGroupe": -1
            },
            "message": "Personne n’est dupe : la bénédiction sonne faux dans une cour de brutes. Les gardes se resserrent et le Clan perd de sa superbe."
          },
          "intent": "Bjolnir présente le Clan comme des pèlerins égarés de la déesse de la paix. Réussite: les gardes détournent le regard et l’alerte baisse. Échec: personne n’est dupe, l’alerte monte et le moral souffre.",
          "riskText": "Le Clan avance dans les deux cas; un échec coûte de l’alerte et du moral.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "castle_naerytar",
        "option": {
          "id": "naerytar-betes",
          "label": "What If — Ellyjobell: Libérer les bêtes de somme pour semer le désordre",
          "characterId": "ellyjobell",
          "skill": "nature",
          "resolution": {
            "difficulty": 5,
            "skill": "nature",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "castleAlertLevel": 1,
            "moraleGroupe": 1,
            "message": "La cour se remplit de cris, de poussière et de bêtes affolées. Le Clan se faufile dans le tumulte, avec le sourire."
          },
          "onFailure": {
            "variableDelta": {
              "castleAlertLevel": 2
            },
            "message": "Les bêtes affolées se ruent droit sur le Clan. Les gardes accourent, et l’alerte grimpe d’un cran de plus."
          },
          "intent": "Ellyjobell ouvre les enclos des bêtes de somme. Réussite: la cour se remplit de cris et de poussière, le Clan rit sous cape, mais l’alerte monte un peu. Échec: les bêtes se ruent vers le Clan.",
          "riskText": "Désordre assumé : même en cas de succès, l’alerte du château monte.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      },
      {
        "roomId": "northern_road",
        "option": {
          "id": "caravane-spectacle",
          "label": "What If — Darrin: Offrir un spectacle d’étincelles aux marchands",
          "characterId": "darrin",
          "skill": "arcana",
          "resolution": {
            "difficulty": 3,
            "skill": "arcana",
            "risk": "cost",
            "deathType": "replaceable"
          },
          "effects": {
            "moraleGroupe": 1,
            "chaos": -1,
            "message": "Darrin tire de ses doigts des gerbes d’étincelles colorées. Les marchands applaudissent, parlent à voix haute, et le Clan glane quelques ragots."
          },
          "onFailure": {
            "variableDelta": {
              "chaos": 1
            },
            "message": "Une étincelle égarée met le feu à une bâche. On l’éteint à grands cris, et plusieurs regards se tournent vers le groupe."
          },
          "intent": "Darrin amuse les marchands d’étincelles colorées pendant que les autres écoutent. Réussite: on parle volontiers et la route paraît plus légère. Échec: une étincelle met le feu à une bâche.",
          "riskText": "Approche prudente : un échec augmente seulement l’alerte.",
          "source": "Variante de jeu proposée; événement non attesté dans la campagne jouée."
        }
      }
    ];
    EXTRA_APPROACHES.forEach(({roomId,option}) => rooms[roomId].options.push(option));

