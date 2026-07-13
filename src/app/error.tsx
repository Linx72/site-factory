"use client";

import Link from "next/link";
import { useEffect } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Route error boundary — root layout chrome remains available. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[ErrorPage]", error);
  }, [error]);

  return (
    <PageShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Error
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          An unexpected error occurred. Try again or return to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" render={<Link href="/" />}>
            Home
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
