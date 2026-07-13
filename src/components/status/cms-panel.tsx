"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { CmsEditor } from "@/components/status/cms-editor";
import {
  defaultStatusPageCopy,
  type StatusCmsCopy,
  type StatusCmsEditorCopy,
} from "@/lib/i18n/status-dashboard-copy";
import { siteFeatures } from "@/lib/site-config";
import { api } from "../../../convex/_generated/api";

type CmsPanelProps = {
  copy?: StatusCmsCopy;
  editorCopy?: StatusCmsEditorCopy;
  /** Locale-aware home href (e.g. / or /en). */
  homeHref?: string;
};

/**
 * CMS content rows from Convex — preview + seed for hero copy overrides.
 * Editor + seed only when Convex ALLOW_DEV_SEED=true (`cms.canEdit`).
 */
export function CmsPanel({
  copy = defaultStatusPageCopy.cms,
  editorCopy = defaultStatusPageCopy.cmsEditor,
  homeHref = "/",
}: CmsPanelProps) {
  const rows = useQuery(api.cms.listRecent);
  const policy = useQuery(api.cms.canEdit);
  const seedDemo = useMutation(api.cms.seedDemo);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const canWrite = policy?.canWrite === true;

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
    <FadeIn className="mx-auto mt-10 max-w-2xl">
      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{copy.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {siteFeatures.cms ? copy.descriptionOn : copy.descriptionOff}
            </p>
          </div>
          <Button variant="outline" size="sm" render={<Link href={homeHref} />}>
            {copy.openHomePreview}
          </Button>
        </div>

        {!canWrite && policy !== undefined ? (
          <p className="mt-4 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            {copy.writeLocked}
          </p>
        ) : null}

        <ul className="mt-6 space-y-2">
          {rows === undefined ? (
            <li className="text-sm text-muted-foreground">{copy.loading}</li>
          ) : rows.length === 0 ? (
            <li className="space-y-3 text-sm text-muted-foreground">
              <p>{copy.empty}</p>
              {canWrite ? (
                <>
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
                </>
              ) : null}
            </li>
          ) : (
            rows.map((row) => (
              <li
                key={row._id}
                className="rounded-lg border border-border px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <code className="text-xs">{row.key}</code>
                  <span className="text-xs uppercase text-muted-foreground">
                    {row.locale}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-foreground">{row.value}</p>
              </li>
            ))
          )}
        </ul>

        {canWrite && rows && rows.length > 0 ? (
          <div className="mt-6 border-t border-border pt-4">
            <Button
              variant="ghost"
              size="sm"
              disabled={seeding}
              onClick={handleSeed}
            >
              {seeding ? copy.seeding : copy.reseedButton}
            </Button>
            {seedError ? (
              <p className="mt-2 text-xs text-destructive">{seedError}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {canWrite ? <CmsEditor copy={editorCopy} /> : null}
    </FadeIn>
  );
}
