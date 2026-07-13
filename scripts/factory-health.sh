#!/usr/bin/env bash
#
# factory-health.sh — Verify Site Factory template, clones, live URLs, and GitHub repos.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; FAIL=1; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }

FAIL=0

LIVE_URLS=(
  "demo-studio|https://demo-studio-orpin.vercel.app"
  "saas-ref|https://site-ref-saas.vercel.app"
  "agency-ref|https://site-ref-agency.vercel.app"
  "client-flowstack|https://client-flowstack.vercel.app"
)

echo "═══ Site Factory health ═══"
echo ""

echo "→ Template QA"
if (cd "$ROOT" && npm run qa >/dev/null 2>&1); then
  ok "web-motion-starter: qa"
else
  fail "web-motion-starter: qa failed"
fi

echo ""
echo "→ Template i18n smoke (local sitemap + prod)"
if (cd "$ROOT" && NEXT_PUBLIC_I18N=true NEXT_PUBLIC_SITE_URL=https://web-motion-starter.vercel.app npm run verify:sitemap >/dev/null 2>&1); then
  ok "web-motion-starter: verify:sitemap"
else
  fail "web-motion-starter: verify:sitemap failed"
fi

if (cd "$ROOT" && npm run verify:prod >/dev/null 2>&1); then
  ok "web-motion-starter: verify:prod"
else
  warn "web-motion-starter: verify:prod failed (CDN or network)"
fi

if curl -sfI --max-time 45 "https://web-motion-starter.vercel.app/ru" >/dev/null 2>&1; then
  ok "web-motion-starter → https://web-motion-starter.vercel.app/ru"
else
  warn "web-motion-starter live URL unreachable"
fi

for preset in saas agency; do
  clone="$HOME/Projects/site-ref-${preset}"
  if [[ -d "$clone" ]]; then
    if (cd "$clone" && npm run qa >/dev/null 2>&1); then
      ok "site-ref-${preset}: qa"
    else
      fail "site-ref-${preset}: qa failed"
    fi
  else
    warn "site-ref-${preset}: missing"
  fi
done

for extra in demo-studio client-flowstack; do
  dir="$HOME/Projects/$extra"
  if [[ -d "$dir" ]]; then
    if (cd "$dir" && npm run qa >/dev/null 2>&1); then
      ok "$extra: qa"
    else
      fail "$extra: qa failed"
    fi
  else
    warn "$extra: missing"
  fi
done

echo ""
echo "→ Live URLs"
for entry in "${LIVE_URLS[@]}"; do
  name="${entry%%|*}"
  url="${entry##*|}"
  if curl -sfI --max-time 45 "$url" >/dev/null 2>&1; then
    ok "$name → $url"
  else
    warn "$name → $url (not live yet)"
  fi
done

echo ""
echo "→ GitHub repos"
REPOS=(web-motion-starter demo-studio site-ref-saas site-ref-agency client-flowstack)
for repo in "${REPOS[@]}"; do
  if gh repo view "Linx72/$repo" >/dev/null 2>&1; then
    ok "Linx72/$repo"
  else
    warn "Linx72/$repo not found"
  fi
done 2>/dev/null || warn "gh CLI unavailable — skip repo check"

echo ""
if [[ "$FAIL" -eq 0 ]]; then
  ok "Factory healthy"
else
  fail "Factory has issues — see above"
  exit 1
fi
