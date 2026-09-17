"use client";

import { useEffect } from "react";
import { PROJECT_BASE } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { useLens } from "@/components/providers/LensProvider";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { measureActs, resolvePolicy, setPolicy, setVisible, updateFocus, WORK_RETURN_KEY } from "@/lib/project-focus";
import { ProjectAct } from "./ProjectAct";
import { Reveal } from "@/components/ui/Reveal";
import { LensToggle } from "@/components/ui/LensToggle";

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

/**
 * Put the reader back on the act they left from when they return from a case
 * study. Waits for fonts, because FR copy reflows every measurement.
 */
function useReturnToAct() {
  useEffect(() => {
    let id: string | null = null;
    try {
      id = sessionStorage.getItem(WORK_RETURN_KEY);
      if (id) sessionStorage.removeItem(WORK_RETURN_KEY);
    } catch {
      return;
    }
    if (!id) return;

    const el = document.getElementById(`project-${id}`);
    if (!el) return;

    const land = () => {
      // Lenis survives the client navigation while the document is replaced, so
      // its cached scroll height belongs to the case study. Without the resize
      // it clamps the target and lands short.
      window.__lenis?.resize();
      ScrollTrigger.refresh();
      if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true, offset: -10 });
      else el.scrollIntoView();
    };

    // Landing is idempotent, so run it at each point the page can still move
    // under us: now, after the router's own scroll reset, and once the fonts
    // have reflowed everything (FR copy is longer than EN).
    land();
    const t = setTimeout(land, 140);
    document.fonts?.ready.then(land);
    return () => clearTimeout(t);
  }, []);
}

export function Projects() {
  const { c } = useLang();
  const { lens } = useLens();
  useProjectFocus();
  useReturnToAct();

  return (
    <section id="work" className="section">
      <div className="shell">
        <Reveal className="work-head">
          <p className="eyebrow">{c.work.eyebrow}</p>
          <h2 className="display section-title">
            {c.work.title.pre}
            <span className="grad-text">{c.work.title.grad}</span>
          </h2>
          <p className="section-lead">{c.work.lead[lens]}</p>
        </Reveal>

        {/* The lens control's second home. It used to live only inside the hero,
            where it is out of sight by the time it would matter — this is the
            section it actually rewrites, so it belongs here too. */}
        <Reveal className="work-lens" delay={60}>
          <span className="work-lens-label font-mono">{c.ui.lensRead}</span>
          <LensToggle />
          <span className="work-lens-hint">{c.ui.lensHint}</span>
        </Reveal>
      </div>

      <div className="acts">
        {PROJECT_BASE.map((p) => (
          <ProjectAct key={p.id} base={p} />
        ))}
      </div>
    </section>
  );
}
