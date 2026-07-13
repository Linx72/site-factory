# Lead notify (Resend)

When someone submits the contact / newsletter form, Convex can email the site owner via [Resend](https://resend.com).

## Flow

```
#contact form → leads.subscribe → scheduler → leadsEmail.notifyOwner → Resend API
```

Skips silently when keys are missing (demo mode) — form still saves to Convex.

## Convex env (not Next.js)

```bash
npx convex env set RESEND_API_KEY re_...
npx convex env set LEADS_NOTIFY_EMAIL you@yourdomain.com
# Optional — verified sender; Resend onboarding default works for tests:
npx convex env set RESEND_FROM_EMAIL "Site Factory <onboarding@resend.dev>"

# Production deployment:
npx convex env set RESEND_API_KEY re_... --prod
npx convex env set LEADS_NOTIFY_EMAIL you@yourdomain.com --prod
```

Also need:

- `NEXT_PUBLIC_CONVEX_URL` on the site
- `siteFeatures.contactForm` true (preset / site-config)

## Next.js lead API (no Convex)

Storefronts can notify via `POST /api/lead` when Resend is on **Vercel** (server env):

```bash
# Vercel → Production env (not Convex)
RESEND_API_KEY=re_...
LEADS_NOTIFY_EMAIL=you@yourdomain.com
RESEND_FROM_EMAIL="Site Factory <onboarding@resend.dev>"
NEXT_PUBLIC_LEAD_API=true
```

Redeploy. Form tries API first; on 503 falls back to mailto.

**One-liner (storefront):**

```bash
RESEND_API_KEY=re_... LEADS_NOTIFY_EMAIL=you@domain.com npm run resend:vercel
npm run deploy:prebuilt
npm run verify:lead-api
```

## Checklist

1. Create account at https://resend.com → API key
2. Set Convex env (dev, then `--prod`)
3. `npm run prod:services` — includes Resend step
4. Submit email on `#contact`
5. Check inbox + Convex logs (`[leads] Resend error` if failed)

## Verify locally

```bash
npm run dev:convex   # terminal 1
npm run dev          # terminal 2
# Set RESEND_* on the anonymous/dev Convex deployment
# Submit #contact → expect email within a few seconds
```

## Code

- `convex/leads.ts` — schedules notify after subscribe
- `convex/leadsEmail.ts` — Resend HTTP call

## Production

See `npm run prod:services` step **3. Resend** and [PRODUCTION.md](../PRODUCTION.md).
