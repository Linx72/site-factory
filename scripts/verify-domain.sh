#!/usr/bin/env bash
#
# verify-domain.sh — HTTP + storefront smoke (no i18n).
#
# Usage:
#   npm run domain:verify -- https://site-factory-hq.vercel.app
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

URL="${1:-${VERIFY_PROD_URL:-https://site-factory-hq.vercel.app}}"
URL="${URL%/}"

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; exit 1; }

echo "═══ Domain smoke: $URL ═══"
echo ""

code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 15 --max-time 45 "$URL" 2>/dev/null || true)
code="${code:-000}"
if [[ "$code" =~ ^[23] ]]; then
  ok "Home HTTP $code"
else
  fail "Home unreachable (HTTP $code)"
fi

og_code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 15 --max-time 45 "$URL/opengraph-image" 2>/dev/null || true)
og_code="${og_code:-000}"
if [[ "$og_code" =~ ^[23] ]]; then
  ok "OpenGraph image HTTP $og_code"
else
  warn "OpenGraph image HTTP $og_code"
fi

sitemap_code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 15 --max-time 45 "$URL/sitemap.xml" 2>/dev/null || true)
if [[ "${sitemap_code:-000}" =~ ^[23] ]]; then
  ok "Sitemap HTTP $sitemap_code"
else
  warn "Sitemap HTTP ${sitemap_code:-timeout}"
fi

echo ""
echo "→ Storefront content smoke"
if VERIFY_STOREFRONT_URL="$URL" npm run verify:storefront; then
  ok "Storefront smoke passed for $URL"
else
  warn "Storefront smoke failed — CDN may still be propagating"
  exit 1
fi
