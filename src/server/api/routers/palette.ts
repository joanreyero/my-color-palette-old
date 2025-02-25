import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  palette,
  recommendedColours,
  seasonEnum,
  subSeasonEnum,
} from "~/server/db/schema";
import paletteData from "../../../palette.json";

export const paletteRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.palette.findFirst({
      orderBy: (palette, { desc }) => [desc(palette.createdAt)],
    });

    return post ?? null;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const paletteData = await ctx.db.query.palette.findFirst({
        where: eq(palette.id, input.id),
        with: {
          recommendedColours: true,
        },
      });

      if (!paletteData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Palette not found",
        });
      }

      // Transform the data to match our expected format
      const colours: Record<string, { reason: string; name: string }> = {};
      for (const colour of paletteData.recommendedColours) {
        colours[colour.hex] = {
          name: colour.name,
          reason: colour.reason,
        };
      }

      return {
        id: paletteData.id,
        seasonal: paletteData.season,
        subSeasonal: paletteData.subSeason,
        description: paletteData.description,
        colours,
      };
    }),

  analyzePalette: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx }) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fixed values as requested - always return True Winter
      const season = "spring";
      const subSeason = "Light Spring";

      // Create some dummy colors (5 colors)
      const dummyColors = [
        { hex: "#0C1E3E", name: "Navy Blue" },
        { hex: "#D00C1E", name: "True Red" },
        { hex: "#FFFFFF", name: "Pure White" },
        { hex: "#000000", name: "Black" },
        { hex: "#3957D0", name: "Royal Blue" },
      ];

      // Create a record of colors with reasons
      const colours: Record<string, { reason: string; name: string }> = {};
      for (const color of dummyColors) {
        colours[color.hex] = {
          name: color.name,
          reason: `This ${color.name.toLowerCase()} perfectly complements your ${subSeason} palette.`,
        };
      }

      // Create a description
      const description = `Your ${subSeason} palette features clear, cool, and saturated colors that enhance your natural beauty and complement your crisp winter undertones.`;

      // Insert the palette into the database
      const [newPalette] = await ctx.db
        .insert(palette)
        .values({
          season: season,
          subSeason: subSeason,
          description: description,
        })
        .returning();

      if (!newPalette) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create palette",
        });
      }

      // Insert the recommended colors
      await ctx.db.insert(recommendedColours).values(
        Object.entries(colours).map(([hex, { name, reason }]) => ({
          paletteId: newPalette.id,
          hex,
          name,
          reason,
        })),
      );

      // Return the result
      return {
        id: newPalette.id,
        seasonal: season,
        subSeasonal: subSeason,
        description: description,
        colours,
      };
    }),
});
