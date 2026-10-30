# Instructions du projet

Les consignes de [agent.md](agent.md) s'appliquent intégralement au jeu DD5.
Lire ce document avant toute modification du jeu : HTML autonome, sans dépendance
externe au runtime, rendu canvas déterministe, séparation contexte/saisie,
contrôle du groupe, morts permanentes et restauration des checkpoints.

- Ne jamais présenter une hypothèse ou un événement du module comme un fait de la
  campagne jouée. Citer la source et laisser les informations inconnues ouvertes.
- Maintenir les variantes « What If » distinctes des faits attestés.
- Travailler sur une branche dédiée, sans modifier directement `main`.
- Les outils de test et les rapports peuvent être séparés ; le jeu reste dans
  `index.html` et fonctionne sans installation.
- `paris-guide/` est une autre application. Préserver son contenu ; aucune
  modification fonctionnelle ni suppression lors des travaux DD5. Sa migration
  nécessite une validation séparée avant tout retrait de ce dépôt.
