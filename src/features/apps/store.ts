import { create } from "zustand";
import type { CategoryId, CertCategory, ProjectFolder } from "@/content/types";
import { useWm } from "@/features/window-manager/store";

export type ProjectFilter = "all" | ProjectFolder;

/** UI state shared between app windows. It survives closing and reopening a window, like the prototype. */
type AppsState = {
  stackCat: "all" | CategoryId;
  stackQuery: string;
  stackSel: string | null;
  projectFilter: ProjectFilter;
  projectSel: string | null;
  expOpen: Record<string, boolean>;
  certCat: CertCategory["id"];
  setStackCat: (c: AppsState["stackCat"]) => void;
  setStackQuery: (q: string) => void;
  setStackSel: (name: string | null) => void;
  setProjectFilter: (f: ProjectFilter) => void;
  setProjectSel: (id: string | null) => void;
  /** Open the Projects window on a given project (used from Tech Stack). */
  openProject: (id: string) => void;
  toggleExp: (id: string) => void;
  setCertCat: (c: CertCategory["id"]) => void;
};

export const useApps = create<AppsState>()((set) => ({
  stackCat: "all",
  stackQuery: "",
  stackSel: null,
  projectFilter: "all",
  projectSel: null,
  expOpen: { e1: true },
  certCat: "all",
  setStackCat: (stackCat) => set({ stackCat }),
  setStackQuery: (stackQuery) => set({ stackQuery }),
  setStackSel: (stackSel) => set({ stackSel }),
  setProjectFilter: (projectFilter) => set({ projectFilter, projectSel: null }),
  setProjectSel: (projectSel) => set({ projectSel }),
  openProject: (id) => {
    set({ projectSel: id });
    useWm.getState().open("projects");
  },
  toggleExp: (id) => set((s) => ({ expOpen: { ...s.expOpen, [id]: !s.expOpen[id] } })),
  setCertCat: (certCat) => set({ certCat }),
}));
