/**
 * Ouverture de la base SQLite locale et exécution des migrations.
 *
 * On utilise l'API asynchrone d'expo-sqlite (>= v14). Le schéma est défini
 * dans `schema.sql` mais embarqué ici sous forme de chaîne car Metro ne
 * bundle pas les `.sql` par défaut — le fichier `.sql` reste la source de
 * vérité documentaire et doit rester synchronisé avec cette constante.
 */
import * as SQLite from "expo-sqlite";

const SCHEMA = /* sql */ `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY NOT NULL,
  room_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'resto' CHECK (category IN ('resto','bar','expo','balade')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','done')),
  is_draft INTEGER NOT NULL DEFAULT 0,
  google_place_id TEXT,
  address TEXT,
  lat REAL,
  lng REAL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY NOT NULL,
  room_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  intent TEXT NOT NULL CHECK (intent IN ('want','pass')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  UNIQUE (place_id, user_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY NOT NULL,
  room_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  UNIQUE (place_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_places_room ON places (room_id, deleted);
CREATE INDEX IF NOT EXISTS idx_places_pending ON places (sync_status);
CREATE INDEX IF NOT EXISTS idx_votes_place ON votes (place_id);
CREATE INDEX IF NOT EXISTS idx_votes_pending ON votes (sync_status);
CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews (place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pending ON reviews (sync_status);

CREATE TABLE IF NOT EXISTS sync_state (
  table_name TEXT PRIMARY KEY NOT NULL,
  last_pulled_at TEXT NOT NULL DEFAULT '1970-01-01T00:00:00.000Z'
);
`;

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Renvoie une instance unique (singleton) de la base, en exécutant les
 * migrations au premier appel. Idempotent : sûr à appeler partout.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("paris-guide.db");
      await db.execAsync(SCHEMA);
      return db;
    })();
  }
  return dbPromise;
}
