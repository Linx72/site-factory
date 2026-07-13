/**
 * Analytics provider selection — one env var switches scripts on/off.
 * Docs: docs/features/ANALYTICS.md
 *
 * NEXT_PUBLIC_ANALYTICS=plausible|vercel|none (empty = none)
 * Plausible also needs NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com
 */

export const ANALYTICS_PROVIDERS = ["none", "plausible", "vercel"] as const;
export type AnalyticsProvider = (typeof ANALYTICS_PROVIDERS)[number];

function normalizeProvider(raw: string | undefined): AnalyticsProvider {
  const value = (raw ?? "none").trim().toLowerCase();
  if (value === "plausible" || value === "vercel") {
    return value;
  }
  return "none";
}

/** Resolved at build time from NEXT_PUBLIC_* (inlined by Next). */
export function getAnalyticsProvider(): AnalyticsProvider {
  return normalizeProvider(process.env.NEXT_PUBLIC_ANALYTICS);
}

/** Hostname for Plausible (no protocol). Empty when not configured. */
export function getPlausibleDomain(): string {
  return process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? "";
}

/** True when a provider will inject scripts. */
export function isAnalyticsEnabled(): boolean {
  const provider = getAnalyticsProvider();
  if (provider === "none") return false;
  if (provider === "plausible") return Boolean(getPlausibleDomain());
  return true;
}
