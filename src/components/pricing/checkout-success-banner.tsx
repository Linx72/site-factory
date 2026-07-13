"use client";

import { CheckCircle2Icon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  defaultCheckoutBannerCopy,
  type CheckoutBannerCopy,
} from "@/lib/i18n/checkout-copy";
import { cn } from "@/lib/utils";

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type CheckoutSuccessBannerProps = {
  copy?: CheckoutBannerCopy;
};

/**
 * Shown after Stripe redirect (?checkout=success). Dismiss clears the query param.
 */
export function CheckoutSuccessBanner({
  copy = defaultCheckoutBannerCopy,
}: CheckoutSuccessBannerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isClient = useIsClient();

  if (!isClient || searchParams.get("checkout") !== "success") {
    return null;
  }

  function dismiss() {
    router.replace(copy.homeHref, { scroll: false });
  }

  return (
    <div
      role="status"
      className={cn(
        "fixed inset-x-0 top-16 z-50 mx-auto flex max-w-lg items-center gap-3",
        "rounded-xl border border-border bg-card px-4 py-3 shadow-lg",
        "mx-4 md:mx-auto",
      )}
    >
      <CheckCircle2Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">{copy.successTitle}</p>
        <p className="text-muted-foreground">{copy.successBody}</p>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={copy.dismiss}
        onClick={dismiss}
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}
