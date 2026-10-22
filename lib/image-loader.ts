"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

// Photos live in /public/images as `<name>-<width>.webp` (see scripts/optimize-images.mjs).
// Pass `src="/images/<name>"` to next/image and this picks the right variant.
export default function imageLoader({ src, width }: LoaderArgs) {
  if (src.startsWith("/images/")) {
    return `${src}-${width}.webp`;
  }
  return src;
}
