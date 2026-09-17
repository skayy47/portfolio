"use client";

import { useLayoutEffect, useRef } from "react";
import { ProjectBase } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { Expandable } from "@/components/ui/Expandable";
import { DemoStage } from "@/components/demos/DemoStage";
import { registerAct } from "@/lib/project-focus";

const NAMES: Record<string, string> = { aura: "AURA", nexus: "nexus", maestro: "MAESTRO" };

const ArrowOut = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * One project, presented as an act: numeral and name, then the live demo edge
 * to edge, then the reading matter. The demo is a working illustration, not a
 * screenshot — it is pointer-events:none behind one full-frame link, so the
 * whole stage is a single target.
 */
export function ProjectAct({ base }: { base: ProjectBase }) {
  const { c } = useLang();
  const t = c.projects[base.id];
  const name = NAMES[base.id];
  const actRef = useRef<HTMLElement>(null);

  // Layout effect so the act is in the store before the focus controller in
  // Projects — a parent, whose layout effects run after its children's — measures.
  useLayoutEffect(() => registerAct(base.id, actRef.current!), [base.id]);

  return (
    <article
      ref={actRef}
      /* SystemsMap scrolls to this id — the contract predates the rewrite. */
      id={`project-${base.id}`}
      className="act"
      data-project={base.id}
      data-accent={base.accent}
    >
      <header className="shell act-head">
        <span className="act-index font-display" aria-hidden>
          {base.index}
        </span>
        <div className="act-title">
          <p className="eyebrow act-kicker">{t.kicker}</p>
          <h3 className="display act-name">{name}</h3>
        </div>
        <p className="act-tagline">{t.tagline}</p>
      </header>

      <div className="shell-wide act-stage">
        <div className="media-frame demo-frame act-frame">
          <div className="act-frame-inner">
            <div className="act-demo-scale">
              <DemoStage projectId={base.id} demo={base.demo} />
            </div>
            <a
              href={base.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="frame-link"
              data-cursor
              aria-label={`${c.ui.openLive} — ${name}`}
            >
              <div className="media-veil" />
              <div className="media-live">
                <span className="live-pill">
                  <span className="live-dot" style={{ position: "static" }} />
                  {base.video ? c.ui.liveDemo : c.ui.live}
                </span>
                <span className="media-open">
                  {c.ui.openLive}
                  <ArrowOut size={14} />
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="shell act-foot">
        <div className="act-copy">
          <p className="act-desc">{t.description}</p>
          <Expandable>
            <ul className="signature">
              {t.signature.map((s) => (
                <li key={s}>
                  <span className="bullet-dot" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Expandable>
        </div>

        <aside className="act-meta">
          <div className="project-metrics">
            {t.metrics.map((m) => (
              <span key={m} className="metric-chip font-mono">
                {m}
              </span>
            ))}
          </div>
          <div className="project-tech">
            {base.tech.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
          <div className="act-actions">
            <Magnetic strength={0.22}>
              <a href={base.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-cursor>
                {c.ui.openLive}
                <ArrowOut />
              </a>
            </Magnetic>
            <a href={base.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              {c.ui.source}
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
