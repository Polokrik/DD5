Les résultats d’action disparaissaient au changement de scène, des missions
échouées étaient considérées comme accomplies et la progression sautait des
épisodes du journal. Cette branche répare le moteur puis apporte une interface
de livre d’aventure: choix cliquables, portraits et chronique intégrée. Les
décisions importantes affichent désormais leur déroulement et leurs conséquences
avant de poursuivre; un échec conserve une issue ou un retour au checkpoint.

Le parcours suit les étapes documentées de Verdure jusqu’à l’invitation de Thay.
La revanche précède les œufs; leur éclosion se produit sur la route d’Elturel.
Carnath, Diderius, la Mer de Glace et la Forêt Brumeuse ont des étapes de récit
dans le jeu. Les alternatives restent distinctes, et la finale est une simulation
facultative. Les sept profils reprennent les PDF et les précisions du MJ. Les
ouvertures et plusieurs passages de la chronique ont été réécrits en phrases
suivies, sans ajouter d’événement canonique.

Le jeu reste un seul HTML autonome. Les sauvegardes antérieures restent lisibles;
le résultat courant est conservé au rechargement. Les sources primaires et les
44 fichiers de Notre Paris restent identiques. La direction artistique détaillée
couvre encore principalement Verdure; plusieurs étapes ultérieures restent des
résumés et utilisent un décor d’ambiance générique.

La mise en scène ajoute cinq décors (tunnel, temple, moulin et deux duels), des
vignettes de résolution et des effets déterministes: brouillard, impacts,
magie, repli et départ du dragon. « Revoir l’action » ne rejoue pas la décision.
Le menu Ambiance permet de réduire les mouvements et d’activer des sons
facultatifs, désactivés au départ. Les sons sont synthétiques; aucune voix humaine
ni musique n’est ajoutée. Les réglages restent séparés de la progression.

Validation: 30 tests moteur, parcours Chromium des cinq actes au clic, parcours
défavorable sans réglage des scores et variantes Cyanwrath/œufs. Vérifications
des imports, sauvegardes, états, morts, retours, trois plans finaux, quatre issues,
clavier, 18 chapitres, sept fiches et affichages de 320 à 1440 pixels. Aucune
requête externe ni erreur JavaScript; palette de scène ≤ 48 couleurs. Contrôle
séparé des sources et de Notre Paris.
Un test Chromium dédié vérifie aussi les deux duels, la stabilité du texte, la
relecture des effets sans mutation, les préférences et les scénarios d’activation,
de coupure et de refus du son.

La comparaison avec `main` inclut la remise en état initiale. La comparaison
avec `repair/dd5-audit-campaign` permet de revoir l’interface et la révision
narrative. Le diff HTML est en partie mécanique: les données des salles sont
désormais présentées sur plusieurs lignes.

Voir [le rapport de révision](REVISION_JOUEUR.md), [l’interface](INTERFACE.md) et
les captures dans `docs/previews/`.
La tranche d’effets est détaillée dans [VERDURE_VIVANTE.md](VERDURE_VIVANTE.md).
