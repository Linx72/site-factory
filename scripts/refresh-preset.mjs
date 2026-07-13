#!/usr/bin/env node
/**
 * Re-apply a reference preset to an existing project (content, config, page, brand).
 *
 * Usage:
 *   node scripts/refresh-preset.mjs                    # cwd, preset from content/site.json
 *   node scripts/refresh-preset.mjs demo-studio        # preset id
 *   node scripts/refresh-preset.mjs saas /path/to/site-ref-saas
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(__dirname, "..");

const [, , presetArg, projectArg] = process.argv;
const projectDir = path.resolve(projectArg ?? process.cwd());

function readPresetId() {
  if (presetArg && !presetArg.startsWith("/")) return presetArg;

  const siteJsonPath = path.join(projectDir, "content/site.json");
  if (!fs.existsSync(siteJsonPath)) {
    console.error("No content/site.json — pass preset id: refresh-preset.mjs saas");
    process.exit(1);
  }

  const site = JSON.parse(fs.readFileSync(siteJsonPath, "utf8"));
  if (!site.preset) {
    console.error("content/site.json has no preset field — pass preset id explicitly");
    process.exit(1);
  }
  return site.preset;
}

const presetId = readPresetId();
const presetPath = path.join(templateRoot, "references", `${presetId}.json`);

if (!fs.existsSync(presetPath)) {
  console.error(`Preset not found: ${presetPath}`);
  process.exit(1);
}

const preset = JSON.parse(fs.readFileSync(presetPath, "utf8"));

execFileSync(
  process.execPath,
  [path.join(templateRoot, "scripts/apply-preset.mjs"), presetPath, projectDir],
  { stdio: "inherit" },
);

const pagePath = path.join(projectDir, "src/app/page.tsx");
execFileSync(
  process.execPath,
  [
    path.join(templateRoot, "scripts/generate-page.mjs"),
    "--home-page",
    preset.sections,
    pagePath,
  ],
  { stdio: "inherit" },
);

console.log(`Refreshed preset "${presetId}" in ${projectDir}`);
