import React from "react";
import { Text } from "react-native";
import { Tabs } from "expo-router";

/** Navigation par onglets : Liste, Carte, Ajouter. */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0EA5E9",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { borderTopColor: "#F3F4F6" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Liste",
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Carte",
          tabBarIcon: ({ color }) => <TabIcon emoji="🗺️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Ajouter",
          tabBarIcon: ({ color }) => <TabIcon emoji="➕" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{emoji}</Text>;
}
