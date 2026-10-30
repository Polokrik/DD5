import React from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { CATEGORIES } from "@/constants/categories";
import type { Category } from "@/types";

/** Filtre = sous-ensemble de catégories actives. `null` interne = "Tout". */
export type CategoryFilterValue = Set<Category>;

interface Props {
  value: CategoryFilterValue;
  onChange: (next: CategoryFilterValue) => void;
}

/**
 * Barre de filtres horizontale par catégorie (multi-sélection).
 * Aucune catégorie sélectionnée = toutes affichées (puce "Tout" active).
 */
export function CategoryFilter({ value, onChange }: Props) {
  const allActive = value.size === 0;

  const toggle = (cat: Category) => {
    const next = new Set(value);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    onChange(next);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-2"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      <Chip label="Tout" emoji="✨" active={allActive} onPress={() => onChange(new Set())} />
      {CATEGORIES.map((c) => (
        <Chip
          key={c.key}
          label={c.label}
          emoji={c.emoji}
          active={value.has(c.key)}
          color={c.color}
          onPress={() => toggle(c.key)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  emoji,
  active,
  color = "#0EA5E9",
  onPress,
}: {
  label: string;
  emoji: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-full border px-3 py-1.5"
      style={{
        backgroundColor: active ? color : "transparent",
        borderColor: active ? color : "#D1D5DB",
      }}
    >
      <Text className="mr-1 text-sm">{emoji}</Text>
      <Text
        className="text-sm font-medium"
        style={{ color: active ? "#fff" : "#374151" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
