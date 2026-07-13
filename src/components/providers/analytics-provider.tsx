"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import Script from "next/script";

import {
  getAnalyticsProvider,
  getPlausibleDomain,
} from "@/lib/analytics";

/**
 * Thin analytics inject — controlled by NEXT_PUBLIC_ANALYTICS.
 * Renders nothing when provider is `none` or Plausible domain is missing.
 * Mount once in root layout.
 */
export function AnalyticsScripts() {
  const provider = getAnalyticsProvider();

  if (provider === "vercel") {
    return <VercelAnalytics />;
  }

  if (provider === "plausible") {
    const domain = getPlausibleDomain();
    if (!domain) {
      return null;
    }
    return (
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
