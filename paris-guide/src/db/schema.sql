-- =============================================================================
-- Schéma SQLite LOCAL (offline-first)
-- =============================================================================
-- Chaque table porte les métadonnées de synchronisation :
--   id           : UUID généré côté client (permet la création hors-ligne)
--   room_id      : isole les données du binôme
--   created_at   : ISO 8601
--   updated_at   : ISO 8601, sert d'horloge logique (Last-Write-Wins)
--   deleted      : tombstone (0/1) — suppression logique propagée au sync
--   sync_status  : 'pending' | 'synced' — LOCAL UNIQUEMENT (non envoyé au serveur)
-- =============================================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Lieux à visiter ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS places (
  id              TEXT PRIMARY KEY NOT NULL,
  room_id         TEXT NOT NULL,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL DEFAULT 'resto'
                    CHECK (category IN ('resto','bar','expo','balade')),
  status          TEXT NOT NULL DEFAULT 'todo'
                    CHECK (status IN ('todo','done')),
  is_draft        INTEGER NOT NULL DEFAULT 0,   -- brouillon offline (nom seul)
  google_place_id TEXT,
  address         TEXT,
  lat             REAL,
  lng             REAL,
  created_by      TEXT NOT NULL,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted         INTEGER NOT NULL DEFAULT 0,
  sync_status     TEXT NOT NULL DEFAULT 'pending'
);

-- Votes d'intention (1 par utilisateur et par lieu) ------------------------
CREATE TABLE IF NOT EXISTS votes (
  id           TEXT PRIMARY KEY NOT NULL,
  room_id      TEXT NOT NULL,
  place_id     TEXT NOT NULL,
  user_id      TEXT NOT NULL,
  intent       TEXT NOT NULL CHECK (intent IN ('want','pass')),
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted      INTEGER NOT NULL DEFAULT 0,
  sync_status  TEXT NOT NULL DEFAULT 'pending',
  UNIQUE (place_id, user_id)
);

-- Avis après visite (note 1..5 + commentaire, 1 par utilisateur et par lieu)-
CREATE TABLE IF NOT EXISTS reviews (
  id           TEXT PRIMARY KEY NOT NULL,
  room_id      TEXT NOT NULL,
  place_id     TEXT NOT NULL,
  user_id      TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  deleted      INTEGER NOT NULL DEFAULT 0,
  sync_status  TEXT NOT NULL DEFAULT 'pending',
  UNIQUE (place_id, user_id)
);

-- Index pour les requêtes fréquentes (sync + écran liste) ------------------
CREATE INDEX IF NOT EXISTS idx_places_room    ON places (room_id, deleted);
CREATE INDEX IF NOT EXISTS idx_places_pending ON places (sync_status);
CREATE INDEX IF NOT EXISTS idx_votes_place    ON votes (place_id);
CREATE INDEX IF NOT EXISTS idx_votes_pending  ON votes (sync_status);
CREATE INDEX IF NOT EXISTS idx_reviews_place  ON reviews (place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pending ON reviews (sync_status);

-- Curseur de synchronisation : dernier updated_at récupéré par table -------
CREATE TABLE IF NOT EXISTS sync_state (
  table_name   TEXT PRIMARY KEY NOT NULL,
  last_pulled_at TEXT NOT NULL DEFAULT '1970-01-01T00:00:00.000Z'
);
