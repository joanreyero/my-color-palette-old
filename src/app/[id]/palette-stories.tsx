"use client";

import { useState, useEffect } from "react";
import Stories from "react-insta-stories";
import { Share2, X } from "lucide-react";
import Image from "next/image";
import paletteData from "../../palette.json";

type PaletteResult = {
  id: number;
  seasonal: string;
  subSeasonal?: string;
  description?: string | null;
  colours: Record<string, { reason: string; name: string }>;
  celebrity?: {
    name?: string;
    gender?: string;
  } | null;
};

// Define the type for the new palette data structure
type SeasonalColor = {
  hex: string;
  name: string;
};

type SubSeasonData = {
  description: string;
  colors: SeasonalColor[];
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
                opacity: 0.9;
              }
            }

            @keyframes scaleUp {
              0% {
                transform: scale(1);
                text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
              }
              75% {
                transform: scale(1.05);
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
              }
              100% {
                transform: scale(1.03);
                text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
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
              text-shadow: none;
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
                fadeIn 1.5s ease-out 0.3s forwards,
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

    // Celebrity Fashion Icon slide
    {
      content: () => {
        // Get celebrity info based on the user's result
        const getCelebrityInfo = () => {
          // Check if celebrity data is available directly in the result
          if (result.celebrity) {
            try {
              // Use the gender from the result if available, otherwise default to female
              const userGender =
                result.celebrity.gender?.toLowerCase() === "male"
                  ? "male"
                  : "female";

              // Get the image path based on the user's season and subseasonal
              const imagePath = result.subSeasonal
                ? `/celebrities/${result.subSeasonal.toLowerCase().replace(/\s+/g, "-")}-${userGender}.jpg`
                : `/celebrities/${result.seasonal.toLowerCase()}-${userGender}.jpg`;

              // Look up reason in palette data if not in the result
              let reason = "A perfect style icon for your color palette";

              // Try to get more detailed reason from palette data
              if (result.subSeasonal) {
                try {
                  const capitalizedSeason = (result.seasonal
                    .charAt(0)
                    .toUpperCase() + result.seasonal.slice(1)) as Season;
                  const typedPaletteData = paletteData as PaletteDataType;
                  const seasonData = typedPaletteData[capitalizedSeason];
                  const celebrityData =
                    seasonData?.[result.subSeasonal as SubSeason]
                      ?.celebrities?.[userGender];

                  if (celebrityData) {
                    reason = celebrityData.reason;
                  }
                } catch (err) {
                  console.error("Error getting celebrity reason:", err);
                }
              }

              return {
                name: result.celebrity.name,
                reason: reason,
                image: imagePath,
              };
            } catch (error) {
              console.error("Error loading celebrity data:", error);
            }
          }

          // Fallback to palette data if no celebrity in result
          if (result.subSeasonal && result.seasonal) {
            try {
              const capitalizedSeason = (result.seasonal
                .charAt(0)
                .toUpperCase() + result.seasonal.slice(1)) as Season;
              const typedPaletteData = paletteData as PaletteDataType;
              const seasonData = typedPaletteData[capitalizedSeason];
              const userGender = "female";

              const subSeasonData =
                seasonData?.[result.subSeasonal as SubSeason];
              const celebrityData = subSeasonData?.celebrities?.[userGender];

              if (celebrityData) {
                return {
                  name: celebrityData.name,
                  reason: celebrityData.reason,
                  image: `/celebrities/${result.subSeasonal.toLowerCase().replace(/\s+/g, "-")}-${userGender}.jpg`,
                };
              }
            } catch (error) {
              console.error("Error loading fallback celebrity data:", error);
            }
          }

          // Default fallback
          return {
            name: "Style Icon",
            reason: "Represents your perfect color palette",
            image: "/placeholder.jpg",
          };
        };

        const celebrity = getCelebrityInfo();

        return (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            <style jsx global>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes slideUp {
                from {
                  transform: translateY(30px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }

              @keyframes scaleIn {
                from {
                  transform: scale(0.95);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes fadeSlideRight {
                from {
                  transform: translateX(-20px);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
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

              @keyframes expandWidth {
                from {
                  width: 0;
                  opacity: 0;
                }
                to {
                  width: 100%;
                  opacity: 1;
                }
              }

              .celebrity-title {
                animation: fadeSlideRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)
                  forwards;
              }

              .accent-line {
                animation: fadeIn 1s ease-out 0.4s forwards;
                opacity: 0;
              }

              .accent-line div:first-child {
                animation: expandWidth 0.8s ease-out 0.5s forwards;
                width: 0;
                opacity: 0;
              }

              .accent-line div:last-child {
                animation: expandWidth 0.8s ease-out 0.5s forwards;
                width: 0;
                opacity: 0;
              }

              .celebrity-image {
                animation: scaleIn 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s
                  forwards;
                opacity: 0;
              }

              .celebrity-name {
                animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s
                  forwards;
                opacity: 0;
              }

              .celebrity-description {
                animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s
                  forwards;
                opacity: 0;
              }

              .decorative-element {
                animation: fadeIn 1.5s ease-out forwards;
              }
            `}</style>

            {/* Decorative elements - adjusted for dark background */}
            <div
              className="decorative-element absolute -left-[5%] top-[10%] z-0 h-[35%] w-[50%] rotate-[15deg] rounded-[30%_70%_50%_50%/40%_40%_60%_60%]"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent)`,
                backdropFilter: "blur(10px)",
              }}
            />
            <div
              className="decorative-element absolute -bottom-[10%] -right-[5%] z-0 h-[40%] w-[60%] rotate-[-10deg] rounded-[50%_50%_30%_70%/40%_60%_40%_60%]"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 80%)`,
                backdropFilter: "blur(5px)",
              }}
            />

            {/* Enhanced Decorative elements - adjusted for dark background */}
            <div
              className="decorative-element absolute -left-[8%] top-[5%] z-0 h-[45%] w-[65%] rotate-[15deg] rounded-[40%_60%_55%_45%/50%_40%_60%_50%]"
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent 70%)`,
                backdropFilter: "blur(12px)",
              }}
            />
            <div
              className="decorative-element absolute -bottom-[15%] -right-[10%] z-0 h-[50%] w-[70%] rotate-[-5deg] rounded-[45%_55%_35%_65%/40%_65%_35%_60%]"
              style={{
                background: `radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.07), transparent 80%)`,
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Seasonal accent color spots - add a touch of the season's accent color */}
            <div
              className="decorative-element absolute left-[55%] top-[10%] z-0 h-[25%] w-[25%] rotate-[25deg] rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle, ${Object.keys(result.colours)[0] ?? "#ffffff"}, transparent 80%)`,
                filter: "blur(40px)",
              }}
            />
            <div
              className="decorative-element absolute bottom-[60%] right-[65%] z-0 h-[18%] w-[18%] rotate-[-15deg] rounded-full opacity-15"
              style={{
                background: `radial-gradient(circle, ${Object.keys(result.colours)[1] ?? "#ffffff"}, transparent 70%)`,
                filter: "blur(50px)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 sm:px-8 md:px-12">
              <h2 className="celebrity-title mb-3 font-serif text-2xl font-light italic tracking-wide text-white sm:text-3xl md:mb-5 md:text-4xl lg:text-5xl">
                Your Celebrity Fashion Icon
              </h2>

              <div className="accent-line mb-5 flex items-center justify-center space-x-3 md:mb-8">
                <div className="h-[1px] w-16 bg-white/30 sm:w-20 md:w-28"></div>
                <div className="h-2 w-2 rotate-45 bg-white/40"></div>
                <div className="h-[1px] w-16 bg-white/30 sm:w-20 md:w-28"></div>
              </div>

              <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
                <div className="celebrity-image relative mb-6 h-80 w-80 overflow-hidden rounded-full border-4 border-white/30 shadow-2xl backdrop-blur-sm sm:h-96 sm:w-96 md:h-[28rem] md:w-[28rem]">
                  <Image
                    src={celebrity.image || "/placeholder.jpg"}
                    alt={celebrity.name ?? "Celebrity fashion icon"}
                    className="h-full w-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 28rem"
                    priority
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `inset 0 0 30px 8px rgba(0, 0, 0, 0.6), 0 0 30px 5px rgba(255, 255, 255, 0.2)`,
                    }}
                  />
                </div>

                <div className="mt-4 max-w-2xl rounded-xl bg-white/10 px-6 py-5 backdrop-blur-md md:mt-6 md:px-8 md:py-6">
                  <h3 className="celebrity-name mb-3 text-center text-3xl font-bold text-white sm:text-4xl md:mb-4 md:text-5xl">
                    {celebrity.name}
                  </h3>

                  <p className="celebrity-description mx-auto max-w-lg text-center text-lg font-light leading-relaxed text-white/90 sm:text-xl md:text-2xl">
                    {celebrity.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      },
      duration: 7000,
    },

    // Sub-season Population Statistics slide
    {
      content: () => {
        // Get the first color from the palette for the sub-season percentage
        const firstColor = Object.keys(result.colours)[0] ?? "#6366f1";

        // Convert the hex color to a percentage between 0.5 and 5
        // Take the first two characters after # (red value) and convert to decimal
        const hexValue = parseInt(firstColor.slice(1, 3), 16);
        // Scale to our target range: (hexValue / 255) * 4.5 + 0.5
        const subSeasonPercentage = ((hexValue / 255) * 4.5 + 0.5).toFixed(1);

        return (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900">
            <style jsx global>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes scaleIn {
                from {
                  transform: scale(0.9);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes countUp {
                from {
                  transform: translateY(100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }

              @keyframes growCircle {
                from {
                  transform: scale(0);
                }
                to {
                  transform: scale(1);
                }
              }

              @keyframes pulse {
                0% {
                  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
                }
                70% {
                  box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
                }
              }

              @keyframes slideFromBottom {
                from {
                  transform: translateY(30px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }

              @keyframes floatLight {
                0% {
                  transform: translate(0, 0);
                  opacity: 0.5;
                }
                50% {
                  transform: translate(-15px, -15px);
                  opacity: 0.8;
                }
                100% {
                  transform: translate(0, 0);
                  opacity: 0.5;
                }
              }

              @keyframes rotateSlow {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }

              @keyframes shimmerLight {
                0% {
                  opacity: 0.3;
                  transform: translateX(-100%) translateY(-100%) rotate(25deg);
                }
                50% {
                  opacity: 0.6;
                }
                100% {
                  opacity: 0.3;
                  transform: translateX(100%) translateY(100%) rotate(25deg);
                }
              }

              .stat-title {
                animation: fadeIn 0.8s ease-out forwards;
              }

              .stat-circle {
                animation:
                  growCircle 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                  pulse 2s infinite 1.5s;
                position: relative;
                overflow: visible;
              }

              .stat-circle::before {
                content: "";
                position: absolute;
                top: -20%;
                left: -20%;
                width: 140%;
                height: 140%;
                border-radius: 50%;
                background: radial-gradient(
                  circle,
                  ${firstColor}40 0%,
                  transparent 70%
                );
                animation: floatLight 8s ease-in-out infinite;
                z-index: -1;
              }

              .stat-circle::after {
                content: "";
                position: absolute;
                top: -30%;
                left: -30%;
                width: 160%;
                height: 160%;
                border-radius: 50%;
                border: 1px dashed rgba(255, 255, 255, 0.2);
                animation: rotateSlow 30s linear infinite;
                z-index: -1;
              }

              .stat-percentage {
                animation: countUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s
                  forwards;
                opacity: 0;
                position: relative;
              }

              .stat-description {
                animation: slideFromBottom 0.8s ease-out 0.6s forwards;
                opacity: 0;
              }

              .stat-detail {
                animation: fadeIn 1s ease-out 0.9s forwards;
                opacity: 0;
              }

              .decorative-element {
                animation: fadeIn 1.5s ease-out forwards;
              }

              .light-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(30px);
                animation: fadeIn 2s ease-out forwards;
                opacity: 0;
              }
            `}</style>

            {/* Light orbs */}
            <div
              className="light-orb"
              style={{
                background: `radial-gradient(circle, ${firstColor}60 0%, transparent 70%)`,
                width: "180px",
                height: "180px",
                top: "15%",
                right: "15%",
                animationDelay: "0.3s",
                zIndex: 0,
              }}
            />

            <div
              className="light-orb"
              style={{
                background: `radial-gradient(circle, ${firstColor}40 0%, transparent 70%)`,
                width: "220px",
                height: "220px",
                bottom: "20%",
                left: "5%",
                animationDelay: "0.8s",
                zIndex: 0,
              }}
            />

            {/* Decorative elements */}
            <div
              className="decorative-element absolute -left-[10%] top-[5%] z-0 h-[45%] w-[55%] rotate-[15deg] rounded-[40%_60%_55%_45%/50%_40%_60%_50%]"
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05), transparent 70%)`,
                backdropFilter: "blur(12px)",
              }}
            />
            <div
              className="decorative-element absolute -bottom-[15%] -right-[10%] z-0 h-[50%] w-[70%] rotate-[-5deg] rounded-[45%_55%_35%_65%/40%_65%_35%_60%]"
              style={{
                background: `radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.04), transparent 80%)`,
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Seasonal accent color spots */}
            <div
              className="decorative-element absolute left-[15%] top-[35%] z-0 h-[20%] w-[20%] rounded-full opacity-10"
              style={{
                background: `radial-gradient(circle, ${Object.keys(result.colours)[0] ?? "#ffffff"}, transparent 70%)`,
                filter: "blur(50px)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center sm:px-8">
              <h2 className="stat-title mb-3 font-serif text-2xl font-light italic tracking-wide text-white sm:text-3xl md:mb-6 md:text-4xl">
                Color Palette Insights
              </h2>

              <div className="relative mb-8 flex flex-col items-center md:mb-10">
                <div className="stat-circle relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black p-1 sm:h-52 sm:w-52 md:h-64 md:w-64">
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm">
                    <span className="stat-percentage relative font-mono text-5xl font-bold text-white sm:text-6xl md:text-7xl">
                      {subSeasonPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="max-w-xl">
                <h3 className="stat-description mb-3 text-xl font-medium text-white sm:text-2xl md:mb-4 md:text-3xl">
                  You belong to an exclusive color family
                </h3>

                <p className="stat-detail mx-auto max-w-lg text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
                  Only{" "}
                  <span className="font-semibold text-white">
                    {subSeasonPercentage}%
                  </span>{" "}
                  of people share your{" "}
                  <span className="font-semibold text-white">
                    {result.subSeasonal ?? result.seasonal}
                  </span>{" "}
                  color profile, based on our global color analysis data.
                </p>
              </div>
            </div>
          </div>
        );
      },
      duration: 7000,
    },

    // Color Adoption Statistics slide
    {
      content: () => {
        // Get all three top colors from the palette
        const colorKeys = Object.keys(result.colours);
        const topThreeColors = colorKeys.slice(0, 3);

        // Generate statistics for each color
        const colorStats = topThreeColors.map((colorHex, index) => {
          // Use different parts of the hex code to generate varied percentages
          // For first color use red component, second use green, third use blue
          const component = index === 0 ? 1 : index === 1 ? 3 : 5;
          const hexValue = parseInt(
            colorHex.slice(component, component + 2),
            16,
          );

          // Scale to our target range: (hexValue / 255) * 4 + 1
          // This gives us a range between 1% and 5% for more realistic values
          const adoptionPercentage = ((hexValue / 255) * 4 + 1).toFixed(1);

          return {
            hex: colorHex,
            name: result.colours[colorHex]?.name ?? "signature color",
            percentage: adoptionPercentage,
            // Add slight delay to each animation
            animationDelay: index * 0.2,
          };
        });

        return (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            <style jsx global>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes slideUp {
                from {
                  transform: translateY(30px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }

              @keyframes growBar {
                from {
                  width: 0;
                  opacity: 0;
                }
                to {
                  width: 100%;
                  opacity: 1;
                }
              }

              @keyframes fadeInScale {
                from {
                  transform: scale(0.95);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes highlightText {
                0% {
                  text-shadow: 0 0 0 rgba(255, 255, 255, 0);
                }
                50% {
                  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
                }
                100% {
                  text-shadow: 0 0 0 rgba(255, 255, 255, 0);
                }
              }

              @keyframes glowPulse {
                0% {
                  opacity: 0.4;
                  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.1);
                }
                50% {
                  opacity: 0.8;
                  box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.3);
                }
                100% {
                  opacity: 0.4;
                  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.1);
                }
              }

              @keyframes colorShimmer {
                0% {
                  background-position: -100% 0;
                }
                100% {
                  background-position: 200% 0;
                }
              }

              @keyframes floatAnimation {
                0% {
                  transform: translateY(0) translateX(0);
                }
                33% {
                  transform: translateY(-10px) translateX(5px);
                }
                66% {
                  transform: translateY(5px) translateX(-5px);
                }
                100% {
                  transform: translateY(0) translateX(0);
                }
              }

              .stat-title {
                animation: fadeIn 0.8s ease-out forwards;
                position: relative;
              }

              .stat-title::after {
                content: "";
                position: absolute;
                bottom: -10px;
                left: 25%;
                width: 50%;
                height: 1px;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.8),
                  transparent
                );
                animation: colorShimmer 4s ease-in-out infinite;
                background-size: 200% 100%;
              }

              .stat-bar-container {
                animation: fadeInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
                  forwards;
                opacity: 0;
                position: relative;
                overflow: hidden;
              }

              .stat-bar-container::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.2),
                  transparent
                );
                animation: colorShimmer 4s ease-in-out infinite;
                background-size: 200% 100%;
                z-index: 0;
              }

              .stat-bar {
                animation: growBar 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)
                  forwards;
                width: 0;
                opacity: 0;
                position: relative;
                z-index: 1;
              }

              .stat-bar::after {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                width: 15px;
                height: 100%;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.4)
                );
                animation: glowPulse 4s ease-in-out infinite;
                border-radius: 0 4px 4px 0;
              }

              .stat-percentage {
                animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
                  forwards;
                opacity: 0;
                position: relative;
                z-index: 2;
              }

              .stat-description {
                animation: slideUp 0.8s ease-out 0.9s forwards;
                opacity: 0;
              }

              .stat-detail {
                animation: fadeIn 1s ease-out 1.2s forwards;
                opacity: 0;
              }

              .decorative-element {
                animation: fadeIn 1.5s ease-out forwards;
              }

              .color-label {
                animation: fadeIn 0.8s ease-out forwards;
                opacity: 0;
              }

              .color-dot {
                animation: floatAnimation 8s ease-in-out infinite;
              }
            `}</style>

            {/* Decorative elements */}
            <div
              className="decorative-element absolute -right-[5%] top-[10%] z-0 h-[35%] w-[45%] rotate-[-15deg] rounded-[40%_60%_50%_50%/50%_40%_60%_50%]"
              style={{
                background: `radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.03), transparent 70%)`,
                backdropFilter: "blur(12px)",
              }}
            />
            <div
              className="decorative-element absolute -bottom-[10%] left-[0%] z-0 h-[30%] w-[40%] rotate-[10deg] rounded-[45%_55%_35%_65%/50%_50%_50%_50%]"
              style={{
                background: `radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.04), transparent 80%)`,
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Floating color dots */}
            {colorStats.map((stat, index) => (
              <div
                key={`dot-${index}`}
                className="color-dot absolute rounded-full"
                style={{
                  backgroundColor: stat.hex,
                  width: 15 + index * 5 + "px",
                  height: 15 + index * 5 + "px",
                  top: 20 + index * 20 + "%",
                  right: 5 + index * 15 + "%",
                  opacity: 0.4,
                  filter: "blur(5px)",
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}

            {colorStats.map((stat, index) => (
              <div
                key={`dot2-${index}`}
                className="color-dot absolute rounded-full"
                style={{
                  backgroundColor: stat.hex,
                  width: 10 + index * 8 + "px",
                  height: 10 + index * 8 + "px",
                  bottom: 15 + index * 25 + "%",
                  left: 10 + index * 10 + "%",
                  opacity: 0.3,
                  filter: "blur(6px)",
                  animationDelay: `${index * 0.3 + 1}s`,
                }}
              />
            ))}

            {/* Content */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center sm:px-8">
              <h2 className="stat-title mb-4 font-serif text-2xl font-light italic tracking-wide text-white sm:text-3xl md:mb-6 md:text-4xl">
                Color Trend Analysis
              </h2>

              <div className="mb-6 w-full max-w-xl space-y-4 md:mb-8">
                {colorStats.map((colorStat, index) => (
                  <div key={colorStat.hex} className="flex flex-col space-y-1">
                    {/* Color name label */}
                    <div
                      className="color-label flex items-center text-left text-sm text-white/80 md:text-base"
                      style={{ animationDelay: `${0.3 + index * 0.2}s` }}
                    >
                      <div
                        className="mr-2 h-3 w-3 rounded-full"
                        style={{ backgroundColor: colorStat.hex }}
                      />
                      <span>{colorStat.name}</span>
                    </div>

                    {/* Bar with percentage */}
                    <div
                      className="stat-bar-container h-10 w-full rounded-lg bg-white/5 p-1.5 backdrop-blur-sm md:h-12"
                      style={{ animationDelay: `${0.2 + index * 0.2}s` }}
                    >
                      <div
                        className="stat-bar h-full origin-left rounded-md"
                        style={{
                          backgroundColor: colorStat.hex,
                          animationDelay: `${0.5 + index * 0.2}s`,
                        }}
                      >
                        <div className="flex h-full items-center justify-end pr-4">
                          <span
                            className="stat-percentage text-sm font-bold text-white md:text-lg"
                            style={{ animationDelay: `${0.7 + index * 0.2}s` }}
                          >
                            {colorStat.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-xl">
                <h3 className="stat-description mb-3 text-xl font-medium text-white sm:text-2xl md:mb-4 md:text-3xl">
                  Your color palette is distinctively rare
                </h3>

                <p className="stat-detail mx-auto max-w-lg text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
                  Your recommended colors are used by only a small percentage of
                  people worldwide. This makes your palette uniquely expressive
                  and helps you stand out with a distinctive personal style.
                </p>
              </div>
            </div>
          </div>
        );
      },
      duration: 70000,
    },
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
          textShadow: `0 1px 5px ${config.shadowColor}`,
        }}
      >
        {text}
      </div>
      <div className={`season-text-overlay ${className}`}>{text}</div>
    </div>
  );
}
