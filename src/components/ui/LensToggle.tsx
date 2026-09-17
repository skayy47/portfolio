"use client";

import { useLens } from "@/components/providers/LensProvider";
import { useLang } from "@/components/providers/LangProvider";
import { LENSES } from "@/lib/content";

/**
 * Business ⇄ Technical view switch. It rewrites the hero, the work section's
 * lead, every project's kicker/tagline/description/signature/metrics, the
 * systems-map theses and the secondary blurbs — the same systems, described
 * for whoever is reading. Rendered twice: in the hero and at the work head.
 */
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
