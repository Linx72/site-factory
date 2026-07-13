#!/usr/bin/env node
/**
 * Pull latest template code into an existing Site Factory clone.
 *
 * Preserves project identity: site-config, brand palette, content/site.json,
 * README, vercel.json, visual snapshots, env, git, and package name.
 *
 * Usage (from template root):
 *   node scripts/sync-from-template.mjs [projectDir]
 *   node scripts/sync-from-template.mjs [projectDir] --refresh-preset
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const refreshPreset = args.includes("--refresh-preset");
const projectArg = args.find((a) => !a.startsWith("-"));
const projectDir = path.resolve(projectArg ?? process.cwd());

if (!fs.existsSync(projectDir)) {
  console.error(`Project not found: ${projectDir}`);
  process.exit(1);
}

if (projectDir === templateRoot) {
  console.error("Refusing to sync template into itself.");
  process.exit(1);
}

const PRESERVE_IN_SRC = new Set([
  "lib/site-config.ts",
  "lib/theme/brand-palette.css",
]);

/** Dirs synced with --delete to drop stale files from old template layouts. */
const SYNC_DIRS = [
  "src",
  "convex",
  "docs",
  "public",
  "references",
  "tokens",
  ".github",
];

/** Dirs synced without --delete (clone may have project-specific scripts). */
const SYNC_DIRS_NO_DELETE = ["scripts"];

const COMMON_EXCLUDES = [
  "node_modules",
  ".next",
  "out",
  ".git",
  ".vercel",
  ".env*",
  "*.tsbuildinfo",
  ".DS_Store",
  "tests/visual/*-snapshots",
];

function rsyncDir(relativeDir, useDelete = true) {
  const src = path.join(templateRoot, relativeDir);
  if (!fs.existsSync(src)) return;

  const excludes = [...COMMON_EXCLUDES];
  if (relativeDir === "src") {
    for (const file of PRESERVE_IN_SRC) {
      excludes.push(file);
    }
  }

  const rsyncArgs = [
    "-a",
    ...(useDelete ? ["--delete"] : []),
    ...excludes.flatMap((pattern) => ["--exclude", pattern]),
    `${src}/`,
    `${path.join(projectDir, relativeDir)}/`,
  ];

  execFileSync("rsync", rsyncArgs, { stdio: "inherit" });
}

const ROOT_FILES = [
  "eslint.config.mjs",
  "next.config.ts",
  "next-env.d.ts",
  "playwright.config.ts",
  "postcss.config.mjs",
  "tsconfig.json",
  "components.json",
  "AGENTS.md",
];

console.log(`→ Syncing template → ${projectDir}`);

for (const dir of SYNC_DIRS) {
  rsyncDir(dir, true);
}

for (const dir of SYNC_DIRS_NO_DELETE) {
  rsyncDir(dir, false);
}

for (const file of ROOT_FILES) {
  const src = path.join(templateRoot, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(projectDir, file));
  }
}

/** Sync test specs but not snapshots. */
const testsDir = path.join(templateRoot, "tests");
if (fs.existsSync(testsDir)) {
  execFileSync(
    "rsync",
    [
      "-a",
      "--delete",
      ...COMMON_EXCLUDES.flatMap((pattern) => ["--exclude", pattern]),
      `${testsDir}/`,
      `${path.join(projectDir, "tests")}/`,
    ],
    { stdio: "inherit" },
  );
}

/** Merge npm scripts from template; keep clone package name. */
function mergePackageJson() {
  const templatePkg = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "package.json"), "utf8"),
  );
  const targetPath = path.join(projectDir, "package.json");
  const targetPkg = JSON.parse(fs.readFileSync(targetPath, "utf8"));

  targetPkg.scripts = { ...templatePkg.scripts, ...targetPkg.scripts };
  targetPkg.dependencies = {
    ...templatePkg.dependencies,
    ...targetPkg.dependencies,
  };
  targetPkg.devDependencies = {
    ...templatePkg.devDependencies,
    ...targetPkg.devDependencies,
  };

  fs.writeFileSync(targetPath, `${JSON.stringify(targetPkg, null, 2)}\n`);
  console.log("→ Merged package.json scripts/deps (kept name)");
}

mergePackageJson();

if (refreshPreset) {
  execFileSync(
    process.execPath,
    [path.join(templateRoot, "scripts/refresh-preset.mjs"), projectDir],
    { stdio: "inherit", cwd: projectDir },
  );
}

console.log(`✓ Synced ${projectDir}`);
console.log("  Next: cd project && npm install && npm run qa");
