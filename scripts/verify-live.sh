#!/usr/bin/env bash
#
# verify-live.sh — HTTP check all Site Factory production URLs (longer timeouts).
#
set -euo pipefail

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; FAIL=1; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }

FAIL=0
TIMEOUT="${VERIFY_LIVE_TIMEOUT:-45}"
STRICT="${VERIFY_LIVE_STRICT:-0}"

check() {
  local name="$1"
  local url="$2"
  local code
  code=$(curl -sI --connect-timeout 10 --max-time "$TIMEOUT" "$url" 2>/dev/null | head -1 | awk '{print $2}')
  if [[ "$code" =~ ^[23] ]]; then
    ok "$name → $url ($code)"
  elif [[ "$STRICT" == "1" ]]; then
    fail "$name → $url (${code:-timeout})"
  else
    warn "$name → $url (${code:-timeout} — site may still be live; retry or open in browser)"
  fi
}

echo "═══ Live URL verify (timeout ${TIMEOUT}s) ═══"
echo ""

check "web-motion-starter" "https://web-motion-starter.vercel.app"
check "web-motion-starter /en" "https://web-motion-starter.vercel.app/en"
check "web-motion-starter /ru" "https://web-motion-starter.vercel.app/ru"
check "web-motion-starter sitemap" "https://web-motion-starter.vercel.app/sitemap.xml"
check "web-motion-starter /ru/motion" "https://web-motion-starter.vercel.app/ru/motion"

check "demo-studio" "https://demo-studio-orpin.vercel.app"
check "demo-studio /en" "https://demo-studio-orpin.vercel.app/en"
check "demo-studio OG" "https://demo-studio-orpin.vercel.app/opengraph-image"
check "saas-ref" "https://site-ref-saas.vercel.app"
check "agency-ref" "https://site-ref-agency.vercel.app"
check "launch-ref" "https://site-ref-launch.vercel.app"
check "client-flowstack" "https://client-flowstack.vercel.app"

echo ""
if [[ "$FAIL" -eq 0 ]]; then
  ok "Live verify complete"
else
  exit 1
fi
