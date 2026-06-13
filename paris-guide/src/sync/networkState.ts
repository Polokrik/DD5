/**
 * Observation de l'état réseau via @react-native-community/netinfo.
 *
 * Expose un petit observable maison pour découpler le reste de l'app de
 * NetInfo et permettre au moteur de sync de réagir aux transitions
 * offline -> online.
 */
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export type NetworkListener = (online: boolean) => void;

let currentlyOnline = true;
const listeners = new Set<NetworkListener>();

/** Vrai si l'appareil est connecté ET qu'Internet est joignable. */
function deriveOnline(state: NetInfoState): boolean {
  // `isInternetReachable` peut être null tant que NetInfo n'a pas tranché.
  return Boolean(state.isConnected && state.isInternetReachable !== false);
}

// Abonnement global unique (démarré à l'import du module).
NetInfo.addEventListener((state) => {
  const next = deriveOnline(state);
  if (next !== currentlyOnline) {
    currentlyOnline = next;
    listeners.forEach((l) => l(next));
  }
});

export function isOnline(): boolean {
  return currentlyOnline;
}

/** Récupère l'état réseau actuel de façon fiable (force un check). */
export async function refreshOnlineStatus(): Promise<boolean> {
  const state = await NetInfo.fetch();
  currentlyOnline = deriveOnline(state);
  return currentlyOnline;
}

/** S'abonne aux transitions online/offline. Renvoie une fonction de désabonnement. */
export function subscribeNetwork(listener: NetworkListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
