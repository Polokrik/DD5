/**
 * =============================================================================
 * MOTEUR DE SYNCHRONISATION OFFLINE-FIRST
 * =============================================================================
 *
 * Principe :
 *   1. Toute action utilisateur écrit en LOCAL (SQLite) et marque la ligne
 *      `sync_status = 'pending'`. L'UI est donc instantanée, online ou non.
 *   2. En tâche de fond, le moteur :
 *        - PUSH : envoie les lignes `pending` vers Supabase (upsert).
 *        - PULL : récupère les lignes distantes modifiées depuis le dernier
 *          curseur et les applique en local.
 *   3. Résolution de conflits : Last-Write-Wins basé sur `updated_at`.
 *      Les suppressions sont des tombstones (`deleted = 1`) qui se propagent.
 *
 * Déclencheurs (voir useSync / _layout) :
 *   - Au démarrage de l'app.
 *   - À chaque transition réseau offline -> online.
 *   - Après chaque mutation locale (débouncé).
 *   - Périodiquement (filet de sécurité).
 * =============================================================================
 */
import { getDatabase } from "@/db/database";
import { supabase } from "./supabaseClient";
import { isOnline, refreshOnlineStatus } from "./networkState";
import type { SyncTable } from "@/types";

const TABLES: SyncTable[] = ["places", "votes", "reviews"];

/** Colonnes propres au local à retirer avant l'envoi serveur. */
const LOCAL_ONLY_COLUMNS = ["sync_status"] as const;

let syncing = false;
let pendingRerun = false;

type Listener = (state: SyncRunState) => void;
export type SyncRunState = {
  status: "idle" | "syncing" | "error" | "offline";
  lastSyncedAt: string | null;
  error?: string;
};

let state: SyncRunState = { status: "idle", lastSyncedAt: null };
const listeners = new Set<Listener>();

function setState(patch: Partial<SyncRunState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
}

export function getSyncState(): SyncRunState {
  return state;
}

export function subscribeSync(listener: Listener): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

/**
 * Lance une passe de synchronisation complète (push puis pull).
 * - Réentrant : si déjà en cours, planifie une relance à la fin.
 * - No-op silencieux si hors-ligne.
 */
export async function runSync(): Promise<void> {
  if (syncing) {
    pendingRerun = true;
    return;
  }
  if (!(await refreshOnlineStatus())) {
    setState({ status: "offline" });
    return;
  }

  syncing = true;
  setState({ status: "syncing", error: undefined });
  try {
    // PUSH d'abord : on remonte nos changements avant de tirer ceux d'en face,
    // ce qui réduit la fenêtre de conflit.
    for (const table of TABLES) await pushTable(table);
    for (const table of TABLES) await pullTable(table);

    setState({ status: "idle", lastSyncedAt: new Date().toISOString() });
  } catch (err) {
    setState({ status: "error", error: (err as Error).message });
  } finally {
    syncing = false;
    if (pendingRerun) {
      pendingRerun = false;
      // Relance différée pour traiter les mutations arrivées pendant le sync.
      void runSync();
    }
  }
}

// ---------------------------------------------------------------------------
// PUSH : local pending -> Supabase
// ---------------------------------------------------------------------------
async function pushTable(table: SyncTable): Promise<void> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM ${table} WHERE sync_status = 'pending'`,
  );
  if (rows.length === 0) return;

  const payload = rows.map((row) => {
    const clean: Record<string, unknown> = { ...row };
    for (const col of LOCAL_ONLY_COLUMNS) delete clean[col];
    // SQLite stocke les booléens en 0/1 ; Postgres attend des booléens.
    if ("deleted" in clean) clean.deleted = Boolean(clean.deleted);
    if ("is_draft" in clean) clean.is_draft = Boolean(clean.is_draft);
    return clean;
  });

  const { error } = await supabase.from(table).upsert(payload, {
    onConflict: "id",
  });
  if (error) throw new Error(`Push ${table}: ${error.message}`);

  // Marque comme 'synced' UNIQUEMENT les lignes inchangées depuis le push
  // (une mutation locale concurrente garde son updated_at -> reste pending).
  for (const row of rows) {
    await db.runAsync(
      `UPDATE ${table} SET sync_status = 'synced'
       WHERE id = ? AND updated_at = ? AND sync_status = 'pending'`,
      [row.id as string, row.updated_at as string],
    );
  }
}

// ---------------------------------------------------------------------------
// PULL : Supabase -> local (Last-Write-Wins)
// ---------------------------------------------------------------------------
async function pullTable(table: SyncTable): Promise<void> {
  const db = await getDatabase();
  const cursor = await getCursor(table);

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .gt("updated_at", cursor)
    .order("updated_at", { ascending: true });

  if (error) throw new Error(`Pull ${table}: ${error.message}`);
  if (!data || data.length === 0) return;

  let maxUpdatedAt = cursor;
  for (const remote of data as Record<string, unknown>[]) {
    await applyRemoteRow(table, remote);
    const updatedAt = String(remote.updated_at);
    if (updatedAt > maxUpdatedAt) maxUpdatedAt = updatedAt;
  }

  await setCursor(table, maxUpdatedAt);
}

/**
 * Applique une ligne distante en local selon le Last-Write-Wins :
 * on n'écrase la ligne locale que si le distant est strictement plus récent.
 * Les lignes 'pending' non encore poussées ne sont PAS écrasées (elles
 * gagneront au prochain push si elles sont plus récentes).
 */
async function applyRemoteRow(
  table: SyncTable,
  remote: Record<string, unknown>,
): Promise<void> {
  const db = await getDatabase();
  const local = await db.getFirstAsync<{
    updated_at: string;
    sync_status: string;
  }>(`SELECT updated_at, sync_status FROM ${table} WHERE id = ?`, [
    remote.id as string,
  ]);

  if (local) {
    // Conflit : le plus récent gagne. À égalité, on garde le local.
    if (String(remote.updated_at) <= local.updated_at) return;
    // Ne pas écraser une mutation locale non encore synchronisée.
    if (local.sync_status === "pending") return;
  }

  const normalized = normalizeRemote(table, remote);
  const columns = Object.keys(normalized);
  const placeholders = columns.map(() => "?").join(", ");
  const updates = columns.map((c) => `${c} = excluded.${c}`).join(", ");

  await db.runAsync(
    `INSERT INTO ${table} (${columns.join(", ")}, sync_status)
     VALUES (${placeholders}, 'synced')
     ON CONFLICT (id) DO UPDATE SET ${updates}, sync_status = 'synced'`,
    columns.map((c) => normalized[c] as never),
  );
}

/** Convertit les types Postgres (booléens) vers la représentation SQLite (0/1). */
function normalizeRemote(
  table: SyncTable,
  remote: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...remote };
  if ("deleted" in out) out.deleted = out.deleted ? 1 : 0;
  if (table === "places" && "is_draft" in out) {
    out.is_draft = out.is_draft ? 1 : 0;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Curseur de synchronisation par table
// ---------------------------------------------------------------------------
async function getCursor(table: SyncTable): Promise<string> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ last_pulled_at: string }>(
    `SELECT last_pulled_at FROM sync_state WHERE table_name = ?`,
    [table],
  );
  return row?.last_pulled_at ?? "1970-01-01T00:00:00.000Z";
}

async function setCursor(table: SyncTable, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO sync_state (table_name, last_pulled_at)
     VALUES (?, ?)
     ON CONFLICT (table_name) DO UPDATE SET last_pulled_at = excluded.last_pulled_at`,
    [table, value],
  );
}

// ---------------------------------------------------------------------------
// Débounce des relances après mutation locale
// ---------------------------------------------------------------------------
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** À appeler après chaque mutation locale : déclenche un sync différé si online. */
export function scheduleSync(delayMs = 1200): void {
  if (!isOnline()) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void runSync();
  }, delayMs);
}
