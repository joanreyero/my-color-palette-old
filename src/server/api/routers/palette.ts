import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  palette,
  colors,
  celebrities,
  subSeasonEnum,
  genderEnum,
} from "~/server/db/schema";

// Import the palette data and define its structure for TypeScript
import paletteJsonData from "~/palette.json";

// Define types for the palette JSON data
type ColorData = {
  hex: string;
  name: string;
  percentage: number;
};

type CelebrityData = {
  name: string;
  reason: string;
};

type SubSeasonData = {
  description: string;
  percentage: number;
  colors: ColorData[];
  celebrities: {
    female: CelebrityData;
    male: CelebrityData;
  };
};

type SeasonData = Record<
  (typeof subSeasonEnum.enumValues)[number],
  SubSeasonData | undefined
>;

type PaletteData = Record<
  "Spring" | "Summer" | "Autumn" | "Winter",
  SeasonData | undefined
>;

// Cast the imported JSON to our type
const typedPaletteData = paletteJsonData as PaletteData;

// Define the analysis result schema for Gemini
const PaletteAnalysisSchema = z.object({
  season: z.enum(["Spring", "Summer", "Autumn", "Winter"]),
  subseason: z.enum(subSeasonEnum.enumValues),
  recommendedColors: z
    .array(
      z.object({
        name: z.string(),
        reason: z.string(),
      }),
    )
    .length(3),
  gender: z.enum(genderEnum.enumValues),
});

export const paletteRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const paletteData = await ctx.db.query.palette.findFirst({
        where: eq(palette.id, input.id),
        with: {
          colors: true,
          celebrities: true,
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
      for (const color of paletteData.colors) {
        if (color.isRecommended) {
          colours[color.hex] = {
            name: color.name,
            reason: `This ${color.name.toLowerCase()} perfectly complements your ${paletteData.subSeason} palette.`,
          };
        }
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
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the environment variable for Google API key is set
        if (!process.env.GOOGLE_API_KEY) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Google API key is not configured",
          });
        }

        // Create the prompt for Gemini
        const prompt = `
        You are a professional color analyst and personal stylist.
        Analyze the person in this image and determine their seasonal color palette.
        
        Based on their features (skin tone, hair color, eye color):
        1. Determine which of the four seasons they belong to: Spring, Summer, Autumn, or Winter
        2. Determine their specific sub-season from the following options:
           - Spring: Light Spring, True Spring, Bright Spring
           - Summer: Light Summer, True Summer, Soft Summer
           - Autumn: Soft Autumn, True Autumn, Dark Autumn
           - Winter: Dark Winter, True Winter, Bright Winter
        3. Recommend 3 specific colors from their palette that would look best on them
        4. Identify if the person appears to be male or female
        
        Provide your analysis in a structured format.
        `;

        // Call Gemini to analyze the image
        const { object: analysis } = await generateObject({
          model: google("gemini-2.0-flash-001"),
          schema: PaletteAnalysisSchema,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image", image: new URL(input.imageUrl) },
              ],
            },
          ],
        });

        console.log(analysis);

        // Extract the analysis results
        const { season, subseason, recommendedColors, gender } = analysis;

        // Access the palette data from our JSON
        const subSeasonData = typedPaletteData[season]?.[subseason];

        if (!subSeasonData) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Could not find palette data for ${season} - ${subseason}`,
          });
        }

        // Insert the palette into the database
        const [newPalette] = await ctx.db
          .insert(palette)
          .values({
            season: season.toLowerCase() as
              | "winter"
              | "summer"
              | "spring"
              | "autumn",
            subSeason: subseason,
            description: subSeasonData.description,
            // Convert number to string for the database
            percentage: String(subSeasonData.percentage),
          })
          .returning();

        if (!newPalette) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create palette",
          });
        }

        // Insert all colors from the sub-season
        const colorEntries = subSeasonData.colors.map(
          (colorData: ColorData) => {
            // Check if this color is one of the recommended ones
            const isRecommended = recommendedColors.some(
              (rc) => rc.name.toLowerCase() === colorData.name.toLowerCase(),
            );

            return {
              paletteId: newPalette.id,
              hex: colorData.hex,
              name: colorData.name,
              // Convert number to string for the database
              percentage: String(colorData.percentage),
              isRecommended,
              reason: isRecommended
                ? recommendedColors.find(
                    (rc) =>
                      rc.name.toLowerCase() === colorData.name.toLowerCase(),
                  )?.reason
                : null,
            };
          },
        );

        await ctx.db.insert(colors).values(colorEntries);

        // Insert the celebrity based on gender
        const celebrityData =
          gender === "female"
            ? subSeasonData.celebrities.female
            : subSeasonData.celebrities.male;

        await ctx.db.insert(celebrities).values({
          paletteId: newPalette.id,
          name: celebrityData.name,
          gender,
        });

        return {
          status: "success",
          id: newPalette.id,
        };
      } catch (error) {
        console.error("Error analyzing palette:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to analyze palette",
        });
      }
    }),
});
