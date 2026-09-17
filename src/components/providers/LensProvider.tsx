"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LENS, Lens } from "@/lib/content";

interface Ctx {
  lens: Lens;
  setLens: (l: Lens) => void;
}

const LensContext = createContext<Ctx>({ lens: DEFAULT_LENS, setLens: () => {} });

export function useLens() {
  return useContext(LensContext);
}

const KEY = "skay-lens";

/**
 * Business ⇄ Technical reading lens.
 *
 * The lens rewrites most of the work section, so a returning reader whose saved
 * lens is not the prerendered default would otherwise watch the wrong words sit
 * there until hydration. `html.js-motion` hides that for everyone with motion
 * on — but it is deliberately never added under reduced motion, which is
 * exactly the audience least willing to have text change under them. Hence the
 * explicit `data-lens-pending` handshake below.
 */
export function LensProvider({ children }: { children: React.ReactNode }) {
  const [lens, setLensState] = useState<Lens>(DEFAULT_LENS);

  useEffect(() => {
    const el = document.documentElement;
    const fromDom = el.dataset.lens as Lens | undefined;
    const saved = (localStorage.getItem(KEY) as Lens) || fromDom || DEFAULT_LENS;
    setLensState(saved);
    el.dataset.lens = saved;
    // The server rendered the default lens. Now that the saved one is applied,
    // the copy the boot script was holding back is safe to show.
    delete el.dataset.lensPending;
  }, []);

  const setLens = useCallback((l: Lens) => {
    setLensState(l);
    document.documentElement.dataset.lens = l;
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    // Copy changes layout height (FR runs longer than EN), so the motion layer
    // must re-measure every ScrollTrigger. Mirrors ThemeProvider's "themechange".
    window.dispatchEvent(new CustomEvent("lenschange", { detail: l }));
  }, []);

  return <LensContext.Provider value={{ lens, setLens }}>{children}</LensContext.Provider>;
}

/**
 * Pre-paint script. Sets data-lens, and when the saved lens differs from the
 * one the page was prerendered with, marks the lens-dependent copy as pending
 * so it is held blank rather than shown wrong for a few hundred milliseconds.
 *
 * The 3s failsafe matters: if the bundle never arrives, the effect that clears
 * this never runs, and without it that copy would stay invisible for good —
 * the same trap lib/motion-boot.ts guards against.
 */
export const lensBootScript = `(function(){var d=document.documentElement;try{var l=localStorage.getItem('${KEY}');if(l){d.dataset.lens=l;if(l!=='${DEFAULT_LENS}'){d.dataset.lensPending='1';setTimeout(function(){delete d.dataset.lensPending;},3000);}}}catch(e){}})();`;
