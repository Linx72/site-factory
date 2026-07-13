import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe/client";
import { handleStripeEvent } from "@/lib/stripe/webhook-handlers";

/**
 * POST /api/stripe/webhook — Stripe event receiver.
 * Requires STRIPE_WEBHOOK_SECRET from `stripe listen` or Dashboard webhook endpoint.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("[stripe] webhook verification failed", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await handleStripeEvent(event);

  return NextResponse.json({ received: true });
}
