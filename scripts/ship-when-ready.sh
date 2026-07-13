#!/usr/bin/env bash
#
# ship-when-ready.sh — QA + verify + prebuilt deploy + full prod smoke.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }

if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  warn "Uncommitted changes — commit and push before prod ship"
  git status -sb
  exit 1
fi

log "QA + visual"
npm run qa:all

log "Messages parity + sitemap"
npm run verify:messages
NEXT_PUBLIC_I18N=true NEXT_PUBLIC_SITE_URL=https://web-motion-starter.vercel.app npm run verify:sitemap

log "Prebuilt deploy"
bash scripts/deploy-prebuilt.sh

log "Wait for prod propagation"
sleep 25

log "Prod smoke (i18n + backend; stripe warns if unset)"
npm run verify:prod
npm run verify:backend
npm run verify:stripe || warn "Stripe not configured on prod (optional)"

ok "Ship complete — https://web-motion-starter.vercel.app/ru"
