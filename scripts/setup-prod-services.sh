#!/usr/bin/env bash
#
# setup-prod-services.sh — Print production onboarding for Convex + Stripe + Resend.
#
# Does not write secrets — run individual scripts after filling dashboards.
#
# Usage:
#   bash scripts/setup-prod-services.sh
#   bash scripts/setup-prod-services.sh --stripe-live
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LIVE=0
[[ "${1:-}" == "--stripe-live" ]] && LIVE=1

echo "═══ Production services checklist ═══"
echo ""
echo "1. Convex (contact, /status, CMS)"
echo "   npx convex login"
echo "   npm run convex:init -- --prod"
echo "   npm run convex:vercel -- https://YOUR-PROD.convex.cloud"
echo "   Optional seed on staging only: npm run convex:seed -- --prod"
echo "   Prod: do NOT set ALLOW_DEV_SEED (keeps CMS editor locked)"
echo ""
echo "2. Stripe (paid pricing checkout)"
if [[ "$LIVE" -eq 1 ]]; then
  echo "   Stripe Dashboard → Live mode"
  echo "   Webhook: https://YOUR_DOMAIN/api/stripe/webhook"
  echo "   Keys: sk_live_..., price_..., whsec_..."
else
  echo "   npm run stripe:setup   # test keys checklist"
fi
echo "   Vercel Production env: STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_TEAM,"
echo "                          STRIPE_WEBHOOK_SECRET, STRIPE_INGEST_SECRET"
echo "   npx convex env set STRIPE_INGEST_SECRET \"...\" --prod"
echo "   npm run deploy:prebuilt"
echo ""
echo "3. Resend (lead notify email)"
echo "   https://resend.com → API key"
echo "   npx convex env set RESEND_API_KEY re_... --prod"
echo "   npx convex env set LEADS_NOTIFY_EMAIL you@domain.com --prod"
echo "   npx convex env set RESEND_FROM_EMAIL \"Brand <onboarding@resend.dev>\" --prod"
echo "   Submit #contact → check inbox (docs/features/RESEND.md)"
echo ""
echo "4. Analytics (optional)"
echo "   NEXT_PUBLIC_ANALYTICS=vercel|plausible|none   # docs/features/ANALYTICS.md"
echo "   For plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com"
echo ""
echo "5. Verify"
echo "   npm run verify:all"
echo "   npm run domain:verify -- https://YOUR_DOMAIN  # after custom domain"
echo ""
echo "Guides:"
echo "  docs/features/CONVEX.md"
echo "  docs/features/STRIPE.md"
echo "  docs/features/RESEND.md"
echo "  docs/features/ANALYTICS.md"
echo "  docs/features/CMS.md"
echo "  docs/PRODUCTION.md"
