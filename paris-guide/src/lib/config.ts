/**
 * Centralise la lecture de la configuration (clés API, room).
 * Les valeurs proviennent de `app.json > expo.extra` ou des variables
 * d'environnement `EXPO_PUBLIC_*`. On échoue tôt si une clé manque.
 */
import Constants from "expo-constants";

type Extra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  googlePlacesApiKey?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Configuration manquante : ${name}. Voir .env.example.`);
  }
  return value;
}

export const config = {
  supabaseUrl: required(
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl,
    "SUPABASE_URL",
  ),
  supabaseAnonKey: required(
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey,
    "SUPABASE_ANON_KEY",
  ),
  googlePlacesApiKey: required(
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? extra.googlePlacesApiKey,
    "GOOGLE_PLACES_API_KEY",
  ),
  /** Room unique partagée par le binôme. */
  roomId: process.env.EXPO_PUBLIC_ROOM_ID ?? "duo-paris",
};
