"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import {
  defaultStatusPageCopy,
  type StatusSubscriptionsCopy,
} from "@/lib/i18n/status-dashboard-copy";
import { api } from "../../../convex/_generated/api";

type SubscriptionStatusPanelProps = {
  copy?: StatusSubscriptionsCopy;
};

/** Live subscription feed from Convex (demo dashboard). */
export function SubscriptionStatusPanel({
  copy = defaultStatusPageCopy.subscriptions,
}: SubscriptionStatusPanelProps) {
  const recent = useQuery(api.subscriptions.listRecent);
  const activeCount = useQuery(api.subscriptions.countActive);
  const seedDemo = useMutation(api.devSeed.seedDemo);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  async function handleSeed() {
    setSeedError(null);
    setSeeding(true);
    try {
      await seedDemo({});
    } catch (error) {
      setSeedError(error instanceof Error ? error.message : copy.seedFailed);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <FadeIn className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-border bg-card p-8">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {copy.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-2 text-muted-foreground">{copy.description}</p>

        <p className="mt-8 text-4xl font-semibold tabular-nums">
          {activeCount === undefined ? "—" : activeCount}
          <span className="ml-2 text-base font-normal text-muted-foreground">
            {copy.active}
          </span>
        </p>

        <ul className="mt-8 space-y-3">
          {recent === undefined ? (
            <li className="text-sm text-muted-foreground">{copy.loading}</li>
          ) : recent.length === 0 ? (
            <li className="space-y-3 text-sm text-muted-foreground">
              <p>{copy.empty}</p>
              <Button
                variant="outline"
                size="sm"
                disabled={seeding}
                onClick={handleSeed}
              >
                {seeding ? copy.seeding : copy.seedButton}
              </Button>
              {seedError ? (
                <p className="text-xs text-destructive">{seedError}</p>
              ) : null}
            </li>
          ) : (
            recent.map((row) => (
              <li
                key={row._id}
                className="flex items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-sm"
              >
                <span className="font-medium capitalize">{row.planId}</span>
                <span className="truncate text-muted-foreground">
                  {row.customerEmail ?? "—"}
                </span>
                <span
                  className={
                    row.status === "active"
                      ? "shrink-0 text-primary"
                      : "shrink-0 text-muted-foreground"
                  }
                >
                  {row.status}
                </span>
              </li>
            ))
          )}
        </ul>

        {recent && recent.length > 0 ? (
          <div className="mt-6 border-t border-border pt-4">
            <Button
              variant="ghost"
              size="sm"
              disabled={seeding}
              onClick={handleSeed}
            >
              {seeding ? copy.seeding : copy.addMore}
            </Button>
            {seedError ? (
              <p className="mt-2 text-xs text-destructive">{seedError}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </FadeIn>
  );
}
