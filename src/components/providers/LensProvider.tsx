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

/** Business ⇄ Technical reading lens. Reframes the hero + project framing. */
export function LensProvider({ children }: { children: React.ReactNode }) {
  const [lens, setLensState] = useState<Lens>(DEFAULT_LENS);

  useEffect(() => {
    const fromDom = document.documentElement.dataset.lens as Lens | undefined;
    const saved = (localStorage.getItem(KEY) as Lens) || fromDom || DEFAULT_LENS;
    setLensState(saved);
    document.documentElement.dataset.lens = saved;
  }, []);

  const setLens = useCallback((l: Lens) => {
    setLensState(l);
    document.documentElement.dataset.lens = l;
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  return <LensContext.Provider value={{ lens, setLens }}>{children}</LensContext.Provider>;
}

/** Pre-paint script — sets data-lens before hydration to avoid a flash. */
export const lensBootScript = `(function(){try{var l=localStorage.getItem('${KEY}');if(l){document.documentElement.dataset.lens=l;}}catch(e){}})();`;
