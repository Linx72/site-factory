#!/usr/bin/env bash
#
# deploy-reference.sh — QA + prebuilt Vercel deploy for saas/agency reference clones.
#
# Usage: bash scripts/deploy-reference.sh [saas|agency|all]
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-all}"

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

extract_alias() {
  grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' | grep -v 'fly-type' | tail -1 || true
}

patch_site_url() {
  local dir="$1"
  local url="$2"
  local vercel_json="$dir/vercel.json"
  [[ -n "$url" ]] || return 0
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const url = process.argv[2];
    const cfg = fs.existsSync(p)
      ? JSON.parse(fs.readFileSync(p, 'utf8'))
      : { framework: 'nextjs', buildCommand: 'npm run build', installCommand: 'npm ci', regions: ['iad1'] };
    cfg.env = { ...(cfg.env || {}), NEXT_PUBLIC_SITE_URL: url };
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
    console.log('  vercel.json NEXT_PUBLIC_SITE_URL=' + url);
  " "$vercel_json" "$url"
}

deploy_one() {
  local preset="$1"
  local dir="$HOME/Projects/site-ref-${preset}"
  if [[ ! -d "$dir" ]]; then
    echo "Skip site-ref-${preset} — not found"
    return 0
  fi

  echo "═══ Deploy site-ref-${preset} ═══"
  cd "$dir"

  npm run qa
  npm run build

  if [[ ! -f .vercel/project.json ]]; then
    echo "→ vercel link (first time)"
    vercel_cmd link --yes
  fi

  vercel_cmd pull --yes --environment=production >/dev/null 2>&1 || true
  # Coerce empty NEXT_PUBLIC_* (same issue as template deploy-prebuilt)
  if [[ -f .vercel/.env.production.local ]]; then
    set -a
    # shellcheck disable=SC1091
    source .vercel/.env.production.local
    set +a
  fi
  if [[ -z "${NEXT_PUBLIC_SITE_URL:-}" ]]; then
    NEXT_PUBLIC_SITE_URL="https://site-ref-${preset}.vercel.app"
  fi
  # Empty NEXT_PUBLIC_I18N from vercel pull must not stay ""; false is fine.
  if [[ -z "${NEXT_PUBLIC_I18N:-}" ]]; then
    NEXT_PUBLIC_I18N=false
  fi
  export NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_I18N
  if [[ -f .vercel/.env.production.local ]]; then
    sed -i '' "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}|" .vercel/.env.production.local 2>/dev/null || true
  fi

  vercel_cmd build --prod --yes
  OUT=$(vercel_cmd deploy --prebuilt --prod --yes --archive=tgz 2>&1) || true
  echo "$OUT" | grep -E 'Production|Aliased|https://|"status"' | tail -8

  ALIAS=$(echo "$OUT" | extract_alias)
  patch_site_url "$dir" "$ALIAS"
  echo ""
}

case "$TARGET" in
  saas) deploy_one saas ;;
  agency) deploy_one agency ;;
  launch) deploy_one launch ;;
  all)
    deploy_one saas
    deploy_one agency
    deploy_one launch
    ;;
  *)
    echo "Usage: deploy-reference.sh [saas|agency|launch|all]"
    exit 1
    ;;
esac

echo "Done. Live URLs in docs/REFERENCE-SITES.md"
