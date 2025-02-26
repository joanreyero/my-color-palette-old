"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "~/lib/utils";
import { ColorPalette } from "./stories/color-palette";
import { ColorStory } from "./stories/color-story";
import { SeasonReveal } from "./stories/season-reveal";
import { TopPicks } from "./stories/top-picks";

const STORY_DURATION = 7000; // 7 seconds per story

interface StoriesProps {
  result: {
    seasonal: string;
    colours: Record<string, { reason: string; name: string }>;
  };
}

export function Stories({ result }: StoriesProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const totalStories = 8;

  // Handle auto-advance
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (currentStory < totalStories - 1) {
        setCurrentStory((current) => current + 1);
      }
    }, STORY_DURATION);

    return () => clearTimeout(timer);
  }, [currentStory, isPaused]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentStory > 0) {
        setCurrentStory((current) => current - 1);
      } else if (e.key === "ArrowRight" && currentStory < totalStories - 1) {
        setCurrentStory((current) => current + 1);
      } else if (e.key === " ") {
        // Space bar to pause/play
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStory]);

  // Handle touch navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    setTouchStart(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const touchEnd = touch.clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0 && currentStory < totalStories - 1) {
        // Swipe left
        setCurrentStory((current) => current + 1);
      } else if (diff < 0 && currentStory > 0) {
        // Swipe right
        setCurrentStory((current) => current - 1);
      }
    }
    setTouchStart(null);
  };

  // Handle click navigation
  const handleAreaClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftSide = x < rect.width / 3;
      const isRightSide = x > (rect.width / 3) * 2;

      if (isLeftSide && currentStory > 0) {
        setCurrentStory((current) => current - 1);
      } else if (isRightSide && currentStory < totalStories - 1) {
        setCurrentStory((current) => current + 1);
      } else {
        // Middle area - pause/play
        setIsPaused((p) => !p);
      }
    },
    [currentStory],
  );

  // Get current story component
  const getCurrentStory = () => {
    const colorEntries = Object.entries(result.colours);

    switch (currentStory) {
      case 0:
        return <SeasonReveal season={result.seasonal} />;
      case 1:
        return <ColorPalette colours={result.colours} />;
      case 2:
        return <TopPicks />;
      default: {
        const colorIndex = currentStory - 3;
        const entry = colorEntries[colorIndex];
        if (entry && colorIndex >= 0 && colorIndex < colorEntries.length) {
          const [hex, { name, reason }] = entry;
          return <ColorStory hex={hex} name={name} reason={reason} />;
        }
        return null;
      }
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-black text-white">
      {/* Progress bars */}
      <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 p-2">
        {Array.from({ length: totalStories }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className={cn(
                "h-full w-full rounded-full bg-white transition-transform duration-[7000ms] ease-linear",
                i === currentStory && !isPaused && "origin-left scale-x-100",
                i === currentStory && isPaused && "origin-left transition-none",
                i < currentStory && "scale-x-100",
                i > currentStory && "scale-x-0",
              )}
              style={{
                transform:
                  i === currentStory && !isPaused ? "scaleX(1)" : undefined,
                transformOrigin: "left",
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-1 opacity-0 transition-opacity hover:bg-black/40 group-hover:opacity-100"
        onClick={() =>
          currentStory > 0 && setCurrentStory((current) => current - 1)
        }
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-1 opacity-0 transition-opacity hover:bg-black/40 group-hover:opacity-100"
        onClick={() =>
          currentStory < totalStories - 1 &&
          setCurrentStory((current) => current + 1)
        }
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Pause/Play button */}
      <button
        className="absolute bottom-4 right-4 z-20 rounded-full bg-black/20 p-2 opacity-0 transition-opacity hover:bg-black/40 group-hover:opacity-100"
        onClick={() => setIsPaused((p) => !p)}
      >
        {isPaused ? (
          <Play className="h-6 w-6" />
        ) : (
          <Pause className="h-6 w-6" />
        )}
      </button>

      {/* Touch/Click areas */}
      <div
        className="absolute inset-0 z-10 flex"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleAreaClick}
      >
        <div className="h-full w-1/3" />
        <div className="h-full w-1/3" />
        <div className="h-full w-1/3" />
      </div>

      {/* Story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="relative h-full"
        >
          {getCurrentStory()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
