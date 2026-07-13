# Site Factory — дорожная карта (v3)

План переписан под **фактическую зрелость** на 2026-07-13.

**Фазы 1–42 уже сделаны.** Шаблон — не MVP, а **production factory**:
14 секций, motion-lab, Convex/Stripe/i18n, verify-стек, scaffold→ship, 4 live-сайта.

v2 («активируйте Convex/Stripe/домен») остаётся полезным как **опциональный блокер аккаунтов**, но **не главный план**.  
v3 — **серьёзные улучшения библиотеки** и **как создавать сайты в Cursor** поверх неё.

---

## 0. Вердикт по текущему состоянию

### Что уже сильно

| Слой | Состояние | Доказательство |
|------|-----------|----------------|
| **Template** | Production-ready | `web-motion-starter` → https://web-motion-starter.vercel.app `/ru` |
| **Delivery** | ~15 мин scaffold→ship | flowstack, saas/agency refs |
| **i18n** | Полный RU/EN + smoke | `verify:messages`, `verify:prod`, JsonLd, 404, checkout locale |
| **Verify** | messages + sitemap + prod + backend + stripe | `npm run verify:all` |
| **Agent** | Skills + rules + playbook | `site-builder`, HOW-TO-USE, PLAYBOOK |
| **Backend** | Convex + Stripe код готов | `/status`, checkout API, webhook→ingest |

### Где потолок сейчас (честно)

Фабрика отлично делает **одностраничные marketing-лендинги**.  
Слабее как **продуктовая библиотека для агента**, если нужно:

1. **Многостраничность** — legal, case study, blog-lite, about (сейчас home + motion + status).
2. **Варианты секций** — один `hero`, один `pricing`; нет «hero-split / hero-fullscreen / pricing-compare».
3. **Типизированный бриф → scaffold** — SITE-BRIEF.md текст, а не машиночитаемый `brief.json`.
4. **Theme packs** — hue/chroma есть; нет готовых визуальных направлений (editorial, dark product, soft studio).
5. **Контент-пайплайн для агента** — copy правится вручную; нет «generate copy pack from brief».
6. **Клиентский CMS UX** — CMS-lite есть, но нет безопасного «клиент правит текст без Cursor».
7. **Semver template** — версия `0.1.0`, нет CHANGELOG / migration notes для `sync:clone`.
8. **GitHub CI** — billing hold; локальный/Vercel verify — source of truth.

### Стратегия v3

```
НЕ: «допилить demo-studio env»
ДА:  «поднять фабрику с L6 → L9: multi-page + variants + agent SDK + product ops»
```

| Уровень | Смысл | Статус |
|---------|-------|--------|
| L0–L6 | Static → live → i18n → pay → domain → client → ops | ✅ |
| **L7 — Multi-page kit** | Legal, case, about, blog-lite из каталога | ✅ v3 Фаза E |
| **L8 — Section variants + themes** | 2–3 варианта ключевых секций + theme packs | ✅ v3 Фаза F |
| **L9 — Agent product layer** | brief.json → scaffold → copy pack → QA gates | ✅ v3 Фаза G |
| **L10 — Client ops** | CMS editor UX, analytics, notify, sales kit | ✅ v3 Фаза H |

**Аккаунты (Convex / Stripe / domain)** — Фаза A\* в конце: делать, когда нужны live leads/payments, **не блокирует** E–G.

---

## 1. Как использовать библиотеку в Cursor (операционная модель)

### 1.1 Два режима работы

| Режим | Workspace | Когда |
|-------|-----------|--------|
| **A. Template lab** | `~/Projects/web-motion-starter` | Новые секции, variants, verify, docs, skills |
| **B. Client delivery** | `~/Projects/<client>` (клон) | Copy, бренд, ship клиента |

**Правило:** новый клиентский сайт **не правят в template**.  
Агент: `move_agent_to_root` → клон → skill `site-builder`.

### 1.2 Канонический промпт агенту

```
Use site-builder skill.
1) Read docs/SITE-BRIEF.md (or brief.json if present).
2) Scaffold with new-web-site.sh --preset <saas|agency> (or --sections …).
3) move_agent_to_root to the clone.
4) Edit content/site.json + brand-palette.css (+ messages/* if i18n).
5) Do NOT invent new section layouts unless brief requires — use SECTION-CATALOG.
6) npm run qa:all → npm run ship:client.
7) Report live URL + how to change copy.
```

### 1.3 Конвейер (уже работает)

```
BRIEF → SCAFFOLD → CONFIG (site.json / brand / features)
     → SECTIONS (catalog ids) → MOTION (optional Figma)
     → FEATURES (convex|i18n|stripe|cms) → QA → SHIP → VERIFY
```

Подробно: [HOW-TO-USE.md](./HOW-TO-USE.md), [PLAYBOOK-NEW-SITE.md](./PLAYBOOK-NEW-SITE.md), [CLIENT-SITE.md](./CLIENT-SITE.md).

### 1.4 Что агенту нельзя ломать

1. Copy — в `content/site.json` / `messages/*.json`, не в JSX.
2. Порядок секций — только ids в `site.json` / `scaffold:page`.
3. Features — только env + `siteFeatures`, не хардкод «Stripe всегда».
4. `sync:clone` — не затирает brand/copy/snapshots.
5. Deploy — `deploy:prebuilt` / `ship:client` (не ждать remote build hangs).

### 1.5 Live-эталоны (смотреть перед scaffold)

| Сайт | URL | Зачем смотреть |
|------|-----|----------------|
| Template | https://web-motion-starter.vercel.app/ru | полный стек + i18n |
| SaaS ref | https://site-ref-saas.vercel.app | B2B пресет |
| Agency ref | https://site-ref-agency.vercel.app | студия / story / team |
| Client | https://client-flowstack.vercel.app | proof доставки |
| Aurora | https://demo-studio-orpin.vercel.app | полная воронка |

---

## 2. Новый план v3 — фазы и дни

**Формат:** 4 фазы × 5 дней = **20 рабочих дней**.  
Каждый день = **одна цель**, файлы, команды, критерий «готово», что проверить в Cursor.

Опционально после: **Фаза A\*** (аккаунты) — 3 дня, если нужны live Convex/Stripe/домен.

---

### ФАЗА E — Multi-page kit (Дни 1–5)

*Цель: фабрика умеет не только home, а минимальный набор страниц для реального клиента.*

#### День 1 — Каталог страниц + роутинг ✅

| | |
|---|---|
| **Статус** | `docs/PAGE-CATALOG.md`, `src/lib/site-pages.ts`, `content/site.json` → `pages[]` |
| **Цель** | Машиночитаемый каталог страниц рядом с секциями |
| **Готово когда** | Агент знает, какие страницы можно scaffold-ить по id |

#### День 2 — Legal pages (privacy + terms) ✅

| | |
|---|---|
| **Статус** | `/privacy`, `/terms` + `/[locale]/…`, Legal messages EN/RU, footer links |
| **Цель** | Готовые legal pages |
| **Готово когда** | Scaffold клиента может включить legal в footer |

#### День 3 — About + Case study templates ✅

| | |
|---|---|
| **Статус** | `/about`, `/case`, `/case/demo` (+ locale), `content/cases/demo.json` |
| **Цель** | Две composition-страницы из существующих секций |
| **Готово когда** | Preset/agency может включать about+case |

#### День 4 — Blog-lite (index + post) ✅

| | |
|---|---|
| **Статус** | `content/blog/*.md` → `/blog`, `/blog/[slug]` (+ locale); footer + sitemap |
| **Цель** | Минимальный контентный контур без headless CMS |
| **Сделать** | MD в `content/blog/*.md` → `/blog`, `/blog/[slug]` |
| **В Cursor** | «Add blog-lite with file-based posts; keep brand tokens» |

#### День 5 — Scaffold pages в CLI + docs ✅

| | |
|---|---|
| **Статус** | `scaffold:from-brief` + `new-web-site.sh --pages`; PAGE-CATALOG |
| **Цель** | CLI и brief пишут `pages[]` в клон |
| **Осталось** | — |

---

### ФАЗА F — Section variants + theme packs (Дни 6–10)

*Цель: один id секции → несколько композиций; бренд не только hue.*

#### День 6 — Контракт variant ✅

| | |
|---|---|
| **Статус** | `src/lib/section-variants.ts`, `variants` in site.json/brief, SECTION-CATALOG + SECTION-VARIANTS.md |
| **Цель** | `variant` в content-модели |
| **Сделать** | В `site.json`: `"variants": { "hero": "editorial" }`; типы; SECTION-CATALOG колонка Variants |
| **Проверка** | Default variant = текущий UI (zero visual regression) |
| **Готово когда** | Без `variant` поведение как сейчас |

#### День 7 — Hero variants (2) ✅

| | |
|---|---|
| **Статус** | `hero/default` + `hero/editorial` (brand-first, no stats) |
| **Цель** | `hero/default` (текущий) + `hero/editorial` (full-bleed, brand-first) |
| **Сделать** | Соблюдать frontend design rules: brand dominant, no cards in hero, no stat clutter в editorial |
| **Проверка** | Template home stays `default`; agency brief example uses `editorial` |
| **Готово когда** | Preset/brief может выбрать editorial hero |

#### День 8 — Pricing + Features variants ✅

| | |
|---|---|
| **Статус** | `pricing/compare` + `features/bento-lite`; shared copy keys; saas brief example |
| **Цель** | `pricing/cards` + `pricing/compare`; `features/grid` + `features/bento-lite` |
| **Проверка** | Template home stays cards/grid; `verify:prod` RU strings |

#### День 9 — Theme packs ✅

| | |
|---|---|
| **Статус** | `references/themes/*`, `npm run theme:apply`, `--theme` on scaffold / brief |
| **Цель** | 3 пакета: `product-dark`, `studio-soft`, `editorial-ink` |
| **Проверка** | Apply → surfaces shift; `default` restores baseline |

#### День 10 — Reference refresh + snapshots ✅

| | |
|---|---|
| **Статус** | saas=`product-dark`+bento-lite+compare; agency=`studio-soft`+editorial; live refs redeployed; LocaleSwitcher fix v1.6.1 |
| **Цель** | saas/agency refs используют новые variants/themes |
| **Проверка** | Live refs + refresh/deploy scripts |

**Результат фазы F:** агент выбирает **preset + theme + variants**, а не только hue. ✅

---

### ФАЗА G — Agent product layer (Дни 11–15)

*Цель: Cursor строит сайт из brief с минимумом импровизации.*

#### День 11 — `brief.json` schema ✅

| | |
|---|---|
| **Статус** | Сделано: `docs/schemas/brief.schema.json`, examples, `npm run verify:brief` |
| **Цель** | Машиночитаемый бриф |
| **Сделать** | `docs/schemas/brief.schema.json`; поля: name, hue, preset, sections[], pages[], theme, locales, features{}, figmaUrl?; пример `docs/examples/brief-saas.json` |
| **Проверка** | JSON Schema validate в `npm run verify:brief -- path` |
| **Готово когда** | SITE-BRIEF.md ссылается на schema как source of truth |
| **В Cursor** | «Add brief schema + verifier; keep SITE-BRIEF as human form» |

#### День 12 — `scaffold:from-brief` ✅

| | |
|---|---|
| **Статус** | Сделано: `npm run scaffold:from-brief -- <brief.json>` |
| **Цель** | Одна команда из brief |
| **Сделать** | `npm run scaffold:from-brief -- docs/examples/brief-saas.json` → вызывает new-web-site.sh + theme + pages + i18n flags |
| **Проверка** | Клон появляется с правильным site.json |
| **Готово когда** | HOW-TO-USE: «предпочтительный путь — brief.json» |
| **В Cursor** | «Implement scaffold:from-brief end-to-end» |

#### День 13 — Copy pack generator (agent skill step) ✅

| | |
|---|---|
| **Статус** | Сделано: `npm run copy:apply`, docs/features/COPY-PACK.md, встроено в scaffold:from-brief |
| **Цель** | Skill-шаг: brief → заполненные `messages/en.json` (+ ru stub) |
| **Сделать** | Документ + prompt block в site-builder skill; опционально `scripts/apply-copy-pack.mjs` для merge JSON |
| **Правила** | Не выдумывать секции вне brief; tech names можно EN; UI labels локализовать |
| **Проверка** | `verify:messages` после генерации |
| **Готово когда** | Агент по brief заполняет copy без ручного JSON-редактирования 200 ключей |
| **В Cursor** | «Extend site-builder skill with copy-pack procedure» |

#### День 14 — QA gates для агента ✅

| | |
|---|---|
| **Статус** | Сделано: global + project `site-builder` skills |
| **Цель** | Definition of Done в skill |
| **Сделать** | Обязательный чеклист: `qa` → `verify:messages` (если i18n) → visual smoke → `ship:client` → `domain:verify`/`verify:live` |
| **Проверка** | Провал любого шага = агент не объявляет «готово» |
| **Готово когда** | Global + project site-builder skills синхронизированы |
| **В Cursor** | «Update skills with hard QA gates before claiming ship» |

#### День 15 — Template semver + sync policy ✅

| | |
|---|---|
| **Статус** | Сделано: `CHANGELOG.md`, `docs/TEMPLATE-SYNC.md`, `package.json` → **1.0.0**, tag `v1.0.0` |
| **Цель** | Предсказуемые обновления клонов |
| **Сделать** | `CHANGELOG.md`, tag `v1.0.0` после E+F+G core; `docs/TEMPLATE-SYNC.md` (что тянет sync:clone, breaking changes) |
| **Проверка** | sync:clone с заметками миграции |
| **Готово когда** | Клиент знает версию template |
| **В Cursor** | «Add CHANGELOG + TEMPLATE-SYNC; bump to 1.0.0» |

**Результат фазы G:** «brief.json → live URL» — основной путь в Cursor. **Дни 11–15 ✅**

---

### ФАЗА H — Client ops & product polish (Дни 16–20)

*Цель: после ship клиент и вы оперируете сайтом как продуктом.*

#### День 16 — Analytics feature flag ✅

| | |
|---|---|
| **Статус** | `NEXT_PUBLIC_ANALYTICS=plausible\|vercel\|none`, AnalyticsScripts, ANALYTICS.md |
| **Цель** | `NEXT_PUBLIC_ANALYTICS=plausible|vercel|none` |
| **Сделать** | Тонкий provider в layout; docs/features/ANALYTICS.md |
| **Проверка** | Вкл/выкл без rebuild секций |
| **Готово когда** | Одна env var |

#### День 17 — Lead notify (Resend) как first-class ✅

| | |
|---|---|
| **Статус** | docs/features/RESEND.md; prod:services шаг 3 |
| **Цель** | Документированный + проверяемый notify |
| **Сделать** | Уже есть hooks в Convex — довести checklist, `verify` hint, HOW-TO-USE |
| **Готово когда** | prod:services включает Resend шаг |

#### День 18 — CMS editor UX (безопасный) ✅

| | |
|---|---|
| **Статус** | `cms.canEdit`; editor/seed hidden без ALLOW_DEV_SEED; Open home preview |
| **Цель** | `/status` CMS edit только при seed/auth policy |
| **Готово когда** | Клиент не ломает prod случайным seed |

#### День 19 — Новый пресет `launch` ✅

| | |
|---|---|
| **Статус** | `references/launch.json` + brief example + REFERENCE-SITES |
| **Цель** | Пресет «быстрый запуск продукта» |
| **Готово когда** | 4-й пресет в CLI |

#### День 20 — Sales/delivery kit + ретро ✅

| | |
|---|---|
| **Статус** | docs/SALES-KIT.md; HANDOFF → v3 complete |
| **Цель** | Пакет для продажи фабрики |
| **Готово когда** | ROADMAP v3 закрыт |

**Результат фазы H:** клиентские ops + sales kit; Roadmap v3 ✅

---

### ФАЗА A\* — Активация аккаунтов (опционально, 3 дня)

*Делать параллельно или после E–G, когда нужны реальные leads/payments/свой домен.*

| День | Цель | Команды |
|------|------|---------|
| A1 | Convex prod | `npx convex login` → `convex:init -- --prod` → `convex:vercel` |
| A2 | Custom domain | Vercel Domains → `domain:custom` → `domain:verify` |
| A3 | Stripe test/live | `stripe:setup` / `--live` → `verify:stripe` → `VERIFY_STRIPE_STRICT=1` |

Не блокирует разработку библиотеки.

---

## 3. Матрица «день → артефакт»

| День | Главный артефакт | Команда проверки |
|------|-------------------|------------------|
| 1 | PAGE-CATALOG.md | `npm run qa` |
| 2 | /privacy /terms | `verify:messages` + browser `/ru/privacy` |
| 3 | /about /case | Playwright smoke |
| 4 | blog-lite | sitemap + post render |
| 5 | `--pages` CLI | scaffold dry-run |
| 6 | variant contract | visual = baseline |
| 7 | hero/editorial | `qa:visual` |
| 8 | pricing/compare | `qa:visual` |
| 9 | theme packs | `theme:apply` |
| 10 | refs refresh | `factory:health` |
| 11 | brief.schema.json | `verify:brief` |
| 12 | scaffold:from-brief | новый клон |
| 13 | copy-pack skill | `verify:messages` |
| 14 | QA gates in skill | skill review |
| 15 | v1.0.0 + CHANGELOG | tag |
| 16 | analytics flag | env toggle |
| 17 | Resend notify | inbox |
| 18 | CMS policy | /status |
| 19 | preset launch | scaffold |
| 20 | SALES-KIT.md | handoff |

---

## 4. Приоритеты, если нет 20 дней

| Горизонт | Что взять |
|----------|-----------|
| **3 дня** | День 11–12–14 (brief → scaffold → QA gates) — максимальный ROI для Cursor |
| **5 дней** | Фаза E целиком (multi-page) |
| **10 дней** | E + F (pages + variants/themes) |
| **20 дней** | E→H полный цикл |
| **Параллельно** | A\* только если нужны live payments/leads |

---

## 5. Что **не** переделывать

| Уже есть | Не тратить дни |
|----------|----------------|
| 14 секций + motion primitives + `/motion` | Новый hero «с нуля» без variant |
| i18n + verify:all | Базовая локализация |
| deploy:prebuilt / ship:client | Отладка remote build hangs |
| site.json + messages pipeline | Copy в JSX |
| saas/agency/demo presets | Ещё один идентичный preset без variants |
| Global skills/rules | Параллельный ad-hoc skill без sync |

---

## 6. Риски v3

| Риск | Mitigation |
|------|------------|
| Multi-page раздует template | Pages — opt-in через `--pages` / brief |
| Variants сломают visual baselines | Default variant = текущий UI; snapshots только осознанно |
| Агент игнорирует brief schema | Hard QA gates в skill + `verify:brief` |
| Theme packs → AI-slop | Явные anti-patterns в DESIGN-TOKENS + theme docs |
| CI billing hold | Vercel + local `verify:all` = source of truth |
| Overbuild blog/CMS | blog-lite = files; CMS = optional flag |

---

## 7. Метрики успеха v3

| Метрика | Сейчас (оценка) | Цель после v3 |
|---------|-----------------|---------------|
| Время brief→live (простой лендинг) | ~15–30 мин | ≤15 мин через `scaffold:from-brief` |
| Страниц «из коробки» | 3 (home/motion/status) | 7+ opt-in |
| Вариантов ключевых секций | 1 | ≥2 для hero/pricing/features |
| Theme packs | hue only | 3 именованных |
| Template version | 0.1.0 | 1.0.0 + CHANGELOG |
| Agent DoD | неформальный | skill QA gates |

---

## 8. Связь с фазами 1–42

| Блок | Фазы | Статус |
|------|------|--------|
| Ядро template / motion / Convex / Stripe | 1–19 | ✅ |
| i18n + verify + ship + a11y | 20–39 | ✅ |
| Stripe locale URLs, domain verify, RU polish | 40–42 | ✅ |
| **Multi-page / variants / agent / ops** | **v3 E–H (дни 1–20)** | ⏳ следующий цикл |

---

## 9. Быстрый старт «с понедельника»

1. Открыть этот файл и выбрать горизонт (3 / 5 / 10 / 20 дней).
2. В Cursor (workspace = `web-motion-starter`):  
   `Implement Roadmap v3 Day N exactly as specified in docs/ROADMAP.md`
3. Клиентские сайты — только после Day 12+ или текущим `scaffold:client` (режим B).
4. Аккаунты — Фаза A\* по необходимости.

---

*Roadmap v3 · 2026-07-13 · фазы 1–42 complete · фокус: L7–L10 (pages, variants, agent, ops)*
