# Stripe checkout (Site Factory)

Optional live pricing checkout on the **Pricing** section. Requires Stripe + Convex.

## Enable

`siteFeatures.stripe` is `true` when `STRIPE_SECRET_KEY` is set.

```bash
# 1. Checklist + generated ingest secret
npm run stripe:setup

# 2. Fill .env.local (see .env.example)

# 3. Convex must be running
npm run convex:init    # if not done
npm run dev:convex     # T1
npm run dev            # T2
```

## Local webhook

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy whsec_... → STRIPE_WEBHOOK_SECRET in .env.local
```

## Env vars

| Variable | Where | Purpose |
|----------|-------|---------|
| `STRIPE_SECRET_KEY` | `.env.local` / Vercel | Server checkout sessions |
| `STRIPE_PRICE_PRO` | `.env.local` / Vercel | Pro plan price ID |
| `STRIPE_PRICE_TEAM` | `.env.local` / Vercel | Team plan price ID |
| `STRIPE_WEBHOOK_SECRET` | `.env.local` / Vercel | Webhook signature verify |
| `STRIPE_INGEST_SECRET` | Next.js + Convex env | Forward events to Convex HTTP |

```bash
npx convex env set STRIPE_INGEST_SECRET "your-secret"
```

## Production

1. Stripe Dashboard → **Live mode** keys + webhook endpoint:
   `https://YOUR_DOMAIN/api/stripe/webhook`
2. `npm run stripe:setup -- --live` — live env checklist
3. Add all vars to Vercel → Production
4. `npx convex env set STRIPE_INGEST_SECRET "..." --prod`
5. Redeploy: `npm run deploy:prebuilt`

**Verify:** `npm run verify:stripe` (warns when demo mode / 503). Set `VERIFY_STRIPE_STRICT=1` when live keys are on Vercel.

**i18n:** Checkout API accepts `locale`; success/cancel URLs use `/ru?checkout=success` when i18n is on.

## Manual verify

- Click **Pro** / **Team** on pricing → Stripe Checkout
- Complete test payment → `/status` shows subscription row

## Code paths

| Path | Role |
|------|------|
| `src/app/api/checkout/route.ts` | Create Checkout session |
| `src/app/api/stripe/webhook/route.ts` | Verify + forward to Convex |
| `convex/http.ts` | Stripe ingest endpoint |
| `convex/subscriptions.ts` | Store subscription state |
