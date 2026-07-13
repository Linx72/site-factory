"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import {
  defaultStatusPageCopy,
  formatStatusTemplate,
  type StatusSeedAllCopy,
} from "@/lib/i18n/status-dashboard-copy";
import { api } from "../../../convex/_generated/api";

type SeedResult = {
  subscriptions: number;
  leads: number;
  cms: number;
};

type SeedAllPanelProps = {
  copy?: StatusSeedAllCopy;
};

/**
 * Dev-only: seed subscriptions, leads, and CMS demo rows in one click.
 * Hidden unless Convex env ALLOW_DEV_SEED=true (`cms.canEdit`).
 */
export function SeedAllPanel({ copy = defaultStatusPageCopy.seedAll }: SeedAllPanelProps) {
  const policy = useQuery(api.cms.canEdit);
  const seedAll = useMutation(api.devSeed.seedAll);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (policy !== undefined && !policy.canWrite) {
    return null;
  }

  if (policy === undefined) {
    return null;
  }

  async function handleSeedAll() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await seedAll({});
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.seedFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn className="mx-auto mt-10 max-w-2xl">
      <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-6">
        <h2 className="text-lg font-semibold">{copy.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{copy.hint}</p>
        <Button
          className="mt-4"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleSeedAll}
        >
          {loading ? copy.seeding : copy.button}
        </Button>
        {result ? (
          <p className="mt-3 text-xs text-primary">
            {formatStatusTemplate(copy.done, {
              subs: result.subscriptions,
              leads: result.leads,
              cms: result.cms,
            })}
          </p>
        ) : null}
        {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
      </div>
    </FadeIn>
  );
}
