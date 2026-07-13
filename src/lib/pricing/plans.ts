/**
 * Pricing plan metadata (client-safe). Stripe Price IDs resolved on the server.
 */
export type PlanId = "starter" | "pro" | "team";

export type PricingPlan = {
  id: PlanId;
  name: string;
  priceLabel: string;
  period?: string;
  description: string;
  features: readonly string[];
  highlighted: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceLabel: "Free",
    description: "Motion primitives and demo sections to fork.",
    features: ["Framer + GSAP setup", "Lenis scroll", "6 section templates"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceLabel: "$29",
    period: "/mo",
    description: "Figma MCP workflow and shadcn UI blocks.",
    features: [
      "Motion context import",
      "Dialog, sheet, tabs",
      "Scroll pin storytelling",
      "Priority patterns",
    ],
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    priceLabel: "$99",
    period: "/mo",
    description: "Multi-page sites with ChatPRD alignment.",
    features: ["PRD → implementation", "Custom design tokens", "Team rules"],
    highlighted: false,
  },
];

export function getPlanById(id: PlanId): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === id);
}
