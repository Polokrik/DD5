# Statistiques DD5 et niveaux de l’aventure

Les fiches PDF fournissent sept instantanés de personnages, aux niveaux 5 à 10.
Le jeu en conserve les valeurs imprimées et affiche séparément une projection au
niveau de la scène. Cette projection permet de jouer les premiers chapitres sans
présenter des statistiques reconstituées comme les anciennes fiches de la table.

Les extractions sont consultables dans [character-stats.json](character-stats.json).
Les jalons, leurs pages sources et la correspondance des 57 salles figurent dans
[level-progression.json](level-progression.json). Les numéros de page désignent les
pages physiques des PDF, à partir de 1.

## Valeurs attestées dans les fiches

| Personnage | Classe | Niveau de la fiche | FOR | DEX | CON | INT | SAG | CHA | CA | PV max. | Maîtrise |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Bjolnir | Paladin | 10 | 19 | 10 | 16 | 8 | 12 | 16 | 21 | 85 | +4 |
| Drek’Thar | Guerrier | 5 | 20 | 12 | 16 | 14 | 10 | 13 | 16 | 49 | +3 |
| Ellyjobell | Druide | 10 | 14 | 18 | 17 | 17 | 18 | 12 | 18 | 81 | +4 |
| Darrin | Ensorceleur | 10 | 11 | 13 | 14 | 15 | 9 | 16 | 11 | 62 | +4 |
| Kairon | Occultiste | 9 | 19 | 13 | 15 | 12 | 14 | 20 | 17 | 67 | +4 |
| Malar | Roublard | 9 | 12 | 19 | 12 | 12 | 15 | 18 | 17 | 58 | +4 |
| Sislay | Rôdeuse | 5 | 14 | 14 | 16 | 11 | 10 | 14 | 13 | 53 | +3 |

Ces données viennent de la page 1 de Bjolnir.pdf, drekthar.pdf, Ellyjobell.pdf,
darrin.pdf, kairon.pdf, malar.pdf et sislay.pdf. Les pages suivantes renseignent
notamment l’équipement, les traits et les sorts. Les en-têtes de niveau servent de
référence; plusieurs compteurs d’XP ne sont plus à jour.

## Projection choisie pour le jeu

Le niveau dépend des jalons du module officiel et de la progression déjà atteinte.
Revenir dans une salle ne donne aucun niveau supplémentaire. Un retour à un
checkpoint restaure le niveau qui y était enregistré.

Les caractéristiques conservent les scores de la fiche, sauf la reconstruction de
Force ci-dessous. On ne divise pas les scores ni les bonus par le rapport des
niveaux. Les augmentations de caractéristiques et les dons historiques ne sont pas
connus: un score projeté à bas niveau reste donc une adaptation, même s’il provient
d’une fiche authentique plus récente.

Le MJ ne se souvient plus de la Force naturelle de Bjolnir et Kairon et a proposé
«16/17 minimum». Le jeu retient **17** avant les gantelets d’ogre. Il retrouve 19 au
niveau de l’instantané fourni : 10 pour Bjolnir et 9 pour Kairon. Ce seuil est une
convention de projection; **la date d’acquisition des gantelets reste inconnue**.
Il ne faut pas écrire dans la chronique qu’ils ont été obtenus à ces niveaux.

Les calculs suivent les formules suivantes:

- Modificateur de caractéristique: `floor((score - 10) / 2)`.
- Maîtrise, pour les niveaux 1 à 20: `2 + floor((niveau - 1) / 4)`.
- Compétence: modificateur + coefficient de maîtrise × bonus de maîtrise.
- Les coefficients 0,1 ou 2 viennent des totaux imprimés: absence de maîtrise
  visible, maîtrise ou expertise. Cette déduction arithmétique ne restitue pas la
  date des choix d’apprentissage.
- Sauvegarde: modificateur + maîtrise applicable. L’Aura de protection de Bjolnir
  ajoute son modificateur de Charisme, minimum+1, seulement à partir du niveau 6
  lorsqu’il est conscient. Aucune aura n’est ajoutée à ses compétences.
- Attaque de base: modificateur pertinent + maîtrise. Les bonus d’armes magiques
  imprimés restent consultables dans la référence; ils ne sont pas attribués
  rétroactivement à tous les chapitres.
- Attaque de sort: maîtrise + modificateur d’incantation. DD de sort:
  `8 + maîtrise + modificateur d’incantation`.

La CA reste celle de la fiche et est désignée comme telle. Sans équipement
historique complet, aucune CA de départ n’est inventée.

Au niveau exact de la fiche, les PV maximaux imprimés sont conservés. Avant ce
niveau, l’estimation utilise le dé de vie maximal au niveau 1 puis sa moyenne
arrondie au supérieur à chaque niveau, avec la Constitution à chaque fois.
Après le niveau de référence, chaque niveau ajoute cette même moyenne avec
Constitution aux PV imprimés. Ces valeurs sont marquées «PV estimés» et ne
prétendent pas reproduire les anciens jets de PV. Le système narratif conserve
ses états de groupe; afficher des PV maximaux ne constitue pas une simulation
complète des combats et des dégâts.

## Jalons retenus

| Étape achevée | Niveau projeté ensuite |
| --- | ---: |
| Défense de Verdure | 2 |
| Camp des pillards | 3 |
| Écloserie | 4 |
| Voyage de la caravane | 5 |
| Carnath seul | 5, aucun gain |
| Activation du portail de Naerytar | 6 |
| Rencontre avec Talis | 7 |
| Cumulus | 8 |
| Varram / Diderius | 9 |
| Mer de Glace / Arauthator | 10 |
| Première attaque du Culte | 11 |
| Neronvain | 12 |
| Invitation à Thay | 12, aucun gain |

La correspondance entre l’assaut avec le jeune dragon bleu du journal
(`JDR DD5 2023.xlsx`, feuille Rise of Tiamat, lignes 185–186) et la première
attaque du Culte est un choix de projection étayé. Le niveau gagné à cette séance
n’est pas attesté. Sans cette correspondance, les derniers chapitres seraient
projetés un niveau plus bas. La campagne jouée s’arrête à l’invitation à Thay:
l’invitation ne vaut pas accomplissement de la mission et ne donne pas son gain
optionnel de niveau.

L’acte V reste un «What If» indépendant, projeté au niveau 14 selon la borne basse
recommandée pour la finale du module (14–15). Il ne signifie pas que Thay,
Xonthal ou les épisodes intermédiaires ont déjà été joués.

## Réserves connues dans les documents

- Kairon: les totaux imprimés des compétences et sauvegardes omettent les
  maîtrises normalement attendues. Le jeu conserve les totaux attestés sans lui
  inventer des maîtrises. Deux entrées de Décharge occulte se contredisent;
  les valeurs brutes restent dans la référence.
- Sislay: plusieurs champs semblent copiés d’autres classes. Les seuls bonus
  de maîtrise visibles en compétence sont Perspicacité et Intimidation.
  Discrétion+2, Perception 0 et Survie 0 restent les totaux de référence.
- Drek’Thar: Intimidation+1 ne contient pas la maîtrise raciale attendue pour
  un demi-orc en 5e édition (2014). Le total imprimé est conservé et l’écart est signalé.
- Darrin: l’en-tête indique ensorceleur 10, mais XP 6840 correspond au niveau 5.
  Des traits de niveaux 14 et 18 et des sorts de niveau 7 sont listés; cela ne lui
  accorde pas leur usage au niveau 10. Boule de feu utilise une sauvegarde et
  Projectile magique ne demande pas de jet d’attaque, même si une cellule de la
  fiche ressemble à une attaque.
- Ellyjobell: certaines descriptions de traits sont anciennes, dont la durée
  de forme sauvage et les PV temporaires de l’esprit de l’ours.
- Malar: le compteur d’XP ne correspond pas à l’en-tête de niveau 9.

Le détail et les sources de chaque réserve figurent dans
[character-stats.json](character-stats.json). Un correctif ultérieur du MJ devra
être explicite et conserver la trace de la valeur d’origine.

## Vérification de l’extraction

Le runtime des statistiques a été comparé aux données extraites : 241 assertions
sur les scores, toutes les compétences et sauvegardes, les PV au niveau de
référence, les paliers de maîtrise 1–20, la Force reconstituée et l’activation de
l’aura. Les totaux de compétences et sauvegardes reproduisent exactement les sept
fiches à leur niveau de référence. Ce contrôle ne prouve pas la justesse des
projections historiques; leurs hypothèses restent celles décrites ci-dessus.
