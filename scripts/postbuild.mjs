// Runs automatically after `npm run build`: adds the server config to the static export.
// Next.js does not copy dotfiles from public/, so .htaccess lives in deploy/.
import { copyFileSync, existsSync } from "node:fs";

if (!existsSync("out")) throw new Error("out/ not found — run `next build` first.");
copyFileSync("deploy/.htaccess", "out/.htaccess");
console.log("✓ Copied deploy/.htaccess → out/.htaccess");
