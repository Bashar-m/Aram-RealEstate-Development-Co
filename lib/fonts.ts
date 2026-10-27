import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  // Only the weights the design uses (light/bold appear on Latin numerals, set in Inter)
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Latin glyphs only: fetched when needed instead of competing with the hero image
  preload: false,
});

export const fontVariables = `${plexArabic.variable} ${inter.variable}`;
