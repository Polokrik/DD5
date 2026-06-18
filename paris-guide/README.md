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
   (`sync_state.last_pulled_at`), appliquées en **Last-Write-Wins**.
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

```bash
cd paris-guide
npm install

# 1. Créez un projet Supabase, exécutez supabase/schema.sql.
# 2. Renseignez les clés dans app.json > expo.extra (ou .env, cf .env.example) :
#    - supabaseUrl, supabaseAnonKey
#    - googlePlacesApiKey (+ clés Google Maps natives dans app.json)
# 3. Créez la room et 2 comptes utilisateurs dans Supabase.

npx expo start
```

> ⚠️ `react-native-maps` et `expo-sqlite` nécessitent un **development build**
> (ou EAS Build) — ils ne fonctionnent pas dans Expo Go sur toutes les plateformes.
