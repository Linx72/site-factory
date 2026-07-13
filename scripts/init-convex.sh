#!/usr/bin/env bash
#
# init-convex.sh — One-time Convex setup for Site Factory clones.
#
# Prerequisites: npx convex login (interactive, once per machine)
#
# Usage:
#   bash scripts/init-convex.sh           # configure dev deployment
#   bash scripts/init-convex.sh --prod    # deploy prod + print Vercel steps
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PROD=0
[[ "${1:-}" == "--prod" ]] && PROD=1

PKG_NAME="$(node -p "require('./package.json').name" 2>/dev/null || echo site")"

echo "═══ Convex init: $PKG_NAME ═══"

if [[ ! -d convex ]]; then
  echo "✗ No convex/ directory"
  exit 1
fi

convex_needs_login() {
  local out
  out="$(npx convex project create 2>&1 || true)"
  echo "$out" | grep -qi "requires logging in"
}

if convex_needs_login; then
  echo ""
  echo "→ Log in first:"
  echo "  npx convex login"
  echo ""
  echo "Then: bash scripts/init-convex.sh"
  exit 1
fi

if [[ "$PROD" -eq 0 ]]; then
  echo ""
  echo "→ Configuring dev deployment (convex.json + .env.local)"
  npx convex dev --configure new --once

  echo ""
  echo "→ Enabling /status seed (dev)"
  npx convex env set ALLOW_DEV_SEED true 2>/dev/null || true

  echo ""
  echo "✓ Dev ready."
  echo "  T1: npm run dev:convex"
  echo "  T2: npm run dev"
  echo "  → http://localhost:3000/status"
  echo ""
  echo "Production: bash scripts/init-convex.sh --prod"
  exit 0
fi

if [[ ! -f convex.json ]] && [[ ! -f .env.local ]]; then
  echo "✗ Run dev setup first: bash scripts/init-convex.sh"
  exit 1
fi

echo ""
echo "→ Deploying production"
npx convex deploy --yes

echo ""
echo "✓ Production deployed."
echo ""
echo "Set on Vercel:"
echo "  NEXT_PUBLIC_CONVEX_URL=<production URL from Convex dashboard>"
echo ""
echo "Quick link:"
echo "  npm run convex:vercel -- https://YOUR-PROD.convex.cloud"
echo ""
echo "Redeploy: npm run ship"
