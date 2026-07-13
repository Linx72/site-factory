/** Shared demo rows for devSeed and cms.seedDemo — keep in sync. */

export const demoSubscriptions = [
  { planId: "pro", email: "demo.pro@example.com" },
  { planId: "team", email: "demo.team@example.com" },
  { planId: "pro", email: "alex@studio.test" },
] as const;

export const demoLeadEmails = [
  "maya@studio.test",
  "dev@motion.dev",
  "hello@example.com",
] as const;

export const demoCmsContent = [
  {
    key: "home.hero.title",
    locale: "en",
    value: "Beautiful motion ready to ship",
  },
  {
    key: "home.hero.title",
    locale: "ru",
    value: "Красивый motion — из CMS Convex",
  },
  {
    key: "home.hero.description",
    locale: "en",
    value:
      "This hero description is loaded from Convex cmsContent — edit via dashboard or seed.",
  },
  {
    key: "home.cta.title",
    locale: "en",
    value: "Ready for your Figma file",
  },
  {
    key: "home.cta.title",
    locale: "ru",
    value: "Готовы к вашему Figma-макету",
  },
  {
    key: "home.cta.description",
    locale: "en",
    value:
      "Paste a design URL in chat — motion, layout, and components land in this stack.",
  },
] as const;
