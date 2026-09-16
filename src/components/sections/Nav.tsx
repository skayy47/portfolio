"use client";

import { useRef } from "react";
import { useLang } from "@/components/providers/LangProvider";
import { IDENTITY } from "@/lib/identity";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";
import { LangToggle } from "@/components/ui/LangToggle";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";

export function Nav() {
  const { c } = useLang();
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /**
   * Previously this was a window scroll listener calling setScrolled/setHidden,
   * which re-rendered the whole nav on most scroll frames. ScrollTrigger drives
   * it now: quickTo writes the transform directly and the glass state is a
   * classList toggle, so scrolling causes zero React renders.
   */
  useGSAP(
    () => {
      const nav = navRef.current;
      const inner = innerRef.current;
      if (!nav || !inner) return;

      // Under reduced motion the shell still hides/shows — it just snaps.
      const setY = reduce
        ? (v: number) => gsap.set(nav, { yPercent: v })
        : gsap.quickTo(nav, "yPercent", { duration: 0.4, ease: "site" });

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          inner.classList.toggle("glass", y > 24);
          setY(self.direction === 1 && y > 320 ? -130 : 0);
        },
      });

      return () => st.kill();
    },
    { scope: navRef, dependencies: [reduce], revertOnUpdate: true }
  );

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(href);
  };

  const links = [
    { label: c.nav.work, href: "#work" },
    { label: c.nav.approach, href: "#approach" },
    { label: c.nav.journey, href: "#journey" },
    { label: c.nav.stack, href: "#stack" },
  ];

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-inner" ref={innerRef}>
        <a href="#top" onClick={go("#top")} className="brand" aria-label="Home">
          <span className="brand-dot" />
          {IDENTITY.handle}
        </a>
        <div className="nav-links">
          {links.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)} className="nav-link">
              {n.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <LangToggle />
          <Magnetic strength={0.25}>
            <a href="#contact" onClick={go("#contact")} className="btn btn-primary nav-cta">
              {c.nav.talk}
            </a>
          </Magnetic>
        </div>
      </div>
    </nav>
  );
}
