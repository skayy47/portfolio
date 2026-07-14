"use client";

import { useState } from "react";
import { PROJECT_BASE, ProjectId } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";

const DISPLAY: Record<ProjectId, string> = { aura: "AURA", nexus: "nexus", maestro: "MAESTRO" };
const STAGE_OF: Record<ProjectId, "data" | "memory" | "agents"> = {
  aura: "data",
  nexus: "memory",
  maestro: "agents",
};
const ACCENT: Record<1 | 2 | 3, string> = {
  1: "var(--accent)",
  2: "var(--accent-2)",
  3: "var(--accent-3)",
};

/** Interactive AI Systems Map — AURA → NEXUS → MAESTRO as data → memory → agents. */
export function SystemsMap() {
  const { c } = useLang();
  const sm = c.systemsMap;
  const [active, setActive] = useState<ProjectId | null>(null);

  const go = (id: ProjectId) => {
    document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="approach" className="section">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{c.approach.eyebrow}</p>
          <h2 className="display section-title">
            {c.approach.title.pre}
            <span className="grad-text">{c.approach.title.grad}</span>
          </h2>
          <p className="section-lead">{c.approach.lead}</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="sysmap" data-live={active ? "on" : "off"} onMouseLeave={() => setActive(null)}>
            <div className="sysmap-track">
              <div className="sysmap-rail" aria-hidden />
              <div className="sysmap-pulse" aria-hidden />
              <div className="sysmap-nodes">
                {PROJECT_BASE.map((p) => {
                  const n = sm.nodes[p.id];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className="sysmap-node"
                      data-on={active === p.id}
                      data-dim={active !== null && active !== p.id}
                      style={{ ["--node" as string]: ACCENT[p.accent] } as React.CSSProperties}
                      onMouseEnter={() => setActive(p.id)}
                      onFocus={() => setActive(p.id)}
                      onClick={() => go(p.id)}
                      aria-label={`${DISPLAY[p.id]} — ${n.role}. ${n.thesis}`}
                    >
                      <span className="sysmap-stage font-mono">{sm.stages[STAGE_OF[p.id]]}</span>
                      <span className="sysmap-orb" aria-hidden />
                      <span className="sysmap-name font-display">{DISPLAY[p.id]}</span>
                      <span className="sysmap-role font-mono">{n.role}</span>
                      <span className="sysmap-thesis">{n.thesis}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="sysmap-arc">
              <span className="sysmap-arc-label font-mono">{c.approach.arcLabel}</span>
              <Arc text={c.approach.arc} />
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Highlight project names inside the arc caption. */
function Arc({ text }: { text: string }) {
  const parts = text.split(/(AURA|nexus|MAESTRO)/g);
  return (
    <>
      {parts.map((p, i) =>
        p === "AURA" || p === "nexus" || p === "MAESTRO" ? (
          <strong key={i} className="grad-text" style={{ fontWeight: 700 }}>
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
