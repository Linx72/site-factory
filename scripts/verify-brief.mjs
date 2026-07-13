#!/usr/bin/env node
/**
 * verify-brief.mjs — Validate a Site Factory brief.json against docs/schemas/brief.schema.json.
 *
 * Usage:
 *   npm run verify:brief -- docs/examples/brief-saas.json
 *   node scripts/verify-brief.mjs path/to/brief.json
 *
 * No external JSON Schema library — checks required + enums + types from our schema.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.join(root, "docs/schemas/brief.schema.json");

const briefArg = process.argv[2];
if (!briefArg) {
  console.error("Usage: npm run verify:brief -- <path-to-brief.json>");
  process.exit(1);
}

const briefPath = path.isAbsolute(briefArg)
  ? briefArg
  : path.resolve(process.cwd(), briefArg);

if (!fs.existsSync(briefPath)) {
  console.error(`✗ Brief not found: ${briefPath}`);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));

/** @type {string[]} */
const errors = [];

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function checkEnum(value, allowed, label) {
  if (allowed && !allowed.includes(value)) {
    errors.push(`${label}: "${value}" not in [${allowed.join(", ")}]`);
  }
}

const props = schema.properties;
const required = schema.required ?? [];

for (const key of required) {
  if (brief[key] === undefined || brief[key] === null || brief[key] === "") {
    errors.push(`missing required: ${key}`);
  }
}

for (const key of Object.keys(brief)) {
  if (!props[key]) {
    errors.push(`unknown property: ${key}`);
  }
}

if (typeof brief.name === "string" && brief.name.length < 1) {
  errors.push("name: empty");
}

if (typeof brief.slug === "string") {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(brief.slug)) {
    errors.push("slug: must be kebab-case (a-z0-9-)");
  }
} else if (brief.slug !== undefined) {
  errors.push("slug: must be string");
}

if (brief.hue !== undefined) {
  if (typeof brief.hue !== "number" || brief.hue < 0 || brief.hue > 360) {
    errors.push("hue: number 0–360 required");
  }
}

if (brief.chroma !== undefined) {
  if (typeof brief.chroma !== "number" || brief.chroma < 0 || brief.chroma > 0.4) {
    errors.push("chroma: number 0–0.4 required");
  }
}

if (brief.preset !== undefined) {
  checkEnum(brief.preset, props.preset.enum, "preset");
}

if (brief.tone !== undefined) {
  checkEnum(brief.tone, props.tone.enum, "tone");
}

if (brief.theme !== undefined) {
  checkEnum(brief.theme, props.theme.enum, "theme");
}

if (brief.sections !== undefined) {
  if (!Array.isArray(brief.sections)) {
    errors.push("sections: must be array");
  } else {
    const allowed = props.sections.items.enum;
    for (const id of brief.sections) {
      checkEnum(id, allowed, `sections[]`);
    }
  }
}

if (brief.pages !== undefined) {
  if (!Array.isArray(brief.pages)) {
    errors.push("pages: must be array");
  } else {
    const allowed = props.pages.items.enum;
    for (const id of brief.pages) {
      checkEnum(id, allowed, `pages[]`);
    }
  }
}

if (brief.variants !== undefined) {
  if (typeOf(brief.variants) !== "object") {
    errors.push("variants: must be object");
  } else {
    const allowedKeys = Object.keys(props.variants.properties);
    for (const [k, v] of Object.entries(brief.variants)) {
      if (!allowedKeys.includes(k)) {
        errors.push(`variants.${k}: unknown`);
      } else {
        checkEnum(v, props.variants.properties[k].enum, `variants.${k}`);
      }
    }
  }
}

if (brief.locales !== undefined) {
  if (!Array.isArray(brief.locales) || brief.locales.length < 1) {
    errors.push("locales: non-empty array required");
  } else {
    for (const loc of brief.locales) {
      checkEnum(loc, props.locales.items.enum, "locales[]");
    }
  }
}

if (brief.features !== undefined) {
  if (typeOf(brief.features) !== "object") {
    errors.push("features: must be object");
  } else {
    const allowedKeys = Object.keys(props.features.properties);
    for (const [k, v] of Object.entries(brief.features)) {
      if (!allowedKeys.includes(k)) {
        errors.push(`features.${k}: unknown`);
      } else if (typeof v !== "boolean") {
        errors.push(`features.${k}: must be boolean`);
      }
    }
  }
}

if (brief.hero !== undefined) {
  if (typeOf(brief.hero) !== "object") {
    errors.push("hero: must be object");
  } else {
    const allowed = Object.keys(props.hero.properties);
    for (const k of Object.keys(brief.hero)) {
      if (!allowed.includes(k)) {
        errors.push(`hero.${k}: unknown`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`✗ Brief invalid: ${briefPath}`);
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log(`✓ Brief OK: ${path.relative(process.cwd(), briefPath) || briefPath}`);
console.log(`  name=${brief.name} slug=${brief.slug} preset=${brief.preset ?? "(none)"}`);
