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
        hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
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
      const colours: Record<
        string,
        {
          reason: string;
          name: string;
          percentage: number | null;
          recommended: boolean;
        }
      > = {};
      for (const color of paletteData.colors) {
        if (color.isRecommended) {
          colours[color.hex] = {
            name: color.name,
            percentage: color.percentage ? parseFloat(color.percentage) : null,
            recommended: color.isRecommended,
            reason:
              color.reason ??
              `This ${color.name.toLowerCase()} perfectly complements your ${paletteData.subSeason} palette.`,
          };
        }
      }

      return {
        id: paletteData.id,
        seasonal: paletteData.season,
        subSeasonal: paletteData.subSeason,
        percentage: paletteData.percentage,
        description: paletteData.description,
        colours,
        celebrity:
          paletteData.celebrities && paletteData.celebrities.length > 0
            ? {
                name: paletteData.celebrities[0]?.name,
                gender: paletteData.celebrities[0]?.gender,
              }
            : null,
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

        const system = `You are an expert in seasonal color analysis.  
        Given an image, you identify the person's seasonal color palette by carefully evaluating:
        - **Skin tone and undertones** (warm, cool, neutral)
        - **Overall contrast** (low, medium, high)
        - **Similarity to provided celebrity examples**

        Classify clearly into one of four main seasons (**Spring, Summer, Autumn, Winter**) and their precise sub-season. Recommend **3 personalized colors** individually tailored to complement:
        - **Eyes**
        - **Hair**
        - **Skin**

        Provide a precise and clear explanation for each recommended color. Respond strictly in the JSON format specified by the user.
        `;

        // Create the prompt for Gemini
        const prompt = `Given the following detailed seasonal palette reference, classify the provided image accurately:

| Main Season | Sub-season       | Description & Characteristics                                | Celebrity Example                      |
|-------------|------------------|--------------------------------------------------------------|----------------------------------------|
| **Spring**  | **Light Spring** | Warm undertones, delicate features, very low contrast, lighter skin/hair/eyes | Taylor Swift, Owen Wilson              |
|             | **True Spring**  | Warm undertones, clear features, medium contrast, golden tones | Blake Lively, Brad Pitt                |
|             | **Bright Spring**| Warm undertones, vivid and intense colors, high contrast, medium to deeper skin tones | Richa Moorjani, Zack Efron             |
| **Summer**  | **Light Summer** | Cool undertones, soft colors, low contrast, muted eye/hair colors, lighter skin tone | Margot Robbie, Daniel Craig            |
|             | **True Summer**  | Cool undertones, muted medium contrast, slightly grayish tones, medium skin tone | Barbara Palvin, Orlando Bloom          |
|             | **Soft Summer**  | Cool-neutral undertones, muted and gentle colors, low-medium contrast, medium skin tone | Jennifer Aniston, Michael Ealy         |
| **Autumn**  | **Soft Autumn**  | Warm-neutral undertones, soft muted colors, gentle contrast, medium skin tone | Scarlett Johansson, Jude Law           |
|             | **True Autumn**  | Warm undertones, earthy rich colors, medium-dark contrast, deeper skin tone | Jennifer Lopez, Ryan Gosling           |
|             | **Dark Autumn**  | Warm undertones, deep intense colors, high contrast, deeper skin tone | Eva Mendes, Kit Harington              |
| **Winter**  | **Dark Winter**  | Cool-neutral undertones, deep dramatic colors, high contrast, deeper skin tone | Anne Hathaway, Keanu Reeves            |
|             | **True Winter**  | Cool undertones, crisp clear colors, stark high contrast, strong features, medium skin tone | Amal Clooney, Cillian Murphy           |
|             | **Bright Winter**| Cool-neutral undertones, bright vivid colors, high contrast, medium to deeper skin tone | Katy Perry, Will Smith                 |

Generate the response strictly following this JSON schema:
"""
{
  "season": "Season_Name",
  "subseason": "Subseason_Name",
  "recommendedColors": [
    {
      "name": "Descriptive Color Name",
      "hex": "#FFFFFF",
      "reason": "Explain clearly why this color complements or enhances their eyes"
    },
    {
      "name": "Descriptive Color Name",
      "hex": "#FFFFFF",
      "reason": "Explain clearly why this color complements or enhances their hair"
    },
    {
      "name": "Descriptive Color Name",
      "hex": "#FFFFFF",
      "reason": "Explain clearly why this color complements or enhances their skin"
    }
  ],
  "gender": "male or female"
}
"""
**Example:**
"""
{
  "season": "Spring",
  "subseason": "Bright Spring",
  "recommendedColors": [
    {
      "name": "Emerald Green",
      "hex": "#50C878",
      "reason": "Emerald green enhances and brightens the vividness of deep brown eyes."
    },
    {
      "name": "Rich Copper",
      "hex": "#B87333",
      "reason": "Rich copper complements and intensifies the warm highlights of dark hair."
    },
    {
      "name": "Vibrant Coral",
      "hex": "#FF6F61",
      "reason": "Vibrant coral enhances the warm undertones of medium-to-deeper skin, adding a healthy glow."
    }
  ],
  "gender": "female"
}
"""
        `;

        // Call Gemini to analyze the image
        const { object: analysis } = await generateObject({
          model: google("gemini-2.0-flash-001"),
          schema: PaletteAnalysisSchema,
          system,
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
            return {
              paletteId: newPalette.id,
              hex: colorData.hex,
              name: colorData.name,
              // Convert number to string for the database
              percentage: String(colorData.percentage),
              isRecommended: false,
              reason: null,
            };
          },
        );

        // Add the recommended colors (which are outside the palette)
        const recommendedColorEntries = recommendedColors.map((rc) => {
          return {
            paletteId: newPalette.id,
            hex: rc.hex,
            name: rc.name,
            percentage: String(Math.random() * 2.5 + 0.5), // Random percentage between 0.5% and 3%
            isRecommended: true,
            reason: rc.reason,
          };
        });

        // Combine palette colors and recommended colors
        const allColorEntries = [...colorEntries, ...recommendedColorEntries];

        await ctx.db.insert(colors).values(allColorEntries);

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
