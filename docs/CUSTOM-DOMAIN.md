# Custom domain (Site Factory)

Point production metadata (OG, sitemap, canonical) at your own domain.

## Prerequisites

1. Vercel project linked (`npm run vercel:setup`)
2. Domain purchased (Cloudflare, Namecheap, etc.)

## Steps

### 1. Add domain in Vercel

Vercel Dashboard → **Project → Settings → Domains** → Add domain:

- `example.com`
- `www.example.com` (optional redirect)

Follow DNS instructions (A record or CNAME). Wait until **Valid**.

### 2. Update SITE_URL + redeploy

```bash
npm run domain:custom -- example.com
# or full URL:
npm run domain:custom -- https://www.example.com
```

This script:

- Patches `vercel.json` → `NEXT_PUBLIC_SITE_URL`
- Runs prebuilt production redeploy

### 3. Verify

```bash
npm run domain:verify -- https://example.com
# or
URL="https://example.com" npm run domain:verify
```

```bash
curl -sI "$URL" | head -1
curl -sI "$URL/opengraph-image" | head -1
VERIFY_PROD_URL="$URL" npm run verify:prod   # RU strings when i18n on
```

Check OG preview: [opengraph.xyz](https://www.opengraph.xyz/)

After custom domain, update Stripe webhook URL to `https://YOUR_DOMAIN/api/stripe/webhook` if checkout is enabled.

## demo-studio example

```bash
cd ~/Projects/demo-studio
# After adding auroralabs.studio in Vercel:
npm run domain:custom -- auroralabs.studio
```

## Apex vs www

| Setup | `NEXT_PUBLIC_SITE_URL` |
|-------|------------------------|
| Apex only | `https://example.com` |
| www canonical | `https://www.example.com` |
| Vercel redirect www→apex | Use apex URL in env |

Match the URL users see in the browser bar for correct OG/sitemap links.
