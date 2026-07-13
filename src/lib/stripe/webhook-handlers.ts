import type Stripe from "stripe";

import { forwardStripeEventToConvex } from "@/lib/convex/stripe-forward";

/**
 * Handles Stripe webhook events — logs and forwards to Convex for persistence.
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("[stripe] checkout.session.completed", {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        planId: session.metadata?.planId,
      });
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.info("[stripe] customer.subscription.deleted", {
        subscriptionId: subscription.id,
      });
      break;
    }
    default:
      console.info("[stripe] unhandled event", event.type);
  }

  await forwardStripeEventToConvex({
    type: event.type,
    data: { object: event.data.object as unknown as Record<string, unknown> },
  });
}
