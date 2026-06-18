// Premium light palette collection. The actual CSS variable values live in
// globals.css under [data-theme="<id>"]. This file is the source of truth for
// the switcher UI (names + swatches) and the default order.

export type ThemeId = "aurora" | "champagne" | "pearl" | "sorbet" | "lagoon";

export interface Theme {
  id: ThemeId;
  name: string;
  blurb: string;
  /** Swatch stops shown in the switcher (left→right). */
  swatch: [string, string, string];
}

export const THEMES: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    blurb: "Iridescent indigo · violet · cyan",
    swatch: ["#5B6CFF", "#9B5BFF", "#28C8E6"],
  },
  {
    id: "champagne",
    name: "Champagne",
    blurb: "Ivory · gold · bronze",
    swatch: ["#A16207", "#C9A24B", "#E4C779"],
  },
  {
    id: "pearl",
    name: "Pearl",
    blurb: "Holographic pink · lilac · mint",
    swatch: ["#E06AA6", "#9B6BE0", "#46D6B6"],
  },
  {
    id: "sorbet",
    name: "Sorbet",
    blurb: "Coral · peach · rose",
    swatch: ["#FF6B5B", "#FF9E6B", "#FF7DA8"],
  },
  {
    id: "lagoon",
    name: "Lagoon",
    blurb: "Teal · aqua · emerald",
    swatch: ["#0FB5A0", "#1FA7C9", "#34C77B"],
  },
];

export const DEFAULT_THEME: ThemeId = "aurora";

/** rgb triplets for the R3F hero, keyed by theme. Kept in sync with globals.css. */
export const THEME_GL: Record<ThemeId, { a: string; b: string; c: string; bg: string }> = {
  aurora: { a: "#5B6CFF", b: "#9B5BFF", c: "#28C8E6", bg: "#F7F8FC" },
  champagne: { a: "#C9A24B", b: "#E4C779", c: "#A16207", bg: "#FBF8F2" },
  pearl: { a: "#E06AA6", b: "#9B6BE0", c: "#46D6B6", bg: "#FCF8FB" },
  sorbet: { a: "#FF6B5B", b: "#FF9E6B", c: "#FF7DA8", bg: "#FFF8F4" },
  lagoon: { a: "#0FB5A0", b: "#1FA7C9", c: "#34C77B", bg: "#F2FBF8" },
};
