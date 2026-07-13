#!/usr/bin/env bash
#
# set-custom-domain.sh — Point production SITE_URL at a custom domain and redeploy.
#
# Prerequisites:
#   - Domain added in Vercel Dashboard → Project → Settings → Domains
#   - DNS configured per Vercel instructions
#
# Usage: bash scripts/set-custom-domain.sh auroralabs.studio
#        bash scripts/set-custom-domain.sh https://www.example.com
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RAW="${1:-}"
if [[ -z "$RAW" ]]; then
  echo "Usage: set-custom-domain.sh <domain-or-url>"
  echo "Example: set-custom-domain.sh auroralabs.studio"
  exit 1
fi

# Normalize to https URL without trailing slash
if [[ "$RAW" == http://* ]] || [[ "$RAW" == https://* ]]; then
  URL="${RAW%/}"
else
  URL="https://${RAW%/}"
fi

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

echo "═══ Custom domain: $URL ═══"
echo ""
echo "Before continuing, confirm in Vercel Dashboard:"
echo "  Project → Settings → Domains → $URL (or www) is added + DNS verified"
echo ""

VERCEL_JSON="$ROOT/vercel.json"
if [[ -f "$VERCEL_JSON" ]] && command -v node >/dev/null 2>&1; then
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const url = process.argv[2];
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    cfg.env = { ...(cfg.env || {}), NEXT_PUBLIC_SITE_URL: url };
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
    console.log('→ Updated vercel.json NEXT_PUBLIC_SITE_URL');
  " "$VERCEL_JSON" "$URL"
fi

if [[ -f scripts/set-production-env.sh ]]; then
  bash scripts/set-production-env.sh "$URL"
else
  printf '%s' "$URL" | vercel_cmd env add NEXT_PUBLIC_SITE_URL production 2>/dev/null \
    || { vercel_cmd env rm NEXT_PUBLIC_SITE_URL production --yes 2>/dev/null; printf '%s' "$URL" | vercel_cmd env add NEXT_PUBLIC_SITE_URL production; } || true
fi

echo ""
echo "→ Redeploy (prebuilt)"
export NEXT_PUBLIC_SITE_URL="$URL"
if [[ -f scripts/deploy-prebuilt.sh ]]; then
  bash scripts/deploy-prebuilt.sh
else
  vercel_cmd pull --yes --environment=production >/dev/null
  NEXT_PUBLIC_SITE_URL="$URL" vercel_cmd build --prod --yes
  vercel_cmd deploy --prebuilt --prod --yes
fi

echo "✓ Done. Verify:"
echo "  npm run domain:verify -- $URL"
echo "  open $URL"
echo "  curl -sI $URL | head -1"
