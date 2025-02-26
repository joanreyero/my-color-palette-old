"use client";

import { motion } from "framer-motion";

interface SeasonRevealProps {
  season: string;
}

export function SeasonReveal({ season }: SeasonRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center p-8 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-medium text-white/80"
      >
        Your season is
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
        className="mt-4 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-8xl"
      >
        {season}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 text-lg font-medium text-white/80"
      >
        Let&apos;s discover your perfect colors
      </motion.p>
    </motion.div>
  );
}
