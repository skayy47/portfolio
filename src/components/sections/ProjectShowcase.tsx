"use client";

import { ProjectBase } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { LiveDemo } from "@/components/demos/LiveDemo";
import { Expandable } from "@/components/ui/Expandable";

const NAMES: Record<string, string> = { aura: "AURA", nexus: "nexus", maestro: "MAESTRO" };

export function ProjectShowcase({ base, flip }: { base: ProjectBase; flip: boolean }) {
  const { c } = useLang();
  const t = c.projects[base.id];
  const name = NAMES[base.id];

  return (
    <article id={`project-${base.id}`} className={`project ${flip ? "project-flip" : ""}`} data-accent={base.accent}>
      {/* Live demo — frame is click-through to the real app. */}
      <Reveal className="project-media-wrap">
        <div className="media-frame demo-frame">
          <LiveDemo demo={base.demo} />
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
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </a>
        </div>
      </Reveal>

      {/* Copy */}
      <Reveal className="project-copy" delay={80}>
        <div className="project-head">
          <span className="project-index font-display">{base.index}</span>
          <div>
            <p className="eyebrow">{t.kicker}</p>
            <h3 className="display project-name">{name}</h3>
          </div>
        </div>

        <div className="project-metrics">
          {t.metrics.map((m) => (
            <span key={m} className="metric-chip font-mono">
              {m}
            </span>
          ))}
        </div>

        <p className="project-tagline">{t.tagline}</p>
        <p className="project-desc">{t.description}</p>

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

        <div className="project-tech">
          {base.tech.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="project-actions">
          <Magnetic strength={0.25}>
            <a href={base.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-cursor>
              {c.ui.openLive}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </Magnetic>
          <a href={base.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
            {c.ui.source}
          </a>
        </div>
      </Reveal>
    </article>
  );
}
