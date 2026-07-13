#!/usr/bin/env bash
#
# Sync template code + re-apply presets for reference clones (saas, agency).
# demo-studio is skipped — managed as production showcase.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SYNC=(node "$ROOT/scripts/sync-from-template.mjs")

for preset in saas agency; do
  target="$HOME/Projects/site-ref-${preset}"
  if [[ ! -d "$target" ]]; then
    echo "Skip site-ref-${preset} — not found (run npm run scaffold:references)"
    continue
  fi
  echo "═══ site-ref-${preset} ═══"
  "${SYNC[@]}" "$target" --refresh-preset
  (cd "$target" && npm install --silent)
  echo ""
done

echo "Done. Verify:"
echo "  cd ~/Projects/site-ref-saas && npm run qa"
echo "  cd ~/Projects/site-ref-agency && npm run qa"
