Les fusions des PR #3 et #5 laissaient `index.html` impossible à analyser:
déclarations concurrentes, objets interrompus et fonctions de navigation absentes.
Cette réparation rétablit un jeu autonome qui démarre, traverse les cinq actes,
restaure ses checkpoints et sauvegarde sans écraser une partie depuis le menu.
L'ancienne finale concurrente est retirée; les trois plans de la finale stratégique
restent accessibles par un choix explicitement hypothétique.

Le journal et les fiches corrigent le groupe initial, les arrivées de Kairon et
Malar, les départs de Drek'Thar et Sislay, la revanche sur Cyanwrath et les œufs
noirs. Le MJ confirme que la campagne est en cours et en est à l'invitation à
Thay. Une chronique de 18 chapitres retrace l'ensemble joué à ce jour, avec un
référentiel sourcé et un rapport détaillant les scènes encore absentes du jeu.
La rédaction reprend l'ouverture et le ton fournis par le MJ.

Notre Paris est conservé dans un commit distinct: les 44 fichiers supprimés par
`e949a95` sont restaurés à l'identique, avec manifeste et plan de migration.
La branche locale indépendante `migration/notre-paris` contient leur snapshot
seul; aucun dépôt distant n'est créé et aucun fichier DD5 n'est retiré.

Validation effectuée:

- `node --test --test-isolation=none tests/engine.test.cjs`: 20 tests réussis.
- `DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs`: cinq actes,
  finale, rollback, sauvegarde/rechargement, clavier et rendu vérifiés dans
  Chromium, sans erreur JavaScript ni requête externe.
- `node tools/verify_paris.cjs`: 44 fichiers identiques à `606e2d7`.
- `git diff --check`: aucune erreur d'espacement.

Limites: adaptation encore abrégée, équilibrage et graphismes à approfondir;
plusieurs épisodes de Rise of Tiamat sont rédigés dans la chronique mais restent
à intégrer comme scènes jouables. Les anciennes sauvegardes invalides sont
refusées sans être effacées. Notre Paris n'a pas été testé sous Expo/Supabase.

Les détails de revue se trouvent dans `docs/AUDIT.md`,
`docs/campaign-reference.json` et `docs/CHRONIQUE_CAMPAGNE.md`.
