"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import paletteData from "../../palette.json";

// Types
type PaletteResult = {
  id: number;
  seasonal: string;
  subSeasonal?: string;
  description?: string | null;
  colours: Record<
    string,
    { reason: string; name: string; percentage?: string }
  >;
  celebrity?: {
    name?: string;
    gender?: string;
  } | null;
  percentage?: string;
};

// Define the type for the new palette data structure
type SeasonalColor = {
  hex: string;
  name: string;
};

type SubSeasonData = {
  description: string;
  colors: SeasonalColor[];
  percentage?: number;
  celebrities?: {
    female: {
      name: string;
      reason: string;
    };
    male: {
      name: string;
      reason: string;
    };
  };
};

type Season = "Spring" | "Summer" | "Autumn" | "Winter";
type SubSeason =
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

// Type for the palette data structure
type PaletteDataType = Record<
  Season,
  Partial<Record<SubSeason, SubSeasonData>>
>;

interface PaletteResultsProps {
  result: PaletteResult;
}

export function PaletteResults({ result }: PaletteResultsProps) {
  const [subSeasonColors, setSubSeasonColors] = useState<SeasonalColor[]>([]);
  const [celebrityInfo, setCelebrityInfo] = useState<{
    name: string;
    reason: string;
    image: string;
  } | null>(null);
  const [subSeasonPercentage, setSubSeasonPercentage] = useState<string>("2.5");

  // Effect to get colors from palette.json based on the user's sub-season
  useEffect(() => {
    if (result.subSeasonal && result.seasonal) {
      try {
        // Capitalize the first letter of the season
        const capitalizedSeason = (result.seasonal.charAt(0).toUpperCase() +
          result.seasonal.slice(1)) as Season;

        // Access the palette data safely
        const typedPaletteData = paletteData as PaletteDataType;
        const seasonData = typedPaletteData[capitalizedSeason];

        if (seasonData && result.subSeasonal in seasonData) {
          const subSeasonData = seasonData[result.subSeasonal as SubSeason];
          if (subSeasonData && Array.isArray(subSeasonData.colors)) {
            setSubSeasonColors(subSeasonData.colors);
          }

          // Set the percentage if available in the data
          if (subSeasonData?.percentage) {
            setSubSeasonPercentage(subSeasonData.percentage.toFixed(1));
          }
        }
      } catch (error) {
        console.error("Error loading sub-season colors:", error);
      }
    }

    // If percentage is available in the result, use it
    if (result.percentage) {
      setSubSeasonPercentage(result.percentage);
    }
  }, [result.subSeasonal, result.seasonal, result.percentage]);

  // Effect to get celebrity info
  useEffect(() => {
    // Get celebrity info based on the user's result
    const getCelebrityInfo = () => {
      if (result.celebrity) {
        try {
          const userGender =
            result.celebrity.gender?.toLowerCase() === "male"
              ? "male"
              : "female";

          const imagePath = result.subSeasonal
            ? `/celebrities/${result.subSeasonal.toLowerCase().replace(/\s+/g, "-")}-${userGender}.jpg`
            : `/celebrities/${result.seasonal.toLowerCase()}-${userGender}.jpg`;

          let reason = "A perfect style icon for your color palette";

          if (result.subSeasonal) {
            try {
              const capitalizedSeason = (result.seasonal
                .charAt(0)
                .toUpperCase() + result.seasonal.slice(1)) as Season;
              const typedPaletteData = paletteData as PaletteDataType;
              const seasonData = typedPaletteData[capitalizedSeason];
              const celebrityData =
                seasonData?.[result.subSeasonal as SubSeason]?.celebrities?.[
                  userGender
                ];

              if (celebrityData) {
                reason = celebrityData.reason;
              }
            } catch (err) {
              console.error("Error getting celebrity reason:", err);
            }
          }

          return {
            name: result.celebrity.name ?? "Style Icon",
            reason: reason,
            image: imagePath,
          };
        } catch (error) {
          console.error("Error loading celebrity data:", error);
        }
      }

      // Fallback implementation
      return {
        name: "Style Icon",
        reason: "Represents your perfect color palette",
        image: "/placeholder.jpg",
      };
    };

    setCelebrityInfo(getCelebrityInfo());
  }, [result]);

  // Get season-specific data
  const getSeasonData = () => {
    const season = result.seasonal.toLowerCase();

    if (season === "spring") {
      return {
        name: "Spring",
        eyebrow: "Vibrant & Fresh",
        mainColor: "#FF6F61", // Coral
        accentColor: "#FFD166", // Sunshine yellow
        gradient: "from-rose-300 to-amber-200",
        lightGradient: "from-rose-50 via-amber-50 to-white",
        textClasses: "text-rose-950",
        fashionStyle: "Playful patterns and vibrant accessories",
        buttonGradient: "from-rose-500 to-amber-500",
        colors: ["#FF6F61", "#FFD300", "#00CED1", "#FFB347", "#F5F5DC"],
      };
    }

    if (season === "summer") {
      return {
        name: "Summer",
        eyebrow: "Soft & Serene",
        mainColor: "#87CEEB", // Sky blue
        accentColor: "#E0BBE4", // Lavender
        gradient: "from-sky-200 to-indigo-100",
        lightGradient: "from-sky-50 via-purple-50 to-white",
        textClasses: "text-sky-950",
        fashionStyle: "Delicate fabrics with subtle detailing",
        buttonGradient: "from-sky-500 to-purple-500",
        colors: ["#B0E0E6", "#CCCCFF", "#C8A2C8", "#FFD1DC", "#B0D3B7"],
      };
    }

    if (season === "autumn" || season === "fall") {
      return {
        name: "Autumn",
        eyebrow: "Warm & Rich",
        mainColor: "#D2691E", // Chocolate
        accentColor: "#DAA520", // Goldenrod
        gradient: "from-amber-300 to-orange-200",
        lightGradient: "from-amber-50 via-orange-50 to-white",
        textClasses: "text-amber-950",
        fashionStyle: "Luxurious textures and layered ensembles",
        buttonGradient: "from-amber-500 to-orange-500",
        colors: ["#CD5C5C", "#DAA520", "#9ACD32", "#8B4513", "#A0522D"],
      };
    }

    if (season === "winter") {
      return {
        name: "Winter",
        eyebrow: "Bold & Clear",
        mainColor: "#0047AB", // Cobalt blue
        accentColor: "#800020", // Burgundy
        gradient: "from-indigo-300 to-purple-200",
        lightGradient: "from-slate-50 via-blue-50 to-white",
        textClasses: "text-slate-950",
        fashionStyle: "High contrast with statement pieces",
        buttonGradient: "from-blue-600 to-indigo-600",
        colors: ["#00008B", "#8A2BE2", "#FF0000", "#2F4F4F", "#FFFFFF"],
      };
    }

    // Default
    return {
      name: "Season",
      eyebrow: "Unique & Expressive",
      mainColor: "#663399", // Rebecca Purple
      accentColor: "#FF5757", // Coral red
      gradient: "from-purple-300 to-pink-200",
      lightGradient: "from-purple-50 via-pink-50 to-white",
      textClasses: "text-purple-950",
      fashionStyle: "Distinctive style with unique elements",
      buttonGradient: "from-purple-500 to-pink-500",
      colors: ["#663399", "#FF5757", "#00CED1", "#FFD300", "#4682B4"],
    };
  };

  const seasonData = getSeasonData();

  return (
    <div>
      {/* Main header section */}
      <section className="mb-24 md:mb-32">
        <div className="overflow-hidden rounded-3xl shadow-2xl">
          <div
            className={`bg-gradient-to-r ${seasonData.gradient} p-12 md:p-16`}
          >
            <div className="relative text-center">
              <div className="mb-6 inline-block rounded-full bg-white/80 px-6 py-2 backdrop-blur-sm">
                <p className="font-medium text-gray-800">
                  <span className="mr-2">✨</span>
                  {seasonData.eyebrow}
                  <span className="ml-2">✨</span>
                </p>
              </div>

              <h1 className="mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text font-serif text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
                {result.subSeasonal ?? result.seasonal}
              </h1>

              <div className="mx-auto mb-8 flex justify-center">
                <div className="h-1 w-24 rounded-full bg-white/40"></div>
              </div>

              <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-800 md:text-xl">
                {result.description ??
                  `Your palette is ${seasonData.eyebrow.toLowerCase()} - ${seasonData.fashionStyle.toLowerCase()}.`}
              </p>
            </div>
          </div>

          {/* Color swatches section */}
          <div className="bg-white p-8 md:p-12">
            <div className="relative mx-auto max-w-4xl">
              <div className="mb-10 text-center">
                <h2 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl">
                  Your Seasonal Palette
                </h2>
                <div className="mx-auto mt-4 h-px w-12 bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 sm:gap-6 md:grid-cols-5 lg:grid-cols-10">
                {subSeasonColors.length > 0
                  ? subSeasonColors.map((color, index) => (
                      <div
                        key={color.hex}
                        className="col-span-1 flex flex-col items-center"
                        style={{
                          animation: `fadeInUp 0.4s ease forwards ${index * 0.05}s`,
                          opacity: 0,
                        }}
                      >
                        <div
                          className="h-10 w-10 rounded-full border shadow-md transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16 md:h-20 md:w-20"
                          style={{
                            backgroundColor: color.hex,
                            boxShadow: `0 4px 20px ${color.hex}30`,
                          }}
                        ></div>
                        <p className="mt-2 max-w-full truncate text-center text-xs font-medium text-gray-700 sm:mt-3 sm:text-sm">
                          {color.name}
                        </p>
                      </div>
                    ))
                  : Object.entries(result.colours).map(
                      ([hex, { name }], index) => (
                        <div
                          key={hex}
                          className="col-span-1 flex flex-col items-center"
                          style={{
                            animation: `fadeInUp 0.4s ease forwards ${index * 0.05}s`,
                            opacity: 0,
                          }}
                        >
                          <div
                            className="h-10 w-10 rounded-full border shadow-md transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16 md:h-20 md:w-20"
                            style={{
                              backgroundColor: hex,
                              boxShadow: `0 4px 20px ${hex}30`,
                            }}
                          ></div>
                          <p className="mt-2 max-w-full truncate text-center text-xs font-medium text-gray-700 sm:mt-3 sm:text-sm">
                            {name}
                          </p>
                        </div>
                      ),
                    )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature colors */}
      <section className="mb-24 md:mb-32">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
            Your Perfect Colors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Elevate your style with these signature shades that perfectly
            complement your natural features
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(result.colours)
            .slice(0, 3)
            .map(([hex, { name, reason }], index) => (
              <div
                key={hex}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  animation: `fadeInScale 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${index * 0.1 + 0.2}s`,
                  opacity: 0,
                }}
              >
                {/* Color display */}
                <div className="relative h-56">
                  <div
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundColor: hex }}
                  ></div>

                  {/* Color name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 text-white">
                    <h3 className="font-serif text-2xl font-semibold">
                      {name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6">
                  <p className="text-base text-gray-600">{reason}</p>

                  <div className="mt-6 flex items-center">
                    <div
                      className="mr-4 h-6 w-6 rounded-full shadow-sm"
                      style={{ backgroundColor: hex }}
                    ></div>
                    <p className="font-mono text-sm font-light text-gray-500">
                      {hex.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Celebrity style icon */}
      {celebrityInfo && (
        <section className="mb-24 md:mb-32">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div className="bg-gray-900 p-8 text-center text-white sm:p-10">
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">
                Your Celebrity Style Muse
              </h2>
            </div>

            <div className="grid bg-gray-900 md:grid-cols-2 md:items-center">
              <div className="flex justify-center p-6 md:p-12">
                <div className="relative aspect-square h-80 w-80 overflow-hidden rounded-full border-4 border-gray-800 shadow-2xl sm:h-96 sm:w-96 md:h-[26rem] md:w-[26rem] lg:h-[28rem] lg:w-[28rem]">
                  <Image
                    src={celebrityInfo.image}
                    alt={celebrityInfo.name}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 28rem"
                    priority
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `inset 0 0 30px 8px rgba(0, 0, 0, 0.6), 0 0 30px 5px rgba(255, 255, 255, 0.1)`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 text-white sm:p-10 md:p-12">
                <div className="mb-6 inline-block rounded-full bg-gray-800 px-4 py-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-300">
                    STYLE ICON
                  </p>
                </div>

                <h3 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
                  {celebrityInfo.name}
                </h3>

                <div className="mb-6 h-1 w-16 bg-gray-700"></div>

                <p className="text-lg leading-relaxed text-gray-300">
                  {celebrityInfo.reason}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {seasonData.colors.map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border border-white/10 shadow-lg transition-transform duration-200 hover:scale-110"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 4px 12px ${color}40`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Statistics section with seasonal theme */}
      <section className="mb-24 md:mb-32">
        <div className="rounded-3xl bg-gray-900 p-12 text-white shadow-2xl md:p-16">
          <div className="relative">
            <div className="mb-16 text-center">
              <h2 className="font-serif text-4xl font-bold tracking-tight text-white md:text-5xl">
                Color Palette Insights
              </h2>
              <div className="mx-auto mt-6 h-px w-24 bg-white/20"></div>
            </div>

            <div className="grid gap-16 md:grid-cols-2">
              {/* Percentage stat */}
              <div className="relative text-center">
                <div className="relative mx-auto mb-6 flex justify-center">
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-black/40 p-1 backdrop-blur-sm sm:h-56 sm:w-56 md:h-64 md:w-64">
                    <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black/60">
                      <span className="text-center font-mono text-5xl font-bold sm:text-6xl md:text-7xl">
                        {subSeasonPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="mb-4 font-serif text-2xl font-medium sm:text-3xl">
                  Exclusive Color Profile
                </h3>

                <p className="mx-auto max-w-md text-gray-300">
                  Only{" "}
                  <span className="font-semibold text-white">
                    {subSeasonPercentage}%
                  </span>{" "}
                  of people worldwide share your{" "}
                  <span className="font-semibold text-white">
                    {result.subSeasonal ?? result.seasonal}
                  </span>{" "}
                  color profile, making your palette distinctively rare.
                </p>
              </div>

              {/* Color bars */}
              <div>
                <h3 className="mb-8 text-center font-serif text-2xl font-medium sm:text-3xl md:text-left">
                  Your Color Trends
                </h3>

                <div className="space-y-6 px-1">
                  {Object.entries(result.colours)
                    .slice(0, 3)
                    .map(([hex, { name, percentage }], index) => {
                      const pct = percentage ?? ((3 - index) * 3.3).toFixed(1);

                      return (
                        <div
                          key={hex}
                          className="relative"
                          style={{
                            animation: `fadeInSlide 0.7s ease-out forwards ${index * 0.1 + 0.2}s`,
                            opacity: 0,
                            transform: "translateX(20px)",
                          }}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="mr-3 h-4 w-4 rounded-full"
                                style={{ backgroundColor: hex }}
                              ></div>
                              <span className="font-medium text-white">
                                {name}
                              </span>
                            </div>
                            <span className="font-mono text-sm">{pct}%</span>
                          </div>

                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: hex,
                                boxShadow: `0 0 12px ${hex}90`,
                                animation: `growBarWidth 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards ${index * 0.1 + 0.5}s`,
                                transformOrigin: "left",
                                transform: "scaleX(0)",
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <p className="mt-8 text-center text-sm text-gray-500 md:text-left">
                  Percentage of people who have these colors in their optimal
                  palette
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
