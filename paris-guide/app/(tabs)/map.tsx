/**
 * Écran Carte : marqueurs colorés selon le statut (À faire = bleu / Fait = vert).
 * Seuls les lieux géolocalisés (non-brouillons) apparaissent. La carte est
 * alimentée par la même source locale que la liste (offline-friendly).
 */
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import { usePlaces } from "@/hooks/usePlaces";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants/categories";

// Région initiale : Paris centre.
const PARIS_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function MapScreen() {
  const router = useRouter();
  const { user } = useApp();
  const { places } = usePlaces(user?.roomId);

  // On ne cartographie que les lieux possédant des coordonnées.
  const located = useMemo(
    () => places.filter((p) => p.lat != null && p.lng != null),
    [places],
  );

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={PARIS_REGION}
        showsUserLocation
      >
        {located.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat!, longitude: p.lng! }}
            pinColor={STATUS_COLORS[p.status]}
            title={p.name}
            description={`${STATUS_LABELS[p.status]}${p.address ? " · " + p.address : ""}`}
            onCalloutPress={() => router.push(`/place/${p.id}`)}
          />
        ))}
      </MapView>

      {/* Légende des couleurs de statut */}
      <View className="absolute bottom-4 left-4 flex-row gap-3 rounded-xl bg-white/95 px-3 py-2 shadow">
        <Legend color={STATUS_COLORS.todo} label={STATUS_LABELS.todo} />
        <Legend color={STATUS_COLORS.done} label={STATUS_LABELS.done} />
      </View>
    </SafeAreaView>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center">
      <View
        className="mr-1.5 h-3 w-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-xs font-medium text-gray-700">{label}</Text>
    </View>
  );
}
