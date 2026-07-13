import { v } from "convex/values";

import { demoCmsContent } from "./seedContent";
import { mutation, query } from "./_generated/server";

/** Fetch one CMS string by key + locale (public read for marketing copy). */
export const get = query({
  args: {
    key: v.string(),
    locale: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("cmsContent")
      .withIndex("by_key_locale", (q) =>
        q.eq("key", args.key).eq("locale", args.locale),
      )
      .unique();

    return row?.value ?? null;
  },
});

/** List recent CMS rows for /status preview. */
export const listRecent = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("cmsContent"),
      key: v.string(),
      locale: v.string(),
      value: v.string(),
      updatedAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("cmsContent").order("desc").take(8);
  },
});

/**
 * Whether /status may show the CMS editor + seed controls.
 * True only when Convex env ALLOW_DEV_SEED=true — never in locked prod.
 */
export const canEdit = query({
  args: {},
  returns: v.object({
    canWrite: v.boolean(),
  }),
  handler: async () => {
    return { canWrite: process.env.ALLOW_DEV_SEED === "true" };
  },
});

/** Upsert a CMS string — dev-only when ALLOW_DEV_SEED=true (status editor). */
export const upsert = mutation({
  args: {
    key: v.string(),
    locale: v.string(),
    value: v.string(),
  },
  returns: v.id("cmsContent"),
  handler: async (ctx, args) => {
    if (process.env.ALLOW_DEV_SEED !== "true") {
      throw new Error("CMS write disabled — set ALLOW_DEV_SEED=true in Convex env");
    }

    const trimmed = args.value.trim();
    if (!trimmed) {
      throw new Error("Value cannot be empty");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("cmsContent")
      .withIndex("by_key_locale", (q) =>
        q.eq("key", args.key).eq("locale", args.locale),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value: trimmed, updatedAt: now });
      return existing._id;
    }

    return await ctx.db.insert("cmsContent", {
      key: args.key,
      locale: args.locale,
      value: trimmed,
      updatedAt: now,
    });
  },
});

const demoContent = demoCmsContent;

/**
 * Seeds demo CMS strings for /status preview.
 * Requires Convex env ALLOW_DEV_SEED=true.
 */
export const seedDemo = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    if (process.env.ALLOW_DEV_SEED !== "true") {
      throw new Error("Dev seed disabled — set ALLOW_DEV_SEED=true in Convex env");
    }

    let upserted = 0;
    const now = Date.now();

    for (const row of demoContent) {
      const existing = await ctx.db
        .query("cmsContent")
        .withIndex("by_key_locale", (q) =>
          q.eq("key", row.key).eq("locale", row.locale),
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          value: row.value,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("cmsContent", {
          ...row,
          updatedAt: now,
        });
      }

      upserted += 1;
    }

    return upserted;
  },
});
