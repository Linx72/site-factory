# Reference site presets

Curated section + brand + **theme** + **variant** combinations for common site types. Agents copy these instead of guessing layout.

## Presets

| Preset | Project name | Theme | Variants | Sections focus |
|--------|--------------|-------|----------|----------------|
| **saas** | `site-ref-saas` | `product-dark` | features=`bento-lite`, pricing=`compare` | logos, bento, pricing, testimonials, faq |
| **agency** | `site-ref-agency` | `studio-soft` | hero=`editorial` | scroll-story, timeline, team, contact |
| **launch** | `site-ref-launch` | `editorial-ink` | hero=`editorial`, features=`bento-lite`, pricing=`compare` | features, pricing, faq, contact + privacy/terms |
| **demo-studio** | `demo-studio` | (custom) | — | bento, scroll-story, pricing, full funnel |

JSON files: `references/saas.json`, `references/agency.json`, `references/launch.json`, `references/demo-studio.json`

Theme packs: `references/themes/*.json` — see [THEME-PACKS.md](./features/THEME-PACKS.md)  
Variants: [SECTION-VARIANTS.md](./features/SECTION-VARIANTS.md)

Token files: `references/tokens/{preset}.json` — synced on preset apply via `sync-figma-tokens.mjs`

## Live deployments

| Preset | Vercel URL | GitHub |
|--------|------------|--------|
| **saas** (Flowbase) | https://site-ref-saas.vercel.app | [Linx72/site-ref-saas](https://github.com/Linx72/site-ref-saas) |
| **agency** (Northline) | https://site-ref-agency.vercel.app | [Linx72/site-ref-agency](https://github.com/Linx72/site-ref-agency) |
| **launch** (Launchpad) | https://site-ref-launch.vercel.app | [Linx72/site-ref-launch](https://github.com/Linx72/site-ref-launch) |
| **demo-studio** (Aurora) | https://demo-studio-orpin.vercel.app | [Linx72/demo-studio](https://github.com/Linx72/demo-studio) |

Deploy / refresh:

```bash
npm run refresh:references         # sync template + re-apply preset (theme + variants)
npm run snapshots:references       # update Playwright baselines deliberately
npm run deploy:references          # saas + agency → Vercel prod
```

## Scaffold with preset

```bash
~/Projects/scripts/new-web-site.sh site-ref-saas --preset saas
~/Projects/scripts/new-web-site.sh site-ref-agency --preset agency
~/Projects/scripts/new-web-site.sh site-ref-launch --preset launch
~/Projects/scripts/new-web-site.sh demo-studio --preset demo-studio
```

Or bootstrap from starter:

```bash
cd ~/Projects/web-motion-starter
npm run scaffold:references
```

`apply-preset` writes `theme` + `variants` (+ `pages` when set) into `content/site.json` and runs `theme:apply` when theme ≠ `default`.

## Refresh existing clone

After updating preset JSON in the template repo:

```bash
node ~/Projects/web-motion-starter/scripts/refresh-preset.mjs saas ~/Projects/site-ref-saas
node ~/Projects/web-motion-starter/scripts/refresh-preset.mjs agency ~/Projects/site-ref-agency
node ~/Projects/web-motion-starter/scripts/refresh-preset.mjs launch ~/Projects/site-ref-launch
node ~/Projects/web-motion-starter/scripts/refresh-preset.mjs demo-studio ~/Projects/demo-studio
```

Updates `site-config.ts`, `content/site.json` (hero + nav + sections + theme + variants + pages), `page.tsx`, brand palette, theme pack, and Figma token CSS.

## Sync template code into existing clone

When the **template** gains new sections, OG, scripts, or Convex functions — pull code without rescaffolding:

```bash
# From template root — sync one project
npm run sync:clone -- ~/Projects/site-ref-saas
npm run sync:clone -- ~/Projects/demo-studio --refresh-preset

# Refresh both reference presets (saas + agency)
npm run refresh:references
```

**Preserved** (not overwritten): `content/site.json`, `site-config.ts`, `brand-palette.css`, `README.md`, `vercel.json`, visual snapshots, `.env*`.

Use `--refresh-preset` (via `refresh:references`) to re-apply theme/variants after sync.

After sync: `npm install && npm run qa` in the clone.

## GitHub (reference clones)

```bash
cd ~/Projects/web-motion-starter
npm run push:references
```

Creates private repos `Linx72/site-ref-saas` and `Linx72/site-ref-agency` if missing.

## Visual baselines (reference clones)

Each preset clone keeps its own snapshots under `tests/visual/snapshots/`:

```bash
# After preset or section / theme / variant changes — update deliberately
npm run snapshots:references

# Or per project
cd ~/Projects/site-ref-saas && npm run qa:visual:update
cd ~/Projects/site-ref-agency && npm run qa:visual:update
npm run qa:visual   # verify
```

## What presets override

- `site-config.ts` — title, description, `siteFeatures`
- `content/site.json` — nav, hero copy, section order, header CTA, **theme**, **variants**, **pages**
- `brand-palette.css` + `theme-pack.css` — via `theme:apply` when preset.theme is set
- `figma-sync.css` — from `references/tokens/{preset}.json`
- `src/app/page.tsx` — HomePage + siteContent
- `README.md` — preset label + theme/variants

## When to use which

**SaaS (`saas`)** — product landing, PLG, pricing compare matrix, bento-lite features, `product-dark` theme. No contact section by default; add `contact` if needed.

**Agency (`agency`)** — portfolio/studio, `studio-soft` + editorial hero, scroll pin story and team. Contact uses Convex when `NEXT_PUBLIC_CONVEX_URL` is set.

**Launch (`launch`)** — product drop / waitlist: `editorial-ink`, editorial hero, bento-lite + pricing compare, FAQ, contact, privacy/terms pages.

**Demo studio (`demo-studio`)** — client pitch showcase. See [DEMO-STUDIO.md](./DEMO-STUDIO.md).

## Customize

1. Scaffold or refresh from preset
2. Edit `content/site.json` for copy/nav/variants (preferred) or section TSX for deep customization
3. `npm run theme:apply -- <id>` to switch packs
4. `npm run sync:tokens` if Figma variables exist
5. `npm run qa:visual` before deploy

## Verify reference clone

```bash
cd ~/Projects/demo-studio
npm run quick-start && npm run dev
npm run qa:visual
```
