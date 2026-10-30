/**
 * Intégration Google Places (recherche + détails).
 * Utilisé UNIQUEMENT en ligne : la recherche enrichit un lieu. Hors-ligne,
 * l'utilisateur crée un brouillon (nom seul) enrichi plus tard via ces appels.
 *
 * Utilise l'API "Places API (New)" — endpoints REST v1.
 */
import { config } from "./config";
import type { Category } from "@/types";

const BASE = "https://places.googleapis.com/v1";

export interface PlaceSuggestion {
  googlePlaceId: string;
  name: string;
  address: string;
}

export interface PlaceDetails extends PlaceSuggestion {
  lat: number;
  lng: number;
  /** Catégorie devinée à partir des types Google (modifiable par l'utilisateur). */
  suggestedCategory: Category;
}

/** Recherche textuelle de lieux, biaisée sur Paris. */
export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (!query.trim()) return [];

  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": config.googlePlacesApiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "fr",
      // Biais géographique : centre de Paris, rayon ~12 km.
      locationBias: {
        circle: {
          center: { latitude: 48.8566, longitude: 2.3522 },
          radius: 12000,
        },
      },
    }),
  });

  if (!res.ok) throw new Error(`Google Places: ${res.status}`);
  const json = (await res.json()) as { places?: GooglePlace[] };
  return (json.places ?? []).map((p) => ({
    googlePlaceId: p.id,
    name: p.displayName?.text ?? "Sans nom",
    address: p.formattedAddress ?? "",
  }));
}

/** Détails complets (coordonnées + catégorie suggérée) d'un lieu. */
export async function getPlaceDetails(
  googlePlaceId: string,
): Promise<PlaceDetails> {
  const res = await fetch(`${BASE}/places/${googlePlaceId}`, {
    headers: {
      "X-Goog-Api-Key": config.googlePlacesApiKey,
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,location,types",
    },
  });

  if (!res.ok) throw new Error(`Google Places détails: ${res.status}`);
  const p = (await res.json()) as GooglePlace;

  return {
    googlePlaceId: p.id,
    name: p.displayName?.text ?? "Sans nom",
    address: p.formattedAddress ?? "",
    lat: p.location?.latitude ?? 0,
    lng: p.location?.longitude ?? 0,
    suggestedCategory: mapTypesToCategory(p.types ?? []),
  };
}

/** Heuristique simple type Google -> catégorie métier. */
function mapTypesToCategory(types: string[]): Category {
  const set = new Set(types);
  if (set.has("bar") || set.has("night_club")) return "bar";
  if (set.has("restaurant") || set.has("cafe") || set.has("bakery"))
    return "resto";
  if (set.has("museum") || set.has("art_gallery")) return "expo";
  if (set.has("park") || set.has("tourist_attraction")) return "balade";
  return "resto";
}

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  types?: string[];
}
