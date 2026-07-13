import { LogoMarquee } from "@/components/motion/logo-marquee";
import {
  defaultLogosCopy,
  type LogosSectionCopy,
} from "@/lib/i18n/section-copy";

const logos = [
  "Acme Studio",
  "Northline",
  "Pixel & Co",
  "Forma Labs",
  "Studio K",
  "Arc Type",
  "Mono Works",
  "Field Design",
] as const;

type LogoMarqueeSectionProps = {
  copy?: LogosSectionCopy;
};

/** Trusted-by strip with infinite marquee. */
export function LogoMarqueeSection({ copy = defaultLogosCopy }: LogoMarqueeSectionProps) {
  return (
    <section aria-label={copy.title}>
      <p className="pb-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {copy.title}
      </p>
      <LogoMarquee items={logos} />
    </section>
  );
}
