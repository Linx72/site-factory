#!/usr/bin/env node
/**
 * verify-sitemap-urls.mjs — smoke-check sitemap URL resolution for prod env.
 *
 * Usage:
 *   npm run verify:sitemap
 *   NEXT_PUBLIC_I18N=true NEXT_PUBLIC_SITE_URL=https://example.com npm run verify:sitemap
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const env = {
  ...process.env,
  NEXT_PUBLIC_I18N: process.env.NEXT_PUBLIC_I18N ?? "true",
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-motion-starter.vercel.app",
};

const out = execSync(
  `npx tsx --eval "import sitemap from './src/app/sitemap.ts'; console.log(JSON.stringify(sitemap().map(e => e.url)));"`,
  { env, cwd: root, encoding: "utf8" },
);

const urls = JSON.parse(out.trim());
console.log("Sitemap entries:", urls.length);
for (const url of urls.slice(0, 6)) {
  console.log(" ", url);
}
if (urls.length > 6) {
  console.log(`  … +${urls.length - 6} more`);
}

const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim();
const hasLocalhost = urls.some((u) => u.includes("localhost"));
const i18nOn = env.NEXT_PUBLIC_I18N === "true";

if (siteUrl && hasLocalhost) {
  console.error("\n✗ Sitemap contains localhost but SITE_URL is set:", siteUrl);
  process.exit(1);
}

if (i18nOn) {
  const hasEn = urls.some((u) => u.includes("/en"));
  const hasRu = urls.some((u) => u.includes("/ru"));
  if (!hasEn || !hasRu) {
    console.error("\n✗ i18n on but sitemap missing /en or /ru URLs");
    process.exit(1);
  }
  const hasPrivacy = urls.some((u) => u.includes("/privacy"));
  if (!hasPrivacy) {
    console.error("\n✗ Sitemap missing /privacy (multi-page kit)");
    process.exit(1);
  }
  const hasBlog = urls.some((u) => u.includes("/blog"));
  if (!hasBlog) {
    console.error("\n✗ Sitemap missing /blog (blog-lite)");
    process.exit(1);
  }
}

console.log("\n✓ Sitemap URLs look OK");
