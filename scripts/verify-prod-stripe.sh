#!/usr/bin/env bash
#
# verify-prod-stripe.sh — smoke-check Stripe checkout API on production.
#
# Warns when STRIPE_SECRET_KEY / price IDs are missing (503 demo mode).
# Set VERIFY_STRIPE_STRICT=1 to fail CI when Stripe is not configured.
#
set -euo pipefail

BASE="${VERIFY_PROD_URL:-https://web-motion-starter.vercel.app}"
TIMEOUT="${VERIFY_PROD_TIMEOUT:-30}"
RETRIES="${VERIFY_PROD_RETRIES:-3}"
RETRY_DELAY="${VERIFY_PROD_RETRY_DELAY:-4}"
STRICT="${VERIFY_STRIPE_STRICT:-0}"

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; exit 1; }

checkout_post() {
  local payload="$1"
  curl -sS --connect-timeout 10 --max-time "$TIMEOUT" \
    -w "\n%{http_code}" \
    -X POST "$BASE/api/checkout" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>/dev/null || echo -e "\n000"
}

echo "═══ Prod Stripe smoke ($BASE/api/checkout, ${RETRIES}x retry) ═══"
echo ""

attempt=1
body=""
code=""

while [[ "$attempt" -le "$RETRIES" ]]; do
  response=$(checkout_post '{"planId":"pro"}')
  code="${response##*$'\n'}"
  body="${response%$'\n'*}"

  if [[ "$code" != "000" && -n "$body" ]]; then
    break
  fi
  if [[ "$attempt" -lt "$RETRIES" ]]; then
    sleep "$RETRY_DELAY"
  fi
  attempt=$((attempt + 1))
done

if [[ "$code" == "000" || -z "$body" ]]; then
  fail "Checkout API unreachable after ${RETRIES} tries"
fi

if [[ "$code" == "503" ]] && echo "$body" | grep -qE 'Stripe (is )?not configured|Stripe не настроен'; then
  warn "Stripe not configured — add STRIPE_SECRET_KEY + price IDs on Vercel"
  warn "Setup: npm run stripe:setup → Vercel env → npm run deploy:prebuilt"

  ru_response=$(checkout_post '{"planId":"pro","locale":"ru"}')
  ru_body="${ru_response%$'\n'*}"
  if echo "$ru_body" | grep -qF "Stripe не настроен"; then
    ok "Checkout API returns RU errors when locale=ru"
  else
    fail "Checkout API missing RU error payload: $ru_body"
  fi

  if [[ "$STRICT" -eq 1 ]]; then
    exit 1
  fi
  exit 0
fi

if [[ "$code" == "200" ]] && echo "$body" | grep -qF '"url"'; then
  ok "Stripe live — checkout session URL returned for Pro plan"
  exit 0
fi

fail "Unexpected checkout response (HTTP $code): $body"
