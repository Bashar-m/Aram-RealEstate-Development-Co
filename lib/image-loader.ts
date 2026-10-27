"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

// Static export = no image server. Images are pre-resized at development time:
//  • /images/<name>                → `<name>-<width>.webp` for every configured width (npm run images)
//  • /projects/<slug>/media/<name> → tiers 640 / 960 / 1280 / 1920 (npm run project-media)
export default function imageLoader({ src, width }: LoaderArgs) {
  if (src.startsWith("/images/")) {
    return `${src}-${width}.webp`;
  }
  if (src.startsWith("/projects/")) {
    const tier = width <= 640 ? 640 : width <= 960 ? 960 : width <= 1280 ? 1280 : 1920;
    return `${src}-${tier}.webp`;
  }
  return src;
}
