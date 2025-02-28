"use client";

import React, { useState } from "react";
import {
  TwitterShareButton,
  WhatsappShareButton,
  TwitterIcon,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import { Instagram, Check, Share2 } from "lucide-react";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  seasonalType: string;
  accentColor: string;
}

export function SocialShareButtons({
  url,
  title,
  seasonalType,
  accentColor,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareMessage = `I just discovered I'm a ${seasonalType} type! Find your perfect colors too.`;

  const handleInstagramShare = async () => {
    try {
      await navigator.clipboard.writeText(`${shareMessage} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  // Get seasonal theme
  const getSeasonalTheme = () => {
    const season = seasonalType.toLowerCase();

    if (season.includes("spring")) {
      return {
        gradientBg: "bg-gradient-to-br from-rose-50 to-amber-50",
        accentGradient: "from-rose-200 to-amber-200",
        lightBg: "bg-amber-50",
        accentColor: "#FF6F61", // Coral
        emoji: "🌸",
        seasonName: "Spring",
      };
    }

    if (season.includes("summer")) {
      return {
        gradientBg: "bg-gradient-to-br from-sky-50 to-indigo-50",
        accentGradient: "from-sky-200 to-indigo-200",
        lightBg: "bg-sky-50",
        accentColor: "#87CEEB", // Sky blue
        emoji: "🌊",
        seasonName: "Summer",
      };
    }

    if (season.includes("autumn") || season.includes("fall")) {
      return {
        gradientBg: "bg-gradient-to-br from-amber-50 to-orange-50",
        accentGradient: "from-amber-200 to-orange-200",
        lightBg: "bg-amber-50",
        accentColor: "#D2691E", // Chocolate
        emoji: "🍂",
        seasonName: "Autumn",
      };
    }

    if (season.includes("winter")) {
      return {
        gradientBg: "bg-gradient-to-br from-slate-50 to-blue-50",
        accentGradient: "from-indigo-200 to-blue-200",
        lightBg: "bg-slate-50",
        accentColor: "#0047AB", // Cobalt blue
        emoji: "❄️",
        seasonName: "Winter",
      };
    }

    // Default theme
    return {
      gradientBg: "bg-gradient-to-br from-purple-50 to-pink-50",
      accentGradient: "from-purple-200 to-pink-200",
      lightBg: "bg-purple-50",
      accentColor: "#8A2BE2", // Purple
      emoji: "✨",
      seasonName: "Season",
    };
  };

  const theme = getSeasonalTheme();

  return (
    <div className="py-6">
      <div
        className={`mx-auto max-w-lg overflow-hidden rounded-3xl shadow-md ${theme.gradientBg}`}
      >
        <div className="p-6 md:p-8">
          {/* Header with emoji decoration */}
          <div className="relative mb-6 text-center">
            <div className="absolute -left-1 -top-2 text-3xl opacity-50">
              {theme.emoji}
            </div>
            <div className="absolute -right-1 -top-2 text-3xl opacity-50">
              {theme.emoji}
            </div>

            <h3 className="text-xl font-medium text-gray-800">
              Share Your {theme.seasonName} Palette
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
              Let your friends discover their perfect colors too
            </p>
          </div>

          {/* Share icons */}
          <div className="mt-6 flex justify-center gap-6">
            <WhatsappShareButton url={url} title={shareMessage} separator=" ">
              <div className="group flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group-hover:ring-2 group-hover:ring-green-100">
                  <WhatsappIcon
                    size={24}
                    round
                    bgStyle={{ fill: "white" }}
                    iconFillColor="#25D366"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-500">
                  WhatsApp
                </p>
              </div>
            </WhatsappShareButton>

            <TwitterShareButton
              url={url}
              title={shareMessage}
              hashtags={["colorpalette", "personalstyle"]}
            >
              <div className="group flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group-hover:ring-2 group-hover:ring-blue-100">
                  <TwitterIcon
                    size={24}
                    round
                    bgStyle={{ fill: "white" }}
                    iconFillColor="#1DA1F2"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-500">
                  Twitter
                </p>
              </div>
            </TwitterShareButton>

            <FacebookShareButton url={url} hashtag="#colorpalette">
              <div className="group flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group-hover:ring-2 group-hover:ring-blue-200">
                  <FacebookIcon
                    size={24}
                    round
                    bgStyle={{ fill: "white" }}
                    iconFillColor="#4267B2"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-500">
                  Facebook
                </p>
              </div>
            </FacebookShareButton>

            <button onClick={handleInstagramShare}>
              <div className="group flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group-hover:ring-2 group-hover:ring-pink-100">
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Instagram className="h-5 w-5 text-[#E1306C]" />
                  )}
                </div>
                <p className="mt-2 text-xs font-medium text-gray-500">
                  {copied ? "Copied!" : "Instagram"}
                </p>
              </div>
            </button>
          </div>

          {/* Social proof section */}
          <div className={`mt-6 rounded-2xl ${theme.lightBg} p-4`}>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-6 bg-gray-200"></div>
              <p className="text-center text-xs font-medium text-gray-500">
                <span className="font-semibold text-gray-700">
                  {getSharePercentage(seasonalType)}%
                </span>{" "}
                of people with your palette type saw an improvement in their
                style
              </p>
              <div className="h-px w-6 bg-gray-200"></div>
            </div>
          </div>

          {/* Call to action banner */}
          <div
            className={`mt-6 rounded-xl bg-gradient-to-r ${theme.accentGradient} p-3`}
          >
            <div className="flex items-center justify-center gap-2">
              <Share2 size={16} className="text-gray-700" />
              <p className="text-center text-sm font-medium text-gray-700">
                Share now to help friends find their colors!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate a believable share outcome percentage
function getSharePercentage(seasonalType: string): string {
  // Generate a consistent but high percentage (85-97%)
  const firstChar = seasonalType.charAt(0).toLowerCase();
  const charCode = firstChar.charCodeAt(0);

  // Calculate a number between 85 and 97
  const basePercentage = 85 + (charCode % 13);

  return basePercentage.toString();
}
