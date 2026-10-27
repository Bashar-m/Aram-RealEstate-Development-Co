import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to `out/`
  output: "export",
  // Emits /ar/about/index.html so any static host can serve clean URLs
  trailingSlash: true,
  images: {
    // No image server in a static export; photos are pre-resized by
    // `npm run images` and resolved by this loader.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [640, 768, 960, 1280, 1920],
    imageSizes: [320, 480],
  },
  experimental: {
    // One bilingual 404 page, since each locale has its own root layout
    globalNotFound: true,
  },
  // Note: cacheComponents / partialPrefetching were removed — Next.js does not
  // allow them with `output: "export"` (they rely on a server at runtime).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
