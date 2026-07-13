#!/usr/bin/env bash
#
# push-reference-repos.sh — Commit, create GitHub repos, and push reference clones.
#
# Creates (if missing):
#   Linx72/site-ref-saas
#   Linx72/site-ref-agency
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v gh >/dev/null 2>&1; then
  echo "✗ gh CLI required — brew install gh && gh auth login"
  exit 1
fi

push_one() {
  local preset="$1"
  local name="site-ref-${preset}"
  local target="$HOME/Projects/$name"
  local repo="Linx72/$name"

  if [[ ! -d "$target" ]]; then
    echo "Skip $name — not found. Run: npm run refresh:references"
    return 0
  fi

  echo "═══ $name ═══"
  cd "$target"

  if [[ -n "$(git status --porcelain)" ]]; then
    git add -A
    git commit -m "$(cat <<EOF
chore: sync Site Factory template — preset ${preset}

Phases 12–14: content-driven presets, OG, sync tooling, visual baselines.
EOF
)"
  fi

  if git remote get-url origin >/dev/null 2>&1; then
    echo "→ Pushing existing remote"
    git push -u origin main 2>&1 || git push -u origin HEAD 2>&1
  else
    echo "→ Creating GitHub repo $repo"
    gh repo create "$repo" --private --source=. --remote=origin --push
  fi

  echo "✓ https://github.com/$repo"
  echo ""
}

for preset in saas agency; do
  push_one "$preset"
done

echo "Done."
