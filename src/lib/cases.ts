/**
 * File-based case studies under content/cases/*.json
 */
import fs from "node:fs";
import path from "node:path";

import type { HomeSectionId } from "@/lib/site-content";

export type CaseStudyMeta = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  year: string;
  sections: HomeSectionId[];
};

const casesDir = path.join(process.cwd(), "content/cases");

export function listCaseStudies(): CaseStudyMeta[] {
  if (!fs.existsSync(casesDir)) return [];
  return fs
    .readdirSync(casesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(casesDir, file), "utf8"));
      return raw as CaseStudyMeta;
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getCaseStudy(slug: string): CaseStudyMeta | null {
  const file = path.join(casesDir, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as CaseStudyMeta;
}
