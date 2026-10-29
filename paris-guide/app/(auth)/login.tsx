import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";

/**
 * Écran de connexion du binôme. Chaque utilisateur se connecte avec son
 * compte ; tous deux partagent la même room (configurée dans .env).
 */
export default function LoginScreen() {
  const { signIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) return;
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      Alert.alert("Connexion impossible", (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8">
        <Text className="mb-2 text-4xl font-extrabold text-gray-900">
          Notre Paris 🗼
        </Text>
        <Text className="mb-8 text-base text-gray-500">
          Le guide partagé de nos sorties à deux.
        </Text>

        <TextInput
          className="mb-3 rounded-xl border border-gray-200 px-4 py-3 text-base"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="mb-6 rounded-xl border border-gray-200 px-4 py-3 text-base"
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          onPress={onSubmit}
          disabled={busy}
          className="items-center rounded-xl bg-sky-500 py-3.5"
          style={{ opacity: busy ? 0.6 : 1 }}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-bold text-white">Se connecter</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
