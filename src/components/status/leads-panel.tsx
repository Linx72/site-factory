"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import {
  defaultStatusPageCopy,
  formatStatusTemplate,
  type StatusLeadsCopy,
} from "@/lib/i18n/status-dashboard-copy";
import { api } from "../../../convex/_generated/api";

type LeadsPanelProps = {
  copy?: StatusLeadsCopy;
  locale?: string;
};

/** Recent newsletter signups from Convex. */
export function LeadsPanel({
  copy = defaultStatusPageCopy.leads,
  locale,
}: LeadsPanelProps) {
  const leads = useQuery(api.leads.listRecent);
  const count = useQuery(api.leads.count);
  const seedLeads = useMutation(api.devSeed.seedLeads);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const dateLocale = locale ?? undefined;

  async function handleSeed() {
    setSeedError(null);
    setSeeding(true);
    try {
      await seedLeads({});
    } catch (error) {
      setSeedError(error instanceof Error ? error.message : copy.seedFailed);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <FadeIn className="mx-auto mt-10 max-w-2xl">
      <div className="rounded-3xl border border-border bg-card p-8">
        <h2 className="text-xl font-semibold">{copy.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatStatusTemplate(copy.total, { count: count ?? "—" })}
        </p>
        <ul className="mt-6 space-y-2">
          {leads === undefined ? (
            <li className="text-sm text-muted-foreground">{copy.loading}</li>
          ) : leads.length === 0 ? (
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
            leads.map((lead) => (
              <li
                key={lead._id}
                className="flex justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>{lead.email}</span>
                <span className="text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleDateString(dateLocale)}
                </span>
              </li>
            ))
          )}
        </ul>

        {leads && leads.length > 0 ? (
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
