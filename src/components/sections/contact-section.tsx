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
import {
  BRIEF_PACKAGE_STORAGE_KEY,
  formatBriefPackageLine,
  readPackageFromSearch,
} from "@/lib/brief-package";
import { siteConfig, siteFeatures } from "@/lib/site-config";
import { api } from "../../../convex/_generated/api";

type ContactSectionProps = {
  copy?: ContactSectionCopy;
};

function buildMailtoHref(
  email: string,
  brief: string,
  subject: string,
): string {
  const body = [`Email: ${email}`, "", brief || "(добавьте детали брифа)"].join(
    "\n",
  );
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${siteConfig.contactEmail}?${params.toString()}`;
}

/** Email + brief — Resend API, mailto, or Convex (when configured). */
function ContactFormStatic({ copy }: { copy: ContactSectionCopy }) {
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState(() => {
    if (typeof window === "undefined") return "";
    let planName: string | null = null;
    try {
      planName = sessionStorage.getItem(BRIEF_PACKAGE_STORAGE_KEY);
      if (planName) {
        sessionStorage.removeItem(BRIEF_PACKAGE_STORAGE_KEY);
      }
    } catch {
      /* private mode */
    }
    planName ??= readPackageFromSearch();
    return planName ? formatBriefPackageLine(planName) : "";
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const briefPlaceholder =
    copy.briefPlaceholder ?? "Project, package, reference links…";
  const useLeadApi = siteFeatures.leadApi;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (useLeadApi) {
      setStatus("loading");
      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, brief }),
        });
        if (response.ok) {
          setStatus("ok");
          setEmail("");
          setBrief("");
          return;
        }
        if (response.status === 503) {
          setStatus("idle");
        } else {
          const data: { error?: string } = await response.json();
          setStatus("error");
          setErrorMessage(data.error ?? copy.genericError);
          return;
        }
      } catch {
        setStatus("idle");
      }
    }

    const subject = `${siteConfig.name} — brief`;
    window.location.href = buildMailtoHref(email, brief, subject);
    setStatus("ok");
  }

  const successText = useLeadApi ? (copy.successApi ?? copy.success) : copy.success;

  return (
    <section id="contact" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-xl text-center">
        <TextReveal
          as="h2"
          text={copy.title}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 text-muted-foreground">{copy.description}</p>
        {copy.mailtoHint && !useLeadApi ? (
          <p className="mt-2 text-xs text-muted-foreground">{copy.mailtoHint}</p>
        ) : null}

        <FadeIn className="mt-8 text-left">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label htmlFor="contact-email-static" className="sr-only">
              {copy.emailLabel}
            </label>
            <input
              id="contact-email-static"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.placeholder}
              required
              className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm outline-none ring-ring/50 transition-shadow focus-visible:ring-2"
            />
            <label htmlFor="contact-brief-static" className="sr-only">
              Brief
            </label>
            <textarea
              id="contact-brief-static"
              name="brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder={briefPlaceholder}
              rows={4}
              className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring/50 transition-shadow focus-visible:ring-2"
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
                className="mt-4 text-center text-sm text-primary"
              >
                {successText}
              </motion.p>
            ) : null}
            {status === "error" && errorMessage ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center text-sm text-destructive"
              >
                {errorMessage}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <p className="mt-6 text-center">
            <Button
              variant="link"
              className="text-muted-foreground"
              render={
                <a href={`mailto:${siteConfig.contactEmail}`} />
              }
            >
              {copy.emailUs}
            </Button>
          </p>
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
