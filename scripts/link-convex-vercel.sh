#!/usr/bin/env bash
#
# link-convex-vercel.sh — Set NEXT_PUBLIC_CONVEX_URL on Vercel and redeploy.
#
# Usage: bash scripts/link-convex-vercel.sh https://your-prod.convex.cloud
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

URL="${1:-}"
if [[ -z "$URL" ]]; then
  echo "Usage: link-convex-vercel.sh <NEXT_PUBLIC_CONVEX_URL>"
  exit 1
fi

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

echo "→ Setting NEXT_PUBLIC_CONVEX_URL=$URL (production)"

VERCEL_JSON="$ROOT/vercel.json"
if [[ -f "$VERCEL_JSON" ]] && command -v node >/dev/null 2>&1; then
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const url = process.argv[2];
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    cfg.env = { ...(cfg.env || {}), NEXT_PUBLIC_CONVEX_URL: url };
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
    console.log('  Updated vercel.json');
  " "$VERCEL_JSON" "$URL"
fi

printf '%s' "$URL" | vercel_cmd env add NEXT_PUBLIC_CONVEX_URL production 2>/dev/null \
  || { vercel_cmd env rm NEXT_PUBLIC_CONVEX_URL production --yes 2>/dev/null; printf '%s' "$URL" | vercel_cmd env add NEXT_PUBLIC_CONVEX_URL production; } || true

echo "→ Redeploy (prebuilt)"
vercel_cmd pull --yes --environment=production >/dev/null
vercel_cmd build --prod --yes
vercel_cmd deploy --prebuilt --prod --yes

echo "✓ Done. Verify: open /status on your production URL"
