"use client";

import { useState, useEffect } from "react";
import Stories from "react-insta-stories";
import { Share2, X } from "lucide-react";
import paletteData from "../../palette.json";

type PaletteResult = {
  id: number;
  seasonal: string;
  subSeasonal?: string;
  description?: string;
  colours: Record<string, { reason: string; name: string }>;
};

// Define the type for the new palette data structure
type SeasonalColor = {
  hex: string;
  name: string;
};

type SubSeasonData = {
  description: string;
  colors: SeasonalColor[];
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
type PaletteDataType = Record<Season, Record<SubSeason, SubSeasonData>>;

interface PaletteStoriesProps {
  result: PaletteResult;
}

export function PaletteStories({ result }: PaletteStoriesProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [subSeasonColors, setSubSeasonColors] = useState<SeasonalColor[]>([]);

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
        }
      } catch (error) {
        console.error("Error loading sub-season colors:", error);
      }
    }
  }, [result.subSeasonal, result.seasonal]);

  const colorEntries = Object.entries(result.colours);

  // Effect to handle body overflow
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    document.body.style.overflow = "";
  };

  // Handle share
  const handleShare = async () => {
    try {
      await navigator.share({
        title: `My ${result.subSeasonal ?? result.seasonal} Color Palette`,
        text: "Check out my personalized color palette!",
        url: window.location.href,
      });
    } catch {
      // Fallback to copy to clipboard
      void navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Season configurations
  const seasonConfig = {
    spring: {
      background: "from-green-200 to-lime-200",
      textColor: "text-pink-800",
      description: "vibrant, fresh, and full of life, like spring blooms",
      shadowColor: "rgba(190, 24, 93, 0.2)",
      imageUrl: "/spring.png",
    },
    summer: {
      background: "from-yellow-200 to-orange-100",
      textColor: "text-teal-800",
      description: "soft, muted, and elegant, like a warm summer sunset",
      shadowColor: "rgba(15, 118, 110, 0.2)",
      imageUrl: "/summer.jpg",
    },
    autumn: {
      background: "from-orange-200 to-amber-100",
      textColor: "text-orange-900",
      description: "warm, rich, and earthy, like autumn leaves",
      shadowColor: "rgba(154, 52, 18, 0.2)",
      imageUrl: "/autumn.png",
    },
    winter: {
      background: "from-blue-100 to-blue-300",
      textColor: "text-blue-900",
      description: "cool, clear, and dramatic, like a crisp winter day",
      shadowColor: "rgba(30, 64, 175, 0.2)",
      imageUrl: "/winter.jpg",
    },
    default: {
      background: "from-purple-100 to-rose-200",
      textColor: "text-purple-900",
      secondaryText: "text-purple-800",
      description: "vibrant, fresh, and full of life",
      shadowColor: "rgba(107, 33, 168, 0.4)",
      imageUrl: "",
    },
  };

  // Get the current season config
  const getCurrentSeasonConfig = () => {
    const season = result.seasonal.toLowerCase();
    if (season === "spring") return seasonConfig.spring;
    if (season === "summer") return seasonConfig.summer;
    if (season === "autumn" || season === "fall") return seasonConfig.autumn;
    if (season === "winter") return seasonConfig.winter;
    return seasonConfig.default;
  };

  const currentSeasonConfig = getCurrentSeasonConfig();

  // Create stories array
  const stories = [
    // Season story
    {
      content: () => (
        <div
          className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${currentSeasonConfig.background} p-4 text-center sm:p-6 md:p-8`}
        >
          <style jsx global>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes scaleUp {
              0% {
                transform: scale(1);
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
              }
              75% {
                transform: scale(1.05);
                text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
              }
              100% {
                transform: scale(1.03);
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
              }
            }

            .season-text-container {
              position: relative;
              display: inline-block;
              width: 100%;
              text-align: center;
              transform-origin: center;
            }

            .season-text-base {
              position: relative;
              z-index: 1;
              animation: scaleUp 3.5s ease-in-out 0.3s forwards;
            }

            .season-text-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              background-image: url("${currentSeasonConfig.imageUrl}");
              background-position: center;
              background-size: 150%;
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
              opacity: 0;
              z-index: 2;
              animation:
                fadeIn 3s ease-out 0.5s forwards,
                scaleUp 3.5s ease-in-out 0.3s forwards;
            }

            .fade-in-bg {
              animation: fadeIn 1.2s ease-in-out 0.2s both;
            }

            @media (min-width: 640px) {
              .season-text-overlay {
                background-size: 20%;
              }
            }
          `}</style>
          <div
            className={`fade-in-bg absolute inset-0 z-0 bg-gradient-to-br ${currentSeasonConfig.background}`}
          ></div>
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-2 text-center sm:px-4">
            <div
              className={`mb-2 text-4xl font-black tracking-tight sm:text-3xl md:text-4xl lg:text-5xl ${currentSeasonConfig.textColor}`}
            >
              {result.seasonal === "autumn" ? "You are an" : "You are a"}
            </div>
            <SeasonalText
              text={
                result.subSeasonal ??
                result.seasonal.charAt(0).toUpperCase() +
                  result.seasonal.slice(1)
              }
              className="text-7xl font-black leading-none tracking-tighter sm:text-7xl md:text-8xl lg:text-[10rem]"
              config={currentSeasonConfig}
            />
            <p
              className={`mt-4 max-w-md text-sm font-bold sm:mt-6 sm:text-base md:mt-8 md:text-lg ${currentSeasonConfig.textColor}`}
            >
              {result.description ??
                `Your colors are ${currentSeasonConfig.description}.`}
            </p>
          </div>
        </div>
      ),
      duration: 7000,
    },

    // Palette story - Updated to show all colors from palette.json
    {
      content: () => (
        <div
          className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${currentSeasonConfig.background} p-4 text-center sm:p-6 md:p-8`}
        >
          <style jsx global>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes popIn {
              0% {
                transform: scale(0);
                opacity: 0;
              }
              70% {
                transform: scale(1.1);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }

            @keyframes shimmer {
              0% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
              }
              70% {
                box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
              }
            }

            .color-circle {
              animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
                forwards;
              opacity: 0;
            }

            .color-circle:hover {
              animation: shimmer 1.5s infinite;
            }

            .color-name {
              animation: fadeInUp 0.5s ease-out forwards;
              opacity: 0;
            }

            .palette-title {
              animation: fadeInUp 0.8s ease-out forwards;
            }

            .palette-description {
              animation: fadeInUp 1s ease-out forwards;
              opacity: 0;
            }
          `}</style>
          <h2
            className={`palette-title mb-4 text-3xl font-bold ${currentSeasonConfig.textColor} sm:mb-6 sm:text-4xl`}
          >
            Your {result.subSeasonal ?? result.seasonal} Palette
          </h2>
          <div className="grid max-w-md grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-5">
            {subSeasonColors.length > 0
              ? subSeasonColors.map((color, index) => (
                  <div key={color.hex} className="flex flex-col items-center">
                    <div
                      className="color-circle h-14 w-14 rounded-full border-2 border-white/30 shadow-lg transition-transform hover:scale-105 sm:h-16 sm:w-16 md:h-20 md:w-20"
                      style={{
                        backgroundColor: color.hex,
                        animationDelay: `${index * 0.1}s`,
                      }}
                    />
                    <p
                      className={`color-name mt-1 truncate text-[10px] font-medium ${currentSeasonConfig.textColor} sm:mt-2 sm:text-xs`}
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      {color.name}
                    </p>
                  </div>
                ))
              : // Fallback to the analyzed colors if subSeasonColors is empty
                Object.entries(result.colours).map(([hex, { name }], index) => (
                  <div key={hex} className="flex flex-col items-center">
                    <div
                      className="color-circle h-14 w-14 rounded-full border-2 border-white/30 shadow-lg transition-transform hover:scale-105 sm:h-16 sm:w-16 md:h-20 md:w-20"
                      style={{
                        backgroundColor: hex,
                        animationDelay: `${index * 0.1}s`,
                      }}
                    />
                    <p
                      className={`color-name mt-1 truncate text-[10px] font-medium ${currentSeasonConfig.textColor} sm:mt-2 sm:text-xs`}
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      {name}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      ),
      duration: 7000,
    },

    // "Our Top Picks" story
    {
      content: () => (
        <div
          className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${currentSeasonConfig.background} p-8 text-center`}
        >
          <style jsx global>{`
            @keyframes pulseSize {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.2);
              }
              100% {
                transform: scale(1.1);
              }
            }

            .pulse-word {
              display: inline-block;
              animation: pulseSize 2.5s ease-in-out forwards;
              transform-origin: center;
            }
          `}</style>
          <h2
            className={`text-6xl font-extrabold italic tracking-tight ${currentSeasonConfig.textColor}`}
          >
            Our <span className="pulse-word mx-3">Top</span> Picks For You
          </h2>
          <p
            className={`mt-6 max-w-md text-lg ${currentSeasonConfig.textColor} opacity-80`}
          >
            Continue to discover your perfect colors.
          </p>
        </div>
      ),
      duration: 4000,
    },

    // Individual color stories
    ...colorEntries.map(([hex, { name, reason }]) => ({
      content: () => (
        <div
          className="flex h-full w-full flex-col items-center justify-center p-4 text-center sm:p-6 md:p-8"
          style={{ backgroundColor: hex }}
        >
          <div className="rounded-full bg-white/10 p-4 backdrop-blur-md sm:p-6">
            <div
              className="h-20 w-20 rounded-full border-4 border-white/30 shadow-lg sm:h-24 sm:w-24 md:h-32 md:w-32"
              style={{ backgroundColor: hex }}
            />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white drop-shadow-md sm:mt-6 sm:text-3xl md:mt-8 md:text-4xl">
            {name}
          </h2>
          <p className="mt-2 max-w-md text-center text-base font-light italic text-white drop-shadow-sm sm:mt-3 sm:text-lg md:mt-4 md:text-xl">
            &ldquo;{reason}&rdquo;
          </p>
        </div>
      ),
      duration: 7000,
    })),
  ];

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-screen overflow-hidden">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 z-20 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/30"
        aria-label="Close stories"
      >
        <X size={20} />
      </button>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="absolute bottom-4 right-4 z-10 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Share"
      >
        <Share2 size={20} />
      </button>

      <Stories
        stories={stories}
        defaultInterval={7000}
        width="100%"
        height="100%"
        storyStyles={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loop={false}
        keyboardNavigation={true}
        onAllStoriesEnd={() => setIsVisible(false)}
      />
    </div>
  );
}

// Reusable component for seasonal text with image fill
function SeasonalText({
  text,
  className,
  config,
}: {
  text: string;
  className: string;
  config: {
    shadowColor: string;
    imageUrl: string;
    textColor?: string;
  };
}) {
  // If no image URL is provided, render plain text
  if (!config.imageUrl) {
    return (
      <div className={`${className} ${config.textColor ?? ""}`}>{text}</div>
    );
  }

  return (
    <div className="season-text-container">
      <div
        className={`season-text-base ${className} ${config.textColor ?? ""}`}
        style={{
          textShadow: `0 2px 10px ${config.shadowColor}`,
        }}
      >
        {text}
      </div>
      <div className={`season-text-overlay ${className}`}>{text}</div>
    </div>
  );
}
