# Modifier le jeu

Le jeu livré est **un seul fichier autonome**, `index.html`, qui s'ouvre sans installation.
Il est **assemblé** à partir de `src/` : on modifie les sources, puis on régénère le fichier.
Ne jamais modifier `index.html` à la main : la construction suivante l'écraserait, et le test
`tests/build.test.cjs` échoue tant qu'il n'est pas à jour.

| Besoin | Windows | macOS | Ligne de commande | Prérequis |
| --- | --- | --- | --- | --- |
| Jouer | `Jouer.bat` | `Jouer.command` | ouvrir `index.html` | aucun |
| Assembler | `Construire.bat` (`tools/build.ps1`) | `Construire.command` (`tools/build.sh`) | `node tools/build.cjs` | aucun, sauf Node pour la commande |
| Tester | `Tester.bat` | `Tester.command` | `node tools/tests.cjs` | Node.js |

Les trois assemblages (`build.cjs`, `build.ps1`, `build.sh`) produisent le même fichier, octet pour octet.
`npm run build | check | test` fait la même chose avec npm.

## Où trouver quoi (`src/scripts/`, assemblés dans l'ordre des numéros)

| Fichiers | Contenu |
| --- | --- |
| `00-constantes` | tailles du canvas, clés de sauvegarde, réglages d'URL (`?whatif=1`, `?debug=1`) |
| `10-chronique`, `11-presentation`, `12-mise-en-scene` | 18 chapitres, textes et fiches des personnages, mises en scène des actions |
| `20-personnages`, `22-etat-initial` | compagnons, arrivées et départs, drapeaux, variables, actes |
| `21-donnees-acte-ii`, `30-salles` | les salles et leurs options (données) |
| `40-alternatives-securisees`, `41-approches-supplementaires` | variantes « Et si… », approches de remplacement, provocations |
| `42-epreuves-de-chronique`, `43-expansion-du-livre`, `44-cumulus-et-reperes` | épreuves des scènes jouées, scènes étoffées et observations, Cumulus, repos et « faire le point » |
| `50-fiches-et-niveaux`, `51-etat-et-sauvegarde` | statistiques D&D 5e, état de partie, sauvegarde et validation d'import |
| `60-interface-et-choix` | cartes de choix, effets en %, compagnie, fiches |
| `70`–`76` | règles : D20, checkpoints, salles, pertes et repos, résolution, décisions, commandes, sauvetage |
| `80`–`88` | rendu : primitives pixel, décors, portraits et actions, Verdure en flammes, sprites, Langdedrosa, kit d'ambiance, boucle de rendu |
| `90-son`, `99-demarrage` | ambiance sonore, branchement de l'interface |

`src/styles.css` : la feuille de style. `src/index.template.html` : le squelette HTML avec deux
marqueurs, remplacés à l'assemblage par la feuille de style et par les scripts.

## Recettes

- **Ajouter une option à une scène** : une entrée `{ roomId, option }` dans
  `41-approches-supplementaires.js` (copier une option voisine). Libellé `What If — …` pour une
  variante; les effets (`effects`, `onSuccess`, `onFailure`) deviennent des pastilles en %.
  Ajouter l'identifiant au test `tests/alternatives.test.cjs`.
- **Animer un décor** : une ligne dans `SCENE_LIFE` (`87-kit-ambiance.js`), par exemple
  `['fire', 197, 156, .9]`. Les éléments disponibles sont dans `LIFE`.
- **Voir un sprite** : `node tools/sprite-lab.cjs planche.png --mode shape drekthar malar`
  (modes `color`, `value`, `shape`). Modèles dans `85-sprites-protagonistes.js`.
- **Ajouter un test** : un fichier `tests/*.test.cjs`; `tests/support.cjs` démarre le moteur sans navigateur.
- **Tests navigateur** (Chromium via Playwright, hors `node --test`) : `node tests/browser-smoke.cjs`,
  `book-browser.cjs`, `verdure-browser.cjs`, `d20-browser.cjs`. Variable `DD5_CHROMIUM_PATH` pour
  désigner un Chromium précis.
- **Relire les sources de campagne** : `python3 tools/extract_campaign.py` (prérequis :
  `tools/requirements.txt`) extrait le journal, les fiches et les documents de `sources/` avec
  l'adresse de chaque cellule, paragraphe ou page.

## Documents

- `docs/ETAT_DU_PROJET.md` : fonctionnalités, règles de jeu, précisions du MJ, suite.
- `docs/CHRONIQUE_CAMPAGNE.md` : chronique en 18 chapitres (lue par les tests).
- `docs/campaign-reference.json`, `docs/source-inventory.json` : faits sourcés et empreintes des
  documents de `sources/` (vérifiées par les tests).
- `docs/STATISTIQUES_DD5.md`, `docs/character-stats.json`, `docs/level-progression.json` : statistiques.
- `docs/ATELIER_MJ.md` : interviews et précisions du MJ.
- `docs/references/` : brief pixel art, bible des sprites, référence de Langdedrosa.
- `docs/previews/` : aperçus du pixel art.
