# Live Site Factory deployments

All production URLs on Vercel (`fly-type` team).

| Site | Role | URL | GitHub |
|------|------|-----|--------|
| **Aurora Labs** | Showcase + i18n | https://demo-studio-orpin.vercel.app | [demo-studio](https://github.com/Linx72/demo-studio) |
| | EN locale | https://demo-studio-orpin.vercel.app/en | |
| | RU locale | https://demo-studio-orpin.vercel.app/ru | |
| **Flowbase** | SaaS preset reference | https://site-ref-saas.vercel.app | [site-ref-saas](https://github.com/Linx72/site-ref-saas) |
| **Northline Studio** | Agency preset reference | https://site-ref-agency.vercel.app | [site-ref-agency](https://github.com/Linx72/site-ref-agency) |
| **Launchpad** | Launch preset reference | https://site-ref-launch.vercel.app | [site-ref-launch](https://github.com/Linx72/site-ref-launch) |
| **Site Factory** | Storefront (Flash/Sprint/Build) | https://site-factory-hq.vercel.app | [site-factory](https://github.com/Linx72/site-factory) |
| **Flowstack** | Client delivery example | https://client-flowstack.vercel.app | [client-flowstack](https://github.com/Linx72/client-flowstack) |

## OG previews

Append `/opengraph-image` to any URL above.

## Health check

```bash
cd ~/Projects/web-motion-starter && npm run verify:live      # prod URLs only
cd ~/Projects/web-motion-starter && npm run factory:health   # QA all clones + repos
```

## Ship a new client

```bash
npm run scaffold:client -- client-name --preset saas
cd ~/Projects/client-name
npm install && npm run qa:all
npm run ship:client
```

See [CLIENT-SITE.md](./CLIENT-SITE.md).
