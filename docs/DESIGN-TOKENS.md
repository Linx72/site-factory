# Design tokens

Single source of truth for brand and motion. Figma variables sync into CSS; TypeScript mirrors motion timing.

## Layers

| Layer | File | Purpose |
|-------|------|---------|
| Brand OKLCH | `src/lib/theme/brand-palette.css` | `--brand-hue`, `--brand-chroma`, primary/accent |
| Motion CSS | `src/app/globals.css` | `--motion-duration-*`, `--motion-ease-out` |
| Motion TS | `src/lib/motion/tokens.ts` | Framer/GSAP shared durations |
| Figma sync (optional) | `src/lib/theme/figma-sync.css` | Radius overrides from Figma |

Import order in `globals.css`: shadcn → `brand-palette.css` → (optional) `figma-sync.css`.

## Manual brand edit

Edit `src/lib/theme/brand-palette.css`:

```css
:root {
  --brand-hue: 220;      /* 0–360 OKLCH hue */
  --brand-chroma: 0.16;
  --brand-lightness: 0.48;
}
```

Or scaffold flag: `new-web-site.sh ... --brand-hue 220 --brand-chroma 0.16`

## Theme packs

Named directions (surfaces + brand + default scheme):

```bash
npm run theme:apply -- studio-soft
```

See [features/THEME-PACKS.md](./features/THEME-PACKS.md). Prefer a pack over inventing purple/cream palettes.

## Figma → CSS sync

### 1. Export variables from Figma (agent)

In Cursor with Figma MCP connected:

```
get_variable_defs(fileKey="...", nodeId="...")
```

Save JSON to `tokens/figma-variables.json` (see `tokens/figma-variables.example.json` for shape).

### 2. Run sync

```bash
npm run sync:tokens
# or
node scripts/sync-figma-tokens.mjs --input tokens/figma-variables.json
# CLI only:
node scripts/sync-figma-tokens.mjs --hue 210 --chroma 0.15
```

### 3. Supported variable names (aliases)

| Figma name | Maps to |
|------------|---------|
| `brand/hue`, `brand-hue` | `--brand-hue` |
| `brand/chroma` | `--brand-chroma` |
| `brand/lightness` | `--brand-lightness` |
| `corner/radius`, `radius` | `--radius` in `figma-sync.css` |

### 4. Verify

```bash
npm run dev
# Toggle dark mode — primary/accent should follow brand hue
```

## Rules for agents

- No raw hex in TSX for brand colors — use `bg-primary`, `text-muted-foreground`, CSS vars
- Keep `motionTokens` and `globals.css` motion vars in sync when changing durations
- After Figma sync, run visual QA on hero + one accent-heavy section
