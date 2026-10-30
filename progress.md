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
- Tests : **75 tests Node**, parcours Chromium inchangés.

## Encore à un seul choix (scènes de chronique)

Leosin, Mondath, sortie de la couvée, route d’Elturel, tournoi, Carnath,
pavillon, Cumulus (arrivée), Diderius, Mer de Glace, iceberg, second Conseil,
forêt, Neronvein, invitation à Thay. À traiter une à une avec le journal.

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
