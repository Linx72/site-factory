#!/usr/bin/env bash
#
# capture-reference-snapshots.sh — Update Playwright baselines for saas/agency clones.
#
set -euo pipefail

for preset in saas agency; do
  target="$HOME/Projects/site-ref-${preset}"
  if [[ ! -d "$target" ]]; then
    echo "Skip site-ref-${preset} — not found"
    continue
  fi
  echo "═══ Updating snapshots: site-ref-${preset} ═══"
  (cd "$target" && npm run qa:visual:update)
  echo ""
done

echo "Done. Verify: cd ~/Projects/site-ref-saas && npm run qa:visual"
