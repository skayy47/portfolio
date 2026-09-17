"use client";

import { useEffect } from "react";
import { PROJECT_BASE } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { measureActs, resolvePolicy, setPolicy, setVisible, updateFocus } from "@/lib/project-focus";
import { ProjectShowcase } from "./ProjectShowcase";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Hosts the one focus controller for the page. Modelled on Nav.tsx: a single
 * ScrollTrigger whose onUpdate only compares cached numbers and writes
 * classList — never setState, so scrolling causes zero React renders here.
 */
function useProjectFocus() {
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      setPolicy(resolvePolicy());
      measureActs();

      const main = ScrollTrigger.create({
        start: 0,
        end: "max",
        onRefresh: measureActs,
        onUpdate: (self) => updateFocus(self.scroll(), window.innerHeight),
      });

      // Replaces the IntersectionObserver each demo used to own. Needed by the
      // `visible` policy (touch / narrow), where there is no single "active" act.
      const vis = PROJECT_BASE.map((p) =>
        ScrollTrigger.create({
          trigger: `#project-${p.id}`,
          start: "top bottom-=8%",
          end: "bottom top+=8%",
          onToggle: (self) => setVisible(p.id, self.isActive),
        })
      );
      // onToggle does not fire for triggers that are already active at creation.
      vis.forEach((st, i) => setVisible(PROJECT_BASE[i].id, st.isActive));

      updateFocus(window.scrollY, window.innerHeight);

      return () => {
        main.kill();
        vis.forEach((v) => v.kill());
      };
    },
    // revertOnUpdate: non-empty dependencies otherwise defer cleanup to unmount,
    // which would stack a second set of triggers on the same elements.
    { dependencies: [reduce], revertOnUpdate: true }
  );

  // Crossing the 900px / coarse-pointer boundary changes the policy. Listen on
  // the media queries rather than on resize — ScrollTrigger is already
  // configured to ignore the mobile URL-bar resize as noise.
  useEffect(() => {
    const mqs = [window.matchMedia("(pointer: coarse)"), window.matchMedia("(min-width: 900px)")];
    const onChange = () => setPolicy(resolvePolicy());
    mqs.forEach((m) => m.addEventListener("change", onChange));
    return () => mqs.forEach((m) => m.removeEventListener("change", onChange));
  }, []);
}

export function Projects() {
  const { c } = useLang();
  useProjectFocus();

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
