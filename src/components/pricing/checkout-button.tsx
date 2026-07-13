"use client";

import { useState } from "react";

import type { PlanId } from "@/lib/pricing/plans";
import {
  defaultPricingCopy,
  type PricingCheckoutCopy,
} from "@/lib/i18n/section-copy";
import { Button } from "@/components/ui/button";
import { navigateToBriefWithPackage } from "@/lib/brief-package";
import { siteFeatures, getSingleLocale } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type CheckoutButtonProps = {
  planId: PlanId;
  planName: string;
  highlighted?: boolean;
  className?: string;
  checkoutCopy?: PricingCheckoutCopy;
  /** BCP 47-ish locale for /api/checkout errors — `en` or `ru`. */
  locale?: string;
};

/**
 * Starts Stripe Checkout for paid plans when configured.
 * Without Stripe (or Starter): smooth-scroll to #contact — factory storefront path.
 */
export function CheckoutButton({
  planId,
  planName,
  highlighted = false,
  className,
  checkoutCopy = defaultPricingCopy.checkout,
  locale = getSingleLocale(),
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiLocale = locale === "ru" ? "ru" : "en";

  async function handleClick() {
    setError(null);

    if (planId === "starter" || !siteFeatures.stripe) {
      navigateToBriefWithPackage(planName);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, locale: apiLocale }),
      });
      const data: { url?: string; error?: string; hint?: string } =
        await response.json();

      if (!response.ok) {
        setError(data.hint ?? data.error ?? checkoutCopy.unavailable);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError(checkoutCopy.networkError);
    } finally {
      setLoading(false);
    }
  }

  const label = loading
    ? checkoutCopy.redirecting
    : checkoutCopy.choosePlan.replace("{plan}", planName);

  return (
    <div className={cn("w-full", className)}>
      <Button
        className="w-full rounded-full"
        variant={highlighted ? "default" : "outline"}
        disabled={loading}
        onClick={handleClick}
      >
        {label}
      </Button>
      {error ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">{error}</p>
      ) : null}
    </div>
  );
}
