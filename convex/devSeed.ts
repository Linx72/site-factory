import { v } from "convex/values";

import {
  demoCmsContent,
  demoLeadEmails,
  demoSubscriptions,
} from "./seedContent";
import { mutation } from "./_generated/server";

function assertDevSeedEnabled() {
  if (process.env.ALLOW_DEV_SEED !== "true") {
    throw new Error("Dev seed disabled — set ALLOW_DEV_SEED=true in Convex env");
  }
}

/** Inserts demo subscription rows for /status preview. */
export const seedDemo = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    assertDevSeedEnabled();

    let inserted = 0;
    for (const [index, demo] of demoSubscriptions.entries()) {
      const sessionId = `demo_seed_${Date.now()}_${index}`;
      await ctx.db.insert("subscriptions", {
        stripeSessionId: sessionId,
        stripeSubscriptionId: `sub_demo_${index}`,
        planId: demo.planId,
        customerEmail: demo.email,
        status: "active",
        createdAt: Date.now() - index * 60_000,
      });
      inserted += 1;
    }

    return inserted;
  },
});

/** Inserts demo newsletter leads for /status preview. */
export const seedLeads = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    assertDevSeedEnabled();

    let inserted = 0;
    for (const [index, email] of demoLeadEmails.entries()) {
      const existing = await ctx.db
        .query("leads")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();

      if (existing) continue;

      await ctx.db.insert("leads", {
        email,
        createdAt: Date.now() - index * 45_000,
      });
      inserted += 1;
    }

    return inserted;
  },
});

/** Seeds subscriptions, leads, and CMS demo rows in one call. */
export const seedAll = mutation({
  args: {},
  returns: v.object({
    subscriptions: v.number(),
    leads: v.number(),
    cms: v.number(),
  }),
  handler: async (ctx) => {
    assertDevSeedEnabled();

    let subscriptions = 0;
    for (const [index, demo] of demoSubscriptions.entries()) {
      const sessionId = `demo_seed_all_${Date.now()}_${index}`;
      await ctx.db.insert("subscriptions", {
        stripeSessionId: sessionId,
        stripeSubscriptionId: `sub_demo_all_${index}`,
        planId: demo.planId,
        customerEmail: demo.email,
        status: "active",
        createdAt: Date.now() - index * 60_000,
      });
      subscriptions += 1;
    }

    let leads = 0;
    for (const [index, email] of demoLeadEmails.entries()) {
      const existing = await ctx.db
        .query("leads")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();

      if (existing) continue;

      await ctx.db.insert("leads", {
        email,
        createdAt: Date.now() - index * 45_000,
      });
      leads += 1;
    }

    let cms = 0;
    const now = Date.now();
    for (const row of demoCmsContent) {
      const existing = await ctx.db
        .query("cmsContent")
        .withIndex("by_key_locale", (q) =>
          q.eq("key", row.key).eq("locale", row.locale),
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { value: row.value, updatedAt: now });
      } else {
        await ctx.db.insert("cmsContent", { ...row, updatedAt: now });
      }
      cms += 1;
    }

    return { subscriptions, leads, cms };
  },
});
