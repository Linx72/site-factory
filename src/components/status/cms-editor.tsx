"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cmsKeys } from "@/lib/cms/keys";
import {
  defaultStatusPageCopy,
  type StatusCmsEditorCopy,
} from "@/lib/i18n/status-dashboard-copy";
import { api } from "../../../convex/_generated/api";

const editableFields = [
  { id: "heroTitle" as const, key: cmsKeys.hero.title },
  { id: "heroDescription" as const, key: cmsKeys.hero.description },
  { id: "ctaTitle" as const, key: cmsKeys.cta.title },
  { id: "ctaDescription" as const, key: cmsKeys.cta.description },
] as const;

type CmsEditorProps = {
  copy?: StatusCmsEditorCopy;
};

/**
 * Dev CMS editor on /status — upserts strings when ALLOW_DEV_SEED=true.
 * Changes apply live on home when NEXT_PUBLIC_CMS=true.
 */
export function CmsEditor({ copy = defaultStatusPageCopy.cmsEditor }: CmsEditorProps) {
  const upsert = useMutation(api.cms.upsert);
  const [locale, setLocale] = useState<"en" | "ru">("en");
  const [key, setKey] = useState<string>(editableFields[0].key);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      await upsert({ key, locale, value });
      setStatus("ok");
      setValue("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : copy.saveFailed);
    }
  }

  return (
    <form
      className="mt-6 space-y-3 rounded-xl border border-dashed border-border bg-muted/10 p-4"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-medium">{copy.title}</p>
      <p className="text-xs text-muted-foreground">{copy.hint}</p>

      <div className="flex flex-wrap gap-2">
        {(["en", "ru"] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            className={
              loc === locale
                ? "rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                : "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            }
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      <label className="block text-xs text-muted-foreground">
        {copy.keyLabel}
        <select
          value={key}
          onChange={(event) => setKey(event.target.value)}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {editableFields.map((item) => (
            <option key={item.key} value={item.key}>
              {copy.fields[item.id]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-muted-foreground">
        {copy.valueLabel}
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
          rows={2}
          placeholder={copy.placeholder}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </label>

      <Button type="submit" size="sm" disabled={status === "loading"}>
        {status === "loading" ? copy.saving : copy.save}
      </Button>

      {status === "ok" ? (
        <p className="text-xs text-primary">{copy.saved}</p>
      ) : null}
      {status === "error" && errorMessage ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : null}
    </form>
  );
}
