#!/usr/bin/env bash
#
# enable-i18n.sh — Turn on next-intl routing (/en, /ru) for this project.
#
# Usage: bash scripts/enable-i18n.sh
#        bash scripts/enable-i18n.sh --deploy   # also patch vercel.json + redeploy
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
DEPLOY=0
[[ "${1:-}" == "--deploy" ]] && DEPLOY=1

ENV_FILE="$ROOT/.env.local"
VERCEL_JSON="$ROOT/vercel.json"

echo "→ Enabling i18n (NEXT_PUBLIC_I18N=true)"

if [[ -f "$ENV_FILE" ]]; then
  if grep -q '^NEXT_PUBLIC_I18N=' "$ENV_FILE"; then
    sed -i '' 's/^NEXT_PUBLIC_I18N=.*/NEXT_PUBLIC_I18N=true/' "$ENV_FILE"
  else
    echo 'NEXT_PUBLIC_I18N=true' >> "$ENV_FILE"
  fi
else
  echo 'NEXT_PUBLIC_I18N=true' > "$ENV_FILE"
fi
ok_msg() { echo "  Updated .env.local"; }

if [[ -f "$VERCEL_JSON" ]] && command -v node >/dev/null 2>&1; then
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    cfg.env = { ...(cfg.env || {}), NEXT_PUBLIC_I18N: 'true' };
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
  " "$VERCEL_JSON"
  echo "  Updated vercel.json"
fi

echo ""
echo "✓ i18n enabled. Edit messages/en.json and messages/ru.json for copy."
echo "  Verify: NEXT_PUBLIC_I18N=true npm run dev → http://localhost:3000/en"
echo "  Docs: docs/features/I18N.md"

if [[ "$DEPLOY" -eq 1 ]]; then
  echo ""
  echo "→ Redeploying production (prebuilt)"
  if [[ -f scripts/deploy-prebuilt.sh ]]; then
    bash scripts/deploy-prebuilt.sh
  elif [[ -f scripts/deploy-vercel.sh ]]; then
    bash scripts/deploy-vercel.sh
  else
    npx vercel --prod --yes
  fi
fi
