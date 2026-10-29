# Clan d’Estain — Chronique interactive

Jeu narratif autonome en français, dans `index.html`. Aucun paquet à installer
pour jouer: HTML, CSS et JavaScript intégrés, canvas 320×200 et rendu déterministe.

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

## Vérification

Node.js 24, sans installation de dépendance:

```sh
node --test --test-isolation=none tests/engine.test.cjs
node tools/verify_paris.cjs
```

Les tests chargent le script réel du HTML. Ils vérifient les références, toutes
les options dans deux configurations de score, les parcours des cinq actes,
les trois plans finaux, les sauvegardes, les états, les checkpoints, les numéros
de choix, les résultats après action, les objectifs à reprendre après un échec
et la fidélité du texte embarqué aux 18 chapitres du document. La CI
exécute la suite du moteur à chaque push et pull request.

Un test supplémentaire utilise un vrai navigateur. Playwright 1.62.1 et Chromium
ont été utilisés dans l'environnement cloud. Ces outils sont réservés aux tests:

```sh
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/verdure-browser.cjs
```

Ce test vérifie aussi les clics, les fenêtres du journal et du groupe, l'import,
les écrans de 320 à 1440 pixels, les mouvements réduits et la palette du canvas.
Il traverse les cinq actes avec les boutons visibles et joue un second parcours
défavorable sans modifier les scores, pour vérifier les reprises après échec.
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

`paris-guide/` est une application indépendante Expo/React Native. Les commandes
ci-dessus concernent uniquement DD5. Son contenu a été restauré à l'identique;
voir le [plan de migration](docs/NOTRE_PARIS_MIGRATION.md). Aucun fichier DD5 ne
doit être supprimé pour effectuer cette séparation.
