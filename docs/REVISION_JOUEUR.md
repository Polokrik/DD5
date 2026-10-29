# Révision du récit et des embranchements

Branche: `feat/dd5-illustrated-interface`. Cette révision prolonge l’audit initial
et l’interface illustrée. Elle conserve le moteur mono-fichier et le dessin au
canvas; elle ne touche pas à Notre Paris.

## Diagnostic du point de vue du joueur

| Signal constaté avant correction | Conséquence | Correction | Priorité |
| --- | --- | --- | --- |
| Le résultat d’une action était remplacé immédiatement par le contexte suivant. | Le joueur ne pouvait pas suivre le geste du personnage ni la réaction de ses adversaires. | Étape de résolution persistante, puis bouton pour poursuivre. | Critique |
| Des échecs au temple et au moulin validaient leur mission. | Le texte décrivait un sauvetage raté, mais la progression considérait l’objectif accompli. | Objectifs validés uniquement au succès; missions accessibles pour une nouvelle tentative. | Critique |
| Navigation parfois consommée comme une décision unique. | Un retour ou une nouvelle tentative pouvait disparaître. | Transitions rejouables, retour au checkpoint et accès à l’accueil. | Critique |
| Les œufs précédaient la revanche et éclosaient sur la route de la caravane. | Les scènes suivaient mal le journal. | Revanche → œufs → Mondath → retour à Verdure → route d’Elturel et éclosion. | Importante |
| Le Conseil pouvait mener directement aux dragons en fonction du score. | Diderius, la Mer de Glace et les étapes suivantes étaient absents du parcours. | Séquences de récit dans l’ordre documenté, indépendamment du score diplomatique. | Importante |
| Choix génériques et risques peu visibles. | Impossible de comprendre l’action proposée et son coût possible. | Verbes concrets, acteur identifié, intention et risque avant le clic; bilan des changements après. | Importante |
| Courtes formules emphatiques, titres et numéros peu liés au chapitre. | La lecture paraissait artificielle et les repères trompeurs. | Ouvertures réécrites, paragraphes reliés, titres issus de la chronique. | Importante |
| Sept petites biographies présentées ensemble. | Les détails des PDF étaient difficiles à consulter. | Sélection d’un personnage et fiche lisible avec identité, biographie, équipement et sources. | Importante |

## Parcours corrigé et limites de fidélité

À Verdure: famille de Linan → forteresse → tunnel et temple → moulin → attaque du
dragon → duel de Drek’Thar → instructions de Nighthill. Le duel de la chronique
laisse Drek’Thar vivant et blessé; sa victoire dès Verdure reste un What If.

Ensuite: libération de Leosin et retour → grotte → revanche → œufs → Mondath →
Elturel → tournoi → caravane → Carnath → Naerytar → pavillon et Kairon → Cumulus
et Malar → Waterdeep → Diderius → Mer de Glace → second Conseil → dragons
métalliques → Forêt Brumeuse → Neronvein → invitation de Thay.

Les nouvelles étapes intermédiaires sont des résumés jouables au clic. Elles ne
constituent pas encore des quêtes aussi détaillées que Verdure. Le chapitre 18
reste une courte ouverture; Thay, Xonthal et la bataille finale ne sont pas
inventés comme événements déjà joués. L’acte V demeure une simulation facultative.
Les calculs de soutien des factions sont des règles de l’adaptation, pas un
compte rendu de votes attestés à la table.

Les conditions demandées par les dragons sont distinguées d’une alliance déjà
acquise. Les alternatives sans les œufs n’annoncent pas la naissance de Boule et
Bill; une victoire anticipée sur Cyanwrath ne le fait pas réapparaître vivant.

## Rédaction et personnages

L’ouverture fournie par le MJ reste la référence de ton. Le récit privilégie les
lieux, les actions et leurs suites dans des phrases complètes. Les aphorismes
promotionnels et les oppositions ajoutées pour donner une gravité artificielle
ont été retirés des ouvertures et de plusieurs passages de la chronique.

Vingt décisions disposent d’un récit de résolution spécifique, notamment les
trois approches de Linan, les évacuations du temple, le moulin, les deux duels et
les plans de la finale simulée. Les autres résolutions utilisent leur message
d’action et un bilan des changements d’état, du moral, de l’alerte, des objectifs
et des relations avec les factions. Leur développement littéraire reste à
poursuivre; toutes les situations ne disposent pas encore de deux paragraphes.

Le geste du marteau et l’injonction de Bjolnir sont une mise en scène adaptée au
jeu. Le refus de tuer et la reddition viennent du MJ; les mots précis ne sont
pas présentés comme une citation de la table. Les variantes sont signalées dans
les choix ou leur intention. La chronique documentaire ne reçoit aucun dialogue
inventé.

Les sept fiches PDF ont fourni les races, les classes, les historiques renseignés,
les traits et l’équipement. La biographie Word complète celle de Malar. Les
champs vides restent vides: aucun passé nouveau n’est attribué à Sislay. Les
objets acquis tardivement sont séparés et ne sont pas ajoutés à l’inventaire de
Verdure. Les précisions et leurs sources sont conservées dans
`campaign-reference.json`, sous `characters[].sheetDetails`.

Le souvenir du brouillard de Darrin reste consigné comme incertain: le journal
attribue à Ellyjobell le brouillard qui couvre l’évacuation du temple. La révision
ne tranche pas silencieusement entre ces deux indications.

## Revue de design selon le skill joint

Le skill **design-deslopifier** fourni dans `SKILL.md` a servi à la revue.
Ses fichiers de références et de modèles n’étaient pas joints; la revue suit son
document principal et les écrans réellement rendus. Intervention de niveau 1:
la composition illustrée appréciée par le MJ est conservée et les problèmes de
lecture et de décision sont corrigés en priorité.

Direction retenue: un livre d’aventure illustré, avec l’image comme repère de
lieu et le texte comme support principal de l’action.

- Typographie: sérif Georgia pour le récit, sans sérif système pour les outils;
  paragraphes limités à environ 68 caractères par ligne.
- Palette: ardoise, ivoire et cuivre existants. Le cuivre signale les repères et
  interactions; les bilans distinguent succès et difficultés par leur texte et
  leur fond, sans dépendre de la couleur seule.
- Composition: illustration, compagnie, récit et décisions; aucun nouveau
  tableau de bord. Une seule action principale pendant un résultat: poursuivre.
- Surfaces: réduction des slogans et des encadrements de biographies. Les cartes
  restantes sont des boutons de choix, avec une fonction interactive précise.
- Icônes: pictogrammes linéaires existants pour les outils, portraits pixel art
  pour les acteurs; aucune nouvelle famille décorative.
- Mouvement: phases déterministes existantes, préférence de mouvements réduits
  conservée. Le récit reçoit le focus après un clic pour que le résultat soit
  visible, sans défilement animé imposé.
- Mobile: lecture sur une colonne, sept personnages visibles dans le sélecteur,
  contenu des fiches défilant séparément, cibles tactiles conservées.

Les rendus ordinateur, récit de reddition, ouverture mobile et fiche de Malar
ont été examinés. Les scènes ultérieures utilisent encore un décor d’ambiance
générique. Cette révision n’ajoute ni cris, ni bande sonore, ni nouveaux effets
événementiels; leur réalisation pourra s’appuyer sur les résolutions désormais
distinctes.

## Validation et revue de la branche

Le parcours Chromium utilise les boutons visibles pour traverser les cinq actes,
en lisant l’étape de résultat avant le choix suivant. Un second parcours joue
réellement rivière → magie → passage discret du temple → assaut du moulin,
sans modifier les scores: il vérifie les blessures, l’objectif non accompli,
la reprise par une autre approche, l’undo et l’accueil avec reprise de sauvegarde.

La suite Node vérifie aussi les trois plans finaux, les quatre issues, les morts,
les absences, les références, chaque option dans deux configurations, les imports,
la compatibilité des anciens flags, la persistance du résultat et l’ordre des
étapes. Les empreintes des documents sources et des 44 fichiers de Notre Paris
sont contrôlées séparément.

Résultat: 27 tests Node réussis; les trois parcours Chromium réussissent. Les
chapitres de l’iceberg et de l’affrontement contre Neronvein ont des écrans
distincts pour que les repères 13 et 17 correspondent bien au récit affiché.
Commandes reproductibles:

```sh
node --test --test-isolation=none tests/engine.test.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
node tools/verify_paris.cjs
git diff --check
```

Le diff HTML est volumineux en partie parce que les tables de salles ont été
réécrites en objets JSON lisibles, plutôt qu’en longues lignes compactes. Les
tests et rapports restent séparés; aucun paquet n’est requis pour jouer.

## Prochaines améliorations prioritaires

1. Développer les étapes actuellement résumées, en partant du journal puis d’un
   entretien ciblé avec le MJ sur les décisions réellement prises et leurs
   alternatives possibles.
2. Étendre les récits de résolution spécifiques aux infiltrations de Naerytar,
   aux discussions du Conseil et aux actions répétées du rituel.
3. Illustrer le tunnel, le temple, le moulin et les duels avant de multiplier les
   décors génériques. Relier ensuite brouillard, flammes et secousses à des
   événements précis, avec option de réduction des effets et son désactivé au
   démarrage.
4. Donner au joueur un historique durable de ses choix et résultats, distinct du
   lecteur documentaire. Le résultat courant est sauvegardé; l’onglet historique
   actuel reste limité à la session.
