"use client";

import { useRef } from "react";
import { useLang } from "@/components/providers/LangProvider";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { withMotion } from "@/lib/motion";

export function Journey() {
  const { c } = useLang();
  const j = c.journey;
  const timelineRef = useRef<HTMLDivElement>(null);

  // The one scrubbed moment on the site. The rail literally is the passage of
  // time, so tying it to scroll position is honest rather than decorative — and
  // it's a pure scale on an absolutely-positioned element, so nothing reflows.
  useGSAP(
    () => {
      withMotion(() => {
        gsap.to(".tl-rail-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        });
      });
    },
    { scope: timelineRef }
  );

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

        <div className="timeline" ref={timelineRef}>
          <span className="tl-rail" aria-hidden />
          <span className="tl-rail-fill" aria-hidden />
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
