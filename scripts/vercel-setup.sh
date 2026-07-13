#!/usr/bin/env bash
#
# vercel-setup.sh — First-time Vercel link + env checklist for a scaffolded site.
#
# Usage: bash scripts/vercel-setup.sh [project-dir]
#
set -euo pipefail

ROOT="$(cd "$(dirname "${1:-.}")" && pwd)"
cd "$ROOT"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }

if ! command -v vercel >/dev/null 2>&1; then
  log "Installing Vercel CLI globally (or use npx vercel)…"
  npm i -g vercel 2>/dev/null || true
fi

log "Link project (pick or create Vercel project)"
if command -v vercel >/dev/null 2>&1; then
  vercel link
else
  npx vercel link
fi

log "Set production env in Vercel dashboard or via CLI:"
echo "  NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN.vercel.app"
echo "  NEXT_PUBLIC_CONVEX_URL=...   (optional — contact + /status)"
echo ""
log "Deploy preview:"
echo "  npm run qa:all && vercel"
echo ""
log "Deploy production:"
echo "  npm run deploy"
