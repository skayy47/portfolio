"use client";

import { useLang } from "@/components/providers/LangProvider";
import { LOCALES } from "@/lib/content";

/** Premium sliding EN / FR switch. */
export function LangToggle() {
  const { locale, setLocale } = useLang();

  return (
    <div className="lang-toggle" role="group" aria-label="Language / Langue">
      <span className="lang-thumb" data-pos={locale} aria-hidden />
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className="lang-opt"
          data-active={l === locale}
          aria-pressed={l === locale}
          onClick={() => setLocale(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
