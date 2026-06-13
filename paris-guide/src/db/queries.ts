/**
 * Couche d'accès aux données LOCALES (SQLite).
 *
 * Règle offline-first : toute mutation écrit immédiatement en local,
 * positionne `updated_at = now()` et `sync_status = 'pending'`. Le moteur
 * de sync se charge ensuite, en tâche de fond, de pousser ces lignes.
 *
 * Aucune de ces fonctions ne dépend du réseau : elles fonctionnent à
 * l'identique online comme offline.
 */
import * as Crypto from "expo-crypto";
import { getDatabase } from "./database";
import type {
  Category,
  Place,
  PlaceStatus,
  PlaceWithRelations,
  Review,
  Vote,
  VoteIntent,
} from "@/types";

const now = () => new Date().toISOString();
const uuid = () => Crypto.randomUUID();

// ---------------------------------------------------------------------------
// PLACES
// ---------------------------------------------------------------------------

export interface CreatePlaceInput {
  roomId: string;
  createdBy: string;
  name: string;
  category: Category;
  /** Brouillon hors-ligne : seul le nom est connu, enrichi plus tard. */
  isDraft?: boolean;
  googlePlaceId?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
}

/** Crée un lieu localement (online ou offline). Renvoie son id. */
export async function createPlace(input: CreatePlaceInput): Promise<string> {
  const db = await getDatabase();
  const id = uuid();
  const ts = now();
  await db.runAsync(
    `INSERT INTO places
       (id, room_id, name, category, status, is_draft, google_place_id,
        address, lat, lng, created_by, created_at, updated_at, deleted, sync_status)
     VALUES (?, ?, ?, ?, 'todo', ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending')`,
    [
      id,
      input.roomId,
      input.name,
      input.category,
      input.isDraft ? 1 : 0,
      input.googlePlaceId ?? null,
      input.address ?? null,
      input.lat ?? null,
      input.lng ?? null,
      input.createdBy,
      ts,
      ts,
    ],
  );
  return id;
}

/** Enrichit un brouillon avec les données Google Places récupérées plus tard. */
export async function enrichPlace(
  id: string,
  data: Pick<Place, "google_place_id" | "address" | "lat" | "lng"> &
    Partial<Pick<Place, "name" | "category">>,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE places SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        google_place_id = ?, address = ?, lat = ?, lng = ?,
        is_draft = 0, updated_at = ?, sync_status = 'pending'
     WHERE id = ?`,
    [
      data.name ?? null,
      data.category ?? null,
      data.google_place_id,
      data.address,
      data.lat,
      data.lng,
      now(),
      id,
    ],
  );
}

/** Bascule le statut À faire / Fait. */
export async function setPlaceStatus(
  id: string,
  status: PlaceStatus,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE places SET status = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
    [status, now(), id],
  );
}

/** Suppression LOGIQUE (tombstone) — propagée au binôme au prochain sync. */
export async function deletePlace(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE places SET deleted = 1, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
    [now(), id],
  );
}

/** Liste les lieux actifs de la room, triés par date de création décroissante. */
export async function listPlaces(roomId: string): Promise<Place[]> {
  const db = await getDatabase();
  return db.getAllAsync<Place>(
    `SELECT * FROM places
     WHERE room_id = ? AND deleted = 0
     ORDER BY created_at DESC`,
    [roomId],
  );
}

/**
 * Liste les lieux avec leurs votes et avis, en 3 requêtes (évite le N+1).
 * Pratique pour l'écran liste où l'on affiche compteurs de votes / note.
 */
export async function listPlacesWithRelations(
  roomId: string,
): Promise<PlaceWithRelations[]> {
  const db = await getDatabase();
  const places = await listPlaces(roomId);
  if (places.length === 0) return [];

  const votes = await db.getAllAsync<Vote>(
    `SELECT * FROM votes WHERE room_id = ? AND deleted = 0`,
    [roomId],
  );
  const reviews = await db.getAllAsync<Review>(
    `SELECT * FROM reviews WHERE room_id = ? AND deleted = 0`,
    [roomId],
  );

  const votesByPlace = groupBy(votes, (v) => v.place_id);
  const reviewsByPlace = groupBy(reviews, (r) => r.place_id);

  return places.map((p) => ({
    ...p,
    votes: votesByPlace.get(p.id) ?? [],
    reviews: reviewsByPlace.get(p.id) ?? [],
  }));
}

export async function getPlace(id: string): Promise<Place | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Place>(`SELECT * FROM places WHERE id = ?`, [id]);
}

// ---------------------------------------------------------------------------
// VOTES (upsert : un seul vote par user/lieu)
// ---------------------------------------------------------------------------

export async function castVote(args: {
  roomId: string;
  placeId: string;
  userId: string;
  intent: VoteIntent;
}): Promise<void> {
  const db = await getDatabase();
  const ts = now();
  // ON CONFLICT sur (place_id, user_id) : on met à jour l'intention.
  await db.runAsync(
    `INSERT INTO votes (id, room_id, place_id, user_id, intent, created_at, updated_at, deleted, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending')
     ON CONFLICT (place_id, user_id) DO UPDATE SET
        intent = excluded.intent,
        deleted = 0,
        updated_at = excluded.updated_at,
        sync_status = 'pending'`,
    [uuid(), args.roomId, args.placeId, args.userId, args.intent, ts, ts],
  );
}

// ---------------------------------------------------------------------------
// REVIEWS (upsert : un seul avis par user/lieu)
// ---------------------------------------------------------------------------

export async function upsertReview(args: {
  roomId: string;
  placeId: string;
  userId: string;
  rating: number; // 1..5
  comment?: string | null;
}): Promise<void> {
  const db = await getDatabase();
  const ts = now();
  await db.runAsync(
    `INSERT INTO reviews (id, room_id, place_id, user_id, rating, comment, created_at, updated_at, deleted, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending')
     ON CONFLICT (place_id, user_id) DO UPDATE SET
        rating = excluded.rating,
        comment = excluded.comment,
        deleted = 0,
        updated_at = excluded.updated_at,
        sync_status = 'pending'`,
    [
      uuid(),
      args.roomId,
      args.placeId,
      args.userId,
      args.rating,
      args.comment ?? null,
      ts,
      ts,
    ],
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return map;
}
