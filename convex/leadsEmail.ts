"use node";

import { v } from "convex/values";

import { internalAction } from "./_generated/server";

/**
 * Sends owner notification when a new lead signs up.
 * Skips silently if RESEND_API_KEY or LEADS_NOTIFY_EMAIL are unset (demo mode).
 */
export const notifyOwner = internalAction({
  args: { email: v.string() },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.LEADS_NOTIFY_EMAIL;
    const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

    if (!apiKey || !notifyTo) {
      console.log(
        "[leads] notify skipped — set RESEND_API_KEY + LEADS_NOTIFY_EMAIL in Convex env",
        args.email,
      );
      return null;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [notifyTo],
        subject: `New lead: ${args.email}`,
        html: `<p>New newsletter signup on <strong>Web Motion Starter</strong>:</p><p>${args.email}</p>`,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[leads] Resend error:", response.status, body);
    }

    return null;
  },
});
