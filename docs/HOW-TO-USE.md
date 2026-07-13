# Как пользоваться Site Factory в Cursor

Практическое руководство: от брифа до production-сайта на базе **web-motion-starter**.

**Если нужен совсем простой язык (аналогии, без жаргона):** сначала [HOW-IT-WORKS.md](./HOW-IT-WORKS.md).

## Что это

**Site Factory** — не «ещё один шаблон», а конвейер:

| Часть | Роль |
|-------|------|
| [`web-motion-starter`](https://github.com/Linx72/web-motion-starter) | Эталонный код: 14 секций, motion, Convex, Stripe, i18n |
| `~/Projects/scripts/new-web-site.sh` | CLI: клонирует шаблон под новый бренд |
| **Пресеты** `saas` / `agency` / `demo-studio` | Готовые наборы секций + hue + copy |
| **Cursor Agent** + skill `site-builder` | Правит copy, Figma, QA, деплой |

Подробная архитектура: [SITE-FACTORY.md](./SITE-FACTORY.md)  
Дорожная карта развития библиотеки: [ROADMAP.md](./ROADMAP.md) (v3 — multi-page, variants, brief→scaffold)

---

## Быстрый старт (новый сайт за ~15 мин)

### Предпочтительный путь — `brief.json`

```bash
cd ~/Projects/web-motion-starter

# 1. Скопируйте пример и поправьте name/slug/hue
cp docs/examples/brief-saas.json ~/Desktop/brief-acme.json
# edit brief-acme.json

# 2. Проверка + scaffold
npm run verify:brief -- ~/Desktop/brief-acme.json
npm run scaffold:from-brief -- ~/Desktop/brief-acme.json

# 3. В Cursor: move_agent_to_root → ~/Projects/<slug>
# 4. QA gates (обязательно) → ship:client
```

Схема полей: [schemas/brief.schema.json](./schemas/brief.schema.json).  
Человеческая форма: [SITE-BRIEF.md](./SITE-BRIEF.md).

### Альтернатива — CLI без brief

### 1. Бриф (таблица)

Заполните [SITE-BRIEF.md](./SITE-BRIEF.md): название, аудитория, **brand hue** (0–360), секции, Figma URL — или сразу JSON.

### 2. Scaffold (legacy)

```bash
# Свой набор секций
~/Projects/scripts/new-web-site.sh client-acme \
  --title "Acme Analytics" \
  --brand-hue 250 \
  --sections hero,bento,features,pricing,faq,contact,cta

# Или пресет
~/Projects/scripts/new-web-site.sh client-acme --preset saas
~/Projects/scripts/new-web-site.sh client-studio --preset agency
```

| Пресет | Когда | Live |
|--------|-------|------|
| **saas** | B2B, pricing, FAQ | https://site-ref-saas.vercel.app |
| **agency** | студия, scroll-story, team | https://site-ref-agency.vercel.app |
| **demo-studio** | полная воронка | https://demo-studio-orpin.vercel.app |

### 3. Открыть в Cursor

Переключите агента на папку клона: `~/Projects/client-acme` (не работайте в шаблоне, если цель — клиентский сайт).

### 4. Контент и бренд

```bash
cd ~/Projects/client-acme
npm install && npm run dev
```

| Задача | Файл / команда |
|--------|----------------|
| Nav, hero, порядок секций | `content/site.json` |
| Цвет primary | `src/lib/theme/brand-palette.css` или `npm run sync:tokens` |
| Название, URL | `src/lib/site-config.ts` |
| Пересборка landing | `npm run scaffold:page -- "hero,bento,pricing,cta" src/app/page.tsx` |

Каталог секций: [SECTION-CATALOG.md](./SECTION-CATALOG.md)

### 5. Промпты для Cursor

**Новый SaaS:**
> Site-builder skill. Проект `client-acme`, preset saas, hue 250. Обнови hero и pricing в `content/site.json`, прогони visual QA.

**Из Figma:**
> Реализуй hero по [figma URL]: get_design_context + get_motion_context, мерж в существующие секции.

**Локализация:**
> `npm run i18n:enable`, переведи hero/pricing/FAQ в `messages/ru.json`.

**Ship:**
> `npm run qa:all`, deploy на Vercel, проверь `/opengraph-image`.

### 6. Опциональные фичи

| Фича | Команда |
|------|---------|
| Contact + live counter | `npm run convex:init`, `npm run dev:convex` |
| EN + RU | `npm run i18n:enable` |
| CMS-копирайт | `NEXT_PUBLIC_CMS=true` + Convex ([CMS.md](./features/CMS.md) — без `ALLOW_DEV_SEED` редактор скрыт) |
| Stripe | `npm run stripe:setup` |
| Resend (email на lead) | Convex env — [RESEND.md](./features/RESEND.md) |
| Analytics | `NEXT_PUBLIC_ANALYTICS=vercel\|plausible` — [ANALYTICS.md](./features/ANALYTICS.md) |
| Домен | `npm run domain:custom -- example.com` |
| Пресет launch | `--preset launch` / [brief-launch.json](./examples/brief-launch.json) |

### 7. QA и деплой

```bash
npm run qa:all
npm run build
npm run ship:client          # QA + prebuilt Vercel (клон)
# или для шаблона:
npm run deploy:prebuilt      # prebuilt prod без зависания CLI
```

Клиентский путь: [CLIENT-SITE.md](./CLIENT-SITE.md)  
Полный playbook: [PLAYBOOK-NEW-SITE.md](./PLAYBOOK-NEW-SITE.md)

---

## Типичные сценарии

### Новый клиент

```bash
~/Projects/scripts/new-web-site.sh client-name --preset saas
# → правки site.json в Cursor → qa:all → ship:client
```

### Обновить клон после апдейта шаблона

```bash
npm run sync:clone -- ~/Projects/client-name
npm run refresh:preset
```

### Motion-примитивы

- Локально: `/motion` или `/ru/motion` (с i18n)
- Код: `src/components/motion/`

### Проверить все live-сайты

```bash
cd ~/Projects/web-motion-starter && npm run verify:live
```

---

## Чеклист «готово к сдаче»

- [ ] Primary в hue бренда
- [ ] Nav-якоря работают
- [ ] Scroll-story pin (или fallback при reduced-motion)
- [ ] `npm run build` без ошибок
- [ ] OG: `/opengraph-image`
- [ ] `NEXT_PUBLIC_SITE_URL` = prod URL на Vercel
- [ ] Sitemap без `localhost` (при i18n — `/en`, `/ru` + hreflang)
- [ ] `npm run verify:prod` — RU-строки на prod (после деплоя)

## Troubleshooting Vercel

| Symptom | Fix |
|---------|-----|
| Deployments **UNKNOWN**, CLI hangs | [Vercel Billing](https://vercel.com/account/billing) — оплата / лимит; отменить зависшие деплои |
| GitHub Deploy не стартует | То же — сообщение про *payments have failed* в Actions |
| Sitemap с `localhost` | После redeploy: dynamic sitemap + `vercel.json` env; проверка: `npm run verify:sitemap` |

### После починки billing

```bash
git add -A && git commit -m "feat: i18n phases 25–29, dynamic sitemap, deploy tooling"
git push origin main
npm run ship:when-ready
```

---

## Карта документов

| Документ | Содержание |
|----------|------------|
| [SITE-FACTORY.md](./SITE-FACTORY.md) | Архитектура фабрики |
| [PLAYBOOK-NEW-SITE.md](./PLAYBOOK-NEW-SITE.md) | Пошаговый workflow |
| [CLIENT-SITE.md](./CLIENT-SITE.md) | 15-мин доставка клиенту |
| [REFERENCE-SITES.md](./REFERENCE-SITES.md) | Пресеты |
| [DEPLOY.md](./DEPLOY.md) | Vercel, CI, env |
| [HANDOFF.md](./HANDOFF.md) | Итог системы |
| [SALES-KIT.md](./SALES-KIT.md) | Продажа / сроки / refs |
| [features/I18N.md](./features/I18N.md) | `/en`, `/ru` |
| [features/ANALYTICS.md](./features/ANALYTICS.md) | Plausible / Vercel |
| [features/RESEND.md](./features/RESEND.md) | Lead email |
