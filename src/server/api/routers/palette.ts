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
      const colours: Record<string, { reason: string; name: string }> = {};
      for (const color of paletteData.colors) {
        if (color.isRecommended) {
          colours[color.hex] = {
            name: color.name,
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
        Your task will be to analyze the person in this image and determine their seasonal color palette.

        ## Things you know
        Here are some things that you know:

        ### Seasonal Palettes
        There are 4 seasonal palettes, each with 3 variations, making the total of 12 palettes:
        - **Bright Spring:** Warm undertones with vivid clarity and medium-to-light depth; pops best in bold, high-contrast spring colors.  
        - **True Spring:** Pure warm undertones with medium depth and moderate clarity; glows in sunny, golden, and fresh spring hues.  
        - **Light Spring:** Warm undertones but very light and soft overall; delicate features thrive in gentle, airy pastels.  
        - **Light Summer:** Cool or neutral-cool with a light, breezy appearance; pastel blues and lavenders complement subtle contrasts.  
        - **True Summer:** Fully cool undertones, gently muted, and medium-to-light in depth; looks best in soft, cool, calm hues.  
        - **Soft Summer:** Neutral-cool, very muted, and medium depth; thrives in dusty, hazy colors that won’t overwhelm.  
        - **Soft Autumn:** Warm-neutral, muted, with medium-to-light depth; enriched by understated earthy tones.  
        - **True Autumn:** Completely warm, medium depth, and vibrant earthy glow; saturated fall colors intensify its warmth.  
        - **Dark Autumn:** Warm-neutral, deeper depth, and somewhat intense; spicy, bold shades align well with its darkness.  
        - **Dark Winter:** Cool-neutral, deep, and dramatic; thrives on strong contrasts and rich cool tones.  
        - **True Winter:** Fully cool, high-contrast (medium or deep); radiant in icy brights and sharp jewel tones.  
        - **Bright Winter:** Cool undertones with exceptionally high clarity; only the boldest, most saturated colors match its vibrant contrast.


        #### Steps to identify the correct sub-season

          1. **Determine Undertone (Warm, Cool, or Neutral)**  
            - Look at skin undertones (golden or peach = warm; pink or bluish = cool; a mix = neutral).  
            - Check hair and eye color: warm tones often appear golden, copper, or chocolate brown; cool tones often appear ash, taupe, or black with blue undertones.  
            - If the overall coloring isn’t purely warm or cool, classify it as neutral.

          2. **Determine Depth (Light to Dark)**  
            - Examine hair color range (blonde to black) and eye darkness (pale to very dark).  
            - Decide if the overall appearance is best described as **light**, **medium**, or **dark**.

          3. **Determine Clarity (Bright/High-Contrast vs. Soft/Muted)**  
            - Assess if the features (hair, eyes, skin) look **crisp and high-contrast** (bright) or **blended and gentle** (soft).  
            - A bright person’s eyes often stand out vividly; a soft person’s features are more subdued and do not compete with each other.

          4. **Combine These Factors to Find the Closest Sub-Season**  
            - If **warm + light + delicate** = Light Spring  
            - If **warm + bright** = Bright Spring (if also light) or True Spring (if medium)  
            - If **warm + muted** = Soft Autumn (if lighter range) or True Autumn (fully warm, medium depth) or Dark Autumn (if deeper)  
            - If **cool + light** = Light Summer  
            - If **cool + muted** = Soft Summer (if lighter) or True Summer (fully cool, medium depth)  
            - If **cool + bright** = Bright Winter (if extremely high contrast) or True Winter (if fully cool, medium-high contrast) or Dark Winter (if deeper)  
        
        #### Key Reminders for the LLM
          - **Check for extremes first** (e.g., obviously warm vs. obviously cool, very light vs. very dark, extremely vivid vs. quite muted).  
          - If you’re uncertain, place the subject in a **neutral** or “soft” category rather than an extreme (pure warm/cool or very bright).  
          - **Prioritize undertone** to filter out half the categories (warm-side sub-seasons vs. cool-side sub-seasons).  
          - Then **assess depth** (light/medium/dark) and **clarity** (bright vs. soft) to zero in on the final sub-season.

        ### Which colours fit which sub-season?
        Each palette has a different set of colours that fit each sub-season:

        Spring:
        - Bright Spring: Vibrant, bold colors like coral, bright yellow, turquoise, scarlet red, lime green
        - True Spring: Warm, lively colors like mango, papaya orange, watermelon, peach, fresh green
        - Light Spring: Delicate, airy colors like light gold, beige, peach, melon, primrose yellow
        
        Summer:
        - Light Summer: Cool, gentle colors like cool gray, light beige, powder blue, periwinkle, lilac
        - True Summer: Soft, calm colors like dusty rose, taupe, gainsboro gray, slate gray, bellflower purple
        - Soft Summer: Muted, dreamy colors like cocoa brown, sage green, heather purple, charcoal gray, muted gray
        
        Autumn:
        - Soft Autumn: Gentle, warm colors like warm taupe, tan beige, chestnut brown, dusty bronze, rosy brown
        - True Autumn: Earthy, rich colors like olive green, mustard yellow, rust, brown, corn gold
        - Dark Autumn: Deep, spicy colors like turmeric, military green, golden olive, eggplant, cognac
        
        Winter:
        - Dark Winter: Bold, mysterious colors like dark slate gray, granite gray, prussian blue, deep purple, black
        - True Winter: Cool, clear colors like icy pink, icy blue, deep rose, dark blue, emerald
        - Bright Winter: Bright, vivid colors like black, white, silver, emerald green, ruby
        
        ## Your task
        Based on their features photo:
        1. Determine which of the four seasons they belong to: Spring, Summer, Autumn, or Winter.
        2. Determine their specific sub-season from the following options:
           - Spring: Light Spring, True Spring, Bright Spring
           - Summer: Light Summer, True Summer, Soft Summer
           - Autumn: Soft Autumn, True Autumn, Dark Autumn
           - Winter: Dark Winter, True Winter, Bright Winter

        It is crucial that we classify the season and sub-season correctly. Pay close attention to the person in the image.

        Then, based on their specific features (like hair color, eye color, skin tone, etc.) and sub-season:
        3. Recommend 3 specific colors outside of their palette that would look best on them. For each color, provide:
           - The color name
           - The exact hex code (in #RRGGBB format)
           - A brief reason in first person in a poetic tone why this color would look good on them

        Finally,
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
            percentage: null, // No percentage for recommended colors outside the palette
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
