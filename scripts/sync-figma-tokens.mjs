#!/usr/bin/env node
/**
 * Sync Figma design variables into CSS brand tokens.
 *
 * Input: JSON from Figma MCP `get_variable_defs` saved to tokens/figma-variables.json,
 * or inline mapping file. Writes `src/lib/theme/brand-palette.css` (brand hue/chroma)
 * and optional motion/radius overrides in `src/lib/theme/figma-sync.css`.
 *
 * Usage:
 *   node scripts/sync-figma-tokens.mjs
 *   node scripts/sync-figma-tokens.mjs --input tokens/figma-variables.json
 *   node scripts/sync-figma-tokens.mjs --hue 220 --chroma 0.16 --radius 0.75rem
 *
 * Env: none required for CLI flags; JSON path defaults to tokens/figma-variables.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const args = process.argv.slice(2);

function getArg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

const inputPath = path.resolve(
  root,
  getArg("--input", "tokens/figma-variables.json"),
);
const brandPalettePath = path.join(root, "src/lib/theme/brand-palette.css");
const figmaSyncPath = path.join(root, "src/lib/theme/figma-sync.css");

/** Map Figma variable names (case-insensitive) to token keys. */
const VARIABLE_ALIASES = {
  "brand/hue": "hue",
  brandhue: "hue",
  "brand-hue": "hue",
  "brand/chroma": "chroma",
  brandchroma: "chroma",
  "brand-chroma": "chroma",
  "brand/lightness": "lightness",
  radius: "radius",
  "corner/radius": "radius",
};

function normalizeKey(key) {
  return key.toLowerCase().replace(/\s+/g, "");
}

function parseFigmaJson(raw) {
  /** @type {Record<string, string | number>} */
  const out = {};

  if (typeof raw !== "object" || raw === null) return out;

  for (const [key, value] of Object.entries(raw)) {
    const alias = VARIABLE_ALIASES[normalizeKey(key)];
    if (!alias) continue;

    if (typeof value === "number") {
      out[alias] = value;
      continue;
    }

    if (typeof value === "string") {
      const num = parseFloat(value.replace(/[^\d.]/g, ""));
      if (!Number.isNaN(num)) out[alias] = num;
      else if (alias === "radius") out[alias] = value;
    }
  }

  return out;
}

function loadTokens() {
  const cli = {
    hue: getArg("--hue", null),
    chroma: getArg("--chroma", null),
    lightness: getArg("--lightness", null),
    radius: getArg("--radius", null),
  };

  /** @type {Record<string, string | number>} */
  let merged = {};

  if (fs.existsSync(inputPath)) {
    const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
    merged = parseFigmaJson(raw);
    console.log(`Read Figma variables from ${inputPath}`);
  } else {
    console.warn(`No JSON at ${inputPath} — using CLI flags / defaults only`);
  }

  for (const [k, v] of Object.entries(cli)) {
    if (v !== null) merged[k] = k === "radius" ? v : parseFloat(v);
  }

  return {
    hue: merged.hue ?? 264,
    chroma: merged.chroma ?? 0.18,
    lightness: merged.lightness ?? 0.48,
    radius: merged.radius ?? null,
  };
}

function writeBrandPalette({ hue, chroma, lightness }) {
  const content = `/**
 * Brand palette — generated/updated by scripts/sync-figma-tokens.mjs
 * Edit hue/chroma manually or re-run sync from Figma variable JSON.
 */
:root {
  --brand-hue: ${hue};
  --brand-chroma: ${chroma};
  --brand-lightness: ${lightness};

  --primary: oklch(var(--brand-lightness) var(--brand-chroma) var(--brand-hue));
  --primary-foreground: oklch(0.985 0.01 var(--brand-hue));
  --ring: oklch(calc(var(--brand-lightness) + 0.2) calc(var(--brand-chroma) * 0.7) var(--brand-hue));
  --accent: oklch(0.96 0.03 var(--brand-hue));
  --accent-foreground: oklch(0.28 0.08 var(--brand-hue));
  --chart-1: oklch(var(--brand-lightness) var(--brand-chroma) var(--brand-hue));
}

.dark {
  --brand-lightness: 0.72;
  --brand-chroma: ${Math.max(chroma - 0.04, 0.08).toFixed(2)};

  --primary: oklch(var(--brand-lightness) var(--brand-chroma) var(--brand-hue));
  --primary-foreground: oklch(0.18 0.04 var(--brand-hue));
  --ring: oklch(calc(var(--brand-lightness) - 0.1) var(--brand-chroma) var(--brand-hue));
  --accent: oklch(0.28 0.06 var(--brand-hue));
  --accent-foreground: oklch(0.92 0.02 var(--brand-hue));
  --chart-1: oklch(var(--brand-lightness) var(--brand-chroma) var(--brand-hue));
}
`;

  fs.writeFileSync(brandPalettePath, content);
  console.log(`Wrote ${brandPalettePath}`);
}

function writeFigmaSync({ radius }) {
  if (!radius) {
    if (fs.existsSync(figmaSyncPath)) fs.unlinkSync(figmaSyncPath);
    return;
  }

  const content = `/**
 * Optional overrides from Figma sync — import after brand-palette in globals.css if used.
 */
:root {
  --radius: ${typeof radius === "number" ? `${radius}rem` : radius};
}
`;

  fs.writeFileSync(figmaSyncPath, content);
  console.log(`Wrote ${figmaSyncPath}`);
  console.log("Add @import '../lib/theme/figma-sync.css'; to globals.css if not present.");
}

const tokens = loadTokens();
writeBrandPalette(tokens);
writeFigmaSync(tokens);
console.log("Done:", tokens);
