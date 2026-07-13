import type { PlanId } from "@/lib/pricing/plans";

/** Maps plan IDs to Stripe Price IDs from environment (server-only usage). */
const stripePriceByPlan: Partial<Record<PlanId, string | undefined>> = {
  pro: process.env.STRIPE_PRICE_PRO,
  team: process.env.STRIPE_PRICE_TEAM,
};

export function getStripePriceId(planId: PlanId): string | undefined {
  return stripePriceByPlan[planId];
}
