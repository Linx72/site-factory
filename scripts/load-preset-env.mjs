#!/usr/bin/env node
/**
 * Emit shell-friendly assignments from a reference preset JSON.
 * Usage: eval "$(node scripts/load-preset-env.mjs references/saas.json)"
 */
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: load-preset-env.mjs <preset.json>");
  process.exit(1);
}

const p = JSON.parse(fs.readFileSync(file, "utf8"));
const esc = (s) => String(s).replace(/'/g, `'\\''`);

if (p.title) console.log(`SITE_TITLE='${esc(p.title)}'`);
if (p.description) console.log(`SITE_DESCRIPTION='${esc(p.description)}'`);
if (p.brandHue != null) console.log(`BRAND_HUE=${p.brandHue}`);
if (p.brandChroma != null) console.log(`BRAND_CHROMA=${p.brandChroma}`);
if (p.sections) console.log(`SECTIONS='${esc(p.sections)}'`);
