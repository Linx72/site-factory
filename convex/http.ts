import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

/**
 * POST /stripe-ingest — Next.js Stripe webhook forwards verified events here.
 * Auth: Authorization: Bearer STRIPE_INGEST_SECRET (same value in Next.js .env.local).
 */
http.route({
  path: "/stripe-ingest",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const expected = process.env.STRIPE_INGEST_SECRET;
    const auth = request.headers.get("Authorization");

    if (!expected || auth !== `Bearer ${expected}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || !("type" in body)) {
      return new Response("Bad Request", { status: 400 });
    }

    const eventType = (body as { type: string }).type;
    const data = (body as { data?: { object?: Record<string, unknown> } }).data
      ?.object;

    if (eventType === "checkout.session.completed" && data) {
      await ctx.runMutation(internal.subscriptions.recordCheckout, {
        stripeSessionId: String(data.id ?? ""),
        stripeSubscriptionId:
          typeof data.subscription === "string" ? data.subscription : undefined,
        planId: String(
          (data.metadata as Record<string, string> | undefined)?.planId ?? "pro",
        ),
        customerEmail:
          typeof (data.customer_details as { email?: string } | undefined)
            ?.email === "string"
            ? (data.customer_details as { email: string }).email
            : undefined,
      });
    }

    if (eventType === "customer.subscription.deleted" && data) {
      const subId = typeof data.id === "string" ? data.id : "";
      if (subId) {
        await ctx.runMutation(internal.subscriptions.markCanceled, {
          stripeSubscriptionId: subId,
        });
      }
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
