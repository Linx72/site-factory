"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import "./globals.css";

type RootGlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Root layout error boundary — replaces entire document when providers/layout fail.
 * Must define html/body; cannot rely on ThemeProvider or PageShell.
 */
export default function RootGlobalError({ error, reset }: RootGlobalErrorProps) {
  useEffect(() => {
    console.error("[RootGlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Critical error
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Application failed to load
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            The root layout encountered an error. Reload the page or return home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" render={<Link href="/" />}>
              Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
