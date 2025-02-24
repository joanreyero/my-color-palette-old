import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

  analyzePalette: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        seasonal: "Spring",
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
    }),
});
