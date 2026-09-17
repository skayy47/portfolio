"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  /** How hard the element chases the cursor, 0..1. */
  strength?: number;
  /** Hard cap on displacement in px, so a wide button cannot fling. */
  radius?: number;
  className?: string;
}

/** Element drifts toward the cursor on hover — subtle, premium magnetism. */
export function Magnetic({ children, strength = 0.35, radius = 26, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // matchMedia rather than a plain `if`: it owns what is created inside and
      // reverts it the instant the pointer type or the OS motion setting flips.
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        // quickTo interpolates on the GSAP ticker, which Lenis already drives —
        // one clock for the whole page. quickSetter would track the raw pointer
        // and need its own rAF loop competing with it. This also replaces the
        // old inline `transition: transform`, which was a CSS transition on a
        // property JS rewrote on every pointer event: it tried to tween each
        // write and smeared.
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "site" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "site" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * strength;
          const dy = (e.clientY - (r.top + r.height / 2)) * strength;
          const d = Math.hypot(dx, dy);
          const k = d > radius ? radius / d : 1;
          xTo(dx * k);
          yTo(dy * k);
        };
        const reset = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", reset);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", reset);
          reset();
        };
      });
    },
    { scope: ref, dependencies: [strength, radius], revertOnUpdate: true }
  );

  return (
    <div ref={ref} className={`magnetic ${className}`}>
      {children}
    </div>
  );
}
