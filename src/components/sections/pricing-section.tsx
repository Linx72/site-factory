"use client";

import { motion } from "framer-motion";

import { CheckoutButton } from "@/components/pricing/checkout-button";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  defaultPricingCopy,
  type PricingSectionCopy,
} from "@/lib/i18n/section-copy";
import { type PlanId } from "@/lib/pricing/plans";
import { PRICING_PLAN_IDS } from "@/lib/i18n/section-copy";
import type { PricingVariant } from "@/lib/section-variants";
import { resolveImplementedPricingVariant } from "@/lib/section-variants";
import { getSingleLocale } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type PricingSectionProps = {
  copy?: PricingSectionCopy;
  locale?: string;
  /** Layout: `cards` (default) | `compare` (feature matrix). */
  variant?: PricingVariant;
};

function PricingHeader({ copy }: { copy: PricingSectionCopy }) {
  return (
    <>
      <TextReveal
        as="h2"
        text={copy.title}
        className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
      />
      <p className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
        {copy.subtitle}
      </p>
    </>
  );
}

function PricingCards({
  copy,
  locale,
}: {
  copy: PricingSectionCopy;
  locale: string;
}) {
  return (
    <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
      {(Object.keys(copy.plans) as PlanId[]).map((planId) => {
        const localized = copy.plans[planId];
        const highlighted = planId === "pro";

        return (
          <motion.div
            key={planId}
            whileHover={{ y: highlighted ? -4 : -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={cn(highlighted && "md:-mt-2 md:mb-2")}
          >
            <Card
              className={cn(
                "flex h-full flex-col",
                highlighted &&
                  "border-foreground/20 shadow-md ring-1 ring-foreground/10",
              )}
            >
              <CardHeader>
                <CardTitle>{localized.name}</CardTitle>
                <CardDescription>{localized.description}</CardDescription>
                <p className="pt-4 text-3xl font-semibold">
                  {localized.priceLabel}
                  {localized.period ? (
                    <span className="text-base font-normal text-muted-foreground">
                      {localized.period}
                    </span>
                  ) : null}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {localized.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden className="text-foreground">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <CheckoutButton
                  planId={planId}
                  planName={localized.name}
                  highlighted={highlighted}
                  checkoutCopy={copy.checkout}
                  locale={locale}
                />
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/** Stable union of feature rows across plans (order: starter → pro → team). */
function buildCompareRows(copy: PricingSectionCopy): string[] {
  const seen = new Set<string>();
  const rows: string[] = [];
  for (const planId of PRICING_PLAN_IDS) {
    for (const feature of copy.plans[planId].features) {
      if (!seen.has(feature)) {
        seen.add(feature);
        rows.push(feature);
      }
    }
  }
  return rows;
}

/**
 * Compare matrix — same plan/feature copy as cards; checkout CTAs in footer row.
 */
function PricingCompare({
  copy,
  locale,
}: {
  copy: PricingSectionCopy;
  locale: string;
}) {
  const planIds = PRICING_PLAN_IDS;
  const rows = buildCompareRows(copy);

  return (
    <div className="mt-12 overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">{copy.title}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-4 pr-4 font-medium text-muted-foreground">
              {/* feature column */}
            </th>
            {planIds.map((planId) => {
              const plan = copy.plans[planId];
              const highlighted = planId === "pro";
              return (
                <th
                  key={planId}
                  scope="col"
                  className={cn(
                    "px-3 py-4 align-bottom font-semibold",
                    highlighted && "bg-muted/40",
                  )}
                >
                  <p className="text-base">{plan.name}</p>
                  <p className="mt-1 text-2xl tracking-tight">
                    {plan.priceLabel}
                    {plan.period ? (
                      <span className="text-sm font-normal text-muted-foreground">
                        {plan.period}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-2 text-xs font-normal text-muted-foreground">
                    {plan.description}
                  </p>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((feature) => (
            <tr key={feature} className="border-b border-border/70">
              <th
                scope="row"
                className="max-w-[14rem] py-3 pr-4 text-left font-normal text-muted-foreground"
              >
                {feature}
              </th>
              {planIds.map((planId) => {
                const included = copy.plans[planId].features.includes(feature);
                const highlighted = planId === "pro";
                return (
                  <td
                    key={planId}
                    className={cn(
                      "px-3 py-3 text-center",
                      highlighted && "bg-muted/40",
                    )}
                  >
                    {included ? (
                      <span className="font-medium text-foreground" aria-hidden>
                        ✓
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50" aria-hidden>
                        —
                      </span>
                    )}
                    <span className="sr-only">
                      {included ? "Included" : "Not included"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-6 pr-4" />
            {planIds.map((planId) => {
              const plan = copy.plans[planId];
              const highlighted = planId === "pro";
              return (
                <td
                  key={planId}
                  className={cn("px-3 py-6 align-top", highlighted && "bg-muted/40")}
                >
                  <CheckoutButton
                    planId={planId}
                    planName={plan.name}
                    highlighted={highlighted}
                    checkoutCopy={copy.checkout}
                    locale={locale}
                  />
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/** Pricing section — `cards` or `compare` from site.json variants. */
export function PricingSection({
  copy = defaultPricingCopy,
  locale = getSingleLocale(),
  variant = "cards",
}: PricingSectionProps) {
  const layout = resolveImplementedPricingVariant(variant);

  return (
    <section id="pricing" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-5xl">
        <PricingHeader copy={copy} />
        {layout === "compare" ? (
          <PricingCompare copy={copy} locale={locale} />
        ) : (
          <PricingCards copy={copy} locale={locale} />
        )}
      </div>
    </section>
  );
}
