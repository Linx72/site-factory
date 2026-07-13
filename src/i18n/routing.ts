import { defineRouting } from "next-intl/routing";

/** Supported locales — enable with NEXT_PUBLIC_I18N=true */
export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
