/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Couleurs métier alignées sur les catégories et statuts
        resto: "#EF4444",
        bar: "#8B5CF6",
        expo: "#F59E0B",
        balade: "#10B981",
        todo: "#3B82F6",
        done: "#22C55E",
      },
    },
  },
  plugins: [],
};
