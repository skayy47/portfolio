"use client";

import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";

export function Journey() {
  const { c } = useLang();
  const j = c.journey;

  return (
    <section id="journey" className="section">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{j.eyebrow}</p>
          <h2 className="display section-title">
            {j.title.pre}
            <span className="grad-text">{j.title.grad}</span>
          </h2>
          <p className="section-lead">{j.lead}</p>
        </Reveal>

        <div className="timeline">
          <span className="tl-rail" aria-hidden />
          {j.steps.map((s, i) => (
            <Reveal key={i} delay={i * 60} className={`tl-step tl-${s.kind}`}>
              <span className="tl-dot" aria-hidden />
              <span className="tl-year font-mono">{s.year}</span>
              <div className="tl-card glass">
                <h3 className="tl-title font-display">{s.title}</h3>
                <p className="tl-place font-mono">{s.place}</p>
                <p className="tl-note">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
