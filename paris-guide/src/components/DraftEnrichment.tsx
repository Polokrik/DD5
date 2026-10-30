import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import {
  getPlaceDetails,
  searchPlaces,
  type PlaceDetails,
  type PlaceSuggestion,
} from "@/lib/googlePlaces";

interface Props {
  /** Nom saisi hors-ligne, utilisé comme requête de recherche. */
  name: string;
  online: boolean;
  onEnriched: (details: PlaceDetails) => Promise<void>;
}

/**
 * Enrichissement d'un brouillon créé hors-ligne. On propose des suggestions
 * Google Places plutôt que de choisir le premier résultat : un nom court peut
 * correspondre à plusieurs adresses, et c'est à l'utilisateur de trancher.
 */
export function DraftEnrichment({ name, online, onEnriched }: Props) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[] | null>(null);
  const [busy, setBusy] = useState(false);

  if (!online) {
    return (
      <Text className="mb-4 text-sm italic text-amber-600">
        Brouillon — reconnectez-vous pour l'associer à un lieu Google Places.
      </Text>
    );
  }

  const search = async () => {
    setBusy(true);
    try {
      setSuggestions(await searchPlaces(name));
    } catch (e) {
      Alert.alert("Recherche impossible", (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const pick = async (s: PlaceSuggestion) => {
    setBusy(true);
    try {
      await onEnriched(await getPlaceDetails(s.googlePlaceId));
    } catch (e) {
      Alert.alert("Erreur", (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="mb-4 rounded-xl bg-amber-50 p-3">
      <Text className="mb-2 text-sm text-amber-800">
        Brouillon : associez-le à un lieu pour obtenir l'adresse et l'afficher
        sur la carte.
      </Text>

      {suggestions === null ? (
        <Pressable
          onPress={search}
          disabled={busy}
          className="items-center rounded-lg bg-amber-500 py-2.5"
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">
              Enrichir avec Google Places
            </Text>
          )}
        </Pressable>
      ) : suggestions.length === 0 ? (
        <Text className="text-sm text-gray-600">Aucun résultat pour « {name} ».</Text>
      ) : (
        suggestions.map((s) => (
          <Pressable
            key={s.googlePlaceId}
            onPress={() => pick(s)}
            disabled={busy}
            className="border-b border-amber-100 py-2"
          >
            <Text className="text-base font-medium text-gray-900">{s.name}</Text>
            <Text className="text-xs text-gray-500">{s.address}</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}
