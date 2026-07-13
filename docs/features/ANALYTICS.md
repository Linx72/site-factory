# Analytics (feature flag)

One env var enables privacy-friendly analytics without touching sections.

## Enable

```bash
# .env.local / Vercel Production
NEXT_PUBLIC_ANALYTICS=none      # default — no scripts
NEXT_PUBLIC_ANALYTICS=vercel    # @vercel/analytics (Web Analytics on Vercel)
NEXT_PUBLIC_ANALYTICS=plausible # Plausible script
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com   # required for plausible
```

`siteFeatures.analytics` mirrors the resolved provider (`none` | `plausible` | `vercel`).

## Behavior

| Value | Script | Notes |
|-------|--------|-------|
| `none` / empty / unknown | — | Zero network calls |
| `vercel` | `@vercel/analytics` | Enable **Web Analytics** in the Vercel project |
| `plausible` | `plausible.io/js/script.js` | Needs `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (hostname only) |

Toggle by changing env and redeploying (or restarting `next dev`). No section rebuilds.

## Code

- Resolver: `src/lib/analytics.ts`
- Inject: `AnalyticsScripts` in root `layout.tsx`

## Verify

```bash
# none — page source has no plausible / va scripts
NEXT_PUBLIC_ANALYTICS=none npm run dev

# vercel — look for /_vercel/insights in network after deploy
NEXT_PUBLIC_ANALYTICS=vercel npm run deploy:prebuilt

# plausible — script tag with data-domain=
NEXT_PUBLIC_ANALYTICS=plausible \
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com \
npm run dev
```

## Privacy

Privacy copy already mentions analytics only when a flag is enabled. Prefer Plausible or Vercel over third-party ad trackers.
