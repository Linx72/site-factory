#!/usr/bin/env bash
#
# github-ship.sh — Push demo-studio to GitHub for Vercel Git integration.
#
# Usage: bash scripts/github-ship.sh [github-user/repo-name]
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="${1:-Linx72/demo-studio}"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: https://cli.github.com" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  log "Committing changes"
  git add -A
  git commit -m "$(cat <<'EOF'
chore: Site Factory showcase — Aurora Labs production ready

Phase 10: ship scripts, OG branding, visual QA snapshots, PRODUCTION docs.
EOF
)"
fi

if gh repo view "$REPO" >/dev/null 2>&1; then
  log "Remote exists: $REPO"
else
  log "Creating GitHub repo: $REPO"
  gh repo create "${REPO#*/}" --private --source=. --remote=origin --description "Aurora Labs — Site Factory showcase (demo-studio preset)"
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/$REPO.git"
fi

log "Pushing to origin main"
git push -u origin HEAD:main

echo ""
echo "Next — Vercel Git deploy:"
echo "  1. https://vercel.com/new → Import github.com/$REPO"
echo "  2. Framework: Next.js (auto)"
echo "  3. Env: NEXT_PUBLIC_SITE_URL = your *.vercel.app URL after first deploy"
echo "  4. Or link existing project fly-type/demo-studio → Settings → Git"
echo ""
echo "GitHub Actions secrets (for deploy.yml): see docs/DEMO-STUDIO.md"
