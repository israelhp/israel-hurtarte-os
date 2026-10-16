/** Desktop apps, in Dock order. */
export const APP_IDS = [
  "home",
  "about",
  "stack",
  "projects",
  "experience",
  "education",
  "certs",
  "terminal",
  "contact",
] as const;
export type AppId = (typeof APP_IDS)[number];
