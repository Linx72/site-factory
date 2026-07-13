#!/usr/bin/env bash
#
# setup-resend-vercel.sh — set Resend + lead API env on Vercel Production (storefront, no Convex).
#
# Usage:
#   RESEND_API_KEY=re_... LEADS_NOTIFY_EMAIL=you@domain.com bash scripts/setup-resend-vercel.sh
#   npm run resend:vercel
#
# After this script: npm run deploy:prebuilt (or wait for main → Deploy workflow).
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; exit 1; }

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

SCOPE="${VERCEL_SCOPE:-fly-type}"
API_KEY="${RESEND_API_KEY:-}"
NOTIFY="${LEADS_NOTIFY_EMAIL:-}"
FROM="${RESEND_FROM_EMAIL:-Site Factory <onboarding@resend.dev>}"

if [[ -z "$API_KEY" ]]; then
  read -r -p "RESEND_API_KEY (re_...): " API_KEY
fi
if [[ -z "$NOTIFY" ]]; then
  read -r -p "LEADS_NOTIFY_EMAIL: " NOTIFY
fi

[[ -n "$API_KEY" ]] || die "RESEND_API_KEY required"
[[ -n "$NOTIFY" ]] || die "LEADS_NOTIFY_EMAIL required"

if [[ ! -f .vercel/project.json ]]; then
  log "Linking Vercel project (scope $SCOPE)"
  vercel_cmd link --yes --scope "$SCOPE"
fi

add_env() {
  local name="$1"
  local value="$2"
  local public="${3:-0}"
  log "Vercel env: $name (production)"
  if [[ "$public" == "1" ]]; then
    printf '%s' "$value" | vercel_cmd env add "$name" production --force --scope "$SCOPE"
  else
    printf '%s' "$value" | vercel_cmd env add "$name" production --force --scope "$SCOPE"
  fi
}

add_env RESEND_API_KEY "$API_KEY"
add_env LEADS_NOTIFY_EMAIL "$NOTIFY"
add_env RESEND_FROM_EMAIL "$FROM"
add_env NEXT_PUBLIC_LEAD_API "true" 1

ok "Resend env set on Vercel Production"
echo ""
echo "Next:"
echo "  npm run deploy:prebuilt"
echo "  npm run verify:lead-api   # expect 200 after Resend is live"
echo ""
echo "Docs: docs/features/RESEND.md"
