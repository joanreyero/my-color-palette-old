import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { paletteEmail } from "~/server/db/schema";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "~/env";

// Initialize Resend with API key
const resendApiKey = env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    // Use explicit typing for the request body
    const body = (await request.json()) as Record<string, unknown>;

    // Define validation schema
    const emailRequestSchema = z.object({
      email: z.string().email(),
      paletteId: z.string().min(1),
      seasonalType: z.string().min(1),
    });

    // Validate input
    const { email, paletteId, seasonalType } = emailRequestSchema.parse(body);

    // Save email to database
    await db.insert(paletteEmail).values({
      email,
      paletteId: parseInt(paletteId),
    });

    // Get palette details for email
    const paletteDetails = await db.query.palette.findFirst({
      where: (paletteTable, { eq }) => eq(paletteTable.id, parseInt(paletteId)),
      with: {
        colors: true,
      },
    });

    if (!paletteDetails) {
      return NextResponse.json({ error: "Palette not found" }, { status: 404 });
    }

    // Check if resend is initialized
    if (!resend) {
      console.error("Resend API key not configured");
      return NextResponse.json(
        { error: "Email service not available" },
        { status: 500 },
      );
    }

    // Get the seasonal type from the palette data
    const seasonalName = paletteDetails.subSeason || paletteDetails.season;

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: "My Color Palette <noreply@marketing.oscape.io>",
      to: email,
      subject: `Your ${seasonalName} Color Palette`,
      html: getEmailTemplate(
        paletteDetails,
        seasonalType || seasonalName,
        `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/${paletteId}`,
      ),
    });

    if (emailResult.error) {
      console.error("Error sending email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Safe error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing email request:", errorMessage);

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

interface Color {
  hex: string;
}

interface PaletteWithColors {
  season: string;
  subSeason?: string;
  colors?: Color[];
}

function getEmailTemplate(
  palette: PaletteWithColors,
  seasonalType: string,
  paletteUrl: string,
) {
  // Extract colors to display in email
  const colorSwatches = palette.colors
    ? palette.colors
        .slice(0, 6)
        .map(
          (color) => `
            <div style="height: 40px; width: 40px; border-radius: 8px; background-color: ${color.hex}; margin: 0 4px; display: inline-block;"></div>
          `,
        )
        .join("")
    : "";

  return `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 16px; text-align: center;">Your ${seasonalType} Color Palette</h1>
      
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Thanks for discovering your seasonal color palette! Here's your personalized color guide to help enhance your style.
      </p>
      
      <div style="background-color: #f7fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
        <h2 style="color: #4a5568; font-size: 18px; margin-bottom: 16px;">Your Colors</h2>
        <div style="display: block; text-align: center; margin-bottom: 16px;">
          ${colorSwatches}
        </div>
        <p style="font-size: 14px; color: #718096;">These colors are specially selected to complement your ${seasonalType} type.</p>
      </div>
      
      <div style="text-align: center; margin-top: 32px;">
        <a href="${paletteUrl}" style="background-color: #4a5568; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          View Your Full Palette
        </a>
      </div>
      
      <p style="font-size: 14px; color: #718096; margin-top: 32px; text-align: center;">
        This email was sent because you requested your color palette from My Color Palette.
      </p>
    </div>
  `;
}
