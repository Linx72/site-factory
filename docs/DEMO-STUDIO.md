# Aurora Labs — Site Factory showcase

Public demo of the **demo-studio** preset: bento grid, scroll pin story, pricing, and conversion path with Aurora brand (hue 195).

## Quick start

```bash
cd ~/Projects/demo-studio
npm run quick-start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Brand copy lives in `content/site.json` — hero, nav, section order. Edit JSON or refresh from preset:

```bash
node ~/Projects/web-motion-starter/scripts/refresh-preset.mjs demo-studio ~/Projects/demo-studio
```

## Brand tokens

Preset token file: `web-motion-starter/references/tokens/demo-studio.json`

```bash
node scripts/sync-figma-tokens.mjs --input ../web-motion-starter/references/tokens/demo-studio.json
```

Or re-apply preset (syncs palette + tokens):

```bash
node ../web-motion-starter/scripts/refresh-preset.mjs demo-studio .
```

## Visual QA

```bash
npm run playwright:install
npm run qa:visual          # compare snapshots
npm run qa:visual:update   # refresh baselines after intentional UI changes
```

Snapshots: `tests/visual/snapshots/{mobile,tablet,desktop}/home-full.png`

## Deploy (Vercel)

### CI (GitHub)

Workflows in `.github/workflows/`:

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci.yml` | push/PR → `main` | lint, visual QA, build |
| `deploy.yml` | manual / tag `v*` | qa:all → vercel build → prod |

GitHub Actions secrets (from `.vercel/project.json`):

| Secret | Value |
|--------|-------|
| `VERCEL_ORG_ID` | `team_eLgXKhKRbNFeYcGYXl1XQ1PM` |
| `VERCEL_PROJECT_ID` | `prj_m4V9QbPqQc9AHWW83ZwfEHn0Mwj5` |
| `VERCEL_TOKEN` | [Account token](https://vercel.com/account/tokens) |

Push this repo to GitHub and enable Actions before first deploy.

### First-time CLI

```bash
npm run vercel:setup    # vercel link + env checklist
```

Set in Vercel → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_CONVEX_URL` | optional |

### Production deploy

```bash
npm run qa:all && npm run build
vercel --prod
```

Or from template monorepo root:

```bash
cd ~/Projects/web-motion-starter && npm run deploy:demo-studio
```

### Verify production

```bash
curl -sI https://YOUR_URL | head -1
curl -sI https://YOUR_URL/opengraph-image | head -1
```

Check hero title **Motion-first product experiences** and OG image shows **Aurora Labs** on brand hue gradient.

## Convex (optional)

Contact form and `/status` panels activate when `NEXT_PUBLIC_CONVEX_URL` is set:

```bash
npx convex dev
npx convex env set ALLOW_DEV_SEED true
```

Without Convex, build still passes — static mailto fallback on contact, placeholder on `/status`.
