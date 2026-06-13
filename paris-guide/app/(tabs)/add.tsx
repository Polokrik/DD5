/**
 * Écran d'ajout d'un lieu, avec deux chemins :
 *   - ONLINE  : recherche Google Places -> ajout enrichi (adresse, coords).
 *   - OFFLINE : ajout rapide d'un brouillon (nom + catégorie seulement),
 *               enrichi automatiquement plus tard quand le réseau revient.
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import { usePlaces } from "@/hooks/usePlaces";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  getPlaceDetails,
  searchPlaces,
  type PlaceSuggestion,
} from "@/lib/googlePlaces";
import { CATEGORIES } from "@/constants/categories";
import type { Category } from "@/types";

export default function AddScreen() {
  const router = useRouter();
  const { user } = useApp();
  const online = useNetworkStatus();
  const { addPlace } = usePlaces(user?.roomId);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("resto");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  // Recherche Google Places débouncée (uniquement en ligne).
  useEffect(() => {
    if (!online || name.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        setSuggestions(await searchPlaces(name));
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [name, online]);

  // Ajout enrichi depuis une suggestion Google.
  const addFromSuggestion = useCallback(
    async (s: PlaceSuggestion) => {
      if (!user) return;
      setSaving(true);
      try {
        const details = await getPlaceDetails(s.googlePlaceId);
        await addPlace({
          roomId: user.roomId,
          createdBy: user.id,
          name: details.name,
          category: details.suggestedCategory,
          googlePlaceId: details.googlePlaceId,
          address: details.address,
          lat: details.lat,
          lng: details.lng,
          isDraft: false,
        });
        router.back();
      } catch (e) {
        Alert.alert("Erreur", (e as Error).message);
      } finally {
        setSaving(false);
      }
    },
    [user, addPlace, router],
  );

  // Ajout rapide d'un brouillon (offline ou saisie libre).
  const addDraft = useCallback(async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      await addPlace({
        roomId: user.roomId,
        createdBy: user.id,
        name: name.trim(),
        category,
        isDraft: true,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }, [user, name, category, addPlace, router]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 pt-2">
        <Text className="mb-3 text-2xl font-extrabold text-gray-900">
          Ajouter un lieu
        </Text>

        {!online && (
          <View className="mb-3 rounded-lg bg-amber-50 px-3 py-2">
            <Text className="text-xs text-amber-700">
              Hors-ligne : ajout en brouillon (nom seul). Il sera enrichi
              automatiquement au retour du réseau.
            </Text>
          </View>
        )}

        {/* Nom / recherche */}
        <TextInput
          className="rounded-xl border border-gray-200 px-4 py-3 text-base"
          placeholder={online ? "Rechercher (ex. Le Comptoir)…" : "Nom du lieu"}
          value={name}
          onChangeText={setName}
          autoFocus
        />

        {/* Sélecteur de catégorie (pour le brouillon) */}
        <View className="mt-3 flex-row flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              className="rounded-full border px-3 py-1.5"
              style={{
                backgroundColor: category === c.key ? c.color : "transparent",
                borderColor: category === c.key ? c.color : "#D1D5DB",
              }}
            >
              <Text
                style={{ color: category === c.key ? "#fff" : "#374151" }}
                className="text-sm font-medium"
              >
                {c.emoji} {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Suggestions Google */}
      {online && (
        <FlatList
          data={suggestions}
          keyExtractor={(s) => s.googlePlaceId}
          className="mt-2"
          ListHeaderComponent={
            searching ? (
              <View className="py-3">
                <ActivityIndicator color="#0EA5E9" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => addFromSuggestion(item)}
              className="border-b border-gray-100 px-4 py-3"
            >
              <Text className="text-base font-medium text-gray-900">
                {item.name}
              </Text>
              <Text className="text-xs text-gray-500">{item.address}</Text>
            </Pressable>
          )}
        />
      )}

      {/* Ajout manuel / brouillon */}
      <View className="mt-auto p-4">
        <Pressable
          onPress={addDraft}
          disabled={!name.trim() || saving}
          className="items-center rounded-xl bg-sky-500 py-3.5"
          style={{ opacity: !name.trim() || saving ? 0.5 : 1 }}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-bold text-white">
              {online ? "Ajouter sans détails" : "Ajouter en brouillon"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
