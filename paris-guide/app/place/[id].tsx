/**
 * Détail d'un lieu : statut, votes du binôme et avis (note + commentaire).
 * L'écran d'avis n'apparaît qu'une fois le lieu marqué "Fait".
 */
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import { usePlaces } from "@/hooks/usePlaces";
import { StatusBadge } from "@/components/StatusBadge";
import { VoteButtons } from "@/components/VoteButtons";
import { StarRating } from "@/components/StarRating";
import { CATEGORY_MAP } from "@/constants/categories";

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useApp();
  const { places, setStatus, vote, review, removePlace } = usePlaces(
    user?.roomId,
  );

  const place = useMemo(() => places.find((p) => p.id === id), [places, id]);

  // État du formulaire d'avis (prérempli depuis l'avis existant).
  const myReview = place?.reviews.find((r) => r.user_id === user?.id);
  const [rating, setRating] = useState(myReview?.rating ?? 0);
  const [comment, setComment] = useState(myReview?.comment ?? "");

  if (!user || !place) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Lieu introuvable.</Text>
      </View>
    );
  }

  const cat = CATEGORY_MAP[place.category];

  const saveReview = async () => {
    if (rating < 1) {
      Alert.alert("Note manquante", "Choisissez au moins une étoile.");
      return;
    }
    await review(place.id, user.id, rating, comment.trim() || undefined);
    Alert.alert("Avis enregistré", "Votre avis a été sauvegardé.");
  };

  const confirmDelete = () =>
    Alert.alert("Supprimer ce lieu ?", "Action partagée avec votre binôme.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await removePlace(place.id);
          router.back();
        },
      },
    ]);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      {/* Entête */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center pr-2">
          <Text className="mr-2 text-2xl">{cat.emoji}</Text>
          <Text className="flex-1 text-xl font-extrabold text-gray-900">
            {place.name}
          </Text>
        </View>
        <StatusBadge
          status={place.status}
          onToggle={() =>
            setStatus(place.id, place.status === "todo" ? "done" : "todo")
          }
        />
      </View>

      {place.address ? (
        <Text className="mb-4 text-sm text-gray-500">{place.address}</Text>
      ) : place.is_draft ? (
        <Text className="mb-4 text-sm italic text-amber-600">
          Brouillon — sera enrichi via Google Places au prochain passage en ligne.
        </Text>
      ) : null}

      {/* Votes */}
      <Section title="On y va ?">
        <VoteButtons
          votes={place.votes}
          currentUserId={user.id}
          onVote={(intent) => vote(place.id, user.id, intent)}
        />
      </Section>

      {/* Avis (uniquement après visite) */}
      {place.status === "done" && (
        <Section title="Votre avis">
          <StarRating value={rating} onChange={setRating} size={28} />
          <TextInput
            className="mt-3 min-h-[80px] rounded-xl border border-gray-200 p-3 text-base"
            placeholder="Un mot sur cette sortie…"
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
          />
          <Pressable
            onPress={saveReview}
            className="mt-3 items-center rounded-xl bg-sky-500 py-3"
          >
            <Text className="font-bold text-white">Enregistrer l'avis</Text>
          </Pressable>

          {/* Avis du binôme */}
          {place.reviews
            .filter((r) => r.user_id !== user.id)
            .map((r) => (
              <View key={r.id} className="mt-4 rounded-xl bg-gray-50 p-3">
                <StarRating value={r.rating} size={16} />
                {r.comment ? (
                  <Text className="mt-1 text-sm text-gray-700">{r.comment}</Text>
                ) : null}
              </View>
            ))}
        </Section>
      )}

      {/* Suppression */}
      <Pressable onPress={confirmDelete} className="mt-8 items-center py-3">
        <Text className="text-sm font-medium text-red-500">
          Supprimer ce lieu
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">
        {title}
      </Text>
      {children}
    </View>
  );
}
