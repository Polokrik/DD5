L'ancienne présentation affichait une console de commandes et un canvas composé
de blocs. Cette tranche introduit une interface de livre d'aventure: titre
illustré, scènes en pixel art de Verdure et Linan, portraits du groupe et cartes
de choix cliquables. Les chiffres fonctionnent directement au clavier et dans
la saisie; il n'est plus nécessaire de connaître la syntaxe `choose`.

Le journal contient les 18 chapitres complets de la campagne, intégrés au HTML
pour une lecture sans réseau. Les commandes classiques restent accessibles dans
un panneau discret. Les sauvegardes, imports validés et checkpoints sont conservés.
Le jeu reste un fichier autonome, sans dépendance runtime ni requête externe.

Validation: 22 tests du moteur réussis; Chromium parcourt les cinq actes et vérifie
les clics, les raccourcis, le lecteur des 18 chapitres, les portraits, les imports,
l'undo et le rechargement. Affichage contrôlé entre 320 et 1440 pixels, réduction
des animations respectée, rendu déterministe et palette de scène ≤ 48 couleurs.

La direction artistique détaillée couvre le titre, l'approche de Verdure, la rue
de Linan et la forteresse. Les autres salles utilisent la nouvelle interface avec
un décor d'ambiance générique. Notre Paris et les sources de campagne sont inchangés.

Cette branche part de `repair/dd5-audit-campaign`. Comparer à cette branche pour
revoir uniquement l'interface; comparer à `main` inclut également les réparations
du moteur et la conservation de Notre Paris.

Voir `docs/INTERFACE.md` et les captures `docs/previews/title.png` et
`docs/previews/mobile.png`.
