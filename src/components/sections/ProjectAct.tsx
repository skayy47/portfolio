"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ProjectBase } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { useLens } from "@/components/providers/LensProvider";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { withMotion } from "@/lib/motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { Expandable } from "@/components/ui/Expandable";
import { DemoStage } from "@/components/demos/DemoStage";
import { forceActive, registerAct, WORK_RETURN_KEY } from "@/lib/project-focus";

const NAMES: Record<string, string> = { aura: "AURA", nexus: "nexus", maestro: "MAESTRO" };

const ArrowOut = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * One project, presented as an act: numeral and name, then the live demo edge
 * to edge, then the reading matter. The demo is a working illustration, not a
 * screenshot — it is pointer-events:none behind one full-frame link, so the
 * whole stage is a single target.
 */
export function ProjectAct({ base }: { base: ProjectBase }) {
  const { c, locale } = useLang();
  const { lens } = useLens();
  const t = c.projects[base.id];
  const name = NAMES[base.id];

  const actRef = useRef<HTMLElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  // Layout effect so the act is in the store before the focus controller in
  // Projects — a parent, whose layout effects run after its children's — measures.
  useLayoutEffect(() => registerAct(base.id, actRef.current!), [base.id]);

  useGSAP(
    () => {
      withMotion(() => {
        /* T1 — the act arrives: numeral, name, kicker, tagline, stage. */
        const split = SplitText.create(nameRef.current, {
          type: "chars",
          // 3.13+ wraps each char in its own overflow:hidden span, which is the
          // masked rise without putting overflow:hidden on the heading itself.
          mask: "chars",
          // Puts an aria-label back so a screen reader does not spell the name out.
          aria: "auto",
        });
        // The chars do not exist before JS runs, so the heading is pre-hidden as
        // a whole under html.js-motion; reveal it now that they do.
        gsap.set(nameRef.current, { opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: actRef.current, start: "top 78%", once: true },
        });

        // fromTo, never from. These elements are pre-hidden in CSS under
        // html.js-motion, and .from() reads its destination from the CURRENT
        // computed style — which is the hidden one. It would animate 0 to 0,
        // silently. Every end value here has to be stated outright.
        tl.fromTo(indexRef.current, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.0, ease: "siteOut" }, 0)
          .fromTo(split.chars, { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: "site", stagger: 0.045 }, 0.06)
          .fromTo(
            [actRef.current!.querySelector(".act-kicker"), actRef.current!.querySelector(".act-tagline")],
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: "siteOut", stagger: 0.07 },
            0.18
          )
          .fromTo(
            frameRef.current,
            { clipPath: "inset(14% 8% 14% 8%)", scale: 1.05 },
            { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, ease: "site" },
            0.1
          );

        /* T2 — the reading matter, on its own trigger: the foot can sit 600px
           below the frame, so sharing T1's start would fire it off screen. */
        const footBits = [
          ".act-desc",
          ".expandable-toggle",
          ".metric-chip",
          ".chip",
          ".act-actions > *",
        ].flatMap((sel) => gsap.utils.toArray<HTMLElement>(footRef.current!.querySelectorAll(sel)));

        gsap.fromTo(
          footBits,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "siteOut",
            stagger: 0.045,
            scrollTrigger: { trigger: footRef.current, start: "top 88%", once: true },
          }
        );

        /* T3 — the numeral drifts against the scroll. scrub:true, never a
           number: a numeric scrub smooths on gsap.ticker, and T1 writes y in px
           on this same element while this writes yPercent — GSAP composes the
           two into one matrix, so they must stay different properties. */
        gsap.fromTo(
          indexRef.current,
          { yPercent: -14 },
          {
            yPercent: 16,
            ease: "none",
            scrollTrigger: {
              trigger: actRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        return () => split.revert();
      });

      /* Cursor-tracked parallax on the active frame.
         Safe here in a way it would not be on a normal card: .demo is
         pointer-events:none and the whole stage is one link, so there is
         nothing inside for the movement to push out from under the cursor. */
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const frame = frameRef.current;
        const tilt = tiltRef.current;
        if (!frame || !tilt) return;

        gsap.set(tilt, { transformPerspective: 900, transformOrigin: "center" });
        // quickTo, not quickSetter: it interpolates on the GSAP ticker Lenis
        // already drives, so there is one clock and no second rAF loop.
        const xTo = gsap.quickTo(tilt, "x", { duration: 0.65, ease: "site" });
        const yTo = gsap.quickTo(tilt, "y", { duration: 0.65, ease: "site" });
        const rxTo = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "site" });
        const ryTo = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "site" });

        const onMove = (e: PointerEvent) => {
          // Only the act being read reacts. Moving a dimmed frame would make
          // the page feel busy in exactly the way the focus system prevents.
          if (actRef.current!.classList.contains("is-dim")) return;
          const r = frame.getBoundingClientRect();
          const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          // Past roughly these amounts the frame visibly parts from its gutter.
          xTo(nx * 10);
          yTo(ny * 7);
          ryTo(nx * 2.2);
          rxTo(-ny * 1.8);
        };
        const reset = () => {
          xTo(0);
          yTo(0);
          rxTo(0);
          ryTo(0);
        };

        frame.addEventListener("pointermove", onMove);
        frame.addEventListener("pointerleave", reset);
        return () => {
          frame.removeEventListener("pointermove", onMove);
          frame.removeEventListener("pointerleave", reset);
          reset();
        };
      });
    },
    // The FR copy is longer than the EN, and the lens rewrites it entirely, so
    // both change every measurement. revertOnUpdate is required: with non-empty
    // dependencies @gsap/react defers cleanup to unmount, which would stack a
    // second set of triggers on the same elements.
    { scope: actRef, dependencies: [locale, lens], revertOnUpdate: true }
  );

  return (
    <article
      ref={actRef}
      /* SystemsMap scrolls to this id — the contract predates the rewrite. */
      id={`project-${base.id}`}
      className="act"
      data-project={base.id}
      data-accent={base.accent}
    >
      <header className="shell act-head">
        <span ref={indexRef} className="act-index font-display" aria-hidden>
          {base.index}
        </span>
        <div className="act-title">
          <p className="eyebrow act-kicker">{t.kicker}</p>
          <h3 ref={nameRef} className="display act-name">
            {name}
          </h3>
        </div>
        <p className="act-tagline">{t.tagline}</p>
      </header>

      <div className="shell-wide act-stage">
        <div ref={frameRef} className="media-frame demo-frame act-frame">
          <div ref={tiltRef} className="act-frame-inner">
            <div className="act-demo-scale">
              <DemoStage projectId={base.id} demo={base.demo} />
            </div>
            <a
              href={base.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="frame-link"
              data-cursor
              data-cursor-label={c.ui.cursorOpen}
              aria-label={`${c.ui.openLive} — ${name}`}
            >
              <div className="media-veil" />
              <div className="media-live">
                <span className="live-pill">
                  <span className="live-dot" style={{ position: "static" }} />
                  {base.video ? c.ui.liveDemo : c.ui.live}
                </span>
                <span className="media-open">
                  {c.ui.openLive}
                  <ArrowOut size={14} />
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div ref={footRef} className="shell act-foot">
        <div className="act-copy">
          <p className="act-desc">{t.description}</p>
          <Expandable>
            <ul className="signature">
              {t.signature.map((s) => (
                <li key={s}>
                  <span className="bullet-dot" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Expandable>
        </div>

        <aside className="act-meta">
          <div className="project-metrics">
            {t.metrics.map((m) => (
              <span key={m} className="metric-chip font-mono">
                {m}
              </span>
            ))}
          </div>
          <div className="project-tech">
            {base.tech.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
          <div className="act-actions">
            <Magnetic strength={0.22}>
              <a href={base.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-cursor>
                {c.ui.openLive}
                <ArrowOut />
              </a>
            </Magnetic>
            <Link
              href={`/work/${base.id}`}
              className="btn btn-ghost"
              data-cursor
              data-cursor-label={c.ui.cursorCase}
              onClick={() => {
                // Remember where to put the reader back. sessionStorage rather
                // than a hash: Next's native hash scroll and Lenis fight over
                // the same scrollTop on first paint.
                try {
                  sessionStorage.setItem(WORK_RETURN_KEY, base.id);
                } catch {
                  /* private mode — the return just lands at the top */
                }
                // Never let a dimmed frame be what the reader leaves on.
                forceActive(base.id);
              }}
            >
              {c.ui.caseStudy}
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href={base.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
              {c.ui.source}
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
