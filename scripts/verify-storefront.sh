#!/usr/bin/env bash
#
# verify-storefront.sh — smoke-check Site Factory storefront (RU, no i18n).
#
set -euo pipefail

BASE="${VERIFY_STOREFRONT_URL:-https://site-factory-hq.vercel.app}"
TIMEOUT="${VERIFY_PROD_TIMEOUT:-60}"
RETRIES="${VERIFY_PROD_RETRIES:-5}"
RETRY_DELAY="${VERIFY_PROD_RETRY_DELAY:-5}"
MIN_HTML_BYTES="${VERIFY_PROD_MIN_BYTES:-4000}"
FAIL=0

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; FAIL=1; }

fetch_to() {
  curl -sL --compressed --connect-timeout 20 --max-time "$TIMEOUT" \
    --retry 2 --retry-delay 3 --retry-all-errors \
    -o "$2" "$1" 2>/dev/null || true
}

check_patterns() {
  local name="$1"
  local url="$2"
  shift 2
  local patterns=("$@")
  local attempt=1
  local missing=()
  local tmp
  tmp="$(mktemp)"

  while [[ "$attempt" -le "$RETRIES" ]]; do
    fetch_to "$url" "$tmp"
    missing=()
    local size=0
    if [[ -s "$tmp" ]]; then
      size=$(wc -c < "$tmp" | tr -d " ")
    fi
    if [[ "$size" -ge "$MIN_HTML_BYTES" ]]; then
      for pattern in "${patterns[@]}"; do
        if ! grep -qF -- "$pattern" "$tmp"; then
          missing+=("$pattern")
        fi
      done
      if [[ "${#missing[@]}" -eq 0 ]]; then
        ok "$name"
        rm -f "$tmp"
        return
      fi
    else
      missing+=("(empty or short: ${size}b)")
    fi
    if [[ "$attempt" -lt "$RETRIES" ]]; then
      sleep "$RETRY_DELAY"
    fi
    attempt=$((attempt + 1))
  done

  fail "$name -> missing at $url after ${RETRIES} tries: ${missing[*]}"
  rm -f "$tmp"
}

echo "═══ Storefront smoke ($BASE) ═══"
echo ""

check_patterns "home RU" "$BASE" \
  'lang="ru"' \
  "Переключить тему" \
  "Как устроено" \
  "Пакеты" \
  "Flash" \
  "Sprint" \
  "Build" \
  "Оставить бриф"

check_patterns "about RU" "$BASE/about" \
  "О фабрике" \
  "Каталог секций"

check_patterns "privacy RU" "$BASE/privacy" \
  "Политика конфиденциальности"

check_patterns "contact form" "$BASE" \
  "contact-brief-static" \
  "contact-email-static"

check_patterns "status hint" "$BASE/status" \
  "Convex не подключён" \
  "Форма брифа на главной"

echo ""
if [[ "$FAIL" -eq 0 ]]; then
  ok "Storefront smoke passed"
else
  exit 1
fi
