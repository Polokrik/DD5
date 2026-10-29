# Audit et remise en état de DD5

Ce rapport décrit la première remise en état du moteur. La tranche d'interface
réalisée ensuite est documentée dans [INTERFACE.md](INTERFACE.md); les références
au squelette graphique ci-dessous décrivent l'état antérieur à cette tranche.

État de référence: `e949a95cbbe93373560888ae93366a98c65d6c35`, qui était la tête
distante de `main` lors de la vérification. Travail sur
`repair/dd5-audit-campaign`; sauvegarde locale
`backup/dd5-before-audit-e949a95`. Aucune modification directe de `main`.

## Diagnostic technique initial

Le jeu était entièrement bloqué à l'analyse JavaScript. Aucun test ni chaîne de
construction n'était fourni. L'absence de marqueurs `<<<<<<<` ne signifiait pas
que les conflits étaient résolus: des blocs incompatibles avaient été conservés
côte à côte.

| Version locale | Observation reproductible sur le script intégré |
| --- | --- |
| `356c22d` | Syntaxe du petit gestionnaire d'erreurs valide, mais page générique appelant un `game.js` absent; pas une base de jeu restaurable telle quelle. |
| `afe7306`, `bc05924` | `Unexpected identifier 'strongAlliance'`: virgules manquantes et propriétés répétées avant les PR #3/#5. |
| `858e90f`, fusion #3 `a116fe8` | `Identifier 'DATA' has already been declared`. |
| `1226e66` | `Unexpected identifier 'scene1Done'` dans la branche réintégrée par #5. |
| fusion #5 `5090c7d`, tête `e949a95` | Double `DATA` en premier blocage; les autres ruptures sont masquées par cette première erreur. |

La PR #3 ajoute une enveloppe `DATA` au-dessus de déclarations autonomes, puis
une autre liste de personnages et d'autres variables. Elle remplace des accès
directs par `getCurrentRoom`, `getAvailableOptions`, `enterRoom` et
`callSceneTurn`, sans fournir leurs définitions dans le résultat fusionné.
Le diff du premier parent compte 50 lignes ajoutées et 14 retirées.

La PR #5 ajoute 282 lignes au début des drapeaux: un autre jeu de variables et de
salles pour l'acte II, dont la dernière option n'est pas refermée avant la reprise
des drapeaux de la branche principale. Les deux ajouts de contenu ne pouvaient
donc pas simplement coexister.

La salle titre englobe aussi accidentellement les salles de la bataille finale.
Une fois la syntaxe corrigée, `seriousMessages` reste hors de portée au moment de
traiter certaines options. Deux finales concurrentes coexistent, l'acte II n'a
pas d'entrée jouable et la transition de l'acte III marque l'acte IV accompli
sans le jouer.

Cette analyse repose sur les commits et les diffs locaux. Les lectures GraphQL
et REST de `api.github.com` ont renvoyé `Forbidden`; les commentaires et revues
des PR distantes ne sont donc pas présentés comme consultés. L'accès Git HTTPS
à la branche principale fonctionne.

## Réparations livrées

| Problème | Correction |
| --- | --- |
| Déclarations et objets brisés | Une seule table de salles, une seule identité de chaque état, une table `DATA` qui les référence; intégration du bloc de l'acte II. |
| Accesseurs et navigation absents | Accesseurs de données, entrée de salle et hooks de scène définis; références vérifiées. |
| Actes inaccessibles ou sautés | Parcours I → II → III → IV → V, sans valider un acte non joué. |
| Deux versions de la finale | Retrait des anciennes salles `act_v_ritual`, `finale`, `epilogue`; une seule finale stratégique avec trois plans. |
| Sélections absurdes et pont périlleux en erreur | Traitement cohérent des fins sérieuses et absurdes et retour au checkpoint. |
| Menus écrasant une sauvegarde | Consulter les crédits ou reprendre une partie ne crée plus de checkpoint avant le chargement; effacer ne réenregistre pas immédiatement la partie. |
| Import trop permissif | Validation de la salle, des actes, personnages, états, tableaux, variables et checkpoints imbriqués; rejet avant mutation et refus des clés de prototype. |
| Undo sans effet utile | Snapshot avant la décision et ses effets; suppression des checkpoints automatiques qui enregistraient à nouveau le résultat. |
| Chronologie non restaurée | Événements de recrutement et décisions résolues conservés dans sauvegardes et checkpoints. |
| Résurrection implicite | Un recrutement n'active plus un personnage mort ou à terre. |
| Mort permanente inaccessible par les risques normaux | Un second échec à risque mortel sur un personnage blessé peut tuer; une blessure ordinaire peut le mettre à terre. |
| Groupe sans capacité pour avancer | Proposition de retour à la décision précédente au lieu d'une impasse silencieuse. |
| Gains de soutien répétables sans limite | Les décisions réussies ne sont plus rejouables; les actions du rituel sont explicitement répétables. Undo rétablit la disponibilité. |
| Fin jugée avant trois actions | Vérification préalable; aucun drapeau de fin n'est écrit trop tôt. |
| Effets oubliés | `publicTrust`, événement de recrutement et destin des œufs propagés correctement. |
| Consultation changeant la partie | Initialisation des salles séparée de leur description; `look` n'avance plus les actes et ne crée plus de checkpoints. |
| Réglages de debug destructeurs | Variables numériques uniquement, en mode debug; impossible de remplacer `finalBattle` par un nombre. |
| Langue et incohérence du dragon bleu | Menus en français, souffle de foudre pour Lennithon, suppression des références modernes dans les options concernées. |

Le cœur reste dans `index.html`, sans bibliothèque runtime, chargement externe,
tirage aléatoire ou génération d'assets à l'exécution. Le canvas conserve sa
résolution 320×200 et le lissage désactivé. Les outils et tests sont séparés du
fichier de jeu. `AGENTS.md` renvoie explicitement aux règles complètes de
`agent.md`, qui reste conservé.

## Référentiel de campagne et écarts

Le fichier `campaign-reference.json` distingue les sources primaires, fiches,
règles maison, scénarios et intentions visuelles. Il structure sept PJ, les
événements majeurs, morts attestées, décisions et incertitudes. Les 17 documents
sources sont conservés et accompagnés de leurs empreintes SHA-256. L'outil
d'extraction fournit des références de cellules, paragraphes et pages. Les
modules officiels ne remplacent jamais le compte rendu d'une session.

| Partie du jeu | Faits et sources | Correction ou limite actuelle |
| --- | --- | --- |
| Groupe initial | `Tyranny of dragons!5`, fiches PDF | Bjolnir, Drek'Thar, Darrin, Ellyjobell et Sislay actifs. Malar et Kairon absents au départ. Malrond retiré: non attesté dans les sources examinées. |
| Acte I — Verdure | `Tyranny of dragons!4:35` | Défaite survivable de Drek'Thar disponible comme option de chronique; victoire précoce sur Cyanwrath étiquetée What If. Le tunnel, Escobert, l'interrogatoire et l'assaut contre le dragon restent très abrégés ou absents. Le jeu laisse choisir l'ordre moulin/temple; le journal place le temple avant le moulin. |
| Acte II — Camp et grotte | `Tyranny of dragons!36:83` | Sauvetage de Leosin enregistre son drapeau. Revanche mortelle de Drek'Thar disponible. Deux œufs emportés sur la voie documentée; destruction/abandon restent des variantes exclusives. L'infiltration de Darrin, Frulam et plusieurs pièges manquent encore; dans le jeu réparé, la confrontation demeure après les œufs, contrairement au journal. |
| Acte III — Elturel et Nord | `Tyranny of dragons!85:188` | Éclosion et adoption par Bjolnir rappelées. Tournoi, retour des dragonnets à la guilde, nombreux incidents de caravane, Carnath et alliance des hommes-lézards restent à développer. Le registre d'inventaire conserve les noms des dragonnets comme trace narrative; il ne modélise pas encore leur transfert à la guilde. |
| Acte III — Pavillon et Cumulus | `Tyranny of dragons!189:259` | Trois scènes abrégées ajoutées. Kairon arrive au pavillon; Drek'Thar et la rôdeuse de Lunaaz partent. Malar arrive au château volant. Eskarotha, Blagothkus, Rezmir et Glazael sont résumés; aucune quête détaillée ne remplace encore ces résumés. |
| Acte IV — Conseil | `Rise of Tiamat!3:274` | Conseil jouable après l'acte III. Les scores de réputation et le seuil d'audience sont des règles du jeu. Ils ne reproduisent pas les conditions attestées des dragons: destruction des masques, excuses et restitution de dépouille. Diderius/Varam, Arauthator/Maccath/Marfulb, Forêt Brumeuse et invitation à Thay ne sont pas encore des scènes jouables. |
| Acte V — Finale | Aucune bataille finale relatée dans le journal fourni | Trois plans et quatre issues mécaniques testés; tous explicitement simulés. Le terme « victoire canonique » est retiré. Les prompts du Puits des Dragons ne prouvent pas le résultat de la partie réelle. |

Le découpage du fichier `prompt;MD` diffère de celui du code: son acte IV devait
couvrir Naerytar/Pavillon/Skyreach et son acte V Rise/Conseil. La réparation
conserve les cinq numéros du code pour limiter les déplacements de contenu.
Un futur redécoupage doit être décidé avec le MJ.

La chronique en prose `CHRONIQUE_CAMPAGNE.md` couvre les événements documentés
en 18 chapitres et environ 6 300 mots, dans le ton demandé par le MJ. Elle
reprend son ouverture. Elle ne transforme ni les prompts visuels ni la finale
du jeu en faits joués. Le MJ confirme que la campagne est toujours en cours et
en est à l'invitation à Thay: le texte couvre donc l'ensemble joué à ce jour.

Le MJ a confirmé que Lunaaz/Luunaz est la joueuse de Sislay et que Malaar et
Malar sont le même personnage. La campagne étant en cours, une étape explicite
sépare désormais la chronique et l'accès facultatif à la finale simulée.
Aucune mort permanente des sept PJ n'est inventée. Drek'Thar part;
il ne meurt pas à Greenest. Les morts de Cyanwrath, Rezmir, Varam, Arauthator,
Neronvein et du dragon de la Forêt Brumeuse sont documentées séparément.

## Validation et limites

Commandes reproductibles depuis la racine:

```sh
node --test --test-isolation=none tests/engine.test.cjs
node tools/verify_paris.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
git diff --check
```

La suite du moteur comporte 20 tests: démarrage et syntaxe, références des
salles/options, exécution de chaque option dans deux conditions de score,
parcours complet sans debug des cinq actes pour chaque plan final, quatre issues,
états du groupe, morts et recrutement, import corrompu, sauvegarde/reprise,
checkpoints, undo, menus, exclusivité des œufs, effet unique des décisions et
conservation des documents sources. Les tests ne prétendent pas épuiser toutes
les combinaisons d'états possibles.

Chromium parcourt les cinq actes avec le plan sabotage via le vrai champ de
commande. Le test vérifie également Game Over, undo, save/rechargement,
historique, autocomplétion, séparation visuelle, lissage désactivé et image
identique à tick fixé. Aucune erreur JavaScript ni requête externe n'est attendue.
Une capture est produite dans `/tmp/dd5-browser-smoke.png`, hors dépôt.

La compatibilité avec des sauvegardes provenant d'anciennes versions inconnues
n'est pas garantie. Les sauvegardes invalides sont refusées et conservées, afin
de permettre leur récupération manuelle. La page sauvegarde toujours sous la clé
existante, sans effacement automatique au chargement corrompu.

Notre Paris: 44 fichiers restaurés et identiques à `606e2d7`, vérifiés par objets
Git. Aucune validation Expo, Supabase ou mobile n'est incluse dans cet audit DD5.
Le plan de migration et le manifeste sont séparés. Aucun fichier DD5 ni document
de campagne n'est supprimé.

Une branche indépendante `migration/notre-paris` est préparée au commit racine
`e66940e88d24eefbd1dfc4e46941107ba013a605`. Son arbre est identique au dossier
restauré. C'est un snapshot autonome, car `git subtree` est indisponible ici;
l'historique d'origine reste conservé dans DD5. Aucun dépôt distant indépendant
n'a été créé et la migration n'est pas déclarée terminée.

## Priorités suivantes

1. Faire évoluer la chronique et le référentiel au fur et à mesure des prochaines
   sessions. Le MJ confirme que rien ne manque après Thay: cette suite n'est pas
   encore jouée. Aucune demande de résultat final n'est bloquante pour ce travail.
2. Remplacer les résumés par des scènes sur les moments structurants attestés:
   revanche avant les œufs, tournoi, Carnath, hommes-lézards, Eskarotha et les
   divergences de Bjolnir sur le sort des dragons.
3. Donner à Rise of Tiamat ses enquêtes et ses retours au Conseil, avec les
   conditions politiques réelles. Éviter de transformer un score de moral en
   unique condition d'accès à une scène historiquement jouée.
4. Améliorer les décors et sprites: le rendu actuel est déterministe, mais reste
   un squelette graphique. Les illustrations des classeurs sont des intentions,
   pas des assets utilisables directement.
5. Ajouter une carte des branches pour l'équilibrage et des parcours avec pertes
   multiples, puis étendre les tests navigateur à ces combinaisons. Les seuils
   actuels valident le fonctionnement; ils ne constituent pas un équilibrage final.
