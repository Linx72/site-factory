#!/usr/bin/env bash
#
# deploy-vercel.sh — QA + production deploy to Vercel.
#
# Requires: vercel CLI (`npm i -g vercel`), logged in (`vercel login`)
# Link once: `vercel link` in project root
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }

log "Running QA (lint + typecheck + visual)…"
npm run qa:all

log "Deploying to Vercel (production)…"
if command -v vercel >/dev/null 2>&1; then
  vercel --prod
else
  npx vercel --prod
fi

log "Done. Check Vercel dashboard for URL."
