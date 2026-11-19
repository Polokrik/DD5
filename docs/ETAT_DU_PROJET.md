# État du projet

Document de référence sur ce que fait le jeu **aujourd'hui**. À tenir à jour à chaque changement
de fonctionnalité ou de règle. Les instructions de travail sont dans [AGENTS.md](../AGENTS.md).

## Contenu

- **Cinq actes jouables** de l'attaque de Verdure à l'invitation à Thay (fin de la campagne réelle),
  57 scènes plus la mission de sauvetage. Chronique intégrée de 18 chapitres
  ([CHRONIQUE_CAMPAGNE.md](CHRONIQUE_CAMPAGNE.md)).
- **Choix « Chronique »** (ce qui a été joué) et **choix « Et si… »** (parcours alternatif assumé),
  plus des **provocations** humoristiques sans gravité (effet léger, jouables une fois par scène).
- **35 scènes étoffées** avec 70 observations facultatives (lecture sans dé ni coût).
- **Bataille finale hypothétique** (acte V) présente dans le code mais masquée aux joueurs :
  `index.html?whatif=1` pour la tester.

## Règles de jeu

- **Épreuves D20** : personnage, caractéristique, maîtrise, niveau et DD affichés avant le clic;
  un seul tirage conservé. 20 et 1 naturels ne décident que des attaques. Niveaux selon les jalons
  de l'aventure officielle, distincts des valeurs des fiches ([STATISTIQUES_DD5.md](STATISTIQUES_DD5.md)).
- **Effets chiffrés** : moral ±10 % par point, alerte ±17 % (alerte du château ±20 %), confiance et
  factions ±5 %. Pastilles vertes ou rouges sur les cartes (réussite / échec), dans le compte rendu et
  dans la barre d'état.
- **Approches** : plusieurs compagnons possibles par scène de décision; une approche ratée est
  épuisée dans la scène; les sorties (« Continuer vers le nord ») sont des choix numérotés.
- **Santé** : actif, blessé, à terre, mort (barre sous les portraits). **Repos** un par chapitre :
  soigne les blessés, jets de mort pour ceux à terre (3 échecs = mort, 3 réussites = stabilisé,
  20 = debout, 1 = deux échecs), puis un événement au D20 (attaque, alerte, nuit calme, aide).
- **Capture et sauvetage** : tant qu'un compagnon est capturé, chaque scène propose de partir à sa
  rescousse (discrétion, force, parlementer); réussite = retour blessé et retour à la scène quittée.
- **Pertes** : pas de remplaçant obligatoire. S'il ne reste que deux compagnons debout, un ancien
  compagnon parti du groupe revient (le plus proche en caractéristiques, pondéré par la classe).
- **Game over** seulement si tous les compagnons présents sont morts; il ramène au dernier choix.
- **Décisions du Clan** : bandeau des trois derniers choix et onglet du journal par chapitre.
- **Ordre et couleur des choix** : le choix joué dans la campagne (`STORY_CHOICES`, ordre du journal) est
  toujours le n° 1, en bleu; puis la sortie qui fait avancer (bleue aussi), les autres approches, les
  « Et si… », les choix farfelus (non signalés comme tels), le repos, et en dernier les retours.
- **Personnages** (onglet du journal) : la compagnie, puis les personnages rencontrés (`NPC_SHEETS`, faits de
  la chronique uniquement), débloqués au chapitre où ils entrent dans l'histoire. Noms, lieux et éléments
  clés en gras dans le récit (`HIGHLIGHT_TERMS`, première occurrence par paragraphe).

## Rendu

- Livre illustré : décors pixel art 320×200, kit d'ambiance commun (`SCENE_LIFE`), compagnie
  visible au premier plan (désactivable dans Ambiance), sept protagonistes d'après la
  [bible des sprites](references/bible-des-sprites.html), Langdedrosa d'après
  [la référence du MJ](references/langdedrosa-pixel.png), duels avec anticipation, frappe, impact
  et récupération. Verdure en flammes : feu orange contre foudre bleue de Lennithon.
- Animation au temps réel (même vitesse sur tous les écrans), mouvement réduit respecté.
- Son d'ambiance facultatif généré par le navigateur (en attente des sons fournis par le MJ).

## Précisions du MJ (canon confirmé)

À respecter dans tout texte. Détails et interviews : [ATELIER_MJ.md](ATELIER_MJ.md),
[campaign-reference.json](campaign-reference.json).

- Groupe de départ : Bjolnir, Ellyjobell, Darrin, Drek'Thar, Sislay. Au pavillon de Talis (journal
  ligne 203), Kairon arrive, Drek'Thar et Sislay partent (« Lunaaz » dans le journal = Sislay).
  Malar (= Malaar) arrive à Cumulus (ligne 226).
- Bjolnir refuse de tuer; il obtient la reddition des kobolds à Verdure et persuade ceux de Cumulus
  de ne pas combattre. À Cumulus, il lit les runes naines, parle à Eskarotha et convainc Blagothkus
  (orgueil des géants, prétention à dominer les dragons, opposition probable d'Eskarotha); il défend
  Glazael et refuse le partage du trésor, que les autres tentent de prendre.
- Force 17 de Bjolnir et Kairon avant les gantelets : reconstruction validée par le MJ.
- À Naerytar, les aventuriers ont provoqué le soulèvement des hommes-lézards.
- Boule et Bill, dragonnets noirs adoptés par Bjolnir, sont une blague : Easter egg discret
  (deux têtes dans le chariot sur la route), pas un élément mis en avant.
- Biographies : Bjolnir et Ellyjobell d'après les textes des joueurs; celle de Drek'Thar est en
  réécriture par son joueur; Sislay n'a pas de biographie.

## Suite

- Pixel art : soulèvement des hommes-lézards à Naerytar, Talis et Ellyjobell au pavillon, Rezmir et
  Glazael à Cumulus; redessiner les sept protagonistes au niveau de détail de Langdedrosa.
- D'autres embranchements du type « sauvetage » (au-delà de la capture), selon les retours du MJ.
- Découper les épisodes encore condensés (Diderius, Mer de Glace) en vraies décisions.
- Intégrer les sons fournis par le MJ.
- Continuer les interviews du MJ par petites scènes; rien après l'invitation à Thay comme joué.

## Limites connues

- Plusieurs scènes de chronique restent linéaires (un choix principal plus repos et « faire le point »).
- Les sprites des protagonistes sont plus simples que celui de Langdedrosa.
- Les lanceurs Windows et Mac ne sont pas testés automatiquement : à vérifier sur chaque système.
