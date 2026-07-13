/**
 * Checkout API error strings — server-side, keyed by locale from POST body.
 * Keeps /api/checkout responses aligned with Home.pricing.checkout on the client.
 */
export type CheckoutApiLocale = "en" | "ru";

export type CheckoutApiCopy = {
  invalidPlan: string;
  planNotFound: string;
  starterFree: string;
  stripeNotConfigured: string;
  stripeHint: string;
  sessionFailed: string;
};

const copyByLocale: Record<CheckoutApiLocale, CheckoutApiCopy> = {
  en: {
    invalidPlan: "Invalid plan",
    planNotFound: "Plan not found",
    starterFree: "Starter plan is free — no checkout required",
    stripeNotConfigured: "Stripe is not configured",
    stripeHint:
      "Set STRIPE_SECRET_KEY and STRIPE_PRICE_PRO / STRIPE_PRICE_TEAM in .env.local",
    sessionFailed: "Failed to create checkout session",
  },
  ru: {
    invalidPlan: "Неверный тариф",
    planNotFound: "Тариф не найден",
    starterFree: "Тариф Старт бесплатный — checkout не нужен",
    stripeNotConfigured: "Stripe не настроен",
    stripeHint:
      "Укажите STRIPE_SECRET_KEY и STRIPE_PRICE_PRO / STRIPE_PRICE_TEAM в env",
    sessionFailed: "Не удалось создать сессию checkout",
  },
};

/** Normalize locale from client body or Accept-Language. */
export function resolveCheckoutLocale(
  bodyLocale: unknown,
  acceptLanguage?: string | null,
): CheckoutApiLocale {
  if (bodyLocale === "ru") return "ru";
  if (bodyLocale === "en") return "en";
  if (acceptLanguage?.toLowerCase().includes("ru")) return "ru";
  return "en";
}

export function checkoutApiCopyFor(locale: CheckoutApiLocale): CheckoutApiCopy {
  return copyByLocale[locale];
}
