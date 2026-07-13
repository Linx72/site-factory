# Sales / delivery kit

What the Site Factory sells, how fast it ships, and what the client gets.

## Live references

| Preset | URL | Best for |
|--------|-----|----------|
| Template | https://web-motion-starter.vercel.app | Full demo stack |
| **saas** | https://site-ref-saas.vercel.app | PLG / pricing |
| **agency** | https://site-ref-agency.vercel.app | Studio / scroll story |
| **launch** | https://site-ref-launch.vercel.app | Product drop (editorial + compare) |
| **Storefront** | https://site-factory-hq.vercel.app | Sell Flash / Sprint / Build |
| demo-studio | https://demo-studio-orpin.vercel.app | Pitch showcase |

## Offers (time boxes)

| Tier | Time | Deliverable |
|------|------|-------------|
| **Flash** | ~15 min | Scaffold from brief → theme + variants → Vercel URL (no custom copy polish) |
| **Sprint** | ~3 days | Flash + copy pack EN/RU, legal pages, contact/Convex, visual QA, custom domain |
| **Build** | ~2 weeks | Sprint + Stripe, CMS-lite, analytics, Resend notify, multi-page (about/case/blog), brand polish |

## What’s in the box

- Next.js motion stack (Framer / GSAP / Lenis)
- Section + page catalogs, presets, theme packs, variants
- `brief.json` → `scaffold:from-brief` → QA gates → ship
- Optional: Stripe, Convex leads/CMS, i18n, Plausible/Vercel analytics, Resend

## Limits (say upfront)

- Not a custom design system from scratch — start from presets/variants
- CMS is string overrides, not a full CMS
- Visual QA baselines are per-clone; update deliberately
- Client must own Vercel / domain / Stripe / Resend accounts

## Metrics to track

| Metric | How |
|--------|-----|
| Scaffold → ship time | Clock from brief to live URL |
| First-pass QA % | `qa` + visual smoke without rework |
| Live clients | Count production domains on factory stack |

## Pitch path

1. Send this kit + 2–3 live refs matching their vertical
2. Collect brief (`docs/SITE-BRIEF.md` / `brief.json`)
3. Scaffold → copy → QA → `ship:client`
4. Hand off `docs/HANDOFF.md` + env checklist (`npm run prod:services`)

## Related

- [HOW-TO-USE.md](./HOW-TO-USE.md)
- [REFERENCE-SITES.md](./REFERENCE-SITES.md)
- [HANDOFF.md](./HANDOFF.md)
- [ROADMAP.md](./ROADMAP.md) — v3 Phase H complete
