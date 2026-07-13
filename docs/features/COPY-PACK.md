# Copy pack (Site Factory)

Apply brand/hero strings from a validated `brief.json` into `messages/` and `content/site.json` without inventing new sections.

## Command

```bash
# Inside a clone (cwd = project), or pass project dir:
npm run copy:apply -- path/to/brief.json
npm run copy:apply -- path/to/brief.json /path/to/clone
```

Called automatically at the end of `npm run scaffold:from-brief`.

## What it writes

| Target | Fields |
|--------|--------|
| `messages/en.json` → `Home.hero` | eyebrow, title, description, primaryCta, secondaryCta from brief |
| `Home.header.cta` | from `hero.primaryCta` |
| `Home.footer.tagline` | `name · description` |
| `messages/ru.json` | same hero strings as **stub** when i18n/ru (translate later) |
| `content/site.json` | name, tagline, hero |
| `src/lib/site-config.ts` | name, description literals |
| `content/copy-pack-applied.json` | audit stamp |

## Agent rules (Day 13)

1. Run `verify:brief` before apply (script does this).
2. **Do not** add section ids outside `brief.sections` / preset.
3. Tech product names (Framer, GSAP…) may stay English.
4. After applying, if i18n: translate RU beyond the stub, then `npm run verify:messages`.
5. Remaining FAQ/features/pricing body copy — edit in messages or leave preset defaults until client supplies text.

## Skill prompt block

```
After scaffold:from-brief (or when brief.json exists in content/):
1. npm run copy:apply -- content/brief.json   # if not already applied
2. Fill remaining Home.* copy only for sections in the brief — keep keys, change values
3. npm run verify:messages when i18n is on
4. Continue QA gates (qa → visual → ship)
```
