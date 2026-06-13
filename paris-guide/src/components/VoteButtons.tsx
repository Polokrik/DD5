import React from "react";
import { Pressable, Text, View } from "react-native";
import type { Vote, VoteIntent } from "@/types";

interface Props {
  votes: Vote[];
  /** Id de l'utilisateur courant (pour surligner son propre vote). */
  currentUserId: string;
  onVote: (intent: VoteIntent) => void;
}

/**
 * Boutons "J'ai envie" / "Pas envie".
 * Affiche le vote de l'utilisateur courant (surligné) et le décompte du binôme.
 */
export function VoteButtons({ votes, currentUserId, onVote }: Props) {
  const myVote = votes.find((v) => v.user_id === currentUserId)?.intent ?? null;
  const wantCount = votes.filter((v) => v.intent === "want").length;
  const passCount = votes.filter((v) => v.intent === "pass").length;

  return (
    <View className="flex-row gap-2">
      <VoteButton
        label="J'ai envie"
        emoji="❤️"
        count={wantCount}
        active={myVote === "want"}
        activeColor="#22C55E"
        onPress={() => onVote("want")}
      />
      <VoteButton
        label="Pas envie"
        emoji="🚫"
        count={passCount}
        active={myVote === "pass"}
        activeColor="#EF4444"
        onPress={() => onVote("pass")}
      />
    </View>
  );
}

function VoteButton({
  label,
  emoji,
  count,
  active,
  activeColor,
  onPress,
}: {
  label: string;
  emoji: string;
  count: number;
  active: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center rounded-xl border px-3 py-2"
      style={{
        backgroundColor: active ? activeColor + "18" : "transparent",
        borderColor: active ? activeColor : "#E5E7EB",
      }}
    >
      <Text className="mr-1 text-base">{emoji}</Text>
      <Text
        className="text-sm font-medium"
        style={{ color: active ? activeColor : "#374151" }}
      >
        {label}
      </Text>
      {count > 0 && (
        <Text className="ml-1 text-sm font-bold" style={{ color: activeColor }}>
          {count}
        </Text>
      )}
    </Pressable>
  );
}
