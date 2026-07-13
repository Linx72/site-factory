"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { Button } from "@/components/ui/button";
import {
  defaultContactCopy,
  type ContactSectionCopy,
} from "@/lib/i18n/section-copy";
import { siteFeatures } from "@/lib/site-config";
import { api } from "../../../convex/_generated/api";

type ContactSectionProps = {
  copy?: ContactSectionCopy;
};

function ContactFormStatic({ copy }: { copy: ContactSectionCopy }) {
  return (
    <section id="contact" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-xl text-center">
        <TextReveal
          as="h2"
          text={copy.title}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 text-muted-foreground">{copy.description}</p>
        <FadeIn className="mt-8">
          <Button className="h-11 rounded-full px-6" render={<a href="mailto:hello@example.com" />}>
            {copy.emailUs}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

/** Convex-backed newsletter — live subscriber count when backend is configured. */
function ContactFormConvex({ copy }: { copy: ContactSectionCopy }) {
  const subscribe = useMutation(api.leads.subscribe);
  const leadCount = useQuery(api.leads.count);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "exists" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const result = await subscribe({ email });
      setStatus(result === "exists" ? "exists" : "ok");
      if (result === "ok") setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : copy.genericError,
      );
    }
  }

  return (
    <section id="contact" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-xl text-center">
        <TextReveal
          as="h2"
          text={copy.title}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 text-muted-foreground">{copy.description}</p>

        {leadCount !== undefined ? (
          <p className="mt-3 text-sm tabular-nums text-primary">
            {copy.leadCount.replace("{count}", String(leadCount))}
          </p>
        ) : null}

        <FadeIn className="mt-8">
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <label htmlFor="contact-email" className="sr-only">
              {copy.emailLabel}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.placeholder}
              required
              disabled={status === "loading"}
              className="h-11 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none ring-ring/50 transition-shadow focus-visible:ring-2 disabled:opacity-60"
            />
            <Button
              type="submit"
              className="h-11 rounded-full px-6"
              disabled={status === "loading"}
            >
              {status === "loading" ? copy.sending : copy.subscribe}
            </Button>
          </form>

          <AnimatePresence mode="wait">
            {status === "ok" ? (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm text-primary"
              >
                {copy.success}
              </motion.p>
            ) : null}
            {status === "exists" ? (
              <motion.p
                key="exists"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                {copy.exists}
              </motion.p>
            ) : null}
            {status === "error" && errorMessage ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm text-destructive"
              >
                {errorMessage}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  );
}

/** Newsletter signup — Convex when configured, static mailto fallback otherwise. */
export function ContactSection({ copy = defaultContactCopy }: ContactSectionProps) {
  const useConvex = siteFeatures.convex && siteFeatures.contactForm;

  if (!useConvex) {
    return <ContactFormStatic copy={copy} />;
  }

  return <ContactFormConvex copy={copy} />;
}
