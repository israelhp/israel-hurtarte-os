"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AppId } from "@/shared/app-ids";
import { HomeApp } from "@/features/apps/home/HomeApp";

// Each app is its own chunk, fetched the first time its window opens.
const load = <T extends ComponentType>(fn: () => Promise<T>) =>
  dynamic(fn, { loading: () => null });

const APPS: Record<AppId, ComponentType> = {
  home: HomeApp, // opens on load, so it ships in the main chunk instead of costing a second round trip
  about: load(() => import("@/features/apps/about/AboutApp").then((m) => m.AboutApp)),
  stack: load(() => import("@/features/apps/stack/StackApp").then((m) => m.StackApp)),
  projects: load(() => import("@/features/projects/ProjectsApp").then((m) => m.ProjectsApp)),
  experience: load(() =>
    import("@/features/apps/experience/ExperienceApp").then((m) => m.ExperienceApp),
  ),
  education: load(() =>
    import("@/features/apps/education/EducationApp").then((m) => m.EducationApp),
  ),
  certs: load(() => import("@/features/apps/certs/CertsApp").then((m) => m.CertsApp)),
  terminal: load(() => import("@/features/terminal/TerminalApp").then((m) => m.TerminalApp)),
  contact: load(() => import("@/features/contact/ContactApp").then((m) => m.ContactApp)),
};

export function AppContent({ id }: { id: AppId }) {
  const App = APPS[id];
  return <App />;
}
