import type { IconName } from "@/shared/icons/Icon";
import { APP_IDS, type AppId } from "@/shared/app-ids";
import type { Dictionary } from "@/i18n";

export const APP_ICONS: Record<AppId, IconName> = {
  home: "home",
  about: "user",
  stack: "layers",
  projects: "folder",
  experience: "briefcase",
  education: "graduation",
  certs: "award",
  terminal: "terminal",
  contact: "mail",
};

export const appName = (t: Dictionary, id: AppId) => t[`app_${id}` as const];
export const windowTitle = (t: Dictionary, id: AppId) => t[`w_${id}` as const];

/** The Dock separates the terminal from the content apps (prototype line 879). */
export const DOCK_SEPARATOR_BEFORE: AppId = "terminal";
export { APP_IDS };
