import React from "react";
import { Pressable, Text, View } from "react-native";
import { CATEGORY_MAP } from "@/constants/categories";
import type { PlaceWithRelations, VoteIntent } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { VoteButtons } from "./VoteButtons";
import { StarRating } from "./StarRating";

interface Props {
  place: PlaceWithRelations;
  currentUserId: string;
  onToggleStatus: () => void;
  onVote: (intent: VoteIntent) => void;
  onPress: () => void;
}

/** Carte d'un lieu dans la liste : entête, statut, votes et note moyenne. */
export function PlaceCard({
  place,
  currentUserId,
  onToggleStatus,
  onVote,
  onPress,
}: Props) {
  const cat = CATEGORY_MAP[place.category];
  const avgRating =
    place.reviews.length > 0
      ? place.reviews.reduce((s, r) => s + r.rating, 0) / place.reviews.length
      : 0;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      {/* Entête : catégorie + nom + statut */}
      <View className="mb-2 flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center pr-2">
          <Text className="mr-2 text-xl">{cat.emoji}</Text>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
              {place.name}
            </Text>
            {place.address ? (
              <Text className="text-xs text-gray-500" numberOfLines={1}>
                {place.address}
              </Text>
            ) : place.is_draft ? (
              <Text className="text-xs italic text-amber-600">
                Brouillon — à enrichir
              </Text>
            ) : null}
          </View>
        </View>
        <StatusBadge status={place.status} onToggle={onToggleStatus} />
      </View>

      {/* Votes du binôme */}
      <View className="my-1">
        <VoteButtons
          votes={place.votes}
          currentUserId={currentUserId}
          onVote={onVote}
        />
      </View>

      {/* Avis (si le lieu est "fait" et noté) */}
      {avgRating > 0 && (
        <View className="mt-2 flex-row items-center">
          <StarRating value={avgRating} size={16} />
          <Text className="ml-2 text-xs text-gray-500">
            {avgRating.toFixed(1)} · {place.reviews.length} avis
          </Text>
        </View>
      )}
    </Pressable>
  );
}
