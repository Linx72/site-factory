#!/usr/bin/env node
/**
 * apply-copy-pack.mjs — Merge brief hero/brand fields into messages + site.json.
 *
 * Does NOT invent section copy outside the brief. Agent may extend messages
 * afterward; this script only applies explicit brief fields.
 *
 * Usage:
 *   npm run copy:apply -- docs/examples/brief-saas.json
 *   npm run copy:apply -- path/to/brief.json /path/to/clone
 *
 * Default projectDir = cwd (run inside clone) or second arg.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const briefArg = process.argv[2];
if (!briefArg) {
  console.error("Usage: npm run copy:apply -- <brief.json> [projectDir]");
  process.exit(1);
}

const briefPath = path.isAbsolute(briefArg)
  ? briefArg
  : path.resolve(process.cwd(), briefArg);

execFileSync(process.execPath, [path.join(root, "scripts/verify-brief.mjs"), briefPath], {
  stdio: "inherit",
});

const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));
const projectDir = process.argv[3]
  ? path.resolve(process.argv[3])
  : process.cwd();

const messagesDir = path.join(projectDir, "messages");
if (!fs.existsSync(messagesDir)) {
  console.error(`✗ No messages/ in ${projectDir}`);
  process.exit(1);
}

/** @param {string} locale */
function loadMessages(locale) {
  const file = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(file)) return null;
  return { file, data: JSON.parse(fs.readFileSync(file, "utf8")) };
}

/** @param {{ file: string, data: Record<string, unknown> }} pack */
function applyHeroBrand(pack) {
  const home = /** @type {Record<string, any>} */ (pack.data.Home ?? {});
  home.hero = home.hero ?? {};
  home.header = home.header ?? {};
  home.footer = home.footer ?? {};

  if (brief.hero) {
    for (const key of ["eyebrow", "title", "description", "primaryCta", "secondaryCta"]) {
      if (typeof brief.hero[key] === "string" && brief.hero[key].length > 0) {
        home.hero[key] = brief.hero[key];
      }
    }
  }

  if (brief.name) {
    if (!brief.hero?.eyebrow) {
      home.hero.eyebrow = brief.name;
    }
    home.footer.tagline = `${brief.name}${
      brief.description ? ` · ${brief.description}` : ""
    }`;
  }

  if (brief.hero?.primaryCta) {
    home.header.cta = brief.hero.primaryCta;
  }

  pack.data.Home = home;

  fs.writeFileSync(pack.file, `${JSON.stringify(pack.data, null, 2)}\n`);
}

const en = loadMessages("en");
if (!en) {
  console.error("✗ messages/en.json missing");
  process.exit(1);
}

applyHeroBrand(en);
console.log(`→ Updated ${path.relative(projectDir, en.file)} (hero + brand)`);

const locales = brief.locales ?? ["en"];
const wantRu =
  locales.includes("ru") ||
  brief.features?.i18n === true ||
  fs.existsSync(path.join(messagesDir, "ru.json"));

if (wantRu) {
  const ru = loadMessages("ru");
  if (ru) {
    // Stub: same hero strings as brief (agent translates later). Keys stay in parity.
    applyHeroBrand(ru);
    console.log(
      `→ Updated ${path.relative(projectDir, ru.file)} (RU stub from brief — translate remaining copy)`,
    );
  }
}

// site.json
const siteJsonPath = path.join(projectDir, "content/site.json");
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
  console.log("→ Updated content/site.json");
}

// site-config.ts — replace name/description string literals if present
const siteConfigPath = path.join(projectDir, "src/lib/site-config.ts");
if (fs.existsSync(siteConfigPath) && brief.name) {
  let src = fs.readFileSync(siteConfigPath, "utf8");
  src = src.replace(
    /name:\s*"[^"]*"/,
    `name: ${JSON.stringify(brief.name)}`,
  );
  if (brief.description) {
    src = src.replace(
      /description:\s*"[^"]*"/,
      `description: ${JSON.stringify(brief.description)}`,
    );
  }
  fs.writeFileSync(siteConfigPath, src);
  console.log("→ Updated src/lib/site-config.ts");
}

fs.mkdirSync(path.join(projectDir, "content"), { recursive: true });
fs.writeFileSync(
  path.join(projectDir, "content/copy-pack-applied.json"),
  `${JSON.stringify(
    {
      appliedAt: new Date().toISOString(),
      brief: brief.slug ?? brief.name,
      fields: ["Home.hero.*", "Home.header.cta", "Home.footer.tagline", "site.json", "site-config"],
      ruStub: wantRu,
      note: "Do not invent sections outside brief.sections / preset. Run verify:messages after edits.",
    },
    null,
    2,
  )}\n`,
);

console.log("✓ Copy pack applied");
