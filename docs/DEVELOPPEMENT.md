# Modifier le jeu

Le jeu livré est **un seul fichier autonome**, `index.html`, qui s'ouvre sans installation.
Il est **assemblé** à partir de `src/` : on modifie les sources, puis on régénère le fichier.

| Besoin | Windows | Autre | Ce qu'il faut |
| --- | --- | --- | --- |
| Jouer | `Jouer.bat` | `Jouer.sh` | rien (fenêtre propre via Edge ou Chrome, sinon le navigateur) |
| Assembler après une modification | `Construire.bat` | `node tools/build.cjs` | rien sous Windows (PowerShell fourni avec le système) |
| Tester | `Tester.bat` | `node tools/tests.cjs` | Node.js (seulement pour les tests) |

`tools/build.ps1` et `tools/build.cjs` font le même assemblage; les tests vérifient que `index.html` est à jour.

Ne jamais modifier `index.html` à la main : la prochaine construction écraserait la modification,
et le test `tests/build.test.cjs` échoue tant qu'il n'est pas à jour.

## Où trouver quoi (`src/scripts/`, assemblés dans l'ordre des numéros)

| Fichier | Contenu |
| --- | --- |
| `00-constantes` | tailles du canvas, clés de sauvegarde, réglages d'URL (`?whatif=1`) |
| `10-chronique`, `11-presentation`, `12-mise-en-scene` | les 18 chapitres, textes de présentation, mises en scène des actions |
| `20-personnages`, `22-etat-initial` | compagnons, drapeaux, variables, actes |
| `21-donnees-acte-ii`, `30-salles` | les salles et leurs options (données) |
| `40-alternatives-securisees`, `41-approches-supplementaires` | variantes « Et si… », approches de remplacement, provocations |
| `42-epreuves-de-chronique`, `43-expansion-du-livre`, `44-cumulus-et-reperes` | épreuves, scènes étoffées, observations, Cumulus |
| `50-fiches-et-niveaux`, `51-etat-et-sauvegarde` | statistiques DD5, état de partie, sauvegarde et import |
| `60-interface-et-choix` | cartes de choix, effets en %, bandeau, fiches |
| `70`–`75` | règles : D20, checkpoints, résolution, repos, pertes, décisions, commandes |
| `80`–`88` | rendu pixel art : primitives, décors, sprites, ambiance, boucle de rendu |
| `90-son`, `99-demarrage` | ambiance sonore, branchement de l'interface |

`src/styles.css` : la feuille de style. `src/index.template.html` : le squelette HTML.

## Recettes

- **Ajouter une option à une scène** : dans `41-approches-supplementaires.js`, une entrée `{ roomId, option }`
  (copier une option voisine). Préfixer le libellé par `What If —` pour une variante; les effets (`effects`,
  `onSuccess`, `onFailure`) sont convertis automatiquement en pastilles %. Ajouter l'identifiant au test
  `tests/alternatives.test.cjs`.
- **Animer un décor** : une ligne dans `SCENE_LIFE` (`87-kit-ambiance.js`), par exemple `['fire', 197, 156, .9]`.
  Les éléments disponibles sont dans `LIFE` (feu, fumée, brume, neige, oiseaux, lucioles…).
- **Voir un sprite** : `node tools/sprite-lab.cjs planche.png --mode shape drekthar malar`
  (modes `color`, `value`, `shape`). Les modèles sont dans `85-sprites-protagonistes.js`.
- **Ajouter un test** : un fichier `tests/*.test.cjs` (voir `tests/support.cjs` pour démarrer le moteur sans navigateur).
- **Tests navigateur** (Chromium, hors `node --test`) : `node tests/browser-smoke.cjs`, `book-browser.cjs`,
  `verdure-browser.cjs`, `d20-browser.cjs`. Ils demandent Playwright et la variable `DD5_CHROMIUM_PATH`.

## Règles du projet

Voir `AGENTS.md` et `agent.md` : pas de canon inventé, variantes « What If » distinctes des faits attestés,
rendu déterministe, mouvement réduit respecté, palette limitée à 48 couleurs par scène.
