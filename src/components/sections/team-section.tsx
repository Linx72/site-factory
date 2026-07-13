"use client";

import { motion } from "framer-motion";

import { TextReveal } from "@/components/motion/text-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { defaultTeamCopy, type TeamSectionCopy } from "@/lib/i18n/section-copy";
import { fadeUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type TeamSectionProps = {
  copy?: TeamSectionCopy;
};

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
    >
      {initials}
    </div>
  );
}

/** Team grid with hover lift and staggered entrance. */
export function TeamSection({ copy = defaultTeamCopy }: TeamSectionProps) {
  return (
    <section id="team" className="border-t border-border px-6 py-24 md:px-16">
      <div className="mx-auto max-w-5xl">
        <TextReveal
          as="h2"
          text={copy.title}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mt-4 max-w-lg text-muted-foreground">{copy.subtitle}</p>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8% 0px" }}
        >
          {copy.members.map((member) => (
            <motion.div key={member.id} variants={fadeUp}>
              <TiltCard className="h-full">
                <Card
                  className={cn(
                    "h-full transition-colors duration-300",
                    "hover:bg-muted/20",
                  )}
                >
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <Avatar initials={member.initials} />
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wide">
                        {member.role}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
