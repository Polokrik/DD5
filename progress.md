# Suivi du chantier DD5

État au 30 octobre 2026. Branche : `feat/dd5-illustrated-interface`.

## Déjà réalisé

- Réparation du moteur après les fusions, sauvegardes et checkpoints.
- Référentiel des sources, chronologie et chronique de 18 chapitres, jusqu’à
  l’invitation à Thay. Les événements suivants restent à écrire avec le MJ.
- Séparation du récit attesté et des variantes « What If ».
- Vérification des identités et races dans les fiches PDF.
- Interface de livre illustré, portraits, résultats narratifs après les choix,
  effets visuels et ambiance sonore facultative.
- Base de 30 tests du moteur et parcours automatisés dans le navigateur.

## Chantier terminé et validé

- [x] Corriger les retours qui restaurent une situation sans personnage capable
  d’agir, notamment au moulin ; proposer des voies de progression avec un coût.
- [x] Garantir deux choix utilisables par écran, résultats compris, et empêcher
  la répétition sans effet des actions du rituel final.
- [x] Raccorder les statistiques des sept fiches aux niveaux de l’aventure
  officielle. Distinguer les valeurs attestées et les projections.
- [x] Intégrer un D20 par épreuve, son calcul et son résultat sauvegardé.
  Animation facultative, passable immédiatement, sans nouveau tirage.
- [x] Tester réussites, échecs, personnages indisponibles, restauration et reprise
  des sauvegardes ; mettre à jour les rapports de validation.

Les données des fiches et les jalons du module sont intégrés. Les sept profils
affichent caractéristiques, compétences, sauvegardes et attaques, avec références
PDF séparées. Les épreuves annoncent leur bonus et leur DD/CA, puis expliquent le
résultat. L’animation des dés est passable et désactivable. Les dix variantes
collectives permettent de progresser avec un coût annoncé lorsque les approches
spécialisées ne sont plus possibles. La Force initiale de Bjolnir et Kairon est
reconstruite à **17**, selon la décision du MJ, et non présentée comme un relevé
historique. Les augmentations de caractéristiques anciennes restent inconnues.

Validation : **56 tests Node réussis**, plus trois parcours Chromium couvrant les
cinq actes, les effets de Verdure et les D20/fiches sur mobile. Les commandes et
limites sont dans [le rapport](docs/D20_ET_PARCOURS.md); les sources de calcul dans
[les conventions de statistiques](docs/STATISTIQUES_DD5.md). La CI lance désormais
les trois suites Node.

## Consignes durables

Respecter `AGENTS.md` et `agent.md`. Travailler hors de `main`, conserver le jeu
autonome dans `index.html`, le rendu pixel art et les animations déterministes.
Les jets interviennent une seule fois dans la logique, jamais dans le rendu.
Ne pas inventer de faits canoniques ni déplacer des événements pour faciliter
le jeu. Expliquer la situation, l’action, son risque puis son résultat dans une
prose française développée. Paris reste hors du périmètre de ce chantier.

## Écueils à vérifier

Deux boutons ne suffisent pas si tous deux ramènent au même blocage. Un retour
doit restaurer une décision praticable. Une lecture, une animation, un replay ou
un rechargement ne doit pas retirer le dé. Les niveaux ne doivent pas augmenter
en visitant plusieurs fois une salle. Les valeurs actuelles des PDF ne prouvent
pas l’équipement ni les caractéristiques des personnages à Verdure.

## Prochain chantier

- [ ] Approfondir les chapitres encore résumés à partir des textes et des réponses
  du MJ, avec des situations et des options concrètes.
- [ ] Enrichir les illustrations et leurs réactions aux choix au-delà de Verdure.
- [ ] Compléter les statistiques historiques uniquement si de nouvelles sources
  permettent de lever les incertitudes.

La description de revue est maintenue dans [PR_INTERFACE.md](docs/PR_INTERFACE.md).
La création ou mise à jour distante de la PR reste à effectuer : l’API GitHub
répond `Forbidden` depuis cet environnement. Aucun changement n’a été fusionné
dans `main`.
