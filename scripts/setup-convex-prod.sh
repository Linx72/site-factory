#!/usr/bin/env bash
#
# setup-convex-prod.sh — Deploy Convex backend to production and print Vercel env steps.
#
# Usage: bash scripts/setup-convex-prod.sh
#
# Prerequisites: npx convex login (or CONVEX_DEPLOY_KEY in CI)
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d convex ]]; then
  echo "✗ No convex/ directory in $ROOT"
  exit 1
fi

echo "→ Deploying Convex to production"
npx convex deploy --yes 2>&1

echo ""
echo "→ Production deployment URL (copy to Vercel):"
npx convex env get CONVEX_CLOUD_URL 2>/dev/null || true

echo ""
echo "Link to Vercel + redeploy:"
echo "  npm run convex:vercel -- https://YOUR-PROD.convex.cloud"
echo ""
echo "Stripe ingest (if checkout enabled):"
echo "  npx convex env set STRIPE_INGEST_SECRET \"<same as .env.local>\" --prod"

DEPLOY_URL=""
if [[ -f .env.local ]]; then
  DEPLOY_URL="$(grep -E '^NEXT_PUBLIC_CONVEX_URL=' .env.local | cut -d= -f2- | tr -d '"' || true)"
fi

echo ""
echo "Set on Vercel (Production):"
echo "  NEXT_PUBLIC_CONVEX_URL=<your production convex URL>"
echo ""
echo "Optional (enable /status seed in prod — dev only recommended):"
echo "  npx convex env set ALLOW_DEV_SEED true --prod"
echo ""
echo "After env change → redeploy:"
echo "  npm run ship   # or git push if Vercel Git connected"
echo ""
if [[ -n "$DEPLOY_URL" ]]; then
  echo "Dev URL from .env.local: $DEPLOY_URL"
  echo "(Production URL may differ — check Convex dashboard)"
fi
