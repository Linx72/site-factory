# Changelog

All notable changes to **web-motion-starter** (Site Factory template).

Format based on [Keep a Changelog](https://keepachangelog.com/). Versioning: [SemVer](https://semver.org/).

## [1.7.0] — 2026-07-13

### Added

- **Analytics flag (Roadmap H Day 16):** `NEXT_PUBLIC_ANALYTICS=none|vercel|plausible` + `AnalyticsScripts` — [ANALYTICS.md](./docs/features/ANALYTICS.md)
- **Resend first-class (Day 17):** [RESEND.md](./docs/features/RESEND.md); `prod:services` step 3
- **CMS write policy (Day 18):** `cms.canEdit`; editor/seed hidden without `ALLOW_DEV_SEED`; Open home preview
- **Preset `launch` (Day 19):** editorial-ink + editorial/bento-lite/compare + contact + legal pages
- **Sales kit (Day 20):** [SALES-KIT.md](./docs/SALES-KIT.md); Roadmap v3 Phase H complete

### Changed

- `@vercel/analytics` dependency for `vercel` provider
- CMS.md documents production-safe defaults

## [1.6.1] — 2026-07-13

### Fixed

- **LocaleSwitcher** — do not call `useTranslations` when `NEXT_PUBLIC_I18N` is off (root layout has no `NextIntlClientProvider`; was crashing prod refs with Critical error)
- Deploy wait for prebuilt upload extended to 420s

## [1.6.0] — 2026-07-13

### Added

- **Reference refresh (Roadmap F Day 10):** saas/agency presets carry `theme` + `variants`
- `apply-preset` writes variants and runs `theme:apply`
- REFERENCE-SITES.md documents theme/variant matrix

### Changed

- **saas** → `product-dark` + features/`bento-lite` + pricing/`compare`
- **agency** → `studio-soft` + hero/`editorial` (dropped warm terracotta hue)

## [1.5.0] — 2026-07-13

### Added

- **Theme packs (Roadmap F Day 9):** `product-dark`, `studio-soft`, `editorial-ink` (+ `default`)
- `npm run theme:apply -- <id>` → brand-palette, theme-pack.css, applied-theme.ts
- Scaffold: `new-web-site.sh --theme` + brief `theme` via `scaffold:from-brief`
- Docs: [THEME-PACKS.md](./docs/features/THEME-PACKS.md) with anti-slop rules

## [1.4.0] — 2026-07-13

### Added

- **Features `bento-lite`** — featured first item + asymmetric grid (same `Home.features` keys)
- **Pricing `compare`** — feature matrix table with shared plan/feature copy + checkout CTAs
- Saas example brief sets `features: bento-lite`, `pricing: compare`

### Changed

- `resolveImplemented*` no longer falls back for features/pricing variants

## [1.3.0] — 2026-07-13

### Added

- **Section variants (Roadmap F 6–7):** `variants` in `content/site.json` / brief
- `src/lib/section-variants.ts` + [SECTION-VARIANTS.md](./docs/features/SECTION-VARIANTS.md)
- **Hero `editorial`** — brand-first full-bleed, no stat cards (default unchanged)
- Brief schema / `verify:brief` / `copy:apply` / `scaffold:from-brief` persist variants
- Agency example brief uses `"hero": "editorial"`

### Notes

- Template home omits `variants` → zero visual regression

## [1.2.0] — 2026-07-13

### Added

- **Blog-lite (Roadmap E Day 4):** `content/blog/*.md` → `/blog`, `/blog/[slug]` (+ `/[locale]/…`)
- `src/lib/blog.ts` frontmatter + safe Markdown subset renderer
- Footer Blog link; sitemap includes posts when `blog-index` is enabled
- RU/EN `BlogPage` messages; Playwright + `verify:prod` smoke
- **`new-web-site.sh --pages`** — comma-separated page ids → `content/site.json`

### Changed

- Default `pages[]` includes `blog-index`
- PAGE-CATALOG / ROADMAP Phase E (Days 4–5) marked done
- `scaffold:from-brief` passes `--pages` from brief

## [1.1.0] — 2026-07-13

### Added

- **Multi-page kit (Roadmap E 1–3):** `docs/PAGE-CATALOG.md`, `pages[]` in `content/site.json`
- Routes: `/privacy`, `/terms`, `/about`, `/case`, `/case/[slug]` (+ `/[locale]/…`)
- `content/cases/demo.json` file-based case study
- Footer links for Privacy / Terms (i18n)
- Sitemap includes new public paths when enabled

### Notes

- Enable/disable via `"pages": [...]` in site.json / brief

## [1.0.0] — 2026-07-13

### Added

- **Brief pipeline:** `docs/schemas/brief.schema.json`, `npm run verify:brief`, examples under `docs/examples/`
- **`npm run scaffold:from-brief`** — brief.json → clone via `new-web-site.sh`
- **`npm run copy:apply`** — merge brief hero/brand into `messages/` + `site.json` ([COPY-PACK.md](./docs/features/COPY-PACK.md))
- **Agent QA gates** in site-builder skills (qa → messages → visual → ship)
- **Prod verify stack:** `verify:messages`, `verify:prod`, `verify:backend`, `verify:stripe`, `verify:all`, `domain:verify`
- **Plain-language guide:** [docs/HOW-IT-WORKS.md](./docs/HOW-IT-WORKS.md)
- **Roadmap v3** ([docs/ROADMAP.md](./docs/ROADMAP.md)) — L7–L10 plan; days 11–15 agent layer landed

### Changed

- SITE-BRIEF.md prefers machine-readable brief schema
- HANDOFF / HOW-TO-USE document brief → scaffold as primary client path

### Notes for clones

- Sync with `npm run sync:clone` — see [docs/TEMPLATE-SYNC.md](./docs/TEMPLATE-SYNC.md)
- Multi-page (`privacy` / `about` / blog) and theme packs are planned (Roadmap E–F), not required for 1.0

## [0.1.0] — 2026-07

### Added

- Core template: 14 sections, motion lab, Convex, Stripe, i18n en/ru
- Presets saas / agency / demo-studio
- Phases 1–42 factory delivery (verify, deploy:prebuilt, RU polish)
