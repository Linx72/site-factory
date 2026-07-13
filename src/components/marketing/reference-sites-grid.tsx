import { FadeIn } from "@/components/motion/fade-in";
import { presetReferenceSites } from "@/lib/reference-sites";

/** Grid of live preset demos for sales / about pages. */
export function ReferenceSitesGrid() {
  return (
    <FadeIn className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
      {presetReferenceSites.map((site) => (
        <a
          key={site.id}
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-2xl border border-border bg-card/80 p-5 transition-colors hover:border-primary/40 hover:bg-muted/30"
        >
          <span className="text-base font-semibold tracking-tight group-hover:text-primary">
            {site.label}
          </span>
          <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {site.blurb}
          </span>
        </a>
      ))}
    </FadeIn>
  );
}
