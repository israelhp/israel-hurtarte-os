import { Icon, type IconName } from "../icons/Icon";
import { cn } from "@/lib/cn";

export type AppId =
  | "home"
  | "about"
  | "stack"
  | "projects"
  | "experience"
  | "education"
  | "certs"
  | "contact"
  | "terminal";

/** Prototype per-app tile accent (`.t-*`). */
export const APP_ICON: Record<AppId, IconName> = {
  home: "home",
  about: "user",
  stack: "layers",
  projects: "folder",
  experience: "briefcase",
  education: "graduation",
  certs: "award",
  contact: "mail",
  terminal: "terminal",
};

const SIZE = { dock: "dock-tile", shortcut: "sc-ico", tour: "dock-tile tour-icon" } as const;

/** Glossy app icon tile used by the Dock, desktop shortcuts and the tour. */
export function AppTile({
  app,
  size = "dock",
  icon,
}: {
  app: AppId;
  size?: keyof typeof SIZE;
  icon?: IconName;
}) {
  return (
    <span className={cn(SIZE[size], `t-${app}`)}>
      <Icon name={icon ?? APP_ICON[app]} />
    </span>
  );
}
