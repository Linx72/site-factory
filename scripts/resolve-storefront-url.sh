#!/usr/bin/env bash
#
# resolve-storefront-url.sh — pick a reachable production URL for smoke checks.
#
# Order: VERIFY_STOREFRONT_URL → site-factory-hq → site-factory-fly-type → latest prod deployment.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -n "${VERIFY_STOREFRONT_URL:-}" ]]; then
  echo "${VERIFY_STOREFRONT_URL%/}"
  exit 0
fi

CANDIDATES=(
  "https://site-factory-hq.vercel.app"
  "https://site-factory-fly-type.vercel.app"
)

probe() {
  local url="$1"
  local code
  code=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 8 --max-time 20 "$url" 2>/dev/null || true)
  [[ "$code" =~ ^[23] ]]
}

for url in "${CANDIDATES[@]}"; do
  if probe "$url"; then
    echo "$url"
    exit 0
  fi
done

if command -v vercel >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; then
  vercel_cmd() {
    if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
  }
  latest=$(vercel_cmd ls --scope fly-type 2>/dev/null | grep -Eo 'https://site-factory-[a-z0-9]+-fly-type\.vercel\.app' | head -1 || true)
  if [[ -n "$latest" ]] && probe "$latest"; then
    echo "$latest"
    exit 0
  fi
fi

echo "https://site-factory-hq.vercel.app"
