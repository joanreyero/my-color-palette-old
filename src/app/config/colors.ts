// Shared color configuration for seasonal palettes

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type SubSeason =
  | "Bright Winter"
  | "True Winter"
  | "Dark Winter"
  | "Light Summer"
  | "True Summer"
  | "Soft Summer"
  | "Light Spring"
  | "True Spring"
  | "Bright Spring"
  | "Soft Autumn"
  | "True Autumn"
  | "Dark Autumn";

export type SeasonalConfig = {
  // For page.tsx
  gradient: string;
  lightGradient: string;
  textAccent: string;
  accentColor: string;

  // For palette-stories.tsx
  background: string;
  textColor: string;
  description: string;
  shadowColor: string;
  imageUrl: string;
  secondaryText?: string;
};

// Combined color configuration for both components
const colorConfig: Record<string, SeasonalConfig> = {
  spring: {
    // For page.tsx
    gradient: "from-rose-300 to-amber-200",
    lightGradient: "from-rose-50 via-amber-50 to-white",
    textAccent: "text-rose-500",
    accentColor: "#FF6F61",

    // For palette-stories.tsx
    background: "from-pink-50 to-rose-100",
    textColor: "text-pink-700",
    description: "soft, delicate, and blooming, like cherry blossoms in spring",
    shadowColor: "rgba(157, 23, 77, 0.15)",
    imageUrl: "/spring.png",
  },

  summer: {
    // For page.tsx
    gradient: "from-sky-200 to-indigo-100",
    lightGradient: "from-sky-50 via-purple-50 to-white",
    textAccent: "text-sky-500",
    accentColor: "#87CEEB",

    // For palette-stories.tsx
    background: "from-teal-100 to-emerald-50",
    textColor: "text-teal-800",
    description: "cool, refreshing, and tropical, like a beachside paradise",
    shadowColor: "rgba(15, 118, 110, 0.2)",
    imageUrl: "/summer.jpg",
  },

  autumn: {
    // For page.tsx
    gradient: "from-amber-300 to-orange-200",
    lightGradient: "from-amber-50 via-orange-50 to-white",
    textAccent: "text-amber-500",
    accentColor: "#D2691E",

    // For palette-stories.tsx
    background: "from-amber-100 to-orange-200",
    textColor: "text-amber-900",
    description: "warm, rich, and golden, like autumn leaves",
    shadowColor: "rgba(146, 64, 14, 0.2)",
    imageUrl: "/autumn.png",
  },

  winter: {
    // For page.tsx
    gradient: "from-indigo-300 to-purple-200",
    lightGradient: "from-slate-50 via-blue-50 to-white",
    textAccent: "text-indigo-500",
    accentColor: "#0047AB",

    // For palette-stories.tsx
    background: "from-slate-100 to-blue-200",
    textColor: "text-slate-900",
    description: "crisp, clear, and elegant, like a winter morning",
    shadowColor: "rgba(30, 58, 138, 0.2)",
    imageUrl: "/winter.jpg",
  },

  // Default fallback
  default: {
    // For page.tsx
    gradient: "from-purple-300 to-pink-200",
    lightGradient: "from-pink-50 to-white",
    textAccent: "text-purple-500",
    accentColor: "#8A2BE2",

    // For palette-stories.tsx
    background: "from-purple-100 to-rose-200",
    textColor: "text-purple-900",
    secondaryText: "text-purple-800",
    description: "vibrant, fresh, and full of life",
    shadowColor: "rgba(107, 33, 168, 0.4)",
    imageUrl: "",
  },

  // For fallback compatibility
  fall: {
    // For page.tsx
    gradient: "from-amber-300 to-orange-200",
    lightGradient: "from-amber-50 via-orange-50 to-white",
    textAccent: "text-amber-500",
    accentColor: "#D2691E",

    // For palette-stories.tsx
    background: "from-amber-100 to-orange-200",
    textColor: "text-amber-900",
    description: "warm, rich, and golden, like autumn leaves",
    shadowColor: "rgba(146, 64, 14, 0.2)",
    imageUrl: "/autumn.png",
  },
};

/**
 * Get the seasonal configuration based on the season name
 * @param season The season name (spring, summer, autumn, winter)
 * @returns The seasonal configuration
 */
export function getSeasonalConfig(season: string): SeasonalConfig {
  const seasonLower = season.toLowerCase();

  // Use non-null assertion since we always have the default as fallback
  return colorConfig[seasonLower] ?? colorConfig.default!;
}
