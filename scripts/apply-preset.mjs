#!/usr/bin/env node
/**
 * Apply a reference preset JSON to a scaffolded project directory.
 * Called from new-web-site.sh after base scaffold.
 *
 * Usage: node scripts/apply-preset.mjs references/saas.json /path/to/project
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [, , presetPath, projectDir] = process.argv;

if (!presetPath || !projectDir) {
  console.error("Usage: apply-preset.mjs <preset.json> <projectDir>");
  process.exit(1);
}

const preset = JSON.parse(fs.readFileSync(path.resolve(presetPath), "utf8"));
const root = path.resolve(projectDir);

/** @type {readonly string[]} */
const VALID_SECTIONS = [
  "logos",
  "features",
  "bento",
  "stats",
  "scroll-story",
  "timeline",
  "testimonials",
  "team",
  "ui",
  "pricing",
  "faq",
  "contact",
  "cta",
];

function parseSectionOrder(sectionsCsv) {
  return sectionsCsv
    .split(",")
    .map((s) => s.trim())
    .filter((id) => id !== "hero" && VALID_SECTIONS.includes(id));
}

function writeSiteConfig() {
  const features = preset.siteFeatures ?? {
    stripe: false,
    convex: false,
    contactForm: true,
  };

  const content = `/**
 * Public site + brand defaults. Generated from preset "${preset.id}".
 */
import type { AnalyticsProvider } from "@/lib/analytics";
import { getAnalyticsProvider } from "@/lib/analytics";

export const siteConfig = {
  name: ${JSON.stringify(preset.title)},
  description: ${JSON.stringify(preset.description)},
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  links: {
    github: "",
  },
} as const;

/** Brand OKLCH tokens — synced with brand-palette.css and presets. */
export const brandTokens = {
  hue: ${preset.brandHue ?? 264},
  chroma: ${preset.brandChroma ?? 0.18},
} as const;

/** Toggle optional subsystems — enable only when env/backend is configured. */
export const siteFeatures = {
  stripe: Boolean(process.env.STRIPE_SECRET_KEY),
  convex: Boolean(process.env.NEXT_PUBLIC_CONVEX_URL),
  contactForm: ${features.contactForm ?? true},
  i18n: process.env.NEXT_PUBLIC_I18N === "true",
  cms:
    process.env.NEXT_PUBLIC_CMS === "true" &&
    Boolean(process.env.NEXT_PUBLIC_CONVEX_URL),
  analytics: getAnalyticsProvider() as AnalyticsProvider,
} as const;
`;

  fs.writeFileSync(path.join(root, "src/lib/site-config.ts"), content);
}

function writeSiteJson() {
  /** @type {Record<string, unknown>} */
  const payload = {
    name: preset.title,
    tagline: preset.description,
    preset: preset.id,
    nav: preset.nav ?? [],
    sections: parseSectionOrder(preset.sections ?? ""),
  };

  if (preset.headerCta) {
    payload.headerCta = preset.headerCta;
  }

  if (preset.hero) {
    payload.hero = preset.hero;
  }

  if (preset.variants && typeof preset.variants === "object") {
    payload.variants = preset.variants;
  }

  if (preset.theme) {
    payload.theme = preset.theme;
  }

  if (Array.isArray(preset.pages) && preset.pages.length > 0) {
    payload.pages = preset.pages;
  }

  fs.mkdirSync(path.join(root, "content"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "content/site.json"),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
}

function applyThemePack() {
  const themeId = preset.theme;
  if (!themeId || themeId === "default") return;

  const templateScripts = path.resolve(path.dirname(path.resolve(presetPath)), "..");
  const applyTheme =
    [
      path.join(root, "scripts/apply-theme.mjs"),
      path.join(templateScripts, "scripts/apply-theme.mjs"),
    ].find((p) => fs.existsSync(p)) ?? null;

  if (!applyTheme) {
    console.warn(`! theme "${themeId}" set but apply-theme.mjs not found — skip`);
    return;
  }

  execFileSync(process.execPath, [applyTheme, themeId, root], {
    cwd: root,
    stdio: "inherit",
  });
}

function writeBrandPalette() {
  if (preset.brandHue == null && preset.brandChroma == null) return;

  const palettePath = path.join(root, "src/lib/theme/brand-palette.css");
  if (!fs.existsSync(palettePath)) return;

  let css = fs.readFileSync(palettePath, "utf8");
  if (preset.brandHue != null) {
    css = css.replace(/(--brand-hue:\s*)[0-9.]+/, `$1${preset.brandHue}`);
  }
  if (preset.brandChroma != null) {
    css = css.replace(/(--brand-chroma:\s*)[0-9.]+/, `$1${preset.brandChroma}`);
  }
  fs.writeFileSync(palettePath, css);
}

function syncPresetTokens() {
  const tokenFile = path.join(
    path.dirname(path.resolve(presetPath)),
    "tokens",
    `${preset.id}.json`,
  );
  if (!fs.existsSync(tokenFile)) return;

  const syncScript = path.join(root, "scripts/sync-figma-tokens.mjs");
  if (!fs.existsSync(syncScript)) return;

  execFileSync(process.execPath, [syncScript, "--input", tokenFile], {
    cwd: root,
    stdio: "inherit",
  });
}

function writeReadme() {
  const readme = `# ${preset.title}

Reference site preset: \`${preset.id}\` (from \`web-motion-starter/references/${preset.id}.json\`).

${preset.description}

## Develop

\`\`\`bash
npm run quick-start   # install + optional Playwright
npm run dev
\`\`\`

## Sections

\`${preset.sections}\`

## Theme / variants

- Theme: \`${preset.theme ?? "default"}\`
- Variants: \`${JSON.stringify(preset.variants ?? {})}\`

## Docs

- \`docs/REFERENCE-SITES.md\` — preset catalog
- \`docs/features/THEME-PACKS.md\` — theme packs
- \`docs/features/SECTION-VARIANTS.md\` — section variants
- \`docs/PLAYBOOK-NEW-SITE.md\` — full workflow
`;
  fs.writeFileSync(path.join(root, "README.md"), readme);
}

writeSiteConfig();
writeSiteJson();
writeBrandPalette();
syncPresetTokens();
applyThemePack();
writeReadme();
console.log(`Applied preset "${preset.id}" to ${root}`);
if (preset.theme) console.log(`  theme: ${preset.theme}`);
if (preset.variants) console.log(`  variants: ${JSON.stringify(preset.variants)}`);
