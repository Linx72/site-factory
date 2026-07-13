"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { routing, type AppLocale } from "@/i18n/routing";
import { siteFeatures } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * EN / RU toggle — only when NEXT_PUBLIC_I18N=true and on /[locale] routes.
 * Outer gate avoids calling useTranslations without NextIntlClientProvider
 * (non-locale `/` has no provider when i18n is off).
 */
export function LocaleSwitcher() {
  if (!siteFeatures.i18n) {
    return null;
  }
  return <LocaleSwitcherActive />;
}

function LocaleSwitcherActive() {
  const params = useParams();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");
  const locale = params?.locale as AppLocale | undefined;

  if (!locale || !routing.locales.includes(locale)) {
    return null;
  }

  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), "") || "";

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex items-center gap-1 rounded-full border border-border p-0.5 text-xs"
    >
      {routing.locales.map((loc) => {
        const href = `/${loc}${pathWithoutLocale}`;
        return (
          <Link
            key={loc}
            href={href}
            aria-current={loc === locale ? "page" : undefined}
            className={cn(
              "rounded-full px-2 py-1 uppercase transition-colors",
              loc === locale
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {loc}
          </Link>
        );
      })}
    </div>
  );
}
