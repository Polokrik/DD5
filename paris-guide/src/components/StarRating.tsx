import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  value: number; // 0..5
  /** Lecture seule si non fourni. */
  onChange?: (rating: number) => void;
  size?: number;
}

/** Note sur 5 étoiles, interactive (saisie d'avis) ou en lecture seule. */
export function StarRating({ value, onChange, size = 22 }: Props) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const star_ = (
          <Text style={{ fontSize: size, color: filled ? "#F59E0B" : "#D1D5DB" }}>
            {filled ? "★" : "☆"}
          </Text>
        );
        return onChange ? (
          <Pressable key={star} onPress={() => onChange(star)} hitSlop={4}>
            {star_}
          </Pressable>
        ) : (
          <View key={star}>{star_}</View>
        );
      })}
    </View>
  );
}
