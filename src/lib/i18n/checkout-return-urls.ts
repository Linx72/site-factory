/**
 * Stripe Checkout return URLs — respect i18n locale prefix on success/cancel redirects.
 */
import type { CheckoutApiLocale } from "@/lib/i18n/checkout-api-copy";
import { localizedHomeHref } from "@/lib/i18n/paths";
import { siteConfig, siteFeatures } from "@/lib/site-config";

/** Build absolute success/cancel URLs for Stripe Checkout sessions. */
export function stripeCheckoutReturnUrls(locale: CheckoutApiLocale): {
  successUrl: string;
  cancelUrl: string;
} {
  const localeSegment = siteFeatures.i18n ? locale : undefined;
  const home = `${siteConfig.url}${localizedHomeHref(localeSegment)}`;

  return {
    successUrl: `${home}?checkout=success`,
    cancelUrl: `${home}#pricing`,
  };
}
