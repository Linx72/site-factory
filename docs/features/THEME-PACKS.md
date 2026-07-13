# Theme packs

Named visual directions beyond hue/chroma knobs. Source: `references/themes/*.json`.

## Apply

```bash
npm run theme:apply -- studio-soft
npm run theme:apply -- product-dark
npm run theme:apply -- editorial-ink
npm run theme:apply -- default   # restore template baseline
```

Optional second arg = project root (for clones / scaffold):

```bash
npm run theme:apply -- studio-soft ~/Projects/my-client
```

## What it writes

| File | Purpose |
|------|---------|
| `src/lib/theme/brand-palette.css` | hue / chroma / lightness |
| `src/lib/theme/theme-pack.css` | surface + radius + heading font stack |
| `src/lib/theme/applied-theme.ts` | id + `defaultColorScheme` for ThemeProvider |
| `src/lib/site-config.ts` | `brandTokens` |
| `content/site.json` | `"theme": "<id>"` |
| `content/theme-applied.json` | audit stamp |

## Packs

| ID | Feel | Default scheme |
|----|------|----------------|
| `default` | Template baseline | system |
| `product-dark` | Cool teal product UI | dark |
| `studio-soft` | Soft sage / mist | light |
| `editorial-ink` | Ink-blue + serif headings | light |

## Anti-slop (agent rules)

Do **not** default new client sites to:

1. Purple-on-white or purple→indigo glow gradients  
2. Warm cream paper (~`#F4F1EA`) + terracotta + high-contrast serif  
3. Broadsheet: hairline rules, zero radius, dense newspaper columns  

`editorial-ink` is **modern magazine** (tight radius, ink blue) — not a broadsheet clone.

Prefer a pack from this table over inventing a new palette in chat.

## Brief / scaffold

```json
"theme": "studio-soft"
```

```bash
npm run scaffold:from-brief -- docs/examples/brief-agency.json
# runs theme:apply when theme ≠ default

~/Projects/scripts/new-web-site.sh my-site --theme studio-soft
```

## Verify

```bash
npm run theme:apply -- studio-soft
npm run dev
# Hero primary + surfaces should shift; toggle theme for darkSurfaces
npm run theme:apply -- default   # restore before committing template
```
