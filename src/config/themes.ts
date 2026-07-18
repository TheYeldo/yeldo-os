import type { AccentId, ThemeId, WallpaperId } from "@/types/system";

export const themes: ThemeId[] = ["graphite", "oled", "midnight", "light"];
export const accents: AccentId[] = ["cyan", "violet", "blue", "mint"];
export const wallpapers: WallpaperId[] = ["signal", "grid", "quiet"];

export const accentColors: Record<AccentId, string> = {
  cyan: "#45d6df",
  violet: "#9f8cff",
  blue: "#6aa7ff",
  mint: "#65d6ad",
};
