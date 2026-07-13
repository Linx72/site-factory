#!/usr/bin/env bash
#
# storefront-onboard.sh — optional services to upgrade Site Factory storefront.
#
set -euo pipefail

cat <<'EOF'
═══ Site Factory storefront — optional upgrades ═══

Live: https://site-factory-hq.vercel.app
Repo: https://github.com/Linx72/site-factory

── A. Leads на почту (рекомендуется, ~15 мин) ──
  1. https://resend.com → API key
  2. RESEND_API_KEY=re_... LEADS_NOTIFY_EMAIL=you@domain.com npm run resend:vercel
  3. npm run deploy:prebuilt
  4. npm run verify:lead-api   # expect 200

── B. Свой домен (~30 мин) ──
  1. Vercel → Domains → DNS
  2. npm run domain:custom -- your-domain.com
  3. NEXT_PUBLIC_SITE_URL=https://your-domain.com on Vercel → redeploy
  4. npm run domain:verify -- https://your-domain.com

── C. Convex (Sprint: лиды в БД, /status live) ──
  1. npx convex login
  2. npm run convex:init -- --prod
  3. npm run convex:vercel -- https://YOUR.convex.cloud
  4. npm run deploy:prebuilt

── D. GitHub auto-deploy ──
  Secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
  Refresh token yearly: https://vercel.com/account/tokens

── Verify anytime ──
  npm run storefront:health
  npm run alias:verify

Docs: docs/features/RESEND.md · docs/CUSTOM-DOMAIN.md · README.md
EOF
