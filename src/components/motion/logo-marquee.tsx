"use client";

import { cn } from "@/lib/utils";

type LogoMarqueeProps = {
  items: readonly string[];
  className?: string;
};

/**
 * Infinite horizontal marquee — CSS transform only (GPU-friendly).
 * Duplicates items for seamless loop; pauses on hover for readability.
 */
export function LogoMarquee({ items, className }: LogoMarqueeProps) {
  const track = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-border bg-muted/20 py-8",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <div className="flex w-max animate-marquee gap-12 px-6 hover:[animation-play-state:paused] md:gap-16">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="shrink-0 text-sm font-medium tracking-wide text-muted-foreground uppercase md:text-base"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
