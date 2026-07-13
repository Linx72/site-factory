# Site Factory

End-to-end system for building animated marketing sites with Cursor.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Cursor Agent                                               │
│  Skills: site-builder · web-motion · visual-qa              │
│  Rules: web-stack-default · web-figma-workflow · web-no-slop│
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  ~/Projects/scripts/new-web-site.sh [--preset saas|agency]  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  web-motion-starter (template)                              │
│  14 sections · motion primitives · Convex · Stripe · i18n   │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    Brand/Figma        Content/CMS       QA + Deploy
    sync:tokens        /status           ci.yml · deploy
```

## Quick start (new site)

```bash
# 1. Scaffold
~/Projects/scripts/new-web-site.sh my-brand \
  --title "My Brand" \
  --brand-hue 220 \
  --sections hero,bento,features,pricing,faq,contact,cta

# 2. Open in Cursor → move_agent_to_root ~/Projects/my-brand

# 3. Dev
cd ~/Projects/my-brand && npm install && npm run dev

# 4. QA + deploy
npm run qa:all
npm run deploy   # after vercel login
```

## Presets

| Preset | Command | Use case |
|--------|---------|----------|
| `saas` | `--preset saas` | B2B product, pricing, FAQ |
| `agency` | `--preset agency` | Studio, scroll story, team |
| `demo-studio` | `--preset demo-studio` | Full demo (Aurora Labs) |

Reference clones: `npm run scaffold:references` (saas + agency).

## Documentation map

| Doc | Content |
|-----|---------|
| [PLAYBOOK-NEW-SITE.md](./PLAYBOOK-NEW-SITE.md) | Step-by-step workflow |
| [PAGE-CATALOG.md](./PAGE-CATALOG.md) | Opt-in routes: privacy, about, case… |
| [SECTION-CATALOG.md](./SECTION-CATALOG.md) | Section ids + motion |
| [SECTION-VARIANTS.md](./features/SECTION-VARIANTS.md) | hero/features/pricing layout variants |
| [THEME-PACKS.md](./features/THEME-PACKS.md) | Named themes + `theme:apply` + anti-slop |
| [SITE-BRIEF.md](./SITE-BRIEF.md) | Brief template |
| [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) | Brand + Figma sync |
| [REFERENCE-SITES.md](./REFERENCE-SITES.md) | Preset catalog |
| [DEMO-STUDIO.md](./DEMO-STUDIO.md) | Aurora Labs showcase + deploy |
| [LIVE-SITES.md](./LIVE-SITES.md) | All production URLs |
| [CLIENT-SITE.md](./CLIENT-SITE.md) | 15-min client delivery path |
| [CUSTOM-DOMAIN.md](./CUSTOM-DOMAIN.md) | Vercel Domains + SITE_URL |
| [DEPLOY.md](./DEPLOY.md) | Vercel + GitHub Actions |
| [features/I18N.md](./features/I18N.md) | `/en`, `/ru` |
| [features/CMS.md](./features/CMS.md) | Convex copy overrides |
| [features/CONVEX.md](./features/CONVEX.md) | Backend setup + production |
| [COPY-PACK.md](./features/COPY-PACK.md) | brief → messages hero/brand |
| [TEMPLATE-SYNC.md](./TEMPLATE-SYNC.md) | Sync clones safely |
| [CHANGELOG.md](../CHANGELOG.md) | Template semver |
| [HANDOFF.md](./HANDOFF.md) | Complete system handoff |
| [HOW-TO-USE.md](./HOW-TO-USE.md) | Cursor workflow (RU) — scaffold → ship |
| [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) | Простыми словами: завод, клиент, v3 |
| [ROADMAP.md](./ROADMAP.md) | План v3: multi-page / variants / agent (дни 11/12/14 ✅) |

## NPM scripts (template)

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev |
| `npm run dev:convex` | Convex backend |
| `npm run qa` | lint + typecheck |
| `npm run qa:visual` | Playwright 375/768/1440 |
| `npm run qa:all` | qa + visual |
| `npm run sync:tokens` | Figma JSON → CSS |
| `npm run scaffold:page` | Regenerate page.tsx from section ids |
| `npm run verify:brief` | Validate brief.json against schema |
| `npm run scaffold:from-brief` | brief.json → ~/Projects/<slug> clone |
| `npm run copy:apply` | brief hero/brand → messages + site.json |
| `npm run refresh:preset` | Re-apply preset from content/site.json |
| `npm run sync:clone` | Pull template code into existing project |
| `npm run refresh:references` | Sync + refresh saas/agency reference clones |
| `npm run snapshots:references` | Update Playwright baselines for saas/agency |
| `npm run convex:prod` | Deploy Convex + print Vercel env checklist |
| `npm run convex:init` | First-time Convex dev setup (`npx convex login` first) |
| `npm run convex:vercel` | Set `NEXT_PUBLIC_CONVEX_URL` on Vercel + redeploy |
| `npm run domain:custom` | Custom domain → SITE_URL + redeploy |
| `npm run ship:client` | QA + prebuilt Vercel deploy (any clone) |
| `npm run verify:live` | HTTP check all production URLs (45s timeout) |
| `npm run verify:sitemap` | Sitemap URL / i18n smoke (tsx) |
| `npm run stripe:setup` | Stripe + Convex env checklist |
| `npm run deploy:demo-studio` | QA + deploy ~/Projects/demo-studio |

## Feature flags (`site-config.ts`)

| Flag | Env |
|------|-----|
| `stripe` | `STRIPE_SECRET_KEY` |
| `convex` | `NEXT_PUBLIC_CONVEX_URL` |
| `i18n` | `NEXT_PUBLIC_I18N=true` |
| `cms` | `NEXT_PUBLIC_CMS=true` |

## Agent prompt examples

**New SaaS landing:**
> Scaffold site-ref style SaaS landing for "Acme Analytics" — hue 250, sections hero, bento, pricing, faq, cta. Use site-builder skill.

**From Figma:**
> Implement this Figma URL into hero and features — get_design_context + get_motion_context, merge into existing sections.

**Ship:**
> Run visual QA, fix any issues, deploy to Vercel.

## File locations (global)

| Path | Purpose |
|------|---------|
| `~/.cursor/skills/site-builder/` | Orchestration skill |
| `~/.cursor/skills/visual-qa/` | QA checklist |
| `~/.cursor/skills/web-motion/` | Motion + Figma merge |
| `~/.cursor/rules/web-*.mdc` | Global Cursor rules |
| `~/Projects/scripts/new-web-site.sh` | Scaffold CLI |
| `~/Projects/web-motion-starter/` | Template repo |

## Verify template health

```bash
cd ~/Projects/web-motion-starter
npm run qa:all && npm run build
```

## Changelog (factory versions)

| Phase | Delivered |
|-------|-----------|
| 1 | Starter, scaffold, skills, rules |
| 2 | Bento/timeline/team, Figma token sync |
| 3 | Reference presets, Playwright QA |
| 4 | i18n, CMS-lite, CI |
| 5 | Status CMS panel, deploy pipeline |
| 6 | SITE-FACTORY doc, demo-studio preset, seed-all |
| 7 | `content/site.json` → header/hero/sections, `quick-start`, i18n sitemap |
| 8 | Preset hero copy (saas/agency), brand-agnostic visual QA, `refresh-preset`, DEMO-STUDIO deploy doc |
| 9 | Dynamic OG from `site.json` + `brandTokens`, `vercel-setup`, site-builder skill v2, demo-studio CI |
| 10 | `npm run ship`, Vercel link (`fly-type/demo-studio`), `docs/PRODUCTION.md`, showcase README |
| 11 | Prebuilt deploy, GitHub repo `Linx72/demo-studio`, `github:ship` fallback |
| 12 | `sync-from-template`, `refresh:references`, Vercel Git connect script, reference clone sync |
| 13 | Reference visual baselines (saas/agency), `convex:prod` setup script, Phase 12 ship to GitHub |
| 14 | `convex:init` / `convex:vercel` onboarding, CONVEX.md, template git bootstrap |
| 15 | Reference repos on GitHub, `domain:custom`, CUSTOM-DOMAIN.md |
| 16 | Global agent skills + rules, `factory:health`, `i18n:enable`, CLIENT-SITE.md |
| 17 | Live reference deploys, `client-flowstack` example, `scaffold:client` |
| 18 | `client-flowstack` live, `ship:client`, `LIVE-SITES.md`, factory health URLs |
| 19 | `verify:live`, `stripe:setup`, STRIPE.md, HANDOFF.md, factory-health 45s timeout |
| 20–36 | i18n prod: RU copy, metadata, JsonLd, verify:prod, ship:when-ready, a11y |

Forward plan: [ROADMAP.md](./ROADMAP.md) (v3 — days 11/12/14 done; E–H continue).

## Repositories

| Repo | Purpose |
|------|---------|
| [Linx72/web-motion-starter](https://github.com/Linx72/web-motion-starter) | Template (source of truth) |
| [Linx72/demo-studio](https://github.com/Linx72/demo-studio) | Aurora Labs production showcase |
| [Linx72/site-ref-saas](https://github.com/Linx72/site-ref-saas) | Flowbase preset reference |
| [Linx72/site-ref-agency](https://github.com/Linx72/site-ref-agency) | Northline Studio preset reference |

**Live:** [demo-studio](https://demo-studio-orpin.vercel.app) · [saas](https://site-ref-saas.vercel.app) · [agency](https://site-ref-agency.vercel.app) · [client-flowstack](https://client-flowstack.vercel.app)

Full map: [LIVE-SITES.md](./LIVE-SITES.md)

Push reference clones: `npm run push:references`

## Live showcase

**Production:** https://demo-studio-orpin.vercel.app

```bash
open https://demo-studio-orpin.vercel.app
open https://demo-studio-orpin.vercel.app/opengraph-image
```

Set canonical URL in Vercel (once):

```bash
cd ~/Projects/demo-studio && npm run env:production
```

Or bake into `vercel.json` (reliable for `NEXT_PUBLIC_*`):

```json
"env": { "NEXT_PUBLIC_SITE_URL": "https://demo-studio-orpin.vercel.app" }
```

### Auto-deploy on git push

```bash
cd ~/Projects/demo-studio && bash scripts/connect-vercel-git.sh
# or Vercel Dashboard → Settings → Git → connect Linx72/demo-studio
```

## Social previews (OG / Twitter)

`src/app/opengraph-image.tsx` reads:

- `siteConfig.name` — title
- `siteContent.tagline` / hero eyebrow — subtitle
- `brandTokens.hue` — gradient (Aurora = 195, SaaS = 250)

Verify locally after build: `http://localhost:3000/opengraph-image`

```bash
npm run vercel:setup    # first deploy
npm run deploy:demo-studio   # Aurora showcase from template repo
```

## Content-driven sites (`content/site.json`)

Scaffold and presets write brand copy + nav + section order to `content/site.json`. Components read via `@/lib/site-content`:

| Field | Used by |
|-------|---------|
| `nav` | `SiteHeader` |
| `headerCta` | Header primary button |
| `hero` | `HomePage` → `HeroSection` |
| `sections` | `HomePage` section order |

Edit JSON or preset references — no need to hand-edit `page.tsx` for copy/nav changes.

```bash
npm run quick-start    # install + Playwright chromium
```
