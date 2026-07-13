---
name: site-builder
description: >-
  Project-specific site builder for web-motion-starter and its clones. Prefer
  brief.json → scaffold:from-brief → copy:apply → QA gates.
---
# Site builder (this project)

Template **v1.7.0** — see `CHANGELOG.md` and `docs/TEMPLATE-SYNC.md`.

## Preferred flow

```bash
npm run verify:brief -- docs/examples/brief-saas.json
npm run scaffold:from-brief -- docs/examples/brief-saas.json
# move_agent_to_root → ~/Projects/<slug>
# copy pack already applied; extend messages per docs/features/COPY-PACK.md
```

## Variants

```json
"variants": { "hero": "editorial", "features": "bento-lite", "pricing": "compare" }
```

See `docs/features/SECTION-VARIANTS.md`. Prefer variants over inventing section files.

## Themes

```bash
npm run theme:apply -- studio-soft
```

See `docs/features/THEME-PACKS.md`. Anti-slop: no purple glow / cream+terracotta / broadsheet defaults.
## Copy pack

```bash
npm run copy:apply -- content/brief.json
```

Rules: only brief hero/brand auto-applied; do not invent sections; `verify:messages` after RU edits.

## QA gates (must pass before “done”)

1. `npm run qa`
2. `npm run verify:messages` if i18n
3. `npm run qa:visual` or visual smoke
4. `npm run ship:client` / `deploy:prebuilt`
5. Confirm live URL

**Fail any gate → do not claim complete.**

## Key paths

| Path | Purpose |
|------|---------|
| `docs/schemas/brief.schema.json` | Brief contract |
| `docs/features/COPY-PACK.md` | Copy apply rules |
| `docs/TEMPLATE-SYNC.md` | Sync policy |
| `docs/HOW-IT-WORKS.md` | Plain language |
| `scripts/scaffold-from-brief.mjs` | Brief → clone |
| `scripts/apply-copy-pack.mjs` | Hero/brand → messages |

Global skill: `~/.cursor/skills/site-builder/SKILL.md`
