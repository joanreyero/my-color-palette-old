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

        // Create the prompt for Gemini
        const prompt = `
        You are a professional color analyst and personal stylist.
        Your task will be to analyze the person in this image and determine their seasonal color palette.

        ## Things you know
        Here are some things that you know:

        ### Seasonal Palettes
        There are 4 seasonal palettes, each with 3 variations, making the total of 12 palettes:
        - Spring: Light Spring, True Spring, Bright Spring
           - Summer: Light Summer, True Summer, Soft Summer
           - Autumn: Soft Autumn, True Autumn, Dark Autumn
           - Winter: Dark Winter, True Winter, Bright Winter

        ### Guidelines for determining the sub-season
        Below is a concise algorithmic procedure for a simpler LLM to classify a person’s photo into one of the 12 sub-seasons. It is designed to be straightforward and step-by-step:

        1. **Identify Undertone**  
          1. Check skin: Is it clearly warm (yellow, peach, golden) or clearly cool (pink, rose, blue)? If it’s ambiguous, label it “neutral.”  
          2. Check hair: Warm hair appears golden, coppery, or has reddish highlights; cool hair appears ashy, taupe, or bluish-black.  
          3. Check eyes: Warm eyes have golden, greenish, or warm brown tones; cool eyes have gray, blue, or cool brown tones.  
          4. Combine these observations to categorize the overall undertone as **Warm**, **Cool**, or **Neutral** (if conflicting signals).

        2. **Identify Depth**  
          1. Hair color range: Determine if the person’s hair is light (blonde to light brown), medium, or dark (dark brown, black).  
          2. Eye color lightness: Light (pale blue, green, hazel), medium (average brown), or deep (dark brown, black).  
          3. Skin shade: Light (fair/ivory), medium (tan, olive), or deep (dark).  
          4. Decide if the overall impression is **Light**, **Medium**, or **Dark**.

        3. **Identify Clarity**  
          1. Look for contrast among hair, skin, and eyes:  
              - **High contrast** often indicates brightness.  
              - **Low to moderate contrast** suggests softness.  
          2. Look at color saturation in eyes or hair:  
              - Very vivid, intense color (like bright green, jewel blue) can indicate **Bright**.  
              - More subdued, blended color (like grayish blues or dusty browns) suggests **Soft**.  

        4. **Apply Sub-Season Rules**  
          - **Spring Family (Warm)**  
            - **Bright Spring:** Warm + Light/Medium + Bright  
            - **True Spring:** Warm + Medium + Moderate Clarity (fully warm undertone)  
            - **Light Spring:** Warm + Light + Soft Clarity  
          - **Summer Family (Cool)**  
            - **Light Summer:** Cool + Light + Soft/Bright (but typically softer than Bright Spring)  
            - **True Summer:** Cool + Medium + Soft  
            - **Soft Summer:** Cool/Neutral + Medium + Very Soft  
          - **Autumn Family (Warm/Neutral)**  
            - **Soft Autumn:** Warm/Neutral + Light/Medium + Very Soft  
            - **True Autumn:** Warm + Medium + Saturated Warmth  
            - **Dark Autumn:** Warm/Neutral + Dark + Moderate to High Intensity  
          - **Winter Family (Cool/Neutral)**  
            - **Dark Winter:** Cool/Neutral + Dark + High Contrast  
            - **True Winter:** Cool + Medium/Dark + Fully Cool & High Contrast  
            - **Bright Winter:** Cool + Medium/Dark + Very High Brightness & Contrast  

5. **Check Edge Cases**  
   - If the person’s undertone is truly balanced between warm and cool, classify them under **Soft Summer** (muted cool) or **Soft Autumn** (muted warm) depending on slight leaning.  
   - If the person’s depth is not obviously light or dark (medium range), look for clarity cues to pick the correct middle sub-season (True or Soft variants).  

6. **Validation**  
   - Use sample color swatches (digitally or theoretically) to see which set of hues enlivens the complexion vs. dulls it.  
   - Confirm final sub-season by matching overall vibe:  
     - **Spring:** Fresh, warm, and alive.  
     - **Summer:** Cool, soft, and gentle.  
     - **Autumn:** Warm, earthy, and subdued.  
     - **Winter:** Cool, strong, and contrasting.  

7. **Output**  
   - Return the identified sub-season label (e.g., “Dark Winter”) and optionally a summary of the classification logic (e.g., “You appear to have a dark, neutral-cool look with high contrast, so Dark Winter.”).

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
        2. Determine their specific sub-season using the guidelines above.

        It is crucial that we classify the season and sub-season correctly. Pay close attention to the person in the image.

        Then, based on their specific features (like hair color, eye color, skin tone, etc.) and sub-season:
        3. Recommend 3 specific colors outside of their palette that would look best on them. For each color, provide:
           - The color name
           - The exact hex code (in #RRGGBB format)
           - A brief reason in first person in a poetic tone why this color would look good on them, linking it to their specific feature of why you chose it.

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
