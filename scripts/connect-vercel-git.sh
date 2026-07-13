#!/usr/bin/env bash
#
# connect-vercel-git.sh — Link Vercel project to GitHub for auto-deploy on push.
#
# Prerequisites:
#   - vercel link (project linked)
#   - gh auth login
#   - GitHub repo pushed (e.g. Linx72/demo-studio)
#
# Usage: bash scripts/connect-vercel-git.sh [project-dir]
#
set -euo pipefail

ROOT="$(cd "$(dirname "${1:-.}")" && pwd)"
cd "$ROOT"

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

if [[ ! -f .vercel/project.json ]]; then
  echo "✗ No .vercel/project.json — run npm run vercel:setup first"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "✗ gh CLI not found — install: brew install gh"
  exit 1
fi

REMOTE="$(git remote get-url origin 2>/dev/null || true)"
if [[ -z "$REMOTE" ]]; then
  echo "✗ No git remote origin — push repo to GitHub first"
  exit 1
fi

echo "→ Connecting Vercel to GitHub ($REMOTE)"
vercel_cmd git connect --yes 2>&1 || {
  echo ""
  echo "If CLI failed, connect manually:"
  echo "  1. Vercel Dashboard → Project → Settings → Git"
  echo "  2. Connect repository: $REMOTE"
  echo "  3. Production branch: main"
  exit 0
}

echo "✓ Git connected. Push to main triggers Vercel build."
echo "  git push origin main"
