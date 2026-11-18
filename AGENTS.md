# Instructions pour les agents (toute IA travaillant sur ce dépôt)

Ce fichier est **la seule source d'instructions** du projet. `CLAUDE.md` y renvoie.
Lire ensuite, dans cet ordre :

1. [docs/ETAT_DU_PROJET.md](docs/ETAT_DU_PROJET.md) — ce que fait le jeu aujourd'hui, les précisions du MJ, la suite.
2. [docs/DEVELOPPEMENT.md](docs/DEVELOPPEMENT.md) — où se trouve chaque chose, comment construire et tester.

## Le projet

*Le Clan d'Estain* est un jeu narratif en français qui adapte la campagne **Tyranny of Dragons**
réellement jouée par un groupe d'amis (le MJ est le propriétaire du dépôt). Le joueur dirige le
groupe entier, choisit des approches, lance des D20, et suit la chronique illustrée en pixel art.
Le public est **les joueurs de cette campagne** : fidélité au récit vécu, pas de spoiler.

## Règles non négociables

### Canon et écriture
- Ne jamais présenter une hypothèse, un événement du module officiel ou une invention comme un
  fait de la campagne jouée. Source primaire : `sources/JDR DD5 2023.xlsx` (journal de partie),
  puis les fiches des personnages et les précisions du MJ (consignées dans `docs/ETAT_DU_PROJET.md`).
- Les variantes non jouées sont marquées « What If » dans les données (pastille « Et si… » à
  l'écran). Ne jamais les faire passer pour des faits. Ne pas inventer de dialogues ni de citations.
- La campagne réelle s'arrête à **l'invitation à Thay** : rien après ne doit être écrit comme joué.
- Le texte vu par le joueur reste immersif : pas de « fiche », « MJ », « journal », « variante »,
  « dans le jeu » dans la narration (les sources restent dans les champs `source`).
- Français, ton épique et sérieux, humour réservé aux provocations. Accorder au féminin
  Ellyjobell et Sislay (`agree`, `stateLabel`).

### Architecture
- Le jeu livré est **un seul fichier autonome, `index.html`**, qui s'ouvre sans installation ni
  réseau. Il est **généré** depuis `src/` : modifier `src/`, jamais `index.html`, puis reconstruire.
- Aucune dépendance externe au moment de jouer (pas de CDN, pas de paquet, pas de fichier annexe).
  Node.js et Playwright ne servent qu'aux tests.
- Données narratives dans des objets structurés (salles, options, drapeaux, variables), pas de
  logique d'embranchement codée en dur dans l'interface.

### Règles de jeu à préserver
- Chaque écran, résultat compris, propose au moins deux choix utilisables. Un retour restaure un
  état praticable; une approche ratée est épuisée dans la scène (pas de boucle).
- Un D20 par épreuve, tiré au clic dans la logique (jamais dans le rendu), conservé dans la
  sauvegarde : relire, recharger ou animer ne relance jamais le dé.
- Checkpoints : tout état (personnages, drapeaux, variables, décisions, sauvetage) doit être
  restauré par un retour en arrière et validé à l'import d'une sauvegarde.
- Morts permanentes. Game over seulement quand tous les compagnons présents sont morts.
- La bataille finale hypothétique reste dans le code mais n'est pas proposée (`?whatif=1` pour la tester).

### Rendu
- Pixel art 320×200, sans lissage, sans rotation CSS des sprites; au plus 48 couleurs par scène.
- Animations déterministes (aucun hasard par image), cadencées sur le temps réel (60 crans/s),
  respect du mouvement réduit (image fixe complète).
- Direction artistique : [docs/references/brief-pixel-art.md](docs/references/brief-pixel-art.md)
  et la [bible des sprites](docs/references/bible-des-sprites.html).

## Méthode de travail
- Travailler sur une branche dédiée, jamais directement sur `main`.
- Après toute modification de `src/` : `node tools/build.cjs` (ou `sh tools/build.sh`), puis
  `node tools/tests.cjs`. Le test `tests/build.test.cjs` échoue si `index.html` n'est pas à jour.
- Toute nouvelle règle ou option s'accompagne d'un test (`tests/*.test.cjs`).
- Pour les changements visuels, lancer aussi les tests navigateur (voir `docs/DEVELOPPEMENT.md`)
  et regarder le rendu (outil `tools/sprite-lab.cjs`).
- Mettre à jour `docs/ETAT_DU_PROJET.md` quand une fonctionnalité ou une règle change.

## Avant de considérer une tâche terminée
- Le canon est respecté et les variantes sont signalées.
- Le groupe, les absences, les captures et les morts sont gérés.
- Les checkpoints, la sauvegarde et l'import restent cohérents.
- Le rendu est déterministe et le mouvement réduit fonctionne.
- `index.html` est reconstruit et tous les tests passent.
