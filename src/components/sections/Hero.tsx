"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

  // Reset the rotator when the lens flips so lines stay in range.
  useEffect(() => {
    setLine(0);
  }, [lens]);

  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % h.lines.length), 3400);
    return () => clearInterval(id);
  }, [h.lines.length]);

  return (
    <header id="top" className="hero">
      <div className="hero-canvas" aria-hidden>
        <HeroScene />
      </div>

      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow" style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <span className="live-dot" style={{ position: "static" }} />
            {h.roles.join("  ·  ")}
          </p>

          <LensToggle />

          <h1 className="display hero-title">
            {h.title.pre1}
            <span className="grad-text">{h.title.grad1}</span>
            <br />
            {h.title.pre2}
            <span className="grad-text">{h.title.grad2}</span>
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
