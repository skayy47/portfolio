"use client";

import { useLens } from "@/components/providers/LensProvider";
import { useLang } from "@/components/providers/LangProvider";
import { LENSES } from "@/lib/content";

/** Business ⇄ Technical view switch — reframes the hero and project framing. */
export function LensToggle() {
  const { lens, setLens } = useLens();
  const { c } = useLang();
  const label = (l: (typeof LENSES)[number]) =>
    l === "business" ? c.ui.lensBusiness : c.ui.lensTechnical;

  return (
    <div className="lens-toggle" role="group" aria-label={c.ui.lensLabel}>
      <span className="lens-thumb" data-pos={lens} aria-hidden />
      {LENSES.map((l) => (
        <button
          key={l}
          type="button"
          className="lens-opt"
          data-active={l === lens}
          aria-pressed={l === lens}
          onClick={() => setLens(l)}
          data-cursor
        >
          {label(l)}
        </button>
      ))}
    </div>
  );
}
