"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TopPicks() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          bounce: 0.4,
          duration: 0.8,
        }}
        className="mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-4"
      >
        <Sparkles className="h-8 w-8 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
      >
        Our Top Picks
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-lg text-white/80"
      >
        Colors that will make you shine
      </motion.p>
    </motion.div>
  );
}
