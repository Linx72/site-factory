# Convex backend (Site Factory)

Convex powers optional live features: contact form, leads, CMS overrides, `/status` dev panels.

## When you need it

| Feature | Requires Convex |
|---------|-----------------|
| Static marketing site | No |
| Live contact / newsletter | Yes |
| `/status` panels + seed demo data | Yes |
| CMS copy overrides (`NEXT_PUBLIC_CMS=true`) | Yes |

Without `NEXT_PUBLIC_CONVEX_URL`, the site builds and ships with static fallbacks.

## Quick setup (new clone)

```bash
# 1. Login (once per machine)
npx convex login

# 2. Configure dev deployment (writes convex.json + .env.local)
npm run convex:init

# 3. Run backend + frontend
npm run dev:convex   # terminal 1
npm run dev          # terminal 2

open http://localhost:3000/status
```

## Production

```bash
npm run convex:init -- --prod
# or: npm run convex:prod

# Link URL to Vercel
npm run convex:vercel -- https://YOUR-PROD.convex.cloud
```

Or manually set `NEXT_PUBLIC_CONVEX_URL` in Vercel → redeploy.

## Env vars

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` / Vercel | Frontend → Convex |
| `ALLOW_DEV_SEED` | Convex env (dev) | `/status` seed buttons |
| `ALLOW_DEV_SEED` | Convex env (`--prod`) | Staging only — `npm run convex:seed -- --prod` |
| `CONVEX_DEPLOY_KEY` | GitHub secret (CI) | `npx convex deploy` in Actions |

## Tables (schema)

- `leads` — newsletter / contact emails
- `subscriptions` — Stripe demo status
- `cmsContent` — optional copy overrides

See also: [CMS.md](./CMS.md), [DEPLOY.md](../DEPLOY.md).

## Agent mode (cloud coding agents)

For isolated agent sessions, use anonymous dev:

```bash
CONVEX_AGENT_MODE=anonymous npx convex dev
```

Do **not** use agent mode for your own local development — just `npx convex login` + `npx convex dev`.

## Verify

```bash
# Dev
curl -s "http://127.0.0.1:3210/version"  # when convex dev running

# Prod contact form
# Submit email on /#contact → check Convex dashboard → leads table
```
