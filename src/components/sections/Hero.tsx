"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLang } from "@/components/providers/LangProvider";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export function Hero() {
  const { c } = useLang();
  const [line, setLine] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % c.hero.lines.length), 3400);
    return () => clearInterval(id);
  }, [c.hero.lines.length]);

  return (
    <header id="top" className="hero">
      <div className="hero-canvas" aria-hidden>
        <HeroScene />
      </div>

      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow" style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <span className="live-dot" style={{ position: "static" }} />
            {c.hero.roles.join("  ·  ")}
          </p>

          <h1 className="display hero-title">
            {c.hero.title.pre1}
            <span className="grad-text">{c.hero.title.grad1}</span>
            <br />
            {c.hero.title.pre2}
            <span className="grad-text">{c.hero.title.grad2}</span>
          </h1>

          <div className="hero-rotator font-mono" aria-live="polite">
            {c.hero.lines.map((l, i) => (
              <span key={l} className={`rot-line ${i === line ? "on" : ""}`}>
                {l}
              </span>
            ))}
          </div>

          <div className="hero-cta">
            <Magnetic strength={0.3}>
              <a href="#work" onClick={(e) => { e.preventDefault(); scrollToId("#work"); }} className="btn btn-primary" data-cursor>
                {c.hero.cta1}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </Magnetic>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("#contact"); }} className="btn btn-ghost" data-cursor>
              {c.hero.cta2}
            </a>
          </div>

          <p className="hero-loc font-mono">{c.hero.location}</p>
        </div>
      </div>

      <button className="hero-scroll" onClick={() => scrollToId("#approach")} aria-label="Scroll down">
        <span className="scroll-cue"><span /></span>
      </button>
    </header>
  );
}
