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
type PaletteDataType = Record<
  Season,
  Partial<Record<SubSeason, SubSeasonData>>
>;

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
  // Only use the top 3 colors for individual slides
  const topThreeColorEntries = colorEntries.slice(0, 3);

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
      background: "from-pink-50 to-rose-100",
      textColor: "text-pink-700",
      description:
        "soft, delicate, and blooming, like cherry blossoms in spring",
      shadowColor: "rgba(157, 23, 77, 0.15)",
      imageUrl: "/spring.png",
    },
    summer: {
      background: "from-teal-100 to-emerald-50",
      textColor: "text-teal-800",
      description: "cool, refreshing, and tropical, like a beachside paradise",
      shadowColor: "rgba(15, 118, 110, 0.2)",
      imageUrl: "/summer.jpg",
    },
    autumn: {
      background: "from-amber-100 to-orange-200",
      textColor: "text-amber-900",
      description: "warm, rich, and golden, like autumn leaves",
      shadowColor: "rgba(146, 64, 14, 0.2)",
      imageUrl: "/autumn.png",
    },
    winter: {
      background: "from-slate-100 to-blue-200",
      textColor: "text-slate-900",
      description: "crisp, clear, and elegant, like a winter morning",
      shadowColor: "rgba(30, 58, 138, 0.2)",
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
          className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${currentSeasonConfig.background}`}
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

            @keyframes floatElement {
              0% {
                transform: translateY(10px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }

            @keyframes slideFromLeft {
              0% {
                transform: translateX(-30px);
                opacity: 0;
              }
              100% {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes slideFromRight {
              0% {
                transform: translateX(30px);
                opacity: 0;
              }
              100% {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes rotateIn {
              0% {
                transform: rotate(-5deg) scale(0.9);
                opacity: 0;
              }
              100% {
                transform: rotate(0) scale(1);
                opacity: 1;
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

            .season-intro-text {
              animation: slideFromLeft 1s cubic-bezier(0.2, 0.8, 0.2, 1)
                forwards;
            }

            .season-description {
              animation: slideFromRight 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s
                forwards;
              opacity: 0;
            }

            .decorative-element {
              animation: fadeIn 1.5s ease-out forwards;
            }

            .accent-element {
              animation: floatElement 1s ease-out 0.6s forwards;
              opacity: 0;
            }

            .card-frame {
              animation: rotateIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s
                forwards;
              opacity: 0;
            }

            @media (min-width: 640px) {
              .season-text-overlay {
                background-size: 20%;
              }
            }
          `}</style>

          {/* Decorative background elements */}
          <div
            className="decorative-element absolute left-[-5%] top-[-10%] z-0 h-[35%] w-[45%] rotate-[15deg] rounded-[30%_70%_70%_30%/30%_30%_70%_70%]"
            style={{
              background: `linear-gradient(135deg, ${currentSeasonConfig.shadowColor.replace("0.4", "0.15")}, transparent)`,
              backdropFilter: "blur(10px)",
            }}
          />
          <div
            className="decorative-element absolute bottom-[-5%] right-[-5%] z-0 h-[30%] w-[40%] rotate-[-10deg] rounded-[50%_50%_30%_70%/30%_50%_50%_70%]"
            style={{
              background: `linear-gradient(135deg, ${currentSeasonConfig.shadowColor.replace("0.4", "0.2")}, transparent)`,
              backdropFilter: "blur(5px)",
            }}
          />

          {/* Main content container */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
            {/* Card-like frame around content */}
            <div className="card-frame relative mx-auto max-w-4xl">
              {/* Season intro text */}
              <h3
                className={`season-intro-text mb-2 font-serif text-lg italic tracking-wide sm:text-xl md:text-2xl ${currentSeasonConfig.textColor}`}
              >
                You are a
              </h3>

              {/* Accent element */}
              <div className="accent-element mx-auto mb-1 flex items-center justify-center space-x-2">
                <div className="h-[1px] w-8 bg-black/20 sm:w-12"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-black/30"></div>
                <div className="h-[1px] w-8 bg-black/20 sm:w-12"></div>
              </div>

              {/* Main seasonal text with photo overlay */}
              <div className="mb-4 md:mb-6">
                <SeasonalText
                  text={
                    result.subSeasonal ??
                    result.seasonal.charAt(0).toUpperCase() +
                      result.seasonal.slice(1)
                  }
                  className="text-7xl font-black leading-none tracking-tighter sm:text-8xl md:text-9xl lg:text-[10rem]"
                  config={currentSeasonConfig}
                />
              </div>

              {/* Accent element */}
              <div className="accent-element mx-auto mb-4 flex items-center justify-center space-x-2 md:mb-6">
                <div className="h-[1px] w-16 bg-black/20 sm:w-24"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-black/30"></div>
                <div className="h-[1px] w-16 bg-black/20 sm:w-24"></div>
              </div>

              {/* Season description */}
              <p
                className={`season-description mx-auto max-w-md px-4 text-base font-light sm:text-lg md:text-xl ${currentSeasonConfig.textColor}`}
              >
                <span className="font-medium">Your palette</span> is{" "}
                {result.description ?? `${currentSeasonConfig.description}`}.
              </p>
            </div>
          </div>
        </div>
      ),
      duration: 7000,
    },

    // Palette story - Updated to show all colors from palette.json
    {
      content: () => (
        <div
          className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${currentSeasonConfig.background}`}
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

            @keyframes scaleIn {
              0% {
                transform: scale(0.8);
                opacity: 0;
              }
              100% {
                transform: scale(1);
                opacity: 1;
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

            @keyframes floatIn {
              0% {
                opacity: 0;
                transform: translateY(-10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
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
              animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }

            .palette-heading {
              animation: scaleIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
              opacity: 0;
            }

            .palette-accent {
              animation: floatIn 1s ease-out 0.3s forwards;
              opacity: 0;
            }

            .palette-grid {
              animation: fadeIn 1.2s ease-out 0.5s forwards;
              opacity: 0;
            }

            .decorative-element {
              animation: fadeIn 1.5s ease-out forwards;
            }
          `}</style>

          {/* Decorative elements */}
          <div
            className="decorative-element absolute -left-[10%] -top-[15%] z-0 h-[40%] w-[60%] rotate-[10deg] rounded-[70%_30%_50%_50%/60%_40%_60%_40%]"
            style={{
              background: `linear-gradient(135deg, ${currentSeasonConfig.shadowColor.replace("0.2", "0.1")}, transparent)`,
              backdropFilter: "blur(10px)",
            }}
          />
          <div
            className="decorative-element absolute -bottom-[10%] -right-[5%] z-0 h-[35%] w-[50%] rotate-[-10deg] rounded-[40%_60%_30%_70%/40%_50%_50%_60%]"
            style={{
              background: `linear-gradient(135deg, ${currentSeasonConfig.shadowColor.replace("0.2", "0.15")}, transparent)`,
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center md:px-12">
            <div className="palette-heading relative mb-1 font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className={`${currentSeasonConfig.textColor}`}>
                Your Seasonal Palette
              </span>
            </div>

            <h2 className="palette-title mb-3 font-light italic tracking-wide sm:mb-4 md:mb-5">
              <span
                className={`${currentSeasonConfig.textColor} text-base sm:text-lg md:text-xl`}
              >
                {result.subSeasonal ?? result.seasonal}
              </span>
            </h2>

            <div className="palette-accent mx-auto mb-6 flex items-center justify-center space-x-2 md:mb-8">
              <div className="h-[1px] w-12 bg-black/20 sm:w-16"></div>
              <div className="h-2 w-2 rounded-full bg-black/20"></div>
              <div className="h-[1px] w-12 bg-black/20 sm:w-16"></div>
            </div>

            <div className="palette-grid mx-auto max-w-md">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-5">
                {subSeasonColors.length > 0
                  ? subSeasonColors.map((color, index) => (
                      <div
                        key={color.hex}
                        className="flex flex-col items-center"
                      >
                        <div
                          className="color-circle sm:h-18 sm:w-18 h-16 w-16 rounded-full border-2 border-white/50 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 md:h-20 md:w-20 lg:h-24 lg:w-24"
                          style={{
                            backgroundColor: color.hex,
                            animationDelay: `${index * 0.1}s`,
                            boxShadow: `0 10px 25px -5px ${color.hex}80, 0 8px 10px -6px ${color.hex}40`,
                          }}
                        />
                        <p
                          className={`color-name mt-2 max-w-full truncate px-1 text-xs font-medium ${currentSeasonConfig.textColor} sm:text-sm`}
                          style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                        >
                          {color.name}
                        </p>
                      </div>
                    ))
                  : // Fallback to the analyzed colors if subSeasonColors is empty
                    Object.entries(result.colours).map(
                      ([hex, { name }], index) => (
                        <div key={hex} className="flex flex-col items-center">
                          <div
                            className="color-circle sm:h-18 sm:w-18 h-16 w-16 rounded-full border-2 border-white/50 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 md:h-20 md:w-20 lg:h-24 lg:w-24"
                            style={{
                              backgroundColor: hex,
                              animationDelay: `${index * 0.1}s`,
                              boxShadow: `0 10px 25px -5px ${hex}80, 0 8px 10px -6px ${hex}40`,
                            }}
                          />
                          <p
                            className={`color-name mt-2 max-w-full truncate px-1 text-xs font-medium ${currentSeasonConfig.textColor} sm:text-sm`}
                            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                          >
                            {name}
                          </p>
                        </div>
                      ),
                    )}
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 7000,
    },

    // "Our Top Picks" story
    {
      content: () => (
        <div
          className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${currentSeasonConfig.background}`}
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

            @keyframes fadeSlideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes floatIn {
              0% {
                opacity: 0;
                transform: translateY(10px) translateX(-10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0) translateX(0);
              }
            }

            .pulse-word {
              display: inline-block;
              animation: pulseSize 2.5s ease-in-out forwards;
              transform-origin: center;
            }

            .top-picks-title {
              animation: fadeSlideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }

            .top-picks-subtitle {
              animation: fadeSlideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s
                forwards;
              opacity: 0;
            }

            .decorative-element {
              animation: fadeIn 1.5s ease-out forwards;
            }

            .accent-line {
              animation: floatIn 1.2s ease-out 0.5s forwards;
              opacity: 0;
            }
          `}</style>

          {/* Decorative elements */}
          <div
            className="decorative-element absolute right-[-5%] top-[10%] z-0 h-[30%] w-[40%] rotate-[15deg] rounded-[30%_70%_60%_40%/40%_40%_60%_50%]"
            style={{
              background: `linear-gradient(135deg, ${currentSeasonConfig.shadowColor.replace("0.2", "0.15")}, transparent)`,
              backdropFilter: "blur(10px)",
            }}
          />
          <div
            className="decorative-element absolute bottom-[15%] left-[0%] z-0 h-[25%] w-[35%] rotate-[-10deg] rounded-[50%_50%_30%_70%/60%_40%_60%_40%]"
            style={{
              background: `linear-gradient(135deg, ${currentSeasonConfig.shadowColor.replace("0.2", "0.2")}, transparent)`,
              backdropFilter: "blur(5px)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8 text-center">
            <div className="top-picks-title relative mb-2 font-serif text-5xl font-extrabold italic tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className={`${currentSeasonConfig.textColor}`}>Our</span>
              <span
                className={`pulse-word mx-3 font-serif italic ${currentSeasonConfig.textColor} brightness-170 opacity-80 drop-shadow-md`}
              >
                Top
              </span>
              <span className={`${currentSeasonConfig.textColor}`}>Picks</span>
            </div>

            <div className="accent-line mx-auto mb-6 h-[2px] w-32 bg-white/50 sm:mb-8 sm:w-40" />

            <p
              className={`top-picks-subtitle max-w-md text-lg font-light ${currentSeasonConfig.textColor} sm:text-xl md:text-2xl`}
            >
              <span className="font-medium">Discover</span> your perfect
              seasonal colors
            </p>

            <div className="accent-line mt-10 flex flex-row items-center justify-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white/70"></div>
              <div className="h-1 w-16 rounded-full bg-white/30"></div>
              <div className="h-2 w-2 rounded-full bg-white/70"></div>
            </div>
          </div>
        </div>
      ),
      duration: 4000,
    },

    // Individual color stories
    ...topThreeColorEntries.map(([hex, { name, reason }]) => ({
      content: () => (
        <div className="relative h-full w-full overflow-hidden">
          {/* Main background - subtle gradient with the featured color */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${hex}99, ${hex})`,
            }}
          />

          {/* Decorative elements */}
          <div
            className="absolute left-[-5%] top-[-10%] z-10 h-[40%] w-[70%] rotate-[-10deg] rounded-[30%_70%_70%_30%/30%_40%_60%_70%]"
            style={{
              background: `linear-gradient(135deg, ${hex}aa, ${hex}88)`,
              boxShadow: `0 30px 50px rgba(0, 0, 0, 0.3)`,
              backdropFilter: "blur(10px)",
            }}
          />

          <div
            className="absolute bottom-[-5%] right-[-10%] z-10 h-[60%] w-[60%] rotate-[15deg] rounded-[50%_50%_30%_70%/40%_50%_50%_60%]"
            style={{
              background: `linear-gradient(135deg, ${hex}dd, ${hex}66)`,
              boxShadow: `0 30px 50px rgba(0, 0, 0, 0.2)`,
              backdropFilter: "blur(5px)",
            }}
          />

          <style jsx global>{`
            @keyframes slideInRight {
              from {
                transform: translateX(50px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes slideInLeft {
              from {
                transform: translateX(-50px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes fadeInUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            @keyframes revealMask {
              from {
                clip-path: inset(0 100% 0 0);
              }
              to {
                clip-path: inset(0 0 0 0);
              }
            }

            .color-card {
              animation: slideInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)
                forwards;
              opacity: 0;
            }

            .color-name-display {
              animation: slideInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s
                forwards;
              opacity: 0;
            }

            .color-swatch {
              animation: revealMask 1.2s ease-out 0.5s forwards;
              clip-path: inset(0 100% 0 0);
            }

            .color-description {
              animation: fadeInUp 0.8s ease-out 0.8s forwards;
              opacity: 0;
            }
          `}</style>

          {/* Content */}
          <div className="relative z-20 flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-5xl flex-col items-center justify-center px-6 md:flex-row md:items-stretch md:justify-between md:px-12 lg:px-16">
              {/* Left side - Color name and info */}
              <div className="color-name-display mb-6 flex flex-col items-center justify-center text-center md:mb-0 md:w-2/5 md:items-start md:justify-center md:text-left">
                <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-white/70 md:text-base">
                  {result.subSeasonal ?? result.seasonal}
                </h3>
                <h2 className="mb-3 font-serif text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                  {name}
                </h2>
                <div className="h-1 w-20 bg-white/30 md:w-24" />

                <div className="color-description mt-6 max-w-sm rounded-lg bg-black/10 p-4 backdrop-blur-sm">
                  <p className="text-center text-base font-light italic text-white md:text-left md:text-lg">
                    &ldquo;{reason}&rdquo;
                  </p>
                </div>
              </div>

              {/* Right side - Color card */}
              <div className="color-card flex w-full flex-col items-center justify-center py-2 md:w-2/5 md:py-0">
                <div className="relative aspect-square w-4/5 max-w-[300px] overflow-hidden rounded-xl shadow-2xl md:h-72 md:w-full lg:h-80">
                  {/* Color swatch main area */}
                  <div
                    className="color-swatch absolute inset-0"
                    style={{ backgroundColor: hex }}
                  />

                  {/* Fabric-like texture overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'url("/fabric-texture.png")',
                      backgroundSize: "cover",
                      mixBlendMode: "overlay",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
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
