"use client";

import { motion } from "framer-motion";

interface ColorStoryProps {
  hex: string;
  name: string;
  reason: string;
}

export function ColorStory({ hex, name, reason }: ColorStoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="relative"
      >
        <div
          className="h-48 w-48 rounded-full shadow-lg"
          style={{ backgroundColor: hex }}
        />
        <motion.div
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute inset-0 -z-10 rounded-full"
          style={{ backgroundColor: hex }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-3xl font-bold text-white"
      >
        {name}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 max-w-md text-lg leading-relaxed text-white/80"
      >
        {reason}
      </motion.p>
    </motion.div>
  );
}
