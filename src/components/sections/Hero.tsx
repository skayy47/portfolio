"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { withMotion } from "@/lib/motion";
import { useLang } from "@/components/providers/LangProvider";
import { useLens } from "@/components/providers/LensProvider";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";
import { LensToggle } from "@/components/ui/LensToggle";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export function Hero() {
  const { c } = useLang();
  const { lens } = useLens();
  const h = c.hero[lens];
  const [line, setLine] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  /**
   * Entrance timeline. dependencies: [] on purpose — a lens or lang switch
   * swaps the copy underneath an already-finished timeline, which is what we
   * want. Re-running it would replay the headline on every toggle.
   *
   * Two deliberate targets:
   *  - .hero-rotator, NOT .rot-line: the setInterval below toggles .on and
   *    .rot-line has its own CSS transition. Inline opacity would fight it.
   *  - .hero-cta, NOT the Magnetic wrapper: Magnetic writes el.style.transform
   *    directly, so an entrance y on that element gets clobbered on first hover.
   */
  useGSAP(
    () => {
      withMotion(() => {
        const tl = gsap.timeline({ defaults: { ease: "siteOut" } });

        // No overflow-mask line reveal here, deliberately. Each logical line
        // wraps to 2+ visual lines at every realistic width (and the title
        // length changes across EN/FR x business/technical), so a yPercent
        // mask slides a ~176px block as one slab rather than reading as a
        // line reveal. Per-visual-line masking would need SplitText, which
        // re-anchors .grad-text's background-clip gradient and visibly bands.
        tl.fromTo(
          ".hero-line-in",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.09 },
          0
        );

        tl.from(
          [".hero-eyebrow", ".hero-lens", ".hero-rotator", ".hero-cta", ".hero-loc", ".hero-scroll"],
          { y: 18, opacity: 0, duration: 0.9, stagger: 0.07 },
          0.15
        );

        // The R3F canvas is dynamic(ssr:false) and may drop frames compiling
        // shaders, so it gets its own tween rather than gating the copy.
        // `from` (not `to`) because .hero-canvas is opacity 1 on desktop but
        // 0.45 in the max-width:900px media query — this animates toward
        // whichever the real computed value is, then clears the inline style.
        tl.from(".hero-canvas", { opacity: 0, duration: 1.2, clearProps: "opacity" }, 0.2);
      });
    },
    { scope: rootRef, dependencies: [] }
  );

  // Reset the rotator when the lens flips so lines stay in range.
  useEffect(() => {
    setLine(0);
  }, [lens]);

  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % h.lines.length), 3400);
    return () => clearInterval(id);
  }, [h.lines.length]);

  return (
    <header id="top" className="hero" ref={rootRef}>
      <div className="hero-canvas" aria-hidden>
        <HeroScene />
      </div>

      <div className="shell hero-grid">
        <div className="hero-copy">
          <p
            className="eyebrow hero-eyebrow"
            style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}
          >
            <span className="live-dot" style={{ position: "static" }} />
            {h.roles.join("  ·  ")}
          </p>

          <div className="hero-lens">
            <LensToggle />
          </div>

          <h1 className="display hero-title">
            <span className="hero-line">
              <span className="hero-line-in">
                {h.title.pre1}
                <span className="grad-text">{h.title.grad1}</span>
              </span>
            </span>
            <span className="hero-line">
              <span className="hero-line-in">
                {h.title.pre2}
                <span className="grad-text">{h.title.grad2}</span>
              </span>
            </span>
          </h1>

          <div className="hero-rotator font-mono" aria-live="polite">
            {h.lines.map((l, i) => (
              <span key={l} className={`rot-line ${i === line ? "on" : ""}`}>
                {l}
              </span>
            ))}
          </div>

          <div className="hero-cta">
            <Magnetic strength={0.3}>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("#work");
                }}
                className="btn btn-primary"
                data-cursor
              >
                {c.hero.cta1}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 12L12 4M12 4H6M12 4V10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Magnetic>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("#contact");
              }}
              className="btn btn-ghost"
              data-cursor
            >
              {c.hero.cta2}
            </a>
          </div>

          <p className="hero-loc font-mono">{c.hero.location}</p>
        </div>
      </div>

      <button className="hero-scroll" onClick={() => scrollToId("#approach")} aria-label="Scroll down">
        <span className="scroll-cue">
          <span />
        </span>
      </button>
    </header>
  );
}
