# Notre Paris 🗼 — Guide partagé offline-first

Application mobile **Expo / React Native** permettant à un **binôme (2 utilisateurs)**
de gérer un guide de Paris commun : lieux à visiter, votes d'intention, statut
À faire / Fait, avis après visite et carte interactive.

L'architecture est **offline-first** : toutes les actions s'appliquent
immédiatement en local (SQLite) et se synchronisent en tâche de fond avec
Supabase dès que le réseau est disponible.

---

## 🧱 Stack technique

| Domaine        | Choix                                              |
| -------------- | -------------------------------------------------- |
| Framework      | Expo (React Native) + TypeScript                   |
| Navigation     | Expo Router v3 (routing par fichiers)              |
| Styles         | Tailwind CSS via **NativeWind v4**                 |
| Base locale    | **Expo SQLite** (API asynchrone)                   |
| Base distante  | **Supabase** (Postgres + Auth + RLS)               |
| Cartographie   | **react-native-maps** + **Google Places API (New)**|
| Réseau         | `@react-native-community/netinfo`                  |

---

## 1. 🌳 Arborescence du projet

```
paris-guide/
├── app.json                 # Config Expo (clés Maps/Supabase dans extra)
├── babel.config.js          # Preset NativeWind
├── metro.config.js          # withNativeWind
├── tailwind.config.js       # Couleurs métier (catégories / statuts)
├── global.css               # Directives Tailwind
├── tsconfig.json            # Alias @/* -> src/*
├── .env.example
│
├── app/                     # ── Expo Router (file-based) ──
│   ├── _layout.tsx          # Racine : providers + garde d'auth + démarrage sync
│   ├── index.tsx            # Redirection
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx        # Connexion du binôme
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Onglets : Liste / Carte / Ajouter
│   │   ├── index.tsx        # ★ Écran d'accueil (liste + filtres)
│   │   ├── map.tsx          # Carte (marqueurs colorés par statut)
│   │   └── add.tsx          # Ajout Google Places OU brouillon offline
│   └── place/
│       └── [id].tsx         # Détail : statut, votes, avis
│
├── src/
│   ├── components/          # UI réutilisable
│   │   ├── PlaceCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── VoteButtons.tsx
│   │   ├── StarRating.tsx
│   │   ├── DraftEnrichment.tsx  # brouillon offline -> lieu Google Places
│   │   └── SyncIndicator.tsx
│   ├── context/
│   │   └── AppContext.tsx   # Utilisateur courant + room
│   ├── db/                  # ── Couche locale SQLite ──
│   │   ├── schema.sql       # Schéma documentaire
│   │   ├── database.ts      # Ouverture + migrations
│   │   └── queries.ts       # CRUD (mutations optimistes)
│   ├── sync/                # ── Moteur offline/online ──
│   │   ├── supabaseClient.ts
│   │   ├── networkState.ts  # Observation du réseau
│   │   └── syncEngine.ts    # Push/Pull + Last-Write-Wins
│   ├── hooks/
│   │   ├── usePlaces.ts     # Source réactive + mutations
│   │   ├── useSync.ts       # Orchestration de la synchro
│   │   └── useNetworkStatus.ts
│   ├── lib/
│   │   ├── config.ts        # Lecture config / clés
│   │   ├── auth.ts          # Connexion partagée (room)
│   │   └── googlePlaces.ts  # Recherche + détails
│   ├── constants/
│   │   └── categories.ts    # Restos / Bars / Expos / Balades + couleurs
│   └── types/
│       └── index.ts         # Types métier partagés
│
└── supabase/
    └── schema.sql           # Schéma Postgres + RLS (miroir distant)
```

## 2. 🗄️ Schéma de base de données

Trois tables synchronisables — **`places`**, **`votes`**, **`reviews`** — partagent
les mêmes métadonnées de synchronisation :

- `id` : UUID généré **côté client** (autorise la création hors-ligne) ;
- `updated_at` : horloge logique du **Last-Write-Wins** ;
- `deleted` : **tombstone** (suppression logique propagée) ;
- `sync_status` (`pending`/`synced`) : **local uniquement**, jamais envoyé.

Voir [`src/db/schema.sql`](src/db/schema.sql) (SQLite) et
[`supabase/schema.sql`](supabase/schema.sql) (Postgres + Row Level Security).

## 3. 🔄 Mécanisme de synchronisation

Implémenté dans [`src/sync/syncEngine.ts`](src/sync/syncEngine.ts) :

1. **Écriture locale optimiste** — chaque mutation marque la ligne `pending`.
2. **PUSH** — les lignes `pending` sont `upsert`ées vers Supabase, puis
   marquées `synced` (sauf si modifiées entre-temps).
3. **PULL** — récupération des lignes distantes modifiées depuis le curseur
   (`sync_state.last_pulled_at`) sur `synced_at`, un horodatage **posé par le
   serveur** (trigger) : l'horloge des téléphones n'est pas fiable, et une
   modification faite hors-ligne puis poussée tard serait sinon manquée par l'autre
   appareil. Application en **Last-Write-Wins** sur `updated_at`.
4. **Conflits** — le plus récent (`updated_at`) gagne ; une mutation locale
   non encore poussée n'est jamais écrasée.

**Déclencheurs** (via `useSync`) : démarrage, transition `offline → online`
(NetInfo), après chaque mutation (débouncé), et périodiquement (filet de sécurité).

## 4. 🏠 Écran d'accueil

[`app/(tabs)/index.tsx`](app/(tabs)/index.tsx) : liste alimentée par SQLite
(donc instantanée et offline), recherche texte, filtres multi-catégories,
filtre de statut, pull-to-refresh, et actions optimistes (toggle statut, votes).

---

## 🚀 Démarrage

Stack validée : **Expo SDK 54** (React Native 0.81, React 19, Reanimated 4).
Vérifié : `npx tsc --noEmit` sans erreur et `npx expo export --platform android`
qui produit un bundle. **Non testé sur appareil** (pas de simulateur dans l'environnement
de développement) : le premier lancement réel reste à faire.

```bash
cd paris-guide
npm install            # si un postinstall natif échoue : npm install --ignore-scripts
cp .env.example .env   # puis renseigner les valeurs
```

### Backend Supabase (une seule fois)

1. Créer un projet Supabase et exécuter [`supabase/schema.sql`](supabase/schema.sql).
2. *Authentication > Providers > Email* : **désactiver les inscriptions publiques**.
3. *Authentication > Users* : créer les **2 comptes** du binôme.
4. Exécuter le bloc **SEED** en bas du fichier SQL avec les 2 UUID (crée la room
   et ses 2 membres). Le client ne peut pas s'y ajouter lui-même.

### Clés Google

- **Places API (New)** : `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` (restreindre la clé aux
  apps Android/iOS dans Google Cloud, et plafonner le budget).
- **Maps SDK** Android et iOS : clés dans `app.json` (`ios.config.googleMapsApiKey`,
  `android.config.googleMaps.apiKey`).

> ⚠️ Les variables `EXPO_PUBLIC_*` sont **embarquées dans l'app** : ne jamais y mettre
> de clé secrète (service role Supabase). La clé `anon` est faite pour être publique,
> c'est la RLS qui protège les données.

## 🧪 Tester

```bash
npx expo start                 # puis scanner le QR avec Expo Go (test rapide)
npx expo run:android           # build de développement local (SDK Android requis)
```

Scénario de recette minimal à faire à deux téléphones :

1. Les deux se connectent, ajoutent un lieu via recherche Google → apparaît chez l'autre.
2. Passer un téléphone en **mode avion**, ajouter un brouillon, voter, marquer « Fait ».
3. Couper puis rétablir le réseau → les changements arrivent chez l'autre.
4. Modifier le **même lieu** sur les deux téléphones hors-ligne → le plus récent gagne.
5. Ouvrir le brouillon, « Enrichir avec Google Places » → le marqueur apparaît sur la carte.

## 📦 Distribuer à 2 personnes

Pas besoin de store. Avec **EAS Build** (`npm i -g eas-cli && eas build`) :

- **Android** : profil `preview` (`"distribution": "internal"`) → un APK à installer par lien.
- **iOS** : exige un compte Apple Developer (99 $/an) pour TestFlight ou l'ad hoc.

Le backend (Supabase) et les API Google restent dans leurs offres gratuites pour
un usage à deux.
