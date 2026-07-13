#!/usr/bin/env bash
#
# Scaffold reference sites (saas, agency, demo-studio) into ~/Projects/
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPT="$HOME/Projects/scripts/new-web-site.sh"

for preset in saas agency demo-studio; do
  name="site-ref-${preset}"
  if [[ "$preset" == "demo-studio" ]]; then
    name="demo-studio"
  fi
  target="$HOME/Projects/$name"
  if [[ -d "$target" ]]; then
    echo "Skip $name — already exists"
    continue
  fi
  echo "→ Scaffolding $name (--preset $preset)"
  "$SCRIPT" "$name" --preset "$preset" --no-install
done

echo "Done. Install: cd ~/Projects/demo-studio && npm install && npm run dev"
