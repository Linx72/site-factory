#!/usr/bin/env bash
#
# setup-stripe.sh — Print Stripe + Convex env checklist for live checkout.
#
# Prerequisites: Stripe account, Convex dev running (npm run convex:init)
#
# Usage:
#   bash scripts/setup-stripe.sh
#   bash scripts/setup-stripe.sh --live
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LIVE=0
[[ "${1:-}" == "--live" ]] && LIVE=1

INGEST_SECRET="${STRIPE_INGEST_SECRET:-$(openssl rand -hex 24 2>/dev/null || echo 'change-me-in-production')}"

echo "═══ Stripe setup checklist ═══"
echo ""
if [[ "$LIVE" -eq 1 ]]; then
  echo "Mode: LIVE (production)"
  echo "Webhook endpoint: https://YOUR_DOMAIN/api/stripe/webhook"
  echo ""
  echo "Copy to Vercel Production:"
  cat <<EOF
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_TEAM=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_INGEST_SECRET=$INGEST_SECRET
EOF
else
  echo "Mode: test (local / staging)"
  echo "1. Stripe Dashboard → Products → create Pro + Team prices"
  echo "2. Copy to .env.local:"
  echo ""
  cat <<EOF
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_TEAM=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_INGEST_SECRET=$INGEST_SECRET
EOF
fi
echo ""
echo "3. Local webhook forwarding (separate terminal):"
echo "   stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo ""
echo "4. Convex env (same ingest secret):"
echo "   npx convex env set STRIPE_INGEST_SECRET \"$INGEST_SECRET\""
echo ""
echo "5. Vercel production — add same vars + redeploy"
echo "   STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, STRIPE_PRICE_TEAM,"
echo "   STRIPE_WEBHOOK_SECRET, STRIPE_INGEST_SECRET"
echo "   npm run deploy:prebuilt"
echo ""
echo "6. Verify: npm run verify:stripe  (VERIFY_STRIPE_STRICT=1 when live)"
echo ""
echo "Full guide: docs/features/STRIPE.md"
