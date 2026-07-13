import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  subscriptions: defineTable({
    stripeSessionId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    planId: v.string(),
    customerEmail: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("canceled")),
    createdAt: v.number(),
  })
    .index("by_session", ["stripeSessionId"])
    .index("by_email", ["customerEmail"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),

  leads: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  /** CMS-lite: editable marketing strings keyed by path + locale. */
  cmsContent: defineTable({
    key: v.string(),
    locale: v.string(),
    value: v.string(),
    updatedAt: v.number(),
  }).index("by_key_locale", ["key", "locale"]),
});
