# Template sync policy

How clones stay aligned with `web-motion-starter` without losing client work.

## Version

Template version lives in `package.json` (`version` field).  
See [CHANGELOG.md](../CHANGELOG.md) for breaking changes.

```bash
# In a clone — check what you were scaffolded from
grep '"version"' package.json
```

## What `npm run sync:clone` pulls

Typically:

- `src/components/**` (sections, motion, UI)
- `src/lib/motion/**`, shared i18n helpers
- `scripts/**` (verify, ship, scaffold tools)
- Docs under `docs/` (optional — prefer reading template docs)

## What sync must **not** overwrite

| Path | Why |
|------|-----|
| `content/site.json` | Client nav / sections / hero |
| `content/brief.json` | Client brief |
| `messages/*.json` | Localized copy |
| `src/lib/theme/brand-palette.css` | Brand hue/chroma |
| `src/lib/site-config.ts` | Name / feature defaults (review manually if needed) |
| `tests/visual/**/*-snapshots/**` | Baselines for this brand |
| `.env*`, `.vercel/` | Secrets / link |

If `sync-from-template.mjs` ever gains flags, keep the same preserve list.

## When to sync

1. Template tagged a new **minor/major** with fixes you need.
2. After reading CHANGELOG for breaking steps (e.g. new message keys → run `verify:messages`).
3. Prefer: sync on a branch → `npm run qa` → visual review → merge.

## After sync checklist

```bash
npm install
npm run qa
npm run verify:messages   # if i18n
npm run qa:visual         # expect intentional diffs; update snapshots only deliberately
```

## Breaking-change policy

- **Patch** (1.0.x): safe sync for most clones.
- **Minor** (1.x.0): new optional sections/scripts; verify messages parity.
- **Major** (2.0.0): read CHANGELOG migration notes before sync.

## Scaffold from a known version

```bash
cd ~/Projects/web-motion-starter
git checkout v1.0.0   # optional pin
npm run scaffold:from-brief -- path/to/brief.json
```

Clones record `content/brief-applied.json` with timestamp; template version is whatever was in `package.json` at scaffold time.
