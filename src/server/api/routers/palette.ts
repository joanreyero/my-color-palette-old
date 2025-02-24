import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { palette, recommendedColours } from "~/server/db/schema";

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

      // This would be the response from the LLM in the future
      const analysis = {
        seasonal: "spring" as const,
        colours: {
          "#FFB6C1": {
            reason:
              "Like cherry blossoms in spring, this soft pink brings warmth and freshness to your complexion",
            name: "Light Pink",
          },
          "#98FB98": {
            reason:
              "As tender as new leaves, this mint green harmonizes with your natural radiance",
            name: "Mint Green",
          },
          "#87CEEB": {
            reason:
              "Clear as a spring sky, this blue enhances your natural brightness",
            name: "Sky Blue",
          },
          "#FFD700": {
            reason:
              "Like daffodils in bloom, this golden yellow amplifies your warm undertones",
            name: "Golden Yellow",
          },
          "#DDA0DD": {
            reason:
              "Reminiscent of wisteria, this soft purple adds a romantic touch to your palette",
            name: "Plum",
          },
        },
      };

      // Insert the palette first
      const [newPalette] = await ctx.db
        .insert(palette)
        .values({
          season: analysis.seasonal,
        })
        .returning();

      if (!newPalette) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create palette",
        });
      }

      // Insert all the recommended colours
      await ctx.db.insert(recommendedColours).values(
        Object.entries(analysis.colours).map(([hex, { name, reason }]) => ({
          paletteId: newPalette.id,
          hex,
          name,
          reason,
        })),
      );

      // Return both the ID and the analysis
      return {
        id: newPalette.id,
        seasonal: analysis.seasonal,
        colours: analysis.colours,
      };
    }),
});
