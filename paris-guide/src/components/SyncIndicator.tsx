import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import type { SyncRunState } from "@/sync/syncEngine";

/** Bandeau discret reflétant l'état de synchronisation / réseau. */
export function SyncIndicator({
  state,
  online,
}: {
  state: SyncRunState;
  online: boolean;
}) {
  if (!online) {
    return (
      <Banner color="#9CA3AF" text="Hors-ligne — vos changements sont enregistrés" />
    );
  }
  if (state.status === "syncing") {
    return (
      <Banner color="#0EA5E9" text="Synchronisation…">
        <ActivityIndicator size="small" color="#0EA5E9" />
      </Banner>
    );
  }
  if (state.status === "error") {
    return <Banner color="#EF4444" text="Échec de synchro — nouvelle tentative bientôt" />;
  }
  return null; // idle & online : rien à afficher
}

function Banner({
  color,
  text,
  children,
}: {
  color: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      className="flex-row items-center justify-center gap-2 px-4 py-1.5"
      style={{ backgroundColor: color + "18" }}
    >
      {children}
      <Text className="text-xs font-medium" style={{ color }}>
        {text}
      </Text>
    </View>
  );
}
