import { useEffect, useState } from "react";
import {
  isOnline,
  refreshOnlineStatus,
  subscribeNetwork,
} from "@/sync/networkState";

/** Renvoie l'état de connexion réactif (true = en ligne). */
export function useNetworkStatus(): boolean {
  const [online, setOnline] = useState<boolean>(isOnline());

  useEffect(() => {
    // Vérifie l'état réel au montage puis écoute les transitions.
    refreshOnlineStatus().then(setOnline);
    return subscribeNetwork(setOnline);
  }, []);

  return online;
}
