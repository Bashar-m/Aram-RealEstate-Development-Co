// Generates responsive WebP variants for every photo in assets/photos.
// The site is exported as static HTML (no image server), so next/image uses
// lib/image-loader.ts to pick from these pre-built files.
//
// Usage: npm run images
// Output: public/images/<name>-<width>.webp
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Keep in sync with images.deviceSizes + images.imageSizes in next.config.ts
const WIDTHS = [320, 480, 640, 960, 1280, 1920];

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "assets/photos");
const outDir = path.join(root, "public/images");

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const name = path.parse(file).name;
  const input = path.join(srcDir, file);
  for (const width of WIDTHS) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width >= 1280 ? 70 : 74 })
      .toFile(path.join(outDir, `${name}-${width}.webp`));
  }
  console.log(`✓ ${name}`);
}

// Open Graph card: the primary logo on the brand ivory background
const logo = await sharp(path.join(root, "public/brand/aram_primary_logo_transparent.png"))
  .trim({ threshold: 10 })
  .resize({ height: 440 })
  .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#F7F7F5" } })
  .composite([{ input: logo, gravity: "center" }])
  .png()
  .toFile(path.join(root, "public/brand/web/aram-og.png"));
console.log("✓ og image");
