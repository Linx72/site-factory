import { siteConfig } from "@/lib/site-config";

type StripeForwardPayload = {
  type: string;
  data: { object: Record<string, unknown> };
};

/**
 * Forwards a verified Stripe event to Convex HTTP ingest.
 * No-op when CONVEX_SITE_URL or STRIPE_INGEST_SECRET is unset.
 */
export async function forwardStripeEventToConvex(
  event: StripeForwardPayload,
): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  const secret = process.env.STRIPE_INGEST_SECRET;

  if (!siteUrl || !secret) {
    console.info("[stripe] Convex ingest skipped — missing env");
    return;
  }

  const response = await fetch(`${siteUrl}/stripe-ingest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    console.error("[stripe] Convex ingest failed", response.status);
  }
}

export { siteConfig };
