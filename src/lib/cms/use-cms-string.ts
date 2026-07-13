"use client";

import { useQuery } from "convex/react";

import { api } from "../../../convex/_generated/api";
import { siteFeatures } from "@/lib/site-config";

/**
 * Returns CMS string when siteFeatures.cms and Convex are enabled; else fallback.
 */
export function useCmsString(
  key: string,
  fallback: string,
  locale = "en",
): string {
  const value = useQuery(
    api.cms.get,
    siteFeatures.cms ? { key, locale } : "skip",
  );

  if (value === undefined || value === null) {
    return fallback;
  }

  return value;
}
