import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { CheckoutSuccessBanner } from "@/components/pricing/checkout-success-banner";
import { localizedHomeHref } from "@/lib/i18n/paths";
import { siteFeatures } from "@/lib/site-config";

/** Suspense boundary for useSearchParams in checkout banner. */
export async function CheckoutSuccessBannerWrapper() {
  const t = await getTranslations("Checkout");
  const locale = siteFeatures.i18n ? await getLocale() : undefined;

  const copy = {
    successTitle: t("successTitle"),
    successBody: t("successBody"),
    dismiss: t("dismiss"),
    homeHref: localizedHomeHref(locale),
  };

  return (
    <Suspense fallback={null}>
      <CheckoutSuccessBanner copy={copy} />
    </Suspense>
  );
}
