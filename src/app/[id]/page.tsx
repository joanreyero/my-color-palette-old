import { type Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { PaletteResults } from "./palette-results";
import { PaletteStories } from "./palette-stories";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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
    };
  } catch (_) {
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
  } catch (error) {
    return notFound();
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Stories View */}
          <div className="mb-16">
            <PaletteStories result={palette} />
          </div>

          {/* Summary View */}
          <div className="mt-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Your Color Summary
            </h2>
            <PaletteResults result={palette} />
          </div>
        </div>
      </div>
    </main>
  );
}
