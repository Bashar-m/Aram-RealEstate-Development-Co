/**
 * Site photography. Each `src` points to a set of pre-resized WebP files
 * generated from assets/photos by `npm run images`.
 *
 * These are illustrative stock photos (Unsplash License) — they are NOT ARAM projects.
 * To swap a photo: replace the file in assets/photos (same name), run `npm run images`.
 * Alt text lives in messages/<locale>.ts under `images`.
 */
export const images = {
  hero: "/images/hero-residence",
  facade: "/images/facade-white",
  villaTerrace: "/images/villa-terrace",
  villaWhite: "/images/villa-white",
  blueprint: "/images/blueprint",
  interior: "/images/interior-living",
  geometric: "/images/geometric",
  towers: "/images/towers",
  timberHouse: "/images/timber-house",
} as const;

export type ImageKey = keyof typeof images;

export const brand = {
  logoPrimary: { src: "/brand/web/aram-logo-primary.webp", width: 420, height: 331 },
  icon: { src: "/brand/web/aram-icon.webp", width: 132, height: 152 },
  wordmark: { src: "/brand/web/aram-wordmark.webp", width: 330, height: 122 },
  og: "/brand/web/aram-og.png",
} as const;
