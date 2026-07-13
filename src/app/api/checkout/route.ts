import { NextResponse } from "next/server";

import {
  checkoutApiCopyFor,
  resolveCheckoutLocale,
} from "@/lib/i18n/checkout-api-copy";
import { stripeCheckoutReturnUrls } from "@/lib/i18n/checkout-return-urls";
import { getPlanById, type PlanId } from "@/lib/pricing/plans";
import { getStripePriceId } from "@/lib/pricing/stripe-prices";
import { getStripe } from "@/lib/stripe/client";

function parsePlanId(value: unknown): PlanId | null {
  if (value === "starter" || value === "pro" || value === "team") return value;
  return null;
}

type CheckoutBody = {
  planId?: unknown;
  locale?: unknown;
};

/**
 * POST /api/checkout — creates a Stripe Checkout Session for paid plans.
 * Returns 503 when Stripe env vars are missing (demo mode).
 * Accepts optional `locale` (`en` | `ru`) for localized error payloads.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json();
  const record =
    typeof body === "object" && body !== null ? (body as CheckoutBody) : {};
  const locale = resolveCheckoutLocale(
    record.locale,
    request.headers.get("accept-language"),
  );
  const copy = checkoutApiCopyFor(locale);

  const planId = parsePlanId(record.planId);

  if (!planId) {
    return NextResponse.json({ error: copy.invalidPlan }, { status: 400 });
  }
  const plan = getPlanById(planId);
  if (!plan) {
    return NextResponse.json({ error: copy.planNotFound }, { status: 404 });
  }

  if (planId === "starter") {
    return NextResponse.json({ error: copy.starterFree }, { status: 400 });
  }

  const stripe = getStripe();
  const priceId = getStripePriceId(planId);

  if (!stripe || !priceId) {
    return NextResponse.json(
      {
        error: copy.stripeNotConfigured,
        hint: copy.stripeHint,
      },
      { status: 503 },
    );
  }

  const { successUrl, cancelUrl } = stripeCheckoutReturnUrls(locale);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { planId, locale },
  });

  if (!session.url) {
    return NextResponse.json({ error: copy.sessionFailed }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
