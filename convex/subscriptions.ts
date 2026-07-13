import { v } from "convex/values";

import { internalMutation, query } from "./_generated/server";

const subscriptionRecord = v.object({
  _id: v.id("subscriptions"),
  planId: v.string(),
  customerEmail: v.optional(v.string()),
  status: v.union(v.literal("active"), v.literal("canceled")),
  createdAt: v.number(),
});

/** Public demo feed — last 8 subscriptions with masked emails. */
export const listRecent = query({
  args: {},
  returns: v.array(subscriptionRecord),
  handler: async (ctx) => {
    const rows = await ctx.db.query("subscriptions").order("desc").take(8);
    return rows.map((row) => ({
      _id: row._id,
      planId: row.planId,
      customerEmail: row.customerEmail
        ? maskEmail(row.customerEmail)
        : undefined,
      status: row.status,
      createdAt: row.createdAt,
    }));
  },
});

export const countActive = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const active = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    return active.length;
  },
});

/** Called from HTTP ingest after Stripe checkout (trusted backend only). */
export const recordCheckout = internalMutation({
  args: {
    stripeSessionId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    planId: v.string(),
    customerEmail: v.optional(v.string()),
  },
  returns: v.id("subscriptions"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_session", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        stripeSubscriptionId: args.stripeSubscriptionId,
        planId: args.planId,
        customerEmail: args.customerEmail,
        status: "active",
      });
      return existing._id;
    }

    return await ctx.db.insert("subscriptions", {
      stripeSessionId: args.stripeSessionId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      planId: args.planId,
      customerEmail: args.customerEmail,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

export const markCanceled = internalMutation({
  args: { stripeSubscriptionId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const match = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();
    if (match) {
      await ctx.db.patch(match._id, { status: "canceled" });
    }
    return null;
  },
});

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}
