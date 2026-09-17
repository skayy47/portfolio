"use client";

import Link from "next/link";

/**
 * The band at the foot of a case study: back to the work, and on to the next
 * project. Styled inline in the dark idiom of the case pages themselves — they
 * each carry their own palette and sit outside the site's five-palette token
 * system, so a var(--ink) here would render invisible.
 */

export const CASE_ORDER = ["aura", "nexus", "maestro", "walmart"] as const;
export type CaseSlug = (typeof CASE_ORDER)[number];

const TITLES: Record<CaseSlug, string> = {
  aura: "AURA",
  nexus: "nexus",
  maestro: "MAESTRO",
  walmart: "Walmart Sales Forecasting",
};

const KICKERS: Record<CaseSlug, string> = {
  aura: "Universal Data Engine",
  nexus: "Production RAG Engine",
  maestro: "Multi-Agent Command Center",
  walmart: "Time-Series BI + ML",
};

export function CaseNav({ current, accent, border }: { current: CaseSlug; accent: string; border: string }) {
  const i = CASE_ORDER.indexOf(current);
  const next = CASE_ORDER[(i + 1) % CASE_ORDER.length];

  return (
    <nav
      aria-label="Case study navigation"
      style={{
        borderTop: `1px solid ${border}`,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 24,
        padding: "clamp(32px, 6vw, 64px) clamp(20px, 6vw, 80px)",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <Link
        href="/"
        className="case-back"
        style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textDecoration: "none", color: "#94A3B8" }}
      >
        ← All work
      </Link>

      <Link
        href={`/work/${next}`}
        className="case-next"
        style={{ textDecoration: "none", display: "block", textAlign: "right" }}
      >
        <span style={{ display: "block", fontSize: 11, letterSpacing: "0.14em", color: "#64748B", marginBottom: 6 }}>
          NEXT PROJECT
        </span>
        <span style={{ display: "block", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, color: accent, letterSpacing: "-0.02em" }}>
          {TITLES[next]} <span aria-hidden>→</span>
        </span>
        <span style={{ display: "block", fontSize: 12, color: "#64748B", marginTop: 4 }}>{KICKERS[next]}</span>
      </Link>
    </nav>
  );
}
