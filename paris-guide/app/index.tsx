import { Redirect } from "expo-router";

/** Point d'entrée : la garde du layout racine gère la redirection réelle. */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
