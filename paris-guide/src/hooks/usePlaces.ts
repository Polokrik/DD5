/**
 * Source de vérité réactive pour l'écran liste / carte.
 *
 * SQLite n'étant pas réactif, on recharge les données :
 *   - au montage,
 *   - après chaque mutation locale (via un petit bus d'événements),
 *   - quand une passe de sync se termine (nouvelles données distantes).
 *
 * Toutes les mutations sont optimistes : on écrit en local puis on programme
 * un sync en tâche de fond.
 */
import { useCallback, useEffect, useState } from "react";
import {
  castVote as dbCastVote,
  createPlace as dbCreatePlace,
  deletePlace as dbDeletePlace,
  listPlacesWithRelations,
  setPlaceStatus as dbSetStatus,
  upsertReview as dbUpsertReview,
  type CreatePlaceInput,
} from "@/db/queries";
import { scheduleSync, subscribeSync } from "@/sync/syncEngine";
import type {
  PlaceStatus,
  PlaceWithRelations,
  VoteIntent,
} from "@/types";

// --- Bus d'événements minimal pour notifier les mutations locales ----------
const dataListeners = new Set<() => void>();
function emitDataChanged() {
  dataListeners.forEach((l) => l());
}
function onDataChanged(listener: () => void): () => void {
  dataListeners.add(listener);
  return () => dataListeners.delete(listener);
}

export function usePlaces(roomId: string | undefined) {
  const [places, setPlaces] = useState<PlaceWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!roomId) return;
    const rows = await listPlacesWithRelations(roomId);
    setPlaces(rows);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    void reload();
    const unsubData = onDataChanged(reload);
    // Recharge quand une passe de sync revient à l'état "idle" (pull terminé).
    let prev = "";
    const unsubSync = subscribeSync((s) => {
      if (prev === "syncing" && s.status === "idle") void reload();
      prev = s.status;
    });
    return () => {
      unsubData();
      unsubSync();
    };
  }, [reload]);

  // --- Mutations (optimistes) ---------------------------------------------
  const afterMutation = useCallback(async () => {
    await reload();
    emitDataChanged();
    scheduleSync();
  }, [reload]);

  const addPlace = useCallback(
    async (input: CreatePlaceInput) => {
      const id = await dbCreatePlace(input);
      await afterMutation();
      return id;
    },
    [afterMutation],
  );

  const setStatus = useCallback(
    async (placeId: string, status: PlaceStatus) => {
      await dbSetStatus(placeId, status);
      await afterMutation();
    },
    [afterMutation],
  );

  const removePlace = useCallback(
    async (placeId: string) => {
      await dbDeletePlace(placeId);
      await afterMutation();
    },
    [afterMutation],
  );

  const vote = useCallback(
    async (placeId: string, userId: string, intent: VoteIntent) => {
      if (!roomId) return;
      await dbCastVote({ roomId, placeId, userId, intent });
      await afterMutation();
    },
    [roomId, afterMutation],
  );

  const review = useCallback(
    async (
      placeId: string,
      userId: string,
      rating: number,
      comment?: string,
    ) => {
      if (!roomId) return;
      await dbUpsertReview({ roomId, placeId, userId, rating, comment });
      await afterMutation();
    },
    [roomId, afterMutation],
  );

  return {
    places,
    loading,
    reload,
    addPlace,
    setStatus,
    removePlace,
    vote,
    review,
  };
}
