/**
 * Legal document body — privacy / terms.
 * Copy from Legal namespace in messages/*.json.
 */
export type LegalDocumentCopy = {
  title: string;
  updatedLabel: string;
  updatedDate: string;
  sections: { heading: string; body: string }[];
  backHome: string;
};

type LegalDocumentSectionProps = {
  copy: LegalDocumentCopy;
  homeHref?: string;
};

/** Long-form legal page layout — readable measure, no marketing cards. */
export function LegalDocumentSection({
  copy,
  homeHref = "/",
}: LegalDocumentSectionProps) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-24 md:px-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {copy.updatedLabel}: {copy.updatedDate}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {copy.title}
      </h1>
      <div className="mt-10 space-y-8 text-muted-foreground">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-foreground">{section.heading}</h2>
            <p className="mt-2 leading-relaxed whitespace-pre-line">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12">
        <a
          href={homeHref}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {copy.backHome}
        </a>
      </p>
    </article>
  );
}
