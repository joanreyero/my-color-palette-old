import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { PaletteResults } from "./palette-results";
import { PaletteStories } from "./palette-stories";
import { AnimationStyles } from "../components/animation-styles";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  if (isNaN(id)) return notFound();

  try {
    const palette = await api.palette.getById({ id });

    return {
      title: `${palette.seasonal} Color Palette | Personal Color Analysis`,
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
            alt: "My Color Palette - Personal Color Analysis",
          },
        ],
      },
    };
  } catch {
    return notFound();
  }
}

export default async function PalettePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  if (isNaN(id)) return notFound();

  let palette;
  try {
    palette = await api.palette.getById({ id });
  } catch {
    return notFound();
  }

  // Determine gradient based on seasonal type
  const getSeasonalGradient = () => {
    const season = palette.seasonal.toLowerCase();

    if (season === "spring") {
      return {
        gradient: "from-rose-300 to-amber-200",
        lightGradient: "from-rose-50 via-amber-50 to-white",
        textAccent: "text-rose-500",
        accentColor: "#FF6F61",
      };
    }

    if (season === "summer") {
      return {
        gradient: "from-sky-200 to-indigo-100",
        lightGradient: "from-sky-50 via-purple-50 to-white",
        textAccent: "text-sky-500",
        accentColor: "#87CEEB",
      };
    }

    if (season === "autumn" || season === "fall") {
      return {
        gradient: "from-amber-300 to-orange-200",
        lightGradient: "from-amber-50 via-orange-50 to-white",
        textAccent: "text-amber-500",
        accentColor: "#D2691E",
      };
    }

    if (season === "winter") {
      return {
        gradient: "from-indigo-300 to-purple-200",
        lightGradient: "from-slate-50 via-blue-50 to-white",
        textAccent: "text-indigo-500",
        accentColor: "#0047AB",
      };
    }

    // Default
    return {
      gradient: "from-purple-300 to-pink-200",
      lightGradient: "from-pink-50 to-white",
      textAccent: "text-purple-500",
      accentColor: "#8A2BE2",
    };
  };

  const seasonalData = getSeasonalGradient();

  return (
    <main
      className={`min-h-screen w-full bg-gradient-to-b ${seasonalData.lightGradient}`}
    >
      {/* Add the animation styles component */}
      <AnimationStyles />

      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[900px] w-[900px] rounded-full bg-gradient-to-b from-pink-300/10 to-rose-200/10 blur-3xl"></div>
        <div className="absolute -bottom-80 left-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-t from-blue-300/10 to-purple-200/10 blur-3xl"></div>

        {/* Floating decorative elements */}
        <div
          className="animate-float-slow absolute left-[15%] top-[20%] h-24 w-24 rounded-full opacity-20"
          style={{ backgroundColor: seasonalData.accentColor }}
        ></div>
        <div
          className="animate-float-medium absolute right-[20%] top-[30%] h-16 w-16 rounded-full opacity-10"
          style={{ backgroundColor: seasonalData.accentColor }}
        ></div>
      </div>

      <div className="container relative mx-auto px-4 pt-12 md:pt-20">
        <div className="mx-auto max-w-5xl">
          {/* Page header with decorative elements */}
          <header className="mb-24 text-center md:mb-20">
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

          {/* <PaletteStories result={palette} /> */}

          {/* Summary View - Decorative divider */}
          <div className="relative mb-24 mt-10 flex items-center justify-center">
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
