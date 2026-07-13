# Section variants

One section id can render multiple layouts. Copy keys stay shared; only composition changes.

## Content model

In `content/site.json` or `brief.json`:

```json
"variants": {
  "hero": "default",
  "features": "grid",
  "pricing": "cards"
}
```

Omit the whole object (or any key) → defaults = current template UI (no visual change).

Optional shorthand on hero copy object:

```json
"hero": { "variant": "editorial", "title": "…" }
```

`variants.hero` wins over `hero.variant` when both are set.

Code: `src/lib/section-variants.ts` → `getSectionVariants()`.

## Status

| Section | Variants | Status |
|---------|----------|--------|
| `hero` | `default`, `editorial` | ✅ |
| `features` | `grid`, `bento-lite` | ✅ |
| `pricing` | `cards`, `compare` | ✅ |

## Agent rules

1. Prefer `variants` in brief over inventing a new section file.
2. Do not invent variant ids outside this table / SECTION-CATALOG.
3. After changing variants, run visual smoke (375 + 1440) on home.
4. Shared copy: same `Home.hero` / `Home.features` / `Home.pricing` message keys.

## Brief

```bash
npm run verify:brief -- docs/examples/brief-saas.json
# variants validated by schema
```
