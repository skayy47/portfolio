"use client";

import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";

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
              <article className="glass more-card ring-grad">
                <div className="more-card-head">
                  <span className="eyebrow">{m.kicker}</span>
                  <span className="metric-chip font-mono">{m.metric}</span>
                </div>
                <h3 className="more-name font-display">{m.name}</h3>
                <p className="more-blurb">{m.blurb}</p>
                <div className="more-tech">
                  {m.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="more-actions">
                  <a href={m.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary more-btn" data-cursor>
                    {c.ui.openLive}
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
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
