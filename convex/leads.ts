import { v } from "convex/values";

import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Newsletter signup — stores email in leads table. */
export const subscribe = mutation({
  args: { email: v.string() },
  returns: v.union(v.literal("ok"), v.literal("exists")),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    if (!emailPattern.test(email)) {
      throw new Error("Invalid email address");
    }

    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      return "exists";
    }

    await ctx.db.insert("leads", {
      email,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.leadsEmail.notifyOwner, { email });

    return "ok";
  },
});

/** Total newsletter signups — shown live on contact section. */
export const count = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const rows = await ctx.db.query("leads").collect();
    return rows.length;
  },
});

/** Recent signups for /status dashboard (masked). */
export const listRecent = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("leads"),
      email: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const rows = await ctx.db.query("leads").order("desc").take(6);
    return rows.map((row) => ({
      _id: row._id,
      email: maskEmail(row.email),
      createdAt: row.createdAt,
    }));
  },
});

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}
