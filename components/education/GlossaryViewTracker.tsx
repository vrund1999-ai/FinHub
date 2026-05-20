"use client";

import { useEffect } from "react";
import { trackGlossaryView } from "@/app/education/glossary/[slug]/actions";

export function GlossaryViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;

    try {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/New_York",
      });
      const key = `finhub:viewed:${today}`;
      const raw = sessionStorage.getItem(key);
      const seen: string[] = raw ? JSON.parse(raw) : [];
      if (seen.includes(slug)) return;
      seen.push(slug);
      sessionStorage.setItem(key, JSON.stringify(seen));
    } catch {
      // sessionStorage unavailable (e.g. private mode) — proceed without dedupe
    }

    void trackGlossaryView(slug);
  }, [slug]);

  return null;
}
