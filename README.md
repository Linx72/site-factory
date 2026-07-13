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
npm run storefront:health      # verify:storefront + verify:lead-api
```

## Ship

```bash
npm run deploy:prebuilt        # Vercel prod (fly-type/site-factory)
npm run domain:verify          # HTTP + storefront smoke
```

Первый раз: `vercel link --yes` (scope `fly-type`, project `site-factory`).

**GitHub Deploy:** если workflow Deploy падает на `vercel pull` — обновите `VERCEL_TOKEN` в [GitHub secrets](https://github.com/Linx72/site-factory/settings/secrets/actions) (токен с [vercel.com/account/tokens](https://vercel.com/account/tokens)).

Если **https://site-factory-hq.vercel.app** не открывается, а деплой Ready — пересоздайте alias: `bash scripts/verify-alias.sh` (или `npm run deploy:prebuilt` — скрипт вызывает его после alias).

## Leads (без Convex)

1. **Сейчас:** форма `#contact` → mailto `brief@sitefactory.dev`
2. **Resend (рекомендуется):** Vercel Production env:
   - `RESEND_API_KEY`, `LEADS_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_LEAD_API=true` → `POST /api/lead`
   - Быстро: `RESEND_API_KEY=re_... LEADS_NOTIFY_EMAIL=you@domain.com npm run resend:vercel && npm run deploy:prebuilt`
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
