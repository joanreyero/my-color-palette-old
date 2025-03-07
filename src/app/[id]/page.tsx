import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { PaletteResults } from "./palette-results";
import { PaletteStories } from "./palette-stories";
import { AnimationStyles } from "../components/animation-styles";
import { SocialShareButtons } from "../components/SocialShareButtons";
import { getSeasonalConfig } from "../config/colors";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: idString } = await params;
  const id = parseInt(idString);
  if (isNaN(id)) return notFound();

  try {
    const palette = await api.palette.getById({ id });

    return {
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL ??
          "https://my-color-palette.vercel.app",
      ),
      title: `${palette.seasonal} Color Palette - Discover Your Perfect Colors`,
      description:
        "View your personalized color palette and style recommendations",
      openGraph: {
        title: `Your ${palette.subSeasonal ?? palette.seasonal} Color Palette Analysis`,
        description:
          "Discover your perfect colors with personalized recommendations",
        images: [
          {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "What Is My Color Palette? - Discover Your Perfect Colors",
          },
        ],
      },
    };
  } catch {
    return notFound();
  }
}

export default async function PalettePage({ params, searchParams }: PageProps) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  if (isNaN(id)) return notFound();

  let palette;
  try {
    palette = await api.palette.getById({ id });
  } catch {
    return notFound();
  }

  // Get the seasonal configuration from our shared config
  const seasonalData = getSeasonalConfig(palette.seasonal);

  return (
    <main
      className={`min-h-screen w-screen overflow-x-hidden bg-gradient-to-b ${seasonalData.lightGradient}`}
    >
      {/* Add the animation styles component */}
      <AnimationStyles />

      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Main gradient backgrounds */}
        <div className="absolute -right-40 -top-40 h-[900px] w-[900px] rounded-full bg-gradient-to-b from-pink-300/15 to-rose-200/10 blur-3xl"></div>
        <div className="absolute -bottom-80 left-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-t from-blue-300/15 to-purple-200/10 blur-3xl"></div>
        <div className="absolute left-[-20%] top-[30%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-amber-200/10 to-yellow-100/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-teal-200/10 to-blue-100/5 blur-3xl"></div>

        {/* Animated floating circles */}
        <div
          className="animate-float-slow absolute left-[15%] top-[20%] h-24 w-24 rounded-full opacity-20"
          style={{ backgroundColor: seasonalData.accentColor }}
        ></div>
        <div
          className="animate-float-medium absolute right-[20%] top-[30%] h-16 w-16 rounded-full opacity-10"
          style={{ backgroundColor: seasonalData.accentColor }}
        ></div>

        {/* Scattered dots pattern - reduced */}
        <div className="absolute left-[5%] top-[10%] h-3 w-3 rounded-full bg-gray-300/30"></div>
        <div className="absolute bottom-[15%] right-[5%] h-3 w-3 rounded-full bg-gray-300/30"></div>

        {/* Corner decorative elements - simplified */}
        <div className="absolute -right-6 top-40 h-24 w-24 rounded-full border-4 border-dashed border-gray-300/30 opacity-40"></div>
        <div className="absolute -left-6 bottom-40 h-20 w-20 rounded-full border-4 border-dashed border-gray-300/30 opacity-40"></div>
        <div className="animate-ping-slow absolute left-[80%] top-[70%] h-3 w-3 rounded-full bg-purple-300/40"></div>

        {/* Seasonal specific element based on the color theme */}
        <div
          className="absolute right-[15%] top-[15%] h-32 w-32 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${seasonalData.accentColor}40 0%, transparent 70%)`,
          }}
        ></div>
      </div>

      <div className="container relative mx-auto px-4 pt-12 md:pt-20">
        <div className="mx-auto max-w-5xl">
          {/* Page header with decorative elements */}
          <header className="mb-8 text-center md:mb-8">
            <div className="relative mx-auto mb-8 inline-block">
              <div className="animate-spin-slow absolute -left-6 -top-6 h-16 w-16 rounded-full border-2 border-dashed border-gray-300/60"></div>
              <div className="animate-spin-slow-reverse absolute -bottom-6 -right-6 h-12 w-12 rounded-full border-2 border-dashed border-gray-300/60"></div>

              <div className="mb-6 inline-block rounded-full bg-white/80 px-6 py-2 backdrop-blur-sm">
                <p className="font-medium text-gray-800">
                  <span className={`${seasonalData.textAccent} mr-1`}>✨</span>
                  Personal Color Analysis
                  <span className={`${seasonalData.textAccent} ml-1`}>✨</span>
                </p>
              </div>

              <h1 className="relative bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text font-serif text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
                Your Color Story
              </h1>

              <div className="mx-auto my-8 flex justify-center">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-gray-300 to-gray-200"></div>
              </div>
            </div>

            <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-gray-700">
              Discover the perfect palette that
              <span
                className={`mx-1 font-medium italic ${seasonalData.textAccent}`}
              >
                enhances
              </span>
              your natural beauty and
              <span
                className={`mx-1 font-medium italic ${seasonalData.textAccent}`}
              >
                elevates
              </span>
              your personal style.
            </p>
          </header>

          <PaletteStories result={palette} />

          {/* Social Share Buttons */}
          <div className="my-10">
            <SocialShareButtons
              url={`${process.env.NEXT_PUBLIC_APP_URL ?? "https://my-color-palette.vercel.app"}/${id}`}
              title={`My ${palette.subSeasonal ?? palette.seasonal} Color Palette`}
              seasonalType={palette.subSeasonal ?? palette.seasonal}
              accentColor={seasonalData.accentColor}
            />
          </div>

          {/* Summary View - Decorative divider */}
          <div className="relative mb-16 flex items-center justify-center">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
              <div className="h-6 w-6 rotate-45 bg-gradient-to-tr from-gray-100 to-gray-300"></div>
            </div>
          </div>

          {/* Summary View */}
          <section className="mb-24 mt-24">
            <PaletteResults result={palette} />
          </section>
        </div>
      </div>
    </main>
  );
}
