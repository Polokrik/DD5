/**
 * =============================================================================
 * ÉCRAN D'ACCUEIL — Liste des lieux + Filtres  (livrable principal)
 * =============================================================================
 * - Liste des lieux du binôme (rechargée localement, donc instantanée).
 * - Filtres : recherche texte, catégories (multi), statut (À faire / Fait).
 * - Indicateur de synchronisation / réseau en haut.
 * - Actions optimistes : toggle statut, vote — écrites en local puis synchro.
 *
 * Toute la donnée vient de SQLite via `usePlaces` : l'écran fonctionne
 * intégralement hors-ligne.
 * =============================================================================
 */
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import { usePlaces } from "@/hooks/usePlaces";
import { useSyncState } from "@/hooks/useSync";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { runSync } from "@/sync/syncEngine";
import {
  CategoryFilter,
  type CategoryFilterValue,
} from "@/components/CategoryFilter";
import { PlaceCard } from "@/components/PlaceCard";
import { SyncIndicator } from "@/components/SyncIndicator";
import { STATUS_LABELS } from "@/constants/categories";
import type { PlaceStatus, PlaceWithRelations } from "@/types";

type StatusFilter = "all" | PlaceStatus;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useApp();
  const online = useNetworkStatus();
  const syncState = useSyncState();
  const { places, loading, setStatus, vote, reload } = usePlaces(user?.roomId);

  // --- État des filtres ----------------------------------------------------
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>(
    new Set(),
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  // --- Application des filtres (mémoïsé) -----------------------------------
  const filtered = useMemo(
    () => applyFilters(places, query, categoryFilter, statusFilter),
    [places, query, categoryFilter, statusFilter],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await runSync(); // pull manuel
    await reload();
    setRefreshing(false);
  };

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Bandeau réseau / synchro */}
      <SyncIndicator state={syncState} online={online} />

      {/* Entête + recherche */}
      <View className="px-4 pb-1 pt-2">
        <Text className="text-2xl font-extrabold text-gray-900">Notre Paris</Text>
        <SearchBar value={query} onChange={setQuery} />
      </View>

      {/* Filtres catégories */}
      <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />

      {/* Filtres statut */}
      <View className="flex-row gap-2 px-4 pb-2">
        <StatusPill
          label="Tout"
          active={statusFilter === "all"}
          onPress={() => setStatusFilter("all")}
        />
        <StatusPill
          label={STATUS_LABELS.todo}
          active={statusFilter === "todo"}
          onPress={() => setStatusFilter("todo")}
        />
        <StatusPill
          label={STATUS_LABELS.done}
          active={statusFilter === "done"}
          onPress={() => setStatusFilter("done")}
        />
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState loading={loading} onAdd={() => router.push("/(tabs)/add")} />
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            currentUserId={user.id}
            onToggleStatus={() =>
              setStatus(item.id, item.status === "todo" ? "done" : "todo")
            }
            onVote={(intent) => vote(item.id, user.id, intent)}
            onPress={() => router.push(`/place/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Logique de filtrage (pure, testable)
// ---------------------------------------------------------------------------
function applyFilters(
  places: PlaceWithRelations[],
  query: string,
  categories: CategoryFilterValue,
  status: StatusFilter,
): PlaceWithRelations[] {
  const q = query.trim().toLowerCase();
  return places.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (categories.size > 0 && !categories.has(p.category)) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Sous-composants locaux
// ---------------------------------------------------------------------------
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="mt-2 flex-row items-center rounded-xl bg-white px-3 py-2.5 shadow-sm">
      <Text className="mr-2 text-gray-400">🔍</Text>
      <TextInput
        className="flex-1 text-base text-gray-900"
        placeholder="Rechercher un lieu…"
        value={value}
        onChangeText={onChange}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

function StatusPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-lg px-3 py-1.5"
      style={{ backgroundColor: active ? "#0EA5E9" : "#fff" }}
    >
      <Text
        className="text-sm font-medium"
        style={{ color: active ? "#fff" : "#6B7280" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function EmptyState({
  loading,
  onAdd,
}: {
  loading: boolean;
  onAdd: () => void;
}) {
  if (loading) return null;
  return (
    <View className="items-center justify-center px-8 py-20">
      <Text className="mb-2 text-5xl">🗺️</Text>
      <Text className="mb-1 text-lg font-bold text-gray-900">
        Aucun lieu pour l'instant
      </Text>
      <Text className="mb-4 text-center text-sm text-gray-500">
        Ajoutez votre premier endroit à découvrir ensemble.
      </Text>
      <Pressable
        onPress={onAdd}
        className="rounded-xl bg-sky-500 px-5 py-2.5"
      >
        <Text className="font-semibold text-white">Ajouter un lieu</Text>
      </Pressable>
    </View>
  );
}
