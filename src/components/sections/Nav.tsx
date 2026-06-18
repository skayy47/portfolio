"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/providers/LangProvider";
import { IDENTITY } from "@/lib/identity";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";
import { LangToggle } from "@/components/ui/LangToggle";

export function Nav() {
  const { c } = useLang();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 320);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <nav className="nav" style={{ transform: hidden ? "translateY(-130%)" : "none" }}>
      <div className={`nav-inner ${scrolled ? "glass" : ""}`}>
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
