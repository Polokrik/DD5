# D20, fiches et parcours — validation du 30 octobre 2026

Le moteur proposait des retours qui pouvaient restaurer le groupe sans acteur
capable de résoudre la scène. La résolution utilisait le moral et le chaos à la
place des caractéristiques DD5. Cette révision corrige les impasses et introduit
des épreuves lisibles, sans changer l’architecture autonome du jeu.

## Corrections des parcours

| Problème reproduit | Correction |
| --- | --- |
| Moulin : Drek’Thar et Ellyjobell indisponibles, retour à la forteresse puis même blocage | Une variante collective permet de sauver le moulin avec un coût annoncé; le retour restaure une vraie décision praticable. |
| Checkpoints « mission-* » pris pour des décisions récupérables | Recherche des actions réelles et contrôle des acteurs, objectifs et conditions dans leur instantané. |
| Retour vers un checkpoint ancien conservant des états futurs dans la pile | Suppression du point restauré et de ses descendants. |
| Un seul bouton après chaque résultat ou dans certaines scènes de liaison | Deux choix utilisables au minimum : progression, retour sûr, accueil ou nouvelle partie selon le contexte. Les provocations absurdes ne suffisent pas à satisfaire cette règle. |
| Conclusion du rituel cliquable avant trois actions, sans effet | Conclusion masquée avant le seuil; les trois actions consommées, seules les issues pertinentes restent disponibles. Sans acteur apte, on peut conclure immédiatement. |
| Personnage spécialiste absent dans une voie finale | Six étapes disposent d’une variante collective qui avance même sur échec, avec un coût pour le rituel, les alliés ou les civils. |
| Une commande de déplacement effaçant le résultat pendant l’animation | Les déplacements attendent la poursuite du compte rendu; aucun nouveau checkpoint ou jet n’est créé. |
| Game Over sans checkpoint avec deux retours identiques à l’accueil | Le résultat propose aussi de recommencer directement à Verdure. |

Les dix voies collectives sont des **What If**, identifiés comme tels. Elles
ne deviennent pas des faits de campagne. Les variantes annoncent séparément le
coût d’une réussite et celui d’un échec. Les changements sont réellement appliqués
aux variables concernées, notamment à `finalBattle` dans la simulation finale.

## Épreuves et résultat

Le choix affiche le personnage, le niveau, le test, son bonus et la difficulté.
Au clic, un seul D20 est tiré par le générateur cryptographique du navigateur.
Le résultat comprend le dé naturel, le modificateur de caractéristique, la
maîtrise et le total. Les instantanés de sauvegarde conservent le résultat; un
historique borné à 100 jets accompagne la partie et ses checkpoints.

L’animation utilise une suite visuelle fixe. Elle s’achève seule et peut être
passée immédiatement ou désactivée dans Ambiance. La préférence système de
mouvements réduits affiche directement le résultat. Consulter une fiche, relire
le texte, rejouer un effet ou recharger ne consomme aucun nouveau tirage.

Un 20 naturel réussit automatiquement une **attaque**, et un 1 naturel la rate.
Ces deux valeurs ne forcent pas l’issue d’un test de caractéristique. Les attaques
contre Cyanwrath utilisent sa CA 17, imprimée dans son bloc de statistiques de
*Hoard of the Dragon Queen*, annexe B. Les autres DD sont des choix d’adaptation
du jeu : ils ne sont pas présentés comme les DD employés historiquement à table.
Les épreuves d’Arcanes autour des objets et protections magiques ne prétendent
pas imposer un jet d’attaque à tous les sorts.

Certaines scènes de la chronique conservent leur issue attestée : le dé mesure
le coût de leur exécution. Ainsi le duel historique de Verdure reste une défaite
de Drek’Thar avec survie et libération des otages. Le bouton l’annonce avant le
clic; un jet réussi ne transforme pas cette défaite en victoire. Les coûts
variables sont des mécanismes de jeu, pas des faits ajoutés au journal.

## Fiches et limites

Les sept profils proposent les six caractéristiques, les 18 compétences, les
six sauvegardes et les attaques. Les valeurs projetées côtoient celles du PDF.
Les [conventions et sources](STATISTIQUES_DD5.md) détaillent les jalons officiels,
la maîtrise, l’expertise, l’aura, les PV estimés et les incohérences des fiches.

La Force 17 avant les gantelets de Bjolnir et Kairon est une reconstruction
acceptée par le MJ. Les augmentations anciennes, les choix de dons et les dates
d’acquisition de l’équipement restent inconnus. La CA est celle de la fiche,
pas une CA historique inventée. Les PV affichés sont des maxima; les blessures
continuent d’utiliser les états du moteur narratif. Il ne s’agit pas d’un moteur
complet de combat tactique DD5.

## Validation reproductible

Résultat : **56 tests Node et trois parcours Chromium réussis**. Aucun changement
fonctionnel de Paris ni modification des documents sources dans cette itération.

```sh
node --test tests/*.test.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-smoke.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/verdure-browser.cjs
DD5_CHROMIUM_PATH=/usr/bin/chromium node tests/d20-browser.cjs
```

Les tests Node chargent le vrai script de `index.html`. Ils couvrent les sept
fiches, les paliers de niveau, les 20 faces du dé, les critiques, les restaurations,
les imports, chaque option sur D20 de 1 et 20, les cinq actes et les trois plans
finaux. Les contrôles de choix parcourent aussi les 57 salles avec tous les
compagnons actifs, à terre ou morts.

Les parcours Chromium utilisent des dés fixés dans leurs seules fixtures pour
reproduire les réussites et échecs. Le test dédié D20 utilise également un vrai
tirage instrumenté et vérifie l’absence de nouveau tirage lors des affichages,
du replay et du rechargement. Les profils détaillés sont contrôlés à 320 px, sans
débordement horizontal, et les erreurs JavaScript sont collectées.

## Priorités suivantes

- Approfondir les épisodes encore résumés à partir des sources et des réponses
  du MJ, sans écrire les événements postérieurs à l’invitation à Thay.
- Compléter les maîtrises et l’équipement historique seulement si de nouvelles
  sources les établissent; les anomalies des fiches restent signalées.
- Enrichir les illustrations et effets des scènes suivantes en gardant les
  animations facultatives et le texte compréhensible sans son.
