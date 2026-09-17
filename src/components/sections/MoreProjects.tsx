"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";
import { CASE_ORDER, type CaseSlug } from "./CaseNav";

const hasCaseStudy = (id: string): id is CaseSlug => (CASE_ORDER as readonly string[]).includes(id);

export function MoreProjects() {
  const { c } = useLang();
  return (
    <section id="more" className="section more-section">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{c.moreWork.eyebrow}</p>
          <h2 className="display section-title">
            {c.moreWork.title.pre}
            <span className="grad-text">{c.moreWork.title.grad}</span>
          </h2>
          <p className="section-lead">{c.moreWork.lead}</p>
        </Reveal>

        <div className="more-grid">
          {c.more.map((m, i) => (
            <Reveal key={m.id} delay={i * 80}>
              {/* A minor act: the same numeral-and-name grammar as the three
                  flagships, at a smaller scale — not a glass card. */}
              <article className="more-card">
                <div className="more-card-head">
                  <span className="more-index font-display" aria-hidden>
                    {String(i + 4).padStart(2, "0")}
                  </span>
                  <div className="more-title">
                    <p className="eyebrow">{m.kicker}</p>
                    <h3 className="more-name font-display">{m.name}</h3>
                  </div>
                </div>

                <p className="more-blurb">{m.blurb}</p>

                <div className="more-meta">
                  <span className="metric-chip font-mono">{m.metric}</span>
                </div>

                <div className="more-tech">
                  {m.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="more-actions">
                  <a href={m.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary more-btn" data-cursor data-cursor-label={c.ui.cursorOpen}>
                    {c.ui.openLive}
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  {hasCaseStudy(m.id) && (
                    <Link
                      href={`/work/${m.id}`}
                      transitionTypes={["nav-forward"]}
                      className="btn btn-ghost more-btn"
                      data-cursor
                      data-cursor-label={c.ui.cursorCase}
                    >
                      {c.ui.caseStudy}
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                  )}
                  <a href={m.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost more-btn" data-cursor>
                    {c.ui.source}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
