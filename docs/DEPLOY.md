# Deploy (Vercel)

Recommended host for Next.js marketing sites scaffolded from this starter.

## Prerequisites

- [Vercel account](https://vercel.com)
- Git repo pushed to GitHub/GitLab/Bitbucket
- Production env vars (see `.env.example`)

## Option A — Vercel Git integration (recommended)

1. Import repo in Vercel dashboard → **Add New Project**
2. Framework preset: **Next.js** (auto-detected)
3. Set environment variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | yes | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_CONVEX_URL` | if Convex | Production Convex URL |
| `STRIPE_SECRET_KEY` | if Stripe | Live or test keys |
| `STRIPE_PRICE_*` | if Stripe | Price IDs |
| `STRIPE_WEBHOOK_SECRET` | if Stripe | From Stripe webhook endpoint |
| `STRIPE_INGEST_SECRET` | if Stripe+Convex | Same in Convex prod env |
| `NEXT_PUBLIC_I18N` | optional | `true` for `/en`, `/ru` |
| `NEXT_PUBLIC_CMS` | optional | `true` with Convex |

4. Deploy — every push to `main` triggers production build

**Convex production:**

```bash
npx convex deploy
npx convex env set STRIPE_INGEST_SECRET "..." --prod
```

## Option B — CLI

```bash
npm i -g vercel
vercel login
npm run qa:all
./scripts/deploy-vercel.sh
```

Script runs lint, typecheck, visual tests, build, then `vercel --prod`.

## Option D — Prebuilt (when cloud build hangs)

Local build + upload artifact — avoids CLI stuck on remote `Building…`:

```bash
npm run deploy:prebuilt
# or: bash scripts/deploy-prebuilt.sh
```

Requires `vercel login` and linked project (`.vercel/project.json`). Check Vercel dashboard until status is **Ready**.

One-shot after billing fix (requires clean git):

```bash
npm run ship:when-ready
# qa:all → verify:sitemap → deploy:prebuilt → sleep → verify:prod
```

Post-deploy smoke only:

```bash
npm run verify:prod        # RU strings on production (3 retries per check)
npm run verify:all         # sitemap + prod
```

Template bakes prod env in `vercel.json`:

```json
"env": {
  "NEXT_PUBLIC_SITE_URL": "https://your-project.vercel.app",
  "NEXT_PUBLIC_I18N": "true"
}
```

## Option C — GitHub Actions

Workflow `.github/workflows/deploy.yml` — manual **Deploy** button or git tag `v*`.

Required repository secrets:

| Secret | Purpose |
|--------|---------|
| `VERCEL_TOKEN` | [Account token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Team/user id from Vercel project settings |
| `VERCEL_PROJECT_ID` | Project id |

## Post-deploy checklist

- [ ] Home loads at production URL
- [ ] Dark mode toggle works
- [ ] `/status` shows Convex data (if backend enabled)
- [ ] Stripe checkout in test mode (if enabled)
- [ ] `NEXT_PUBLIC_SITE_URL` matches actual domain (OG tags, redirects)

## Custom domain

Vercel project → **Settings → Domains** → add domain → update DNS.

Then set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` and redeploy.

## CI vs deploy

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push/PR to `main` | lint, visual, build |
| `deploy.yml` | manual / tag `v*` | production Vercel |

Run CI green before deploying.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Deployments stuck **UNKNOWN** / CLI hangs after upload | Vercel billing or account limit | [Vercel Billing](https://vercel.com/account/billing) — fix payment or raise limit; cancel stuck deploys in dashboard |
| GitHub Deploy job never starts | Same billing message in Actions | Fix Vercel account first |
| Sitemap shows `localhost` | Old static build | `sitemap.xml` is dynamic since Phase 27 — redeploy after billing fix; env in `vercel.json` |

```bash
curl -sI https://YOUR_URL | head -1
# HTTP/2 200
```
