# Production checklist

Applies to any Site Factory project. **Aurora showcase:** see also [DEMO-STUDIO.md](./DEMO-STUDIO.md).

## 1. Pre-ship

```bash
npm run qa:all && npm run build
```

## 2. Vercel

```bash
npm run vercel:setup    # vercel link (once)
npm run vercel:git      # connect GitHub → auto-deploy on push
npm run ship            # qa + prebuilt vercel --prod
```

### Required env (Production)

| Variable | Example | Why |
|----------|---------|-----|
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.vercel.app` | OG, sitemap, metadata |

```bash
npm run env:production   # demo-studio: patches vercel.json + redeploy
```

**Tip:** Prefer `vercel.json` env block over CLI pipe (avoids empty values):

```json
"env": { "NEXT_PUBLIC_SITE_URL": "https://your-site.vercel.app" }
```

### Optional env

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Live contact + `/status` |
| `NEXT_PUBLIC_I18N=true` | `/en`, `/ru` |
| `NEXT_PUBLIC_CMS=true` | Convex copy overrides |

## 3. Custom domain

Vercel → Settings → Domains → update `NEXT_PUBLIC_SITE_URL` → redeploy.

## 4. Convex (optional)

```bash
npx convex login                    # once per machine
npm run convex:init               # dev deployment
npm run convex:init -- --prod       # production deploy
npm run convex:vercel -- <URL>    # link to Vercel + redeploy
```

Full guide: [features/CONVEX.md](./features/CONVEX.md)

## 5. Verify

```bash
npm run verify:all       # sitemap + prod i18n + backend + stripe smoke
npm run verify:backend   # Convex wired on /status (warn if missing)
npm run verify:stripe    # Checkout API (warn if STRIPE_* unset)
npm run prod:services    # Convex + Stripe onboarding checklist
```

```bash
URL="https://your-site.vercel.app"
curl -sI "$URL" | head -1
curl -sI "$URL/opengraph-image" | head -1
```

### GitHub Actions CI

If CI fails in a few seconds with a **billing hold**, that is an account limit — not a code failure. Ship via Vercel (`npm run deploy:prebuilt` or `npm run ship:when-ready`) until billing is restored.

## 6. Rollback

Vercel → Deployments → previous → **Promote to Production**.

See [DEPLOY.md](./DEPLOY.md) for GitHub Actions secrets.
