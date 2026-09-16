"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";

// Lenis smooth scroll, exposed on window for anchor navigation.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Layout settles (React paint + the 0.6s body color transition) before we re-measure. */
function useDeferredRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const deferred = gsap.delayedCall(0.35, refresh).pause();
    const schedule = () => deferred.restart(true);

    // ThemeProvider already dispatches "themechange"; Lang/Lens mirror that pattern.
    // FR copy is longer than EN, so a lang switch moves every trigger below it.
    window.addEventListener("themechange", schedule);
    window.addEventListener("langchange", schedule);
    window.addEventListener("lenschange", schedule);

    // next/font swaps late; without this every reveal fires ~20px early on a cold load.
    document.fonts?.ready.then(schedule);

    return () => {
      window.removeEventListener("themechange", schedule);
      window.removeEventListener("langchange", schedule);
      window.removeEventListener("lenschange", schedule);
      deferred.kill();
    };
  }, []);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useDeferredRefresh();

  useEffect(() => {
    // Reduced motion: no Lenis. ScrollTrigger still runs against native scroll
    // and needs no wiring — its default scroller IS window.
    if (reduce) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    // Drive updates from the scroll event, not the ticker: Lenis writes scrollTop
    // inside raf(), so this reads the post-write value in the same frame.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // gsap.ticker passes elapsed time in SECONDS; lenis.raf expects MILLISECONDS.
    // Getting this wrong makes Lenis either freeze or run 1000x fast.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // GSAP's default lag smoothing skips ticks after a long frame (tab-away, shader
    // compile, GC). A skipped tick desyncs Lenis' interpolation into a visible jump.
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore the default, don't leak it
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [reduce]);

  return <>{children}</>;
}

/** Smoothly scroll to an anchor id; falls back to native when Lenis is off. */
export function scrollToId(id: string) {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: -10 });
  else el.scrollIntoView({ behavior: "smooth" });
}
