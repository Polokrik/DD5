import "../global.css";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "@/context/AppContext";
import { useSync } from "@/hooks/useSync";

/**
 * Garde de navigation : redirige vers /login si non connecté, vers les
 * onglets sinon. Démarre le moteur de sync une fois l'utilisateur connecté.
 */
function RootNavigator() {
  const { user, loading } = useApp();
  const segments = useSegments();
  const router = useRouter();

  // Le sync n'est actif qu'authentifié.
  useSync(Boolean(user));

  React.useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) router.replace("/(auth)/login");
    else if (user && inAuthGroup) router.replace("/(tabs)");
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="place/[id]"
        options={{ presentation: "modal", headerShown: true, title: "Détails" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
