#!/usr/bin/env bash
#
# convex-enable-seed.sh — Enable /status demo seed buttons in Convex env.
#
# Dev by default. Pass --prod only for staging demos (not public production).
#
# Usage:
#   bash scripts/convex-enable-seed.sh
#   bash scripts/convex-enable-seed.sh --prod
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PROD=0
[[ "${1:-}" == "--prod" ]] && PROD=1

if [[ "$PROD" -eq 1 ]]; then
  echo "═══ Convex ALLOW_DEV_SEED (production) ═══"
  echo ""
  echo "! Demo seed on production — use only for internal staging URLs."
  echo ""
  npx convex env set ALLOW_DEV_SEED true --prod
  echo ""
  echo "✓ ALLOW_DEV_SEED=true on production deployment"
  echo "  Open /status → Seed demo buttons"
else
  echo "═══ Convex ALLOW_DEV_SEED (dev) ═══"
  npx convex env set ALLOW_DEV_SEED true
  echo ""
  echo "✓ ALLOW_DEV_SEED=true on dev deployment"
  echo "  http://localhost:3000/status"
fi
