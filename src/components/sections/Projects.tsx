"use client";

import { PROJECT_BASE } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { ProjectShowcase } from "./ProjectShowcase";
import { Reveal } from "@/components/ui/Reveal";

export function Projects() {
  const { c } = useLang();
  return (
    <section id="work" className="section">
      <div className="shell">
        <Reveal className="work-head">
          <p className="eyebrow">{c.work.eyebrow}</p>
          <h2 className="display section-title">
            {c.work.title.pre}
            <span className="grad-text">{c.work.title.grad}</span>
          </h2>
          <p className="section-lead">{c.work.lead}</p>
        </Reveal>

        <div className="projects">
          {PROJECT_BASE.map((p, i) => (
            <ProjectShowcase key={p.id} base={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
