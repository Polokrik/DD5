# Verdure: récit, illustrations et effets d’action

Cette tranche poursuit la révision du livre interactif sur
`feat/dd5-illustrated-interface`. Le jeu reste entièrement contenu dans
`index.html`, sans téléchargement d’image, de police ou de son. Notre Paris et
les documents primaires restent inchangés.

## Ce qui est jouable

Cinq décors complètent ceux de l’ouverture: le tunnel vers la rivière, le temple
assiégé, le moulin à eau, le défi à l’aube et la salle de la revanche dans la
grotte. Les remparts sont également mis en scène pendant l’assaut du dragon.
Le cadrage des duels privilégie la zone où se trouvent les combattants.

Les scènes du tunnel, du temple, du moulin et du dragon décrivent maintenant
l’enjeu avant le clic. Les rats éloignés et la porte ouverte du tunnel ne sont
plus annoncés comme déjà résolus: Ellyjobell et Darrin accomplissent ces gestes
dans le récit de résolution. Le dragon n’est chassé qu’après l’intervention du
Clan. Les textes du défi et de la revanche distinguent les deux rencontres.

Une vignette accompagne les résultats de seize décisions de Verdure et de la
revanche. Elle est placée près du texte, pour rester visible après le défilement
vers le récit. Les effets dépendent de l’action et de son résultat: impact du
marteau, passage des habitants dans le brouillard, magie, affrontement, repli,
ouverture de porte et départ du dragon. Les personnages à terre sont représentés
couchés; la scène ne montre pas un acteur absent ou capturé comme s’il agissait.

Le bouton **Revoir l’action** relance seulement la mise en scène. Il ne touche
ni aux états, ni aux objectifs, ni aux checkpoints, ni à la sauvegarde. La reprise
d’un résultat sauvegardé affiche son image finale sans relancer automatiquement
les effets ou le son. Les anciens résultats sans identifiant d’action restent
lisibles.

## Ambiance et accessibilité

Le bouton **Ambiance** donne accès aux effets, aux mouvements et au son.

- Les sons sont désactivés par défaut. Leur activation nécessite un geste du
  joueur. Un réglage déjà autorisé attend aussi un geste après rechargement.
- Le volume est réglable. Couper le son arrête les sources d’ambiance et les
  effets en cours; masquer l’onglet met également le son en pause.
- Les ambiances sont des sons synthétiques sobres: vent, eau et ponctuations
  courtes de magie, de combat ou de porte. Aucun cri humain enregistré et aucune
  bande musicale ne sont intégrés dans cette tranche.
- La préférence système de mouvements réduits est respectée, y compris si elle
  change pendant la partie. Le joueur peut également choisir des mouvements
  réduits dans le jeu. Les vignettes montrent alors leur état final fixe.
- Les secousses restent limitées à l’illustration. Le récit, les choix et leur
  position de lecture restent stables. Aucun renseignement nécessaire n’est
  transmis uniquement par le son, la couleur ou l’animation.

Les préférences sont conservées séparément de la partie dans le navigateur.
Changer le volume ou les mouvements ne réécrit pas la progression.

## Sources et points ouverts

Le découpage utilise `JDR DD5 2023.xlsx`, feuille `Tyranny of dragons`:

| Scène | Lignes de référence |
| --- | --- |
| Tunnel et porte rouillée | 17–18, 23–25 |
| Temple, illusion et brouillard | 23–28 |
| Moulin et embuscade | 29–30 |
| Dragon sur la forteresse | 28–32 |
| Premier duel | 33–35 |
| Revanche dans la grotte | 71–72 |

Le brouillard de l’évacuation est attribué à Ellyjobell, conformément au journal.
Le souvenir distinct du MJ concernant Darrin reste enregistré comme incertain.
Les alternatives de négociation, de contournement et de victoire anticipée ne
deviennent pas des faits de la campagne.

La question sur les réactions de Drek’Thar et du groupe après le premier duel
reste ouverte dans l’atelier MJ. Aucune réaction supplémentaire ou règle
d’interdiction d’intervention n’est inventée en attendant sa réponse.

Une incohérence a aussi été corrigée dans les résultats: une défaite mortelle
de Drek’Thar dans une variante ne promet plus qu’il revient vivant et blessé.
Le récit tient compte de son état effectif.

## Vérifications reproductibles

```sh
node --test --test-isolation=none tests/engine.test.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/verdure-browser.cjs
node tools/verify_paris.cjs
git diff --check
```

La suite moteur compte 30 tests. Le parcours général traverse les cinq actes,
les échecs et les variantes. Le test ciblé de Verdure joue les deux duels au
clic et vérifie les décors distincts, la palette de 48 couleurs au maximum, le
rendu identique à tick fixé, la lecture stable, les préférences et les anciens
résultats. Il contrôle le silence initial, l’activation volontaire, l’arrêt des
sources au passage en muet, l’absence d’autoplay et le repli silencieux si
l’AudioContext est refusé.

Les écrans de 320, 390 et 1440 pixels sont contrôlés. Les captures du temple,
du moulin, du brouillard, des deux duels et des réglages sont générées dans
`/tmp/dd5-v2-*.png`. Le rendu pixel art et la synthèse sonore utilisent des
séquences déterministes; ils ne modifient pas les résultats du jeu.

Résultat: les 30 tests du moteur, le parcours général Chromium et le test ciblé
Verdure passent. Aucune erreur JavaScript ni requête externe n’a été observée
dans le parcours général. Les 44 fichiers de Notre Paris sont identiques au
contenu conservé.

[Évacuation sous le brouillard](previews/fog.png) ·
[Défi de Cyanwrath](previews/duel.png) ·
[Réglages d’ambiance](previews/ambiance.png)

Les épisodes ultérieurs gardent encore plusieurs résumés et décors d’ambiance.
La prochaine étape narrative consiste à développer les scènes du camp et de
la grotte avec la même séparation entre situation, intention et résultat.
