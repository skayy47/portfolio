"use client";

import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";

const MARQUEE = [
  "Python", "AWS", "Kubernetes", "PyTorch", "LangChain", "Docker", "FastAPI", "Next.js",
  "Kafka", "Airflow", "MLflow", "Terraform", "RAG", "Spark", "GCP", "pgvector",
];

export function Capabilities() {
  const { c } = useLang();
  return (
    <section id="stack" className="section">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{c.stack.eyebrow}</p>
          <h2 className="display section-title">
            {c.stack.title.pre}
            <span className="grad-text">{c.stack.title.grad}</span>
          </h2>
          <p className="section-lead">{c.stack.lead}</p>
        </Reveal>
      </div>

      <div className="marquee" aria-hidden style={{ margin: "2.4rem 0 3rem" }}>
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="chip" style={{ fontSize: "0.82rem", padding: "0.55rem 1rem" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="shell">
        <div className="cap-grid">
          {c.stack.groups.map((g, i) => (
            <Reveal key={g.group} delay={i * 50}>
              <article className="glass cap-card">
                <h3 className="cap-group font-mono">{g.group}</h3>
                <div className="cap-items">
                  {g.items.map((it) => (
                    <span key={it} className="cap-item">
                      {it}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
