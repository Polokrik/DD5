/**
 * Types métier partagés entre la couche SQLite locale et la couche Supabase distante.
 * Les mêmes formes sont utilisées des deux côtés afin de simplifier la synchronisation.
 */

/** Catégories de lieux supportées par le guide. */
export type Category = "resto" | "bar" | "expo" | "balade";

/** Statut d'avancement d'un lieu pour le binôme. */
export type PlaceStatus = "todo" | "done";

/** Intention de vote d'un utilisateur sur un lieu. */
export type VoteIntent = "want" | "pass"; // "J'ai envie" / "Pas envie"

/**
 * Champs communs de synchronisation présents sur toutes les entités.
 * - `updated_at` sert d'horloge logique pour le Last-Write-Wins.
 * - `deleted` est un tombstone (suppression logique) propagé lors du sync.
 * - `sync_status` est LOCAL uniquement (jamais envoyé au serveur).
 */
export interface SyncMeta {
  id: string;
  room_id: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  deleted: number; // 0 | 1 (SQLite n'a pas de booléen natif)
  sync_status: "pending" | "synced"; // colonne locale
}

/** Un lieu à visiter à Paris. */
export interface Place extends SyncMeta {
  name: string;
  category: Category;
  status: PlaceStatus;
  /** Brouillon créé hors-ligne (nom seul, à enrichir plus tard). */
  is_draft: number; // 0 | 1
  google_place_id: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  created_by: string; // user_id de l'auteur
}

/** Vote d'intention d'un utilisateur sur un lieu (1 vote max par user/lieu). */
export interface Vote extends SyncMeta {
  place_id: string;
  user_id: string;
  intent: VoteIntent;
}

/** Avis laissé après visite (note + commentaire, 1 par user/lieu). */
export interface Review extends SyncMeta {
  place_id: string;
  user_id: string;
  rating: number; // 1..5
  comment: string | null;
}

/** Vue agrégée d'un lieu avec ses votes/avis, prête pour l'UI. */
export interface PlaceWithRelations extends Place {
  votes: Vote[];
  reviews: Review[];
}

/** Tables synchronisables. */
export type SyncTable = "places" | "votes" | "reviews";
