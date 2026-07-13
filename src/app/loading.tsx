import { getTranslations } from "next-intl/server";

/** Route-level loading UI — shown during segment transitions. */
export default async function Loading() {
  const t = await getTranslations("Loading");

  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-label={t("ariaLabel")}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">{t("label")}</p>
      </div>
    </div>
  );
}
