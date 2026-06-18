"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_THEME, ThemeId } from "@/lib/themes";

interface Ctx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<Ctx>({ theme: DEFAULT_THEME, setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

const KEY = "skay-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  // Hydrate from storage / the pre-paint script.
  useEffect(() => {
    const fromDom = document.documentElement.dataset.theme as ThemeId | undefined;
    const saved = (localStorage.getItem(KEY) as ThemeId) || fromDom || DEFAULT_THEME;
    setThemeState(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(KEY, t);
    } catch {}
    // Broadcast so the WebGL hero can lerp to the new palette.
    window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

/** Inline, render-blocking script string — sets data-theme before first paint. */
export const themeBootScript = `(function(){try{var t=localStorage.getItem('${KEY}');if(t){document.documentElement.dataset.theme=t;}}catch(e){}})();`;
