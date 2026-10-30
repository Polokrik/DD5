# Clan d’Estain — Chronique interactive

Jeu narratif autonome en français, dans `index.html`. Aucun paquet à installer
pour jouer: HTML, CSS et JavaScript intégrés, canvas 320×200 et rendu déterministe.

Le suivi du chantier, les limites connues et les prochaines étapes sont dans
[progress.md](progress.md).

Depuis la racine du dépôt, démarrer un serveur statique:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

L'interface propose des choix cliquables, des raccourcis numériques, les portraits
de la compagnie et un lecteur intégré des 18 chapitres de la chronique.
La première tranche illustrée couvre le titre, l'approche de Verdure, la famille
de Linan et l'arrivée à la forteresse. Voir les [détails de l'interface](docs/INTERFACE.md).

Le panneau « Commandes clavier et outils » reste disponible. Commandes:
`1`, `2`, `3`, `help`, `choose <numéro>`, `look`, `n/s/e/w`, `party`,
`sheet`, `save`, `load`, `undo`, `export`, `import <json>`.
La sauvegarde utilise le stockage local du navigateur. Les commandes de réglage
des variables nécessitent `debug on` et servent uniquement au diagnostic.

La version actuelle est une adaptation abrégée. Les options « Chronique » citent
des événements joués; les variantes « What If » restent distinctes. L'acte V
simule une finale que le journal disponible ne documente pas.

Les décisions importantes donnent lieu à un récit de résolution, conservé à
l’écran jusqu’au clic sur « Poursuivre ». L’intention et les risques figurent
sous les choix; les blessures, objectifs et relations modifiés sont expliqués
après l’action. Le retour à la décision précédente reste disponible, ainsi que
l’accueil et le redémarrage dans le menu Sauvegarde.

La révision du déroulé, des textes et des sept fiches de personnages est détaillée
dans le [rapport de lecture et de jeu](docs/REVISION_JOUEUR.md). Les étapes allant
du camp du Culte à l’invitation de Thay suivent désormais l’ordre du journal,
avec plusieurs épisodes encore traités sous forme de résumés.

La tranche [Verdure vivante](docs/VERDURE_VIVANTE.md) ajoute cinq décors, des
vignettes de résolution et des effets liés aux décisions. Le bouton **Ambiance**
permet de régler les mouvements et d’activer des sons facultatifs, coupés par
défaut. **Revoir l’action** rejoue uniquement la mise en scène.

Les épreuves utilisent désormais un **D20**, les caractéristiques du compagnon
et sa maîtrise au niveau prévu par l’aventure. Le choix annonce son bonus, son DD
(ou la CA pour une attaque) et ses risques. Le résultat détaille le calcul et
ses conséquences. **Afficher le résultat maintenant** passe l’animation;
**Ambiance → Animer les jets de D20** permet de la désactiver durablement.
Le résultat est enregistré avant l’animation : recharger ou revoir l’action
ne relance jamais le dé. Le rendu reste déterministe; seul le tirage d’une
épreuve consomme du hasard.

Les portraits et **La compagnie** ouvrent les sept fiches : caractéristiques,
compétences, sauvegardes et attaques, avec valeurs projetées et référence PDF.
Les niveaux historiques et certaines augmentations restent inconnus. Voir les
[sources et conventions de calcul](docs/STATISTIQUES_DD5.md).
Les corrections de parcours et leur validation sont détaillées dans le
[rapport D20 et embranchements](docs/D20_ET_PARCOURS.md).

L’état arrêté au 30 octobre comprend aussi35scènes étoffées,70observations
facultatives et14nouveaux décors au-delà de Verdure. Les observations se consultent
dans « Observer les lieux » et n’ajoutent aucun jet ni coût. Les dernières
validations totalisent64tests Node et quatre parcours Chromium. Les travaux
restants et le brouillon non intégré de Cumulus figurent dans [progress.md](progress.md).

## Vérification

Node.js 24, sans installation de dépendance:

```sh
node --test tests/*.test.cjs
```

Les tests chargent le script réel du HTML. Ils vérifient les références, toutes
les options avec des D20 de 1 et de 20, les parcours des cinq actes,
les trois plans finaux, les sauvegardes, les états, les checkpoints, les numéros
de choix, les résultats après action, les objectifs à reprendre après un échec
et la fidélité du texte embarqué aux 18 chapitres du document. La CI
exécute les quatre suites à chaque push et pull request. Les dés fixes sont
injectés uniquement par les outils de test; le jeu utilise le générateur
cryptographique du navigateur.

Un test supplémentaire utilise un vrai navigateur. Playwright 1.62.1 et Chromium
ont été utilisés dans l'environnement cloud. Ces outils sont réservés aux tests:

```sh
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/verdure-browser.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/d20-browser.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/book-browser.cjs
```

Ce test vérifie aussi les clics, les fenêtres du journal et du groupe, l'import,
les écrans de 320 à 1440 pixels, les mouvements réduits et la palette du canvas.
Il traverse les cinq actes avec les boutons visibles et joue un second parcours
défavorable avec des D20 de 1, sans modifier les scores, pour vérifier les reprises
après échec. Le test D20 utilise aussi un vrai tirage, puis vérifie qu’il reste
inchangé lors de l’animation, de la relecture et du rechargement.
Les captures sont écrites dans `/tmp/dd5-ui-title.png`, `/tmp/dd5-ui-verdure.png`,
`/tmp/dd5-ui-linan.png`, `/tmp/dd5-ui-action.png`, `/tmp/dd5-ui-company.png` et
`/tmp/dd5-ui-mobile.png`.

Si Playwright n'est pas disponible, l'installer dans un répertoire d'outils
extérieur au projet et rendre son module accessible à Node, par exemple:

```sh
npm install --prefix /tmp/dd5-browser-tools playwright@1.62.1
NODE_PATH=/tmp/dd5-browser-tools/node_modules DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
```

Le test peut aussi utiliser le Chromium de Playwright lorsque `DD5_CHROMIUM_PATH`
est omis. Il faut alors avoir installé ce navigateur avec l'outil Playwright.

## Campagne et audit

- [Chronique rédigée, 18 chapitres](docs/CHRONIQUE_CAMPAGNE.md)
- [Référentiel structuré et incertitudes](docs/campaign-reference.json)
- [Diagnostic des fusions, bugs et écarts narratifs](docs/AUDIT.md)
- [Inventaire et empreintes des 17 sources](docs/source-inventory.json)

Pour réextraire les classeurs, documents Word et fiches PDF, utiliser Python 3.12
avec les dépendances de `tools/requirements.txt` dans un environnement d'outils:

```sh
python3 tools/extract_campaign.py > /tmp/dd5-sources.json
```

Cette extraction ne modifie aucun document. Les PDF des modules officiels sont
inventoriés mais ne sont pas traités comme un journal de partie.

## Notre Paris

Le dossier `paris-guide/` a été supprimé de `main` et n’est pas réintroduit par
cette publication de DD5. Une copie avait été conservée sur la branche d’audit,
avec un [plan de migration](docs/NOTRE_PARIS_MIGRATION.md) et un snapshot séparé.
Les commandes et le développement ci-dessus concernent uniquement DD5.
