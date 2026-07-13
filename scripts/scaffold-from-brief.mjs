#!/usr/bin/env node
/**
 * scaffold-from-brief.mjs — Validate brief.json and scaffold a client site.
 *
 * Usage (from web-motion-starter):
 *   npm run scaffold:from-brief -- docs/examples/brief-saas.json
 *   npm run scaffold:from-brief -- path/to/brief.json --no-install
 *
 * Calls ~/Projects/scripts/new-web-site.sh with args derived from the brief,
 * then writes content/brief.json + optional .env.local (i18n) into the clone.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
if (args.length < 1 || args[0].startsWith("-")) {
  console.error("Usage: npm run scaffold:from-brief -- <brief.json> [--no-install] [--no-git]");
  process.exit(1);
}

const briefArg = args[0];
const extraFlags = new Set(args.slice(1));
const briefPath = path.isAbsolute(briefArg)
  ? briefArg
  : path.resolve(process.cwd(), briefArg);

// 1) Validate
execFileSync(process.execPath, [path.join(root, "scripts/verify-brief.mjs"), briefPath], {
  stdio: "inherit",
  cwd: root,
});

const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));
const projectsDir = brief.projectsDir || process.env.WEB_PROJECTS_DIR || path.join(os.homedir(), "Projects");
const targetDir = path.join(projectsDir, brief.slug);
const newWebSite = path.join(projectsDir, "scripts/new-web-site.sh");

if (!fs.existsSync(newWebSite)) {
  console.error(`✗ Scaffold CLI not found: ${newWebSite}`);
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  console.error(`✗ Target already exists: ${targetDir}`);
  process.exit(1);
}

const wantI18n =
  brief.features?.i18n === true ||
  (Array.isArray(brief.locales) && brief.locales.includes("ru"));

/** @type {string[]} */
const cli = [brief.slug];

if (brief.name) {
  cli.push("--title", brief.name);
}
if (brief.description) {
  cli.push("--description", brief.description);
}
if (typeof brief.hue === "number") {
  cli.push("--brand-hue", String(brief.hue));
}
if (typeof brief.chroma === "number") {
  cli.push("--brand-chroma", String(brief.chroma));
}

const usePreset = Boolean(brief.preset) && !brief.forceSections;
if (usePreset) {
  cli.push("--preset", brief.preset);
} else if (Array.isArray(brief.sections) && brief.sections.length > 0) {
  cli.push("--sections", brief.sections.join(","));
} else if (brief.preset) {
  cli.push("--preset", brief.preset);
}

if (Array.isArray(brief.pages) && brief.pages.length > 0) {
  cli.push("--pages", brief.pages.join(","));
}

if (brief.theme) {
  cli.push("--theme", brief.theme);
}

if (brief.projectsDir) {
  cli.push("--projects-dir", brief.projectsDir);
}

const noInstall = brief.noInstall || extraFlags.has("--no-install");
const noGit = brief.noGit || extraFlags.has("--no-git");
if (noInstall) cli.push("--no-install");
if (noGit) cli.push("--no-git");

console.log(`\n→ Scaffolding from brief → ${targetDir}`);
console.log(`  ${newWebSite} ${cli.map((c) => (c.includes(" ") ? JSON.stringify(c) : c)).join(" ")}`);

const result = spawnSync("bash", [newWebSite, ...cli], {
  stdio: "inherit",
  env: process.env,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// 2) Persist brief + applied notes in the clone
fs.mkdirSync(path.join(targetDir, "content"), { recursive: true });
fs.writeFileSync(
  path.join(targetDir, "content/brief.json"),
  `${JSON.stringify(brief, null, 2)}\n`,
);

const applied = {
  sourceBrief: briefPath,
  appliedAt: new Date().toISOString(),
  pages: brief.pages ?? ["home"],
  theme: brief.theme ?? "default",
  locales: brief.locales ?? ["en"],
  features: brief.features ?? {},
  notes: [
    "pages[] / variants written to content/site.json when present in brief.",
    "theme packs apply in Roadmap F Day 9 — hue/chroma already applied via scaffold.",
  ],
};
fs.writeFileSync(
  path.join(targetDir, "content/brief-applied.json"),
  `${JSON.stringify(applied, null, 2)}\n`,
);

// 3) Optional hero overlay into content/site.json when present
const siteJsonPath = path.join(targetDir, "content/site.json");
if (fs.existsSync(siteJsonPath)) {
  const site = JSON.parse(fs.readFileSync(siteJsonPath, "utf8"));
  if (brief.name) site.name = brief.name;
  if (brief.description) site.tagline = brief.description;
  if (brief.hero) site.hero = { ...(site.hero ?? {}), ...brief.hero };
  if (Array.isArray(brief.pages) && brief.pages.length > 0) {
    site.pages = brief.pages;
  }
  if (brief.variants && typeof brief.variants === "object") {
    site.variants = { ...(site.variants ?? {}), ...brief.variants };
  }
  fs.writeFileSync(siteJsonPath, `${JSON.stringify(site, null, 2)}\n`);
}

// 4) i18n env stub
if (wantI18n) {
  const envPath = path.join(targetDir, ".env.local");
  const line = "NEXT_PUBLIC_I18N=true\n";
  if (fs.existsSync(envPath)) {
    const existing = fs.readFileSync(envPath, "utf8");
    if (!existing.includes("NEXT_PUBLIC_I18N=")) {
      fs.appendFileSync(envPath, line);
    }
  } else {
    fs.writeFileSync(envPath, line);
  }
  console.log("→ Wrote NEXT_PUBLIC_I18N=true to .env.local");
}

if (brief.theme && brief.theme !== "default") {
  console.log(`\n→ Applying theme pack: ${brief.theme}`);
  execFileSync(
    process.execPath,
    [path.join(root, "scripts/apply-theme.mjs"), brief.theme, targetDir],
    { stdio: "inherit" },
  );
} else if (brief.theme === "default") {
  console.log("→ Theme default — skipping theme:apply");
}

// 5) Copy pack — hero/brand into messages + site.json
console.log("\n→ Applying copy pack from brief");
execFileSync(
  process.execPath,
  [path.join(root, "scripts/apply-copy-pack.mjs"), briefPath, targetDir],
  { stdio: "inherit" },
);

console.log(`
✓ Done: ${targetDir}

Next (Cursor agent — client delivery mode):
  1. move_agent_to_root ${targetDir}
  2. Extend messages for remaining sections (see docs/features/COPY-PACK.md)
  3. QA gates (must all pass before claiming done):
       npm run qa
       npm run verify:messages   # if i18n
       npm run qa:visual         # or visual smoke
       npm run ship:client
  4. Report live URL + how to change copy

Brief: content/brief.json · Copy pack: content/copy-pack-applied.json
`);
