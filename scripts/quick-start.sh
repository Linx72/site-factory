#!/usr/bin/env bash
#
# quick-start.sh — Install deps and optional tooling for a scaffolded site.
#
# Usage: bash scripts/quick-start.sh [--no-playwright] [--convex]
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DO_PLAYWRIGHT=1
DO_CONVEX=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-playwright) DO_PLAYWRIGHT=0; shift ;;
    --convex) DO_CONVEX=1; shift ;;
    -h|--help)
      echo "Usage: quick-start.sh [--no-playwright] [--convex]"
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

echo "→ npm install"
npm install

if [[ "$DO_PLAYWRIGHT" -eq 1 ]]; then
  echo "→ playwright install chromium"
  npm run playwright:install
fi

if [[ "$DO_CONVEX" -eq 1 ]]; then
  echo "→ convex dev (run in another terminal): npm run dev:convex"
fi

echo "✓ Ready. Run: npm run dev"
