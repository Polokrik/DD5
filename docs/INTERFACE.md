# Première tranche de l'interface illustrée

La présentation adopte un livre d'aventure: fond ardoise, papier ivoire,
accents cuivrés, titres en sérif et récit distinct des actions. Elle s'appuie sur
le moteur réparé, avec les mêmes règles, flags et sauvegardes.

[Aperçu sur ordinateur](previews/title.png) · [Aperçu mobile](previews/mobile.png)

## Ce qui est livré

- Écran titre avec paysage de Verdure en flammes, dragon bleu et trois entrées:
  commencer, reprendre et lire la chronique. Reprendre reste désactivé sans
  sauvegarde. Les outils de sauvegarde sont regroupés dans un menu.
- Scènes illustrées pour l'approche de Verdure, la rue de Linan et la forteresse;
  textes d'ouverture adaptés du style et des faits fournis par le MJ.
- Cartes de choix au clic et au clavier, portraits des acteurs et compétences
  en français. Les personnages indisponibles ne donnent pas accès à leurs choix.
  Les touches numériques fonctionnent aussi sans ouvrir la saisie de commandes.
- Portraits des compagnons présents, blessures visibles et fenêtre détaillant
  les sept personnages, y compris les absents.
- Lecteur hors ligne des 18 chapitres complets. Le journal de session reste
  accessible dans un onglet séparé. Ce dernier retrace la session courante;
  le texte intégral de campagne demeure disponible après rechargement.
- Bouton undo, menu de sauvegarde, formulaire d'import validé et commandes
  classiques dans un panneau replié sous le récit.

L'ordre canvas → contexte → saisie reste respecté. Le récit n'est jamais placé
dans le champ de commande. Les fenêtres natives `dialog` assurent la navigation
clavier et la fermeture par Échap. Les raccourcis de jeu n'interceptent pas les
chiffres saisis dans un formulaire ou lorsque le journal est ouvert.

## Dessin et fonctionnement autonome

Le jeu reste un seul fichier `index.html`, sans bibliothèque, police distante,
image externe ou requête réseau. Les décors et portraits sont dessinés au canvas
à partir d'une palette fixe de 40 couleurs pour les scènes. Les surfaces de
décor et portraits sont mises en cache; les flammes, braises et ailes suivent
des phases prédéfinies. Le canevas reste en 320×200, sans lissage.

La préférence système de réduction des animations est respectée à l'ouverture.
Le rendu est identique à tick fixé. Les couleurs hors de la palette ne sont pas
créées par des contours anticrénelés: les polygones utilisent des scanlines de
pixels entiers. L'interface s'adapte aux petits écrans sans défilement horizontal.

## Vérification effectuée

```sh
node --test --test-isolation=none tests/engine.test.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
node tools/verify_paris.cjs
git diff --check
```

22 tests du moteur réussissent. Chromium valide les cinq actes, l'undo,
les sauvegardes et les interactions de la nouvelle interface. Le parcours au clic
va de l'écran titre au sauvetage de Linan. Les tests couvrent aussi les
formulaires d'import valide/invalide, les raccourcis, les portraits et le lecteur
des 18 chapitres. Aucun appel externe ni erreur JavaScript n'est observé.
Les largeurs 320, 390, 768, 1024 et 1440 pixels sont contrôlées, ainsi que le
mode mouvements réduits et une palette réelle de canvas inférieure à 49 couleurs.

## Portée

Les autres salles bénéficient des choix cliquables, portraits et panneaux, mais
leurs illustrations restent un décor d'ambiance générique. Elles n'ont pas encore
reçu la direction artistique détaillée de Verdure. Le contenu narratif, les
branches What If et la frontière entre campagne jouée et finale hypothétique
restent ceux de l'audit. Notre Paris et les documents sources restent inchangés.

La chronique est embarquée dans `CHRONICLE_CHAPTERS`, à partir de
`docs/CHRONIQUE_CAMPAGNE.md`. Un test compare chaque paragraphe; toute évolution
du document doit être reportée dans cette donnée pour conserver le lecteur
autonome. Aucun chargement de Markdown externe n'est nécessaire au joueur.
