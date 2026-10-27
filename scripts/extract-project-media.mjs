// Extracts web-ready media from a project's brochure PDF — run once per project, at development time.
// Never runs in the browser or on request.
//
// Usage:   npm run project-media -- marota-city
// Needs:   Poppler (`brew install poppler`) for pdfimages / pdftoppm, and sharp (bundled with Next.js).
// Output:  public/projects/<slug>/media/<name>-<640|960|1280|1920>.webp
//          data/projects/<slug>/media.json   (dimensions, used to prevent layout shift)
//
// Images are taken from the original embedded files at their native resolution and are
// only ever scaled DOWN (never upscaled).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

// Keep in sync with lib/image-loader.ts
const WIDTHS = [640, 960, 1280, 1920];
const QUALITY = { photo: 74, plan: 86, cutout: 82 };

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run project-media -- <project-slug>");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const { default: config } = await import(`./projects/${slug}.media.mjs`);
const pdf = path.join(root, config.pdf);
const outDir = path.join(root, "public/projects", slug, "media");
const manifestPath = path.join(root, "data/projects", slug, "media.json");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `${slug}-`));

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

// 1. Pull every embedded image out of the PDF once, in its original encoding
execFileSync("pdfimages", ["-all", "-p", pdf, path.join(tmp, "img")]);
const extracted = fs.readdirSync(tmp);
const findImage = (page, num) => {
  const prefix = `img-${String(page).padStart(3, "0")}-${String(num).padStart(3, "0")}.`;
  const file = extracted.find((f) => f.startsWith(prefix));
  if (!file) throw new Error(`Image page ${page} #${num} not found in PDF`);
  return path.join(tmp, file);
};

const manifest = {};

for (const item of config.media) {
  let input;

  if (item.render) {
    // Rasterise a page and crop a region (fractions of the page: x, y, w, h)
    const base = path.join(tmp, `render-${item.page}`);
    execFileSync("pdftoppm", ["-f", String(item.page), "-l", String(item.page), "-r", String(item.render.dpi), "-png", "-singlefile", pdf, base]);
    const img = sharp(`${base}.png`);
    const { width, height } = await img.metadata();
    const [x, y, w, h] = item.render.crop;
    input = await img
      .extract({ left: Math.round(x * width), top: Math.round(y * height), width: Math.round(w * width), height: Math.round(h * height) })
      .toBuffer();
  } else if (item.mask !== undefined) {
    // Re-apply the PDF soft mask so 3D drawings become transparent cut-outs
    // (sharp applies removeAlpha() last, so the source must not use it here)
    input = await sharp(findImage(item.page, item.num)).joinChannel(findImage(item.page, item.mask)).png().toBuffer();
    // Trim the empty transparent border
    input = await sharp(input).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 }).toBuffer();
  } else {
    input = await sharp(findImage(item.page, item.num)).toBuffer();
  }

  const { width, height } = await sharp(input).metadata();
  for (const w of WIDTHS) {
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY[item.kind], alphaQuality: 90, smartSubsample: true })
      .toFile(path.join(outDir, `${item.name}-${w}.webp`));
  }
  manifest[item.name] = { src: `/projects/${slug}/media/${item.name}`, width, height, page: item.page };
  console.log(`✓ ${item.name} (${width}×${height}, p.${item.page})`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${Object.keys(manifest).length} assets → ${path.relative(root, outDir)}`);
