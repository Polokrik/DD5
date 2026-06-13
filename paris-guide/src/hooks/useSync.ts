/**
 * Orchestration de la synchronisation côté UI.
 *
 * - Lance un sync au montage et à chaque retour en ligne.
 * - Programme un sync périodique (filet de sécurité).
 * - Expose l'état courant (idle/syncing/offline/error) pour l'indicateur UI.
 */
import { useEffect, useState } from "react";
import {
  getSyncState,
  runSync,
  subscribeSync,
  type SyncRunState,
} from "@/sync/syncEngine";
import { subscribeNetwork } from "@/sync/networkState";

/**
 * Hook LECTURE SEULE : s'abonne à l'état de synchro sans démarrer
 * d'orchestrateur (intervalle, listeners réseau). À utiliser dans les écrans
 * qui veulent seulement afficher l'indicateur — l'orchestration est lancée
 * une seule fois dans le layout racine via `useSync`.
 */
export function useSyncState(): SyncRunState {
  const [state, setState] = useState<SyncRunState>(getSyncState());
  useEffect(() => subscribeSync(setState), []);
  return state;
}

const PERIODIC_INTERVAL_MS = 60_000;

export function useSync(enabled: boolean): SyncRunState {
  const [state, setState] = useState<SyncRunState>(getSyncState());

  useEffect(() => {
    if (!enabled) return;
    const unsubState = subscribeSync(setState);

    // 1) Sync initial.
    void runSync();

    // 2) Sync à chaque transition offline -> online.
    const unsubNet = subscribeNetwork((online) => {
      if (online) void runSync();
    });

    // 3) Filet de sécurité périodique.
    const timer = setInterval(() => void runSync(), PERIODIC_INTERVAL_MS);

    return () => {
      unsubState();
      unsubNet();
      clearInterval(timer);
    };
  }, [enabled]);

  return state;
}
