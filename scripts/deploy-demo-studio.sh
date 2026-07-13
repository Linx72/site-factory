#!/usr/bin/env bash
#
# deploy-demo-studio.sh — QA + deploy ~/Projects/demo-studio to Vercel.
#
# Prereqs: vercel CLI, `vercel link` inside demo-studio once
#
set -euo pipefail

DEMO="$HOME/Projects/demo-studio"
SCRIPT="$DEMO/scripts/deploy-vercel.sh"

if [[ ! -d "$DEMO" ]]; then
  echo "demo-studio not found at $DEMO" >&2
  echo "Scaffold: ~/Projects/scripts/new-web-site.sh demo-studio --preset demo-studio" >&2
  exit 1
fi

cd "$DEMO"

if [[ ! -f "$SCRIPT" ]]; then
  echo "→ Running QA + deploy from demo-studio"
  npm run qa:all
  if command -v vercel >/dev/null 2>&1; then
    vercel --prod
  else
    npx vercel --prod
  fi
  exit 0
fi

bash "$SCRIPT"
