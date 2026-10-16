/** Theme options shared by the app and the design-system catalog. */
export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export const ACCENTS = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "graphite",
] as const;
export type Accent = (typeof ACCENTS)[number];
