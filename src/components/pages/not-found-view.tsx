import Link from "next/link";

import { Button } from "@/components/ui/button";
import { localizedPath } from "@/lib/i18n/paths";

export type NotFoundCopy = {
  code: string;
  title: string;
  description: string;
  home: string;
  motionLab: string;
};

type NotFoundViewProps = {
  copy: NotFoundCopy;
  /** Locale prefix for links — omit when i18n is off. */
  locale?: string;
};

/** 404 body — wrap with PageShell in route handlers. */
export function NotFoundView({ copy, locale }: NotFoundViewProps) {
  const homeHref = localizedPath(locale, "");
  const motionHref = localizedPath(locale, "/motion");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {copy.code}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">{copy.description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href={homeHref} />}>{copy.home}</Button>
        <Button variant="outline" render={<Link href={motionHref} />}>
          {copy.motionLab}
        </Button>
      </div>
    </div>
  );
}
