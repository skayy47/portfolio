"use client";

import { useState } from "react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "@/components/providers/ThemeProvider";

/** Floating dock to switch between the premium light palettes. */
export function PaletteSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div className="palette-dock" data-open={open}>
      <button
        className="palette-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Change colour palette"
      >
        <span className="palette-orb" aria-hidden>
          <i style={{ background: active.swatch[0] }} />
          <i style={{ background: active.swatch[1] }} />
          <i style={{ background: active.swatch[2] }} />
        </span>
        <span className="palette-name font-mono">{active.name}</span>
      </button>

      <div className="palette-list" role="listbox" aria-label="Palettes">
        {THEMES.map((t) => (
          <button
            key={t.id}
            role="option"
            aria-selected={t.id === theme}
            data-active={t.id === theme}
            className="palette-item"
            onClick={() => {
              setTheme(t.id);
            }}
            title={`${t.name} — ${t.blurb}`}
          >
            <span className="palette-swatch" aria-hidden>
              <i style={{ background: t.swatch[0] }} />
              <i style={{ background: t.swatch[1] }} />
              <i style={{ background: t.swatch[2] }} />
            </span>
            <span className="palette-label">
              <strong>{t.name}</strong>
              <em>{t.blurb}</em>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
