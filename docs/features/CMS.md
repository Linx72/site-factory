# CMS-lite (Convex)

Editable marketing strings stored in Convex — overrides section defaults when enabled.

## Enable

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210   # from npx convex dev
NEXT_PUBLIC_CMS=true
```

`siteFeatures.cms` requires **both** flags.

## Write policy (safe by default)

| Convex env | `/status` editor | Seed buttons | Mutations |
|------------|------------------|--------------|-----------|
| `ALLOW_DEV_SEED` unset / false | **Hidden** | **Hidden** | Reject writes |
| `ALLOW_DEV_SEED=true` | Visible | Visible | Allowed |

**Production:** leave `ALLOW_DEV_SEED` unset so clients cannot edit or seed by accident.

```bash
# Local / staging only
npx convex env set ALLOW_DEV_SEED true
# Prod — ensure it is unset:
# npx convex env unset ALLOW_DEV_SEED --prod
```

`cms.canEdit` query drives the UI; `cms.upsert` / `cms.seedDemo` still enforce the same flag server-side.

## Schema

Table `cmsContent`:

| Field | Type | Notes |
|-------|------|-------|
| `key` | string | e.g. `home.hero.title` |
| `locale` | string | `en`, `ru`, … |
| `value` | string | Plain text |
| `updatedAt` | number | ms timestamp |

Index: `by_key_locale` on `[key, locale]`.

## Keys

Defined in `src/lib/cms/keys.ts`. Wired to **HeroSection** and **CtaSection**:

- `home.hero.eyebrow`
- `home.hero.title`
- `home.hero.description`
- `home.cta.title`
- `home.cta.description`

## Client usage

```typescript
import { useCmsString } from "@/lib/cms/use-cms-string";
import { cmsKeys } from "@/lib/cms/keys";

const title = useCmsString(cmsKeys.hero.title, fallback, locale);
```

## Status UX

On `/status` (when Convex is linked):

1. Read-only list of recent CMS rows (always)
2. **Open home preview** — jump to `/` (or `/[locale]`) to see overrides
3. Editor + seed — only when `ALLOW_DEV_SEED=true`

## Seed demo content

```bash
npx convex dev
npx convex env set ALLOW_DEV_SEED true
```

Call `cms.seedDemo` from Convex dashboard, **/status → Seed demo CMS**, or with `ALLOW_DEV_SEED=true`.

Demo overrides hero title (RU: «из CMS Convex»).

## Queries / mutations

| Function | Purpose |
|----------|---------|
| `cms.get` | Single key + locale |
| `cms.listRecent` | Last 8 rows (status UI) |
| `cms.canEdit` | `{ canWrite }` from `ALLOW_DEV_SEED` |
| `cms.upsert` | Dev write from /status editor |
| `cms.seedDemo` | Demo rows |

## Verify

```bash
npm run dev:convex   # terminal 1
NEXT_PUBLIC_CMS=true npm run dev   # terminal 2
# Without ALLOW_DEV_SEED: editor hidden, banner explains lock
# With ALLOW_DEV_SEED=true: Seed CMS → hero title from Convex on home
```

## Extend

1. Add keys to `cmsKeys`
2. Use `useCmsString` in target section
3. Seed or insert via Convex dashboard

Future: auth-gated admin UI — keep `ALLOW_DEV_SEED` off in production until then.
