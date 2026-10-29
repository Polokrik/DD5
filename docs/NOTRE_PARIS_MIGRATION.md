# Notre Paris — conservation et migration

## État conservé

Le commit `e949a95` avait supprimé `paris-guide/`. Ses 44 fichiers ont été
restaurés depuis `606e2d7`, sans modification fonctionnelle. Leur arbre Git
d'origine est `bcfd637c69682e1ec26de27bdff9463100eb6ac2`.
Le manifeste `docs/paris-manifest.json` contient chaque chemin et son identifiant
d'objet Git. Vérification indépendante, sans commande Git ni écriture:

```sh
node tools/verify_paris.cjs
```

L'application comprend Expo SDK 54, React Native 0.81.5, Expo Router 6, SQLite,
NativeWind et une synchronisation Supabase. Le README du dossier contient sa
configuration et ses besoins externes. Ses sources, son lockfile, son exemple
d'environnement et son schéma Supabase sont conservés tels quels. DD5 ne charge
aucun de ces fichiers et les tests DD5 n'installent aucun de leurs paquets.

## Séparation proposée

1. Après le commit de conservation, extraire l'historique du seul sous-dossier:
   `git subtree split --prefix=paris-guide -b migration/notre-paris`.
   Cette commande prépare une branche distincte dont la racine est Notre Paris.
   Elle ne change pas la branche de travail et n'en retire aucun fichier.
2. Vérifier que l'arbre de cette branche correspond à l'arbre du dossier:
   `git rev-parse migration/notre-paris^{tree}` et
   `git rev-parse HEAD:paris-guide` doivent donner le même identifiant.
3. Créer un dépôt GitHub vide destiné à Notre Paris après choix du nom et de sa
   visibilité. Pousser **cette seule branche extraite** vers sa branche principale.
   Ne pas pousser l'historique complet de DD5 vers le nouveau dépôt.
4. Cloner le nouveau dépôt dans un emplacement distinct. Exécuter `npm ci`,
   `npm run typecheck` et un lancement Expo avec les services, appareils et clés
   adéquats. Les secrets réels doivent rester hors Git. La configuration Supabase,
   les données existantes et les restrictions de clés cartographiques doivent
   être reprises et vérifiées dans le projet séparé.
5. Confirmer la migration, le clonage indépendant et la conservation des données
   avant d'envisager le retrait de `paris-guide/` de DD5 dans une PR séparée.

La création d'un dépôt distant, le transfert de services/données et la suppression
du dossier ne sont pas effectués par cette réparation. Aucun fonctionnement Expo,
mobile ou Supabase n'est revendiqué par les tests DD5.
