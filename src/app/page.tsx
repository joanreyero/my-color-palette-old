import { type Metadata } from "next";
import { UploadDropzone } from "./components/upload-dropzone";

export const metadata: Metadata = {
  title: "Discover Your Colors | Personal Color Palette Analysis",
  description:
    "Upload a photo to reveal your seasonal color palette and get personalized style recommendations tailored just for you.",
  openGraph: {
    title: "Discover Your Colors | Personal Color Palette Analysis",
    description:
      "Get your personalized color palette analysis and style recommendations",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Discover Your Colors
          </h1>
          <p className="mt-6 text-lg text-gray-600 sm:text-xl">
            Upload a photo to reveal your seasonal color palette and
            personalized style recommendations
          </p>

          <div className="mt-12">
            <UploadDropzone />
          </div>
        </div>
      </div>
    </main>
  );
}
