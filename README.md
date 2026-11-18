# Le Clan d'Estain — chronique interactive

Jeu narratif en français qui adapte la campagne *Tyranny of Dragons* jouée par le Clan d'Estain :
choix du groupe, épreuves au D20, livre illustré en pixel art. Il tient dans un seul fichier,
`index.html`, et se lance sans rien installer.

## Jouer

| Système | Double-cliquer sur |
| --- | --- |
| Windows | `Jouer.bat` |
| macOS | `Jouer.command` (au premier lancement : clic droit → Ouvrir) |
| Autre | `index.html`, dans un navigateur |

Le jeu s'ouvre dans sa propre fenêtre si Chrome ou Edge est installé, sinon dans le navigateur.

## Modifier le jeu

Les sources sont dans `src/`; `index.html` est **généré**. Après une modification :

| Étape | Windows | macOS | Ligne de commande |
| --- | --- | --- | --- |
| Assembler | `Construire.bat` | `Construire.command` | `node tools/build.cjs` ou `sh tools/build.sh` |
| Tester (Node.js requis) | `Tester.bat` | `Tester.command` | `node tools/tests.cjs` |

## Organisation du dépôt

| Dossier | Contenu |
| --- | --- |
| `src/` | le code et les données du jeu (voir [docs/DEVELOPPEMENT.md](docs/DEVELOPPEMENT.md)) |
| `tests/` | tests automatiques (moteur, règles, rendu, navigateur) |
| `tools/` | assemblage, tests, atelier de sprites, extraction des sources |
| `sources/` | documents de la campagne : journal de partie, fiches, modules officiels |
| `docs/` | état du projet, chronique, statistiques, précisions du MJ, références visuelles |

**Pour une IA ou un nouveau contributeur** : commencer par [AGENTS.md](AGENTS.md).
