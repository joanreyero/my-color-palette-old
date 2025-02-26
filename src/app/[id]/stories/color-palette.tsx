"use client";

import { motion } from "framer-motion";

interface ColorPaletteProps {
  colours: Record<string, { name: string }>;
}

export function ColorPalette({ colours }: ColorPaletteProps) {
  const colorEntries = Object.entries(colours);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center p-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center text-2xl font-semibold text-white/90"
      >
        Your Color Palette
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid w-full grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {colorEntries.map(([hex, { name }], i) => (
          <motion.div
            key={hex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.7 + i * 0.1,
              type: "spring",
              bounce: 0.4,
            }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="h-24 w-24 rounded-2xl shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: hex }}
            />
            <p className="text-sm font-medium text-white/80">{name}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
