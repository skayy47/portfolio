"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

const QUERY = "(prefers-reduced-motion: reduce)";

/** One-shot read. SSR-safe — returns false on the server. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/** Live-updating reduced-motion flag; re-renders when the OS setting flips. */
export function useReducedMotion(): boolean {
  // Lazy init (not `false`) so reduced-motion users never get a smooth-scroll
  // instance created and torn down on mount. Safe against hydration mismatch:
  // callers use this in effects only, never in rendered output.
  const [reduce, setReduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduce;
}

/**
 * Run a GSAP effect only when motion is welcome.
 *
 * Why gsap.matchMedia and not `if (prefersReducedMotion()) return`:
 * matchMedia owns every tween and ScrollTrigger created inside the callback and
 * REVERTS them the instant the OS setting flips mid-session — no reload, and no
 * element left stranded at a from-state. A plain early-return cannot do that.
 *
 * Returns the context so a caller can add its own breakpoint branches.
 */
export function withMotion(fn: () => void) {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", fn);
  return mm;
}
