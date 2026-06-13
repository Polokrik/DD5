import type { Category, PlaceStatus } from "@/types";

export interface CategoryMeta {
  key: Category;
  label: string;
  emoji: string;
  /** Couleur du marqueur sur la carte et des accents UI. */
  color: string;
}

/** Référentiel des catégories (ordre = ordre d'affichage des filtres). */
export const CATEGORIES: CategoryMeta[] = [
  { key: "resto", label: "Restos", emoji: "🍽️", color: "#EF4444" },
  { key: "bar", label: "Bars", emoji: "🍸", color: "#8B5CF6" },
  { key: "expo", label: "Expos", emoji: "🖼️", color: "#F59E0B" },
  { key: "balade", label: "Balades", emoji: "🌳", color: "#10B981" },
];

export const CATEGORY_MAP: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<Category, CategoryMeta>;

/** Couleurs des marqueurs carte selon le statut (À faire / Fait). */
export const STATUS_COLORS: Record<PlaceStatus, string> = {
  todo: "#3B82F6", // bleu : à faire
  done: "#22C55E", // vert : fait
};

export const STATUS_LABELS: Record<PlaceStatus, string> = {
  todo: "À faire",
  done: "Fait",
};
