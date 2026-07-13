#!/usr/bin/env bash
#
# deploy-prebuilt.sh — local Vercel build + prebuilt prod deploy.
#
# Avoids remote "Building…" hangs when CLI waits on cloud build.
# Usage: bash scripts/deploy-prebuilt.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

log() { printf '\033[1;34m→\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }

vercel_cmd() {
  if command -v vercel >/dev/null 2>&1; then vercel "$@"; else npx vercel "$@"; fi
}

if [[ ! -f .vercel/project.json ]]; then
  log "Linking Vercel project (first time)"
  vercel_cmd link --yes
fi

log "Pull production env"
vercel_cmd pull --yes --environment=production >/dev/null 2>&1 || true

# NEXT_PUBLIC_* are inlined at build time — must be set before vercel build.
# Site Factory storefront: RU copy via section-copy defaults (i18n off).
NEXT_PUBLIC_I18N=false
NEXT_PUBLIC_SITE_URL=https://site-factory-hq.vercel.app
export NEXT_PUBLIC_I18N NEXT_PUBLIC_SITE_URL

# Rewrite pulled env so `vercel build` does not re-inject template defaults.
ENV_FILE=".vercel/.env.production.local"
if [[ -f "$ENV_FILE" ]]; then
  if grep -q '^NEXT_PUBLIC_I18N=' "$ENV_FILE"; then
    sed -i '' "s|^NEXT_PUBLIC_I18N=.*|NEXT_PUBLIC_I18N=${NEXT_PUBLIC_I18N}|" "$ENV_FILE"
  else
    echo "NEXT_PUBLIC_I18N=${NEXT_PUBLIC_I18N}" >>"$ENV_FILE"
  fi
  if grep -q '^NEXT_PUBLIC_SITE_URL=' "$ENV_FILE"; then
    sed -i '' "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}|" "$ENV_FILE"
  else
    echo "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}" >>"$ENV_FILE"
  fi
fi

log "Build env: NEXT_PUBLIC_I18N=$NEXT_PUBLIC_I18N SITE_URL=$NEXT_PUBLIC_SITE_URL"

log "Vercel prebuilt artifact (production env)"
vercel_cmd build --prod --yes

log "Deploy prebuilt (--archive=tgz, wait up to 420s)"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
# tgz archive avoids flaky multi-file uploads; wait for Ready + alias.
vercel_cmd deploy --prebuilt --prod --yes --archive=tgz >"$TMP" 2>&1 &
DEPLOY_PID=$!
for _ in $(seq 1 420); do
  if ! kill -0 "$DEPLOY_PID" 2>/dev/null; then
    break
  fi
  sleep 1
done
if kill -0 "$DEPLOY_PID" 2>/dev/null; then
  kill "$DEPLOY_PID" 2>/dev/null || true
  log "CLI timed out after 420s — check Vercel dashboard; alias manually if Ready"
  cat "$TMP"
  exit 0
fi
wait "$DEPLOY_PID"
OUT=$(cat "$TMP")
echo "$OUT"

URL=$(echo "$OUT" | grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' | head -1 || true)
if echo "$OUT" | grep -q '"status": "ok"'; then
  ok "Production deploy ready"
  [[ -n "$URL" ]] && ok "URL: $URL"
elif [[ -n "$URL" ]]; then
  ok "Deployment: $URL"
  ok "Verify: curl -sI $URL | head -3"
else
  ok "Check Vercel dashboard for deployment status"
fi
