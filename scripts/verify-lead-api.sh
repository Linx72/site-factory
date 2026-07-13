#!/usr/bin/env bash
#
# verify-lead-api.sh — smoke POST /api/lead (503 ok without Resend; 200 when configured).
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE="$(bash "$ROOT/scripts/resolve-storefront-url.sh")"
BASE="${BASE%/}"

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }

echo "═══ Lead API smoke ($BASE/api/lead) ═══"

body='{"email":"smoke-test@example.com","brief":"verify-lead-api smoke"}'
out=$(curl -sS --connect-timeout 15 --max-time 30 -X POST "$BASE/api/lead" \
  -H "Content-Type: application/json" \
  -d "$body" 2>/dev/null || echo '{"error":"timeout"}')

code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 15 --max-time 30 -X POST "$BASE/api/lead" \
  -H "Content-Type: application/json" \
  -d "$body" 2>/dev/null || echo "000")

echo "Response ($code): $out"

if [[ "$code" == "200" ]]; then
  ok "Lead API live — Resend configured"
elif [[ "$code" == "503" ]]; then
  ok "Lead API reachable — mailto fallback (set RESEND_* + NEXT_PUBLIC_LEAD_API=true)"
else
  warn "Unexpected status $code"
  exit 1
fi
