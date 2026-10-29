/**
 * Client Supabase configuré pour React Native.
 * - Session persistée dans AsyncStorage : expo-secure-store est limité à ~2 Ko
 *   par valeur, ce que dépasse une session Supabase (access + refresh token + user).
 * - `detectSessionInUrl: false` (pas de redirection web en natif).
 */
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
