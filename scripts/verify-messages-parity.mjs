#!/usr/bin/env node
/**
 * verify-messages-parity.mjs — ensure en.json and ru.json share the same key tree.
 *
 * Usage: npm run verify:messages
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function flattenKeys(obj, prefix = "") {
  /** @type {string[]} */
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function loadMessages(name) {
  const file = path.join(root, "messages", name);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const en = loadMessages("en.json");
const ru = loadMessages("ru.json");

const enKeys = new Set(flattenKeys(en));
const ruKeys = new Set(flattenKeys(ru));

const missingInRu = [...enKeys].filter((k) => !ruKeys.has(k)).sort();
const missingInEn = [...ruKeys].filter((k) => !enKeys.has(k)).sort();

if (missingInRu.length === 0 && missingInEn.length === 0) {
  console.log(`✓ Messages parity OK (${enKeys.size} keys)`);
  process.exit(0);
}

if (missingInRu.length > 0) {
  console.error(`✗ Missing in ru.json (${missingInRu.length}):`);
  for (const k of missingInRu.slice(0, 20)) {
    console.error(`  - ${k}`);
  }
  if (missingInRu.length > 20) {
    console.error(`  … +${missingInRu.length - 20} more`);
  }
}

if (missingInEn.length > 0) {
  console.error(`✗ Missing in en.json (${missingInEn.length}):`);
  for (const k of missingInEn.slice(0, 20)) {
    console.error(`  - ${k}`);
  }
  if (missingInEn.length > 20) {
    console.error(`  … +${missingInEn.length - 20} more`);
  }
}

process.exit(1);
