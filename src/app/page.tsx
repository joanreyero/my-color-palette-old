import { type Metadata } from "next";
import { UploadDropzone } from "./components/upload-dropzone";
import Animations from "./components/animations";
import ScrollButton from "./components/scroll-button";

export const metadata: Metadata = {
  title: "My Color Palette | Discover Your Perfect Colors with AI Analysis",
  description:
    "Upload your photo for personalized color analysis based on seasonal color theory. Get customized color recommendations that complement your natural features.",
  keywords:
    "color analysis, seasonal color palette, personal style, color recommendations, AI color analysis, fashion, style guide",
  openGraph: {
    title: "My Color Palette | Discover Your Perfect Colors with AI Analysis",
    description:
      "Get personalized color recommendations based on your unique features with our AI-powered analysis",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Color Palette - AI Color Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Color Palette | Discover Your Perfect Colors",
    description: "Use AI to find your perfect seasonal color palette",
    images: ["/og-image.jpg"],
  },
};

export default function Home() {
  // Seasonal color showcase with enhanced fashion-forward descriptions
  const seasonalPalettes = [
    {
      season: "Spring",
      colors: ["#FF6F61", "#FFD300", "#00CED1", "#FFB347", "#F5F5DC"],
      gradient: "from-rose-300 to-amber-200",
      description: "Fresh, vivid, and effervescent",
      fashionStyle: "Playful patterns and vibrant accessories",
    },
    {
      season: "Summer",
      colors: ["#B0E0E6", "#CCCCFF", "#C8A2C8", "#FFD1DC", "#B0D3B7"],
      gradient: "from-sky-200 to-indigo-100",
      description: "Ethereal, serene, and sophisticated",
      fashionStyle: "Delicate fabrics with subtle detailing",
    },
    {
      season: "Autumn",
      colors: ["#CD5C5C", "#DAA520", "#9ACD32", "#8B4513", "#A0522D"],
      gradient: "from-amber-300 to-orange-200",
      description: "Rich, textured, and naturally elegant",
      fashionStyle: "Luxurious textures and layered ensembles",
    },
    {
      season: "Winter",
      colors: ["#00008B", "#8A2BE2", "#FF0000", "#2F4F4F", "#FFFFFF"],
      gradient: "from-indigo-300 to-purple-200",
      description: "Bold, dramatic, and refined",
      fashionStyle: "High contrast with statement pieces",
    },
  ];

  return (
    <main className="bg-[#FFFAF5] text-gray-900">
      {/* Include the animations component */}
      <Animations />

      {/* Hero section with fashion-forward design */}
      <section className="relative min-h-screen overflow-hidden pb-32 pt-20">
        {/* Abstract color splash elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-[800px] w-[800px] rounded-full bg-gradient-to-b from-pink-300/30 to-rose-200/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-20 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-blue-300/20 to-purple-200/10 blur-3xl"></div>
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-200/20 to-yellow-100/10 blur-3xl"></div>

          {/* Floating color circles - mimicking color swatches */}
          <div className="animate-float-slow absolute left-[10%] top-[15%] h-16 w-16 rounded-full bg-rose-400/70"></div>
          <div className="animate-float-medium absolute right-[15%] top-[25%] h-12 w-12 rounded-full bg-blue-400/70"></div>
          <div className="animate-float-fast absolute bottom-[30%] left-[20%] h-20 w-20 rounded-full bg-amber-400/70"></div>
          <div className="animate-float-slow absolute bottom-[20%] right-[25%] h-14 w-14 rounded-full bg-purple-400/70"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-block rounded-full bg-white/80 px-6 py-2 backdrop-blur-sm">
              <p className="font-medium text-gray-800">
                <span className="text-rose-500">✨</span> AI-Powered Color
                Analysis <span className="text-blue-500">✨</span>
              </p>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 bg-clip-text pb-2 font-serif text-6xl font-bold tracking-tight text-transparent sm:text-7xl md:text-8xl">
              Discover Your <br />
              <span className="italic">Perfect Palette</span>
            </h1>

            <div className="mb-12 flex justify-center">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-rose-400 to-purple-500"></div>
            </div>

            <p className="mx-auto mb-12 max-w-2xl text-xl font-light leading-relaxed text-gray-700 md:text-2xl">
              Elevate your personal style with colors scientifically chosen to
              <span className="mx-1 font-medium italic text-rose-500">
                complement
              </span>{" "}
              your unique features and
              <span className="mx-1 font-medium italic text-purple-500">
                enhance
              </span>{" "}
              your natural beauty.
            </p>

            {/* Interactive palette preview */}
            <div className="mb-12 flex flex-wrap justify-center gap-4">
              {seasonalPalettes.map((palette, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="relative flex h-20 w-[165px] items-center justify-center rounded-2xl bg-white p-4 shadow-md">
                    <div className="space-y-1">
                      <p className="font-serif text-sm font-medium">
                        {palette.season}
                      </p>
                      <div className="flex gap-1">
                        {palette.colors.slice(0, 5).map((color, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full ring-1 ring-white/30"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating upload card */}
            <div className="relative mx-auto max-w-2xl">
              {/* Decorative elements */}
              <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full border-4 border-dashed border-purple-200/60"></div>
              <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full border-4 border-dashed border-rose-200/60"></div>

              <div
                id="upload-section"
                className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]"
              >
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-100 to-blue-50"></div>
                <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-tr from-amber-100 to-rose-50"></div>

                <div className="relative">
                  <h2 className="mb-6 font-serif text-3xl font-bold text-gray-900">
                    Reveal Your Colors
                  </h2>

                  <UploadDropzone />

                  <p className="mt-6 text-center text-sm text-gray-500">
                    Your photo will be analyzed securely using advanced AI to
                    determine your seasonal color type
                  </p>

                  <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure analysis with privacy protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color story section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          {/* Diagonal color band */}
          <div className="absolute h-full w-full -skew-y-6 transform bg-gradient-to-r from-rose-50 via-violet-50 to-sky-50"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
              Your Color Story
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Colors are more than aesthetics—they&apos;re your personal
              expression. Discover how the right palette can transform your
              style.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {seasonalPalettes.map((palette, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
              >
                {/* Color swatch header */}
                <div
                  className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${palette.gradient}`}
                ></div>

                <div className="relative mt-12 text-center">
                  <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
                    <div
                      className="h-16 w-16 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${palette.colors[0]} 0%, ${palette.colors[1]} 50%, ${palette.colors[2]} 100%)`,
                      }}
                    ></div>
                  </div>

                  <h3 className="mb-2 font-serif text-2xl font-bold">
                    {palette.season}
                  </h3>
                  <p className="mb-4 text-gray-600">{palette.description}</p>

                  <div className="mb-6 h-px w-full bg-gray-100"></div>

                  <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                    Style Notes
                  </p>
                  <p className="mt-2 text-gray-700">{palette.fashionStyle}</p>

                  <div className="mt-8 flex justify-center space-x-2">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full shadow-sm ring-2 ring-white transition-transform duration-200 hover:scale-110"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
              The Experience
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Your journey to color discovery is effortless and enlightening
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Connected timeline */}
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-rose-300 via-purple-300 to-blue-300 md:block"></div>

            <div className="space-y-24">
              {/* Step 1 */}
              <div className="relative md:flex md:items-center">
                <div className="mb-10 md:mb-0 md:w-1/2 md:pr-12 md:text-right">
                  <h3 className="mb-4 font-serif text-2xl font-bold text-gray-900">
                    Capture Your Essence
                  </h3>
                  <p className="text-gray-600">
                    Upload a high-quality photo in natural lighting that
                    showcases your unique features—the foundation for your
                    personal color analysis
                  </p>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-md">
                    <span className="font-serif text-xl font-bold">1</span>
                  </div>
                </div>

                <div className="md:w-1/2 md:pl-12">
                  <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-200/50 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-lg bg-white/80 px-6 py-3 backdrop-blur-sm">
                        <p className="font-medium text-gray-800">
                          Photo Upload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative md:flex md:items-center">
                <div className="order-last mb-10 md:mb-0 md:w-1/2 md:pl-12">
                  <h3 className="mb-4 font-serif text-2xl font-bold text-gray-900">
                    AI Color Analysis
                  </h3>
                  <p className="text-gray-600">
                    Our advanced AI examines your skin tone, hair color, and eye
                    color to determine your ideal seasonal palette with
                    scientific precision
                  </p>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-md">
                    <span className="font-serif text-xl font-bold">2</span>
                  </div>
                </div>

                <div className="order-first md:w-1/2 md:pr-12 md:text-right">
                  <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-bl from-purple-200/50 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-lg bg-white/80 px-6 py-3 backdrop-blur-sm">
                        <p className="font-medium text-gray-800">
                          AI Processing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative md:flex md:items-center">
                <div className="mb-10 md:mb-0 md:w-1/2 md:pr-12 md:text-right">
                  <h3 className="mb-4 font-serif text-2xl font-bold text-gray-900">
                    Personalized Results
                  </h3>
                  <p className="text-gray-600">
                    Receive a comprehensive analysis with your seasonal color
                    type, custom color recommendations, and celebrity style
                    matches
                  </p>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-md">
                    <span className="font-serif text-xl font-bold">3</span>
                  </div>
                </div>

                <div className="md:w-1/2 md:pl-12">
                  <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-lg bg-white/80 px-6 py-3 backdrop-blur-sm">
                        <p className="font-medium text-gray-800">
                          Your Color Story
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
                <h3 className="mb-3 font-medium text-gray-900">
                  What is seasonal color analysis?
                </h3>
                <p className="text-gray-600">
                  Seasonal color analysis determines which colors harmonize with
                  your natural features based on your skin undertone, hair, and
                  eye color. It categorizes individuals into four seasonal
                  types: Spring, Summer, Autumn, and Winter.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
                <h3 className="mb-3 font-medium text-gray-900">
                  How accurate is the AI analysis?
                </h3>
                <p className="text-gray-600">
                  Our AI has been trained on thousands of color analyses to
                  provide highly accurate results. It uses advanced image
                  processing to detect subtle color variations in your features
                  that determine your seasonal palette.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 p-6 shadow-sm">
                <h3 className="mb-3 font-medium text-gray-900">
                  How do I get the best results from my photo?
                </h3>
                <p className="text-gray-600">
                  For optimal results, upload a well-lit photo taken in natural
                  daylight with no filters. Your face should be clearly visible
                  with minimal makeup, and ideally showing your natural hair
                  color.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-indigo-50"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-serif text-5xl font-bold text-gray-900">
              Ready to Transform Your Style?
            </h2>
            <p className="mb-10 text-xl text-gray-700">
              Unlock the power of color and discover the palette that makes you
              shine
            </p>

            <div className="inline-block overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 p-[3px] shadow-lg">
              <ScrollButton
                targetId="upload-section"
                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-gray-800 transition-all duration-200 hover:bg-transparent hover:text-white"
              >
                <span>Find Your Colors</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </ScrollButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="font-serif text-xl font-bold text-gray-900">
                My Color Palette
              </p>
              <p className="text-sm text-gray-500">
                Discover your perfect colors
              </p>
            </div>

            <div className="flex items-center gap-6 text-gray-400">
              <svg
                className="h-5 w-5 hover:text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              <svg
                className="h-5 w-5 hover:text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <svg
                className="h-5 w-5 hover:text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </div>

            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} My Color Palette. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
