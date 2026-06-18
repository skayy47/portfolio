"use client";

import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";

export function Approach() {
  const { c } = useLang();
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

        <div className="pillars">
          {c.approach.pillars.map((p, i) => (
            <Reveal key={p.k} delay={i * 90}>
              <article className="glass pillar ring-grad">
                <span className="pillar-k font-mono">{p.k}</span>
                <h3 className="pillar-title font-display">{p.title}</h3>
                <p className="pillar-body">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <blockquote className="arc-quote">
            <span className="arc-label font-mono">{c.approach.arcLabel}</span>
            <Highlight text={c.approach.arc} />
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

function Highlight({ text }: { text: string }) {
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
