#!/usr/bin/env bash
#
# ship-showcase.sh — QA → build → Vercel prod (prebuilt first, fallback full deploy).
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

extract_url() {
  grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' | tail -1 || true
}

log "1/5 — QA"
npm run qa:all

log "2/5 — Production build"
npm run build

log "3/5 — Vercel pull (production settings)"
vercel_cmd pull --yes --environment=production >/dev/null 2>&1 || true

log "4/5 — Prebuilt Vercel build"
vercel_cmd build --prod --yes

log "5/5 — Deploy prebuilt → production"
DEPLOY_URL=""
if OUT=$(vercel_cmd deploy --prebuilt --prod --yes 2>&1); then
  echo "$OUT"
  DEPLOY_URL=$(echo "$OUT" | extract_url)
else
  warn "Prebuilt deploy failed — retrying full deploy…"
  OUT=$(vercel_cmd --prod --yes 2>&1) || true
  echo "$OUT"
  DEPLOY_URL=$(echo "$OUT" | extract_url)
fi

echo ""
if [[ -n "$DEPLOY_URL" ]]; then
  ok "Live: $DEPLOY_URL"
  echo ""
  echo "Set env + redeploy:"
  echo "  vercel env add NEXT_PUBLIC_SITE_URL production"
  echo "  # value: $DEPLOY_URL"
else
  warn "CLI deploy failed (network/Vercel). Use GitHub:"
  echo "  bash scripts/github-ship.sh"
  echo "  Then: Vercel Dashboard → Import Git repo → fly-type/demo-studio"
fi
echo ""
echo "Verify: curl -sI \$URL/opengraph-image | head -1"
