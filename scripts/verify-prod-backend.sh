#!/usr/bin/env bash
#
# verify-prod-backend.sh — smoke-check Convex wiring on production /status.
#
# Warns when NEXT_PUBLIC_CONVEX_URL is missing; passes when live panels render.
# Set VERIFY_BACKEND_STRICT=1 to fail when Convex is not configured.
#
set -euo pipefail

BASE="${VERIFY_PROD_URL:-https://web-motion-starter.vercel.app}"
TIMEOUT="${VERIFY_PROD_TIMEOUT:-60}"
RETRIES="${VERIFY_PROD_RETRIES:-5}"
RETRY_DELAY="${VERIFY_PROD_RETRY_DELAY:-5}"
STRICT="${VERIFY_BACKEND_STRICT:-0}"
FAIL=0

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; FAIL=1; }

fetch() {
  curl -sL --compressed --connect-timeout 15 --max-time "$TIMEOUT" \
    -H "Accept-Language: ru,en;q=0.8" \
    "$1" 2>/dev/null || true
}

echo "═══ Prod backend smoke ($BASE/status, ${RETRIES}x retry) ═══"
echo ""

html=""
attempt=1
while [[ "$attempt" -le "$RETRIES" ]]; do
  html=$(fetch "$BASE/ru/status")
  if [[ -n "$html" ]]; then
    break
  fi
  if [[ "$attempt" -lt "$RETRIES" ]]; then
    sleep "$RETRY_DELAY"
  fi
  attempt=$((attempt + 1))
done

if [[ -z "$html" ]]; then
  fail "/ru/status empty or timeout after ${RETRIES} tries"
  exit 1
fi

if echo "$html" | grep -qF "Бэкенд в реальном времени"; then
  ok "Convex live — subscription panel on /ru/status"
elif echo "$html" | grep -qF "Convex не настроен для этой сборки"; then
  warn "Convex not configured — set NEXT_PUBLIC_CONVEX_URL on Vercel and redeploy"
  warn "Setup: npx convex login → npm run convex:init -- --prod → npm run convex:vercel -- <URL>"
  if [[ "$STRICT" -eq 1 ]]; then
    exit 1
  fi
  exit 0
else
  fail "Unexpected /ru/status — neither Convex disabled nor live panel copy"
  exit 1
fi

if echo "$html" | grep -qF "Подписчики рассылки"; then
  ok "Leads panel copy present"
else
  fail "Leads panel copy missing on /ru/status"
fi

echo ""
if [[ "$FAIL" -eq 0 ]]; then
  ok "Prod backend smoke passed"
else
  exit 1
fi
