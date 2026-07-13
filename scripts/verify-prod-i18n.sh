#!/usr/bin/env bash
#
# verify-prod-i18n.sh — smoke-check RU strings on production (or VERIFY_PROD_URL).
#
# Fetches each URL once per attempt (batched patterns) to reduce CDN/rate-limit flakes.
#
set -euo pipefail

BASE="${VERIFY_PROD_URL:-https://web-motion-starter.vercel.app}"
TIMEOUT="${VERIFY_PROD_TIMEOUT:-60}"
RETRIES="${VERIFY_PROD_RETRIES:-5}"
RETRY_DELAY="${VERIFY_PROD_RETRY_DELAY:-5}"
MIN_HTML_BYTES="${VERIFY_PROD_MIN_BYTES:-8000}"
FAIL=0

ok() { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; FAIL=1; }

fetch_to() {
  curl -sL --compressed --connect-timeout 15 --max-time "$TIMEOUT" \
    -H "Accept-Language: ru,en;q=0.8" \
    -o "$2" \
    "$1" 2>/dev/null || true
}

# check_patterns name url pattern1 pattern2 ...
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
      missing+=("(empty or short response: ${size}b)")
    fi
    if [[ "$attempt" -lt "$RETRIES" ]]; then
      sleep "$RETRY_DELAY"
    fi
    attempt=$((attempt + 1))
  done

  if [[ ! -s "$tmp" ]]; then
    fail "$name -> $url (empty or timeout after ${RETRIES} tries)"
  else
    fail "$name -> missing at $url after ${RETRIES} tries: ${missing[*]}"
  fi
  rm -f "$tmp"
}

check_html() {
  check_patterns "$1" "$2" "$3"
}

echo "═══ Prod i18n smoke ($BASE, ${RETRIES}x retry) ═══"
echo ""

check_patterns "RU home" "$BASE/ru" \
  "Частые вопросы" \
  "закрепляется при скролле" \
  "Что говорят команды" \
  "Елена В." \
  "Фулстек-разработчик" \
  "Бесплатно" \
  "Доступность" \
  "Перейти к содержимому" \
  "hello@studio.ru" \
  '"inLanguage":"ru-RU"' \
  "Эталонные сайты"

sleep 2

check_patterns "RU motion lab" "$BASE/ru/motion" \
  "Лаборатория motion" \
  "Справочник" \
  "Магнитная кнопка" \
  "Наведите — magnetic pull" \
  "← На главную"

sleep 2

check_patterns "RU status" "$BASE/ru/status" \
  "Бэкенд в реальном времени" \
  "Подписчики рассылки" \
  "Инструменты разработки"

sleep 2

check_patterns "RU privacy" "$BASE/ru/privacy" \
  "Политика конфиденциальности" \
  "Какие данные собираем"

sleep 2

check_patterns "RU blog" "$BASE/ru/blog" \
  "Блог" \
  "Multi-page sites without a headless CMS"

check_html "RU 404 title" "$BASE/ru/does-not-exist" "Страница не найдена"

echo ""
if [[ "$FAIL" -eq 0 ]]; then
  ok "Prod i18n smoke passed"
else
  exit 1
fi
