#!/usr/bin/env bash
#
# verify-domain.sh — HTTP + i18n smoke for a production URL (custom or Vercel).
#
# Usage:
#   npm run domain:verify -- https://example.com
#   VERIFY_PROD_URL=https://example.com npm run domain:verify
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

URL="${1:-${VERIFY_PROD_URL:-https://web-motion-starter.vercel.app}}"
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

if [[ -n "${SKIP_I18N_VERIFY:-}" ]]; then
  warn "SKIP_I18N_VERIFY set — skipping prod i18n"
  exit 0
fi

echo ""
echo "→ i18n prod smoke"
if VERIFY_PROD_URL="$URL" npm run verify:prod; then
  ok "i18n smoke passed for $URL"
else
  warn "i18n smoke failed — CDN/DNS may still be propagating"
  exit 1
fi
