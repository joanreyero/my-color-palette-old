import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import GoogleAnalytics from "~/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "What Is My Color Palette? - Discover Your Perfect Colors",
  description: "Find out what your color palette is with our easy tool! Explore personalized color matches for fashion, design, and more. Discover your style today!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head />
      <body>
        <TRPCReactProvider>
          <GoogleAnalytics />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
