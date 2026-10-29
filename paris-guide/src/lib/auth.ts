/**
 * Authentification du binôme.
 *
 * Modèle : une room unique partagée par 2 utilisateurs fixes. Chacun se
 * connecte avec son propre compte Supabase (email/mot de passe, inscriptions
 * publiques désactivées) mais tous deux sont membres de la même `room_id`.
 * On met en cache l'identité (id, email, room : quelques octets, donc OK pour
 * SecureStore) pour que l'app démarre et fonctionne hors-ligne.
 */
import * as SecureStore from "expo-secure-store";
import { supabase } from "@/sync/supabaseClient";
import { config } from "./config";

const CACHED_USER_KEY = "pg.cachedUser";

export interface SessionUser {
  id: string;
  email: string;
  roomId: string;
}

/** Connexion email/mot de passe, puis garantit l'appartenance à la room. */
export async function signIn(
  email: string,
  password: string,
): Promise<SessionUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const user: SessionUser = {
    id: data.user.id,
    email: data.user.email ?? email,
    roomId: config.roomId,
  };

  // L'appartenance à la room est créée UNE FOIS côté serveur (voir le seed dans
  // supabase/schema.sql) : le client ne peut pas s'y inscrire lui-même.
  await SecureStore.setItemAsync(CACHED_USER_KEY, JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  await SecureStore.deleteItemAsync(CACHED_USER_KEY);
}

/**
 * Récupère l'utilisateur courant.
 * - Online : depuis la session Supabase (rafraîchie).
 * - Offline : depuis le cache SecureStore (permet d'utiliser l'app sans réseau).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    const user: SessionUser = {
      id: data.session.user.id,
      email: data.session.user.email ?? "",
      roomId: config.roomId,
    };
    await SecureStore.setItemAsync(CACHED_USER_KEY, JSON.stringify(user));
    return user;
  }

  const cached = await SecureStore.getItemAsync(CACHED_USER_KEY);
  return cached ? (JSON.parse(cached) as SessionUser) : null;
}
