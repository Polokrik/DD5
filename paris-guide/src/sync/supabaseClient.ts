/**
 * Client Supabase configuré pour React Native.
 * - Stockage de session sécurisé via expo-secure-store.
 * - `detectSessionInUrl: false` (pas de redirection web en natif).
 */
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { config } from "@/lib/config";

/** Adaptateur de stockage SecureStore pour la persistance de session. */
const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
