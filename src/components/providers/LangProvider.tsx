"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CONTENT, DEFAULT_LOCALE, Locale, SiteContent } from "@/lib/content";

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  c: SiteContent;
}

const LangContext = createContext<Ctx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  c: CONTENT[DEFAULT_LOCALE],
});

export function useLang() {
  return useContext(LangContext);
}

const KEY = "skay-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const fromDom = document.documentElement.lang;
    const saved = (localStorage.getItem(KEY) as Locale) || (fromDom === "fr" ? "fr" : DEFAULT_LOCALE);
    setLocaleState(saved);
    document.documentElement.lang = saved;
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  return <LangContext.Provider value={{ locale, setLocale, c: CONTENT[locale] }}>{children}</LangContext.Provider>;
}

/** Pre-paint script — sets <html lang> before hydration to avoid a flash. */
export const langBootScript = `(function(){try{var l=localStorage.getItem('${KEY}');if(l){document.documentElement.lang=l;}}catch(e){}})();`;
