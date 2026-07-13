#!/usr/bin/env bash
#
# verify-alias.sh — ensure site-factory-hq responds; recreate alias if needed.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ALIAS="${STOREFRONT_ALIAS:-site-factory-hq.vercel.app}"
DEPLOY_URL="${1:-}"
SCOPE="${VERCEL_SCOPE:-fly-type}"

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }

probe() {
  local url="$1"
  local code
  code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 10 --max-time 20 "https://$url" 2>/dev/null || true)
  [[ "$code" =~ ^[23] ]]
}

if probe "$ALIAS"; then
  ok "Alias https://$ALIAS responds"
  exit 0
fi

warn "Alias https://$ALIAS unreachable — attempting recreate"

if [[ -z "$DEPLOY_URL" ]]; then
  vercel_cmd() {
    if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
  }
  DEPLOY_URL=$(vercel_cmd ls --scope "$SCOPE" 2>/dev/null | grep -Eo 'https://site-factory-[a-z0-9]+-fly-type\.vercel\.app' | head -1 || true)
fi

[[ -n "$DEPLOY_URL" ]] || { warn "No deployment URL to alias"; exit 1; }

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

vercel_cmd alias rm "$ALIAS" --scope "$SCOPE" -y 2>/dev/null || true
vercel_cmd alias set "$DEPLOY_URL" "$ALIAS" --scope "$SCOPE"

sleep 3
if probe "$ALIAS"; then
  ok "Alias https://$ALIAS restored → $DEPLOY_URL"
else
  warn "Alias still unreachable — use https://site-factory-fly-type.vercel.app temporarily"
  exit 1
fi
