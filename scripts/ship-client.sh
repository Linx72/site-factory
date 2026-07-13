#!/usr/bin/env bash
#
# ship-client.sh — QA + prebuilt Vercel prod deploy for any Site Factory clone.
#
# Usage (from project root):
#   bash scripts/ship-client.sh
#
# First time: npm run vercel:setup  (or vercel link --yes)
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

extract_alias() {
  grep 'Aliased' | grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' | head -1 \
    || grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' | grep -v 'fly-type' | tail -1 \
    || true
}

if [[ ! -f .vercel/project.json ]]; then
  log "Linking Vercel project (first time)"
  vercel_cmd link --yes
fi

log "1/4 — QA"
npm run qa

log "2/4 — Build"
npm run build

log "3/4 — Prebuilt Vercel build"
vercel_cmd pull --yes --environment=production >/dev/null 2>&1 || true
vercel_cmd build --prod --yes

log "4/4 — Deploy production"
OUT=$(vercel_cmd deploy --prebuilt --prod --yes 2>&1) || OUT=$(vercel_cmd --prod --yes 2>&1)
echo "$OUT" | grep -E 'Production|Aliased|https://' | tail -4

URL=$(echo "$OUT" | extract_alias)
if [[ -n "$URL" ]] && [[ -f vercel.json ]] && command -v node >/dev/null 2>&1; then
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const url = process.argv[2];
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    cfg.env = { ...(cfg.env || {}), NEXT_PUBLIC_SITE_URL: url };
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
  " vercel.json "$URL"
  ok "vercel.json NEXT_PUBLIC_SITE_URL=$URL"
fi

echo ""
ok "Shipped. Verify: open $URL"
