"use client";

import { useLang } from "@/components/providers/LangProvider";
import { IDENTITY } from "@/lib/identity";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";

export function Contact() {
  const { c } = useLang();
  return (
    <section id="contact" className="section contact-section">
      <div className="shell">
        <Reveal>
          <div className="glass contact-card ring-grad">
            <p className="eyebrow">{c.contact.eyebrow}</p>
            <h2 className="display contact-title" style={{ whiteSpace: "pre-line" }}>
              {c.contact.title.pre}
              <span className="grad-text">{c.contact.title.grad}</span>
            </h2>
            <p className="section-lead" style={{ margin: "0 auto" }}>
              {c.contact.lead}
            </p>

            <div className="contact-actions">
              <Magnetic strength={0.25}>
                <a href={IDENTITY.socials.email} className="btn btn-primary" data-cursor>
                  {IDENTITY.email}
                </a>
              </Magnetic>
              <a href={IDENTITY.socials.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor>
                GitHub
              </a>
              <a href={IDENTITY.socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor>
                LinkedIn
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
