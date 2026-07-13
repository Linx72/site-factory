import { getRequestConfig } from "next-intl/server";

import { routing, type AppLocale } from "./routing";

/** Single-locale sites (i18n off) can set NEXT_PUBLIC_DEFAULT_LOCALE=ru. */
function resolveLocale(requestLocale: string | undefined): AppLocale {
  const i18nEnabled = process.env.NEXT_PUBLIC_I18N === "true";
  let locale = requestLocale;

  if (!locale || !routing.locales.includes(locale as AppLocale)) {
    if (!i18nEnabled) {
      const single = process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim();
      if (single && routing.locales.includes(single as AppLocale)) {
        locale = single;
      } else {
        locale = routing.defaultLocale;
      }
    } else {
      locale = routing.defaultLocale;
    }
  }

  return locale as AppLocale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
