# Site Factory — storefront

Живая витрина пакетов **Flash / Sprint / Build**. Пресет `launch`, тема `editorial-ink`, RU-копирайт без i18n (`NEXT_PUBLIC_DEFAULT_LOCALE=ru`).

| | |
|---|---|
| **Live** | https://site-factory-hq.vercel.app |
| **Repo** | https://github.com/Linx72/site-factory |
| **Brief** | `content/brief.json` (from template `docs/examples/brief-site-factory.json`) |

## Develop

```bash
npm install
npm run dev                    # http://localhost:3000
npm run qa
npm run verify:storefront      # prod smoke (после деплоя)
```

## Ship

```bash
npm run deploy:prebuilt        # Vercel prod (fly-type/site-factory)
npm run domain:verify          # HTTP + storefront smoke
```

Первый раз: `vercel link --yes` (scope `fly-type`, project `site-factory`).

## Leads (без Convex)

1. **Сейчас:** форма `#contact` → mailto `brief@sitefactory.dev`
2. **Resend (рекомендуется):** Vercel Production env:
   - `RESEND_API_KEY`, `LEADS_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_LEAD_API=true` → `POST /api/lead`
3. **Convex (Sprint/Build):** `npx convex login` → `npm run convex:init -- --prod` → `npm run convex:vercel -- <URL>`

См. [docs/features/RESEND.md](docs/features/RESEND.md).

## Custom domain

```bash
# Vercel Dashboard → Domains → DNS valid
npm run domain:custom -- your-domain.com
npm run domain:verify -- https://your-domain.com
```

## Пакеты (pricing)

| ID | Имя | Срок |
|----|-----|------|
| starter | Flash | ~15 мин–1 день |
| pro | Sprint | ~3 дня |
| team | Build | ~2 недели |

Кнопки без Stripe ведут на `#contact`.

## Docs

- [docs/SALES-KIT.md](docs/SALES-KIT.md) — продажа (в шаблоне)
- [docs/CUSTOM-DOMAIN.md](docs/CUSTOM-DOMAIN.md)
- [docs/HANDOFF.md](docs/HANDOFF.md)
