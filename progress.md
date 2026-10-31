# Suivi du projet DD5

État arrêté le **30 octobre 2026**, à la demande du MJ. Les modifications
fonctionnelles sont interrompues. Publication demandée sur `main`; le travail
et son historique sont aussi conservés sur `feat/dd5-illustrated-interface`.

## Fonctionnel et validé

- Moteur réparé après les fusions : démarrage, navigation, cinq actes,
  sauvegardes, checkpoints, états et morts des personnages.
- Chronique de 18 chapitres et référentiel sourcé. La campagne réelle s’arrête
  à l’invitation à Thay; la suite reste à écrire.
- Interface de livre illustré : choix, portraits, résultats narratifs,
  ambiances et effets facultatifs.
- Statistiques des sept fiches, valeurs PDF distinctes des projections au niveau
  de l’aventure officielle. Force initiale de Bjolnir et Kairon reconstruite à17
  avec le MJ; augmentations historiques inconnues.
- D20 par épreuve, calcul visible, résultat sauvegardé. Animation passable et
  désactivable; aucun nouveau jet lors d’une relecture ou d’un rechargement.
- Retours sûrs et deux choix utilisables par écran. Issues collectives avec coût
  annoncé; rituel final limité à trois actions.
- **35 scènes étoffées dans les actes II à IV**, avec **70 observations**
  facultatives. Lire une observation ne coûte aucune ressource et ne tire aucun
  dé; sa consultation est sauvegardée et restaurée avec les checkpoints.
- **14 nouveaux décors** : camp, grotte, caravane, Carnath, marais, Cumulus,
  pavillon, portail, Conseil, Diderius, Mer de Glace, caverne glaciale, forêt et
  audience des dragons. Œufs et portail endommagé utilisent des couches séparées.
- Rappels de certaines conséquences dans les scènes suivantes. Anciennes
  inventions mieux signalées comme « What If ».
- Les échecs politiques au Conseil et chez les dragons ne blessent plus les
  orateurs et conservent la progression.
- Laisser les œufs est une décision sans jet ni blessure. Les approches réussies
  de la grotte conduisent réellement à la salle suivante.
- Précision du MJ sur Bjolnir, l’orgueil des géants et Eskarotha intégrée à la
  scène de Cumulus, à la chronique et au référentiel, sans citation inventée.

## Dernière validation

**64 tests Node et quatre parcours Chromium réussis**, sans erreur JavaScript
ni requête externe. Affichage mobile320px, palette canvas≤48 couleurs, rendu
stable à tick fixe, dés, observations, sauvegardes et reprises vérifiés.

```sh
node --test tests/*.test.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/verdure-browser.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/d20-browser.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/book-browser.cjs
```

Playwright et Chromium sont des outils de test; le jeu ne dépend d’aucun paquet
au runtime. La CI lance automatiquement les quatre suites Node.

## Intégré depuis la reprise du 30 octobre

- **Cumulus en trois scènes** : commandes et Eskarotha, assaut et Rezmir, Glazael
  et trésor. Chemin canonique : `skyreach-return`, `skyreach-convaincre`,
  `skyreach-rezmir`, `skyreach-proteger`. Sources : journal, lignes 220 à 259.
  Le partage du trésor est un What If; Glazael reste captif dans tous les cas.
- **Seize approches supplémentaires** confiées à d’autres compagnons (piste du
  Culte, abords du camp, couvée, champignons, œufs, marais, tunnel, dragon sur
  les remparts). Variantes de jeu, annoncées comme telles.
- **Fiches des personnages** réécrites sans mention de fiche ni de MJ; les
  sources sont repliées. Bios de Bjolnir et Ellyjobell reprises des textes des joueurs.
- Tests : **97 tests Node**, parcours Chromium inchangés.

## Santé, repos et défaite (règles de jeu, façon D&D)

- Barre de santé sous chaque portrait : 3 segments (actif, blessé, à terre); mort = vide.
- **Repos** : un par chapitre, dans les scènes sûres et de chronique. Les blessés se
  relèvent. Les compagnons à terre font un **jet de mort** (3 échecs = mort définitive,
  3 réussites = stabilisé, 20 = debout, 1 = deux échecs). Un D20 décide ensuite d’un
  événement : attaque de cultistes (1-5), alerte (6-8), nuit calme (9-14), aide (15-20).
  Tous les tirages sont écrits dans le compte rendu; rien n’est relancé à la relecture.
- **Game over** seulement si tous les compagnons présents sont morts.
- « Faire le point avec la compagnie » reste un choix de lecture, sans effet.
- Ce sont des règles du jeu, pas des faits de la campagne jouée.

## Corrections de jeu après les premiers essais (30 octobre)

- Les sorties (« Continuer vers le nord ») sont de vrais choix numérotés, avec leur touche.
- Une approche ratée est épuisée dans la scène : plus de boucle sur la même épreuve.
  Les échecs ont un texte propre et s’accordent au féminin (Ellyjobell, Sislay).
- Approches prudentes à la piste du camp (suivre à distance, observer depuis une
  crête) : un échec augmente seulement l’alerte. Effets et difficultés différenciés.
- « Faire le point » devient propre à chaque scène et n’apparaît qu’une fois le repos
  du chapitre pris.
- **La bataille finale hypothétique est masquée** pour les joueurs. Elle reste dans le
  code; pour la tester : ouvrir `index.html?whatif=1`. Les textes qui l’annonçaient
  sont retirés.
- 90 tests Node; parcours Chromium à lancer avec `?whatif=1` pour les cinq actes.

## Contrôle de cohérence et d’immersion (30 octobre)

- Comptes rendus : retrait des formules de jeu (« dans cette variante », « dans cette
  adaptation », « rapporté par le MJ », « le journal », « le jeu »). Environ 50 phrases.
- Cartes de choix : « What If » devient un repère « Et si… », « Option absurde » un repère
  « Provocation », « Chronique » disparaît (c’est le cas normal). Les descriptions
  n’emploient plus « journal », « attesté », « variante » à l’affichage.
- « Faire le point » rappelle le texte réel des observations de la scène.
- Vérifiés sans écart : noms des personnages, arrivées et départs du roster, aucun
  paragraphe recopié entre scènes.
- Limites connues : si Bjolnir est mort, la scène des runes de Cumulus reste sans lui
  (le texte suppose son rôle); les scènes de chronique restent des restitutions.

## Pertes et choix chaotiques

- « Et si… » reste affiché : c'est une partie alternative assumée.
- Les provocations (« Provocation ») sont des **choix chaotiques neutres** : jamais de
  game over, un effet léger (moral, alerte, confiance), jouables une fois par scène.
- Mort d'un compagnon : pas de remplaçant obligatoire; les options liées à lui disparaissent.
  S'il ne reste que deux compagnons, un ancien compagnon parti du groupe (Drek'Thar,
  Sislay après le pavillon) revient, choisi par l'écart minimal des six caractéristiques.

## Effets chiffrés

- Chaque effet est donné en pourcentage : moral ±10 % par point, alerte ±17 % (château ±20 %),
  confiance publique et factions ±5 %. Pastilles vertes (favorable) ou rouges (défavorable)
  sur les cartes de choix (« Réussite » / « Échec »), dans le compte rendu et dans la barre d'état
  (Moral X % · Alerte Y %). Les descriptions écrites en points sont converties à l'affichage.
- Retour d'un ancien compagnon : écart des caractéristiques pondéré par la classe
  (paladin–guerrier 0, martial–rôdeur 4, martial–voleur 8, lanceur de sorts 8 à 12).
- 9 nouvelles options chaotiques (« Provocation ») dans autant de scènes.

## Pixel art : première passe (brief « Tyranny of Dragons — Pixel Art & Animation Polish »)

- **Verdure en flammes / Lennithon** : flammes à cinq images avec cadence et phase propres à chaque foyer,
  braises, colonnes de fumée qui montent, dragon redessiné (six images d'ailes, queue, tête qui oscille),
  éclair rare qui change la lumière de toute la scène (même décor, couleurs bleutées; les feux restent orange),
  premier plan en silhouettes (charrette brisée, réfugiés, pillards à la torche). Bande noire à l'horizon corrigée.
- **Drek'Thar contre Langdedrosa I** (à l'aube, comme dans le journal) : deux combattants redessinés
  (respiration, arme qui se déplace, étoffe, rare étincelle sur la corne), spectateurs en anneau,
  fumées de la ville derrière l'enceinte, élans de coups seulement pendant le duel.
- **Langdedrosa II** : rapports inversés (Drek'Thar plus grand, Langdedrosa plus petit) et berserkers redessinés.
- **Atelier de sprites** (`tools/sprite-lab.cjs`) : dessine un personnage sur fond neutre en couleur, en niveaux
  de gris (étude de valeurs) et en silhouette, agrandi 4×. Usage : `node tools/sprite-lab.cjs sortie.png langdedrosa drekthar`.
- **Sprites des sept protagonistes** portés depuis la *Character Sprite Bible* (grille 64×96, `SPRITE_MODELS`) :
  Bjolnir, Drek'Thar, Ellyjobell, Darrin, Sislay, Kairon, Malar. Même centre de gravité et même ancrage de silhouette
  que la bible (marteau + bouclier, diagonale de l'épée, bâton courbe, mains ouvertes, arc + rapière, cornes + bâton,
  corps bas + rapière). Rasterisation en pixels entiers (arêtes arrondies, aucun lissage ni rotation CSS) à l'échelle
  de la scène (×0,5 en action, ×0,7 au duel, ×0,86 au second duel).
- **Poses explicites** au lieu des décalages d'aperçu : souffle (2 images), mouvement secondaire, action rare par
  personnage (prise du marteau, roulement d'épaule, spore, étincelle, regard, éclat de corne, dague), garde, puis
  `ATTACK_FRAMES` : anticipation → frappe → impact (étincelle) → récupération. Au duel, la garde de Drek'Thar répond à
  la frappe de Langdedrosa.
- Langdedrosa (non protagoniste) reste ma version : violet/or/bleu, queue, lance à lame en croissant.
- Atelier : `node tools/sprite-lab.cjs sortie.png [--mode color|value|shape] bjolnir drekthar ...` (planches de sept images).
- 102 tests Node (dont `tests/sprites.test.cjs`), parcours Chromium inchangés.
- **Kit d'ambiance réutilisable** (`LIFE` + `SCENE_LIFE`) : une quinzaine d'éléments déterministes (feu, torche, fumée,
  brume, neige, gouttes, ondulations, oiseaux, fanions, étoiles, nuages, lueur de fenêtre, lucioles, poussières, feuilles,
  pulsation, éclat, chauves-souris, vaguelettes) et une table par décor. Aucun code ni image propre à une scène;
  pour animer un décor, on ajoute une ligne dans `SCENE_LIFE`. Les décors gardent leur composition.
- **Mouvement de repos des sprites** partagé : souffle sur 4 images, report de poids d'un pied sur l'autre toutes les
  ~1 s, mouvement secondaire décalé par personnage.
- **Compagnie à l'écran** (réglage « Compagnie visible à l'écran » dans Ambiance, activé par défaut) : les protagonistes
  présents apparaissent en petit (×0,36) au premier plan de chaque scène, avec leur souffle et leur report de poids.
  Un blessé se tient en garde, plus bas; un compagnon à terre est couché; absents et morts ne sont pas dessinés.
  Elle prend les couleurs du décor (couleur de ART la plus proche), donc aucune couleur ajoutée. Masquée pendant les
  duels et les scènes d'action (où le protagoniste est déjà dessiné en grand).
- Mouvement réduit : image fixe complète, sans éclair. Aucun hasard : tout dépend du tick.
- Aperçus : `docs/previews/pixel-*.png`.
- Prochains décors (§9 du brief) : camp des pillards, salle des œufs, caravane, marais, Naerytar.
- Easter egg à garder en tête : Boule et Bill, à cacher quelque part.
- Soulèvement des hommes-lézards à Naerytar : provoqué par les aventuriers (confirmé par le MJ).

## À reprendre plus tard

- Découper les épisodes encore condensés en situations et décisions distinctes,
  en commençant par Cumulus, puis Diderius et la Mer de Glace.
- Relire les branches alternatives lorsque des compagnons sont absents, capturés
  ou morts : les options et états sont contrôlés, mais certains passages de la
  chronique restent une restitution de l’histoire jouée.
- Développer les rappels de décisions et les effets propres aux scènes au-delà de
  Verdure. Les nouveaux décors ne constituent pas encore une mise en scène
  spécifique de chaque action.
- Compléter les statistiques historiques uniquement si de nouvelles sources
  établissent les dons, augmentations et dates d’acquisition des objets.
- Continuer les interviews par petites scènes; ne rien écrire après l’invitation
  à Thay comme si cela avait été joué.

## Consignes et écueils

Respecter `AGENTS.md` et `agent.md`. Garder le HTML autonome, le pixel art, les
animations déterministes et la séparation récit/saisie. Un seul tirage par
épreuve. Ne pas inventer de canon, de dialogue exact ou de mort; distinguer les
variantes et les règles de jeu des faits attestés.

Deux boutons ne suffisent pas s’ils ramènent au même blocage. Un retour doit
restaurer une décision praticable. Les niveaux ne doivent pas augmenter en
revenant dans une salle. Les caractéristiques et équipements tardifs des PDF ne
prouvent pas les valeurs historiques à Verdure.

Paris reste hors du périmètre. Sa suppression existante sur `main` est conservée
lors de cette publication : les fichiers restaurés sur l’ancienne branche
d’audit ne sont pas réintroduits. Le snapshot de migration est conservé séparément.

## Documents utiles

- [Chronique complète à ce jour](docs/CHRONIQUE_CAMPAGNE.md)
- [Référentiel et précisions du MJ](docs/campaign-reference.json)
- [Statistiques et limites des projections](docs/STATISTIQUES_DD5.md)
- [Validation des D20 et parcours](docs/D20_ET_PARCOURS.md)
- [Atelier et prochaines interviews](docs/ATELIER_MJ.md)
