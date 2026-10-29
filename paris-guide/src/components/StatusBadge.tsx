import React from "react";
import { Pressable, Text, View } from "react-native";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants/categories";
import type { PlaceStatus } from "@/types";

interface Props {
  status: PlaceStatus;
  /** Si fourni, le badge devient un bouton qui bascule todo/done. */
  onToggle?: () => void;
}

/** Pastille de statut (À faire / Fait) avec couleur dédiée. */
export function StatusBadge({ status, onToggle }: Props) {
  const content = (
    <View
      className="flex-row items-center rounded-full px-3 py-1"
      style={{ backgroundColor: STATUS_COLORS[status] + "22" }}
    >
      <View
        className="mr-1.5 h-2 w-2 rounded-full"
        style={{ backgroundColor: STATUS_COLORS[status] }}
      />
      <Text
        className="text-xs font-semibold"
        style={{ color: STATUS_COLORS[status] }}
      >
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );

  if (!onToggle) return content;
  return (
    <Pressable onPress={onToggle} hitSlop={8}>
      {content}
    </Pressable>
  );
}
