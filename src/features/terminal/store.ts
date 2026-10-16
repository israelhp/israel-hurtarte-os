import { create } from "zustand";
import type { TermLine } from "./commands";

export type StoredLine = TermLine & { id: number };
const MAX_LINES = 500;
const MAX_HISTORY = 100;

/** Terminal session state; survives closing and reopening the window (until the page reloads). */
type TerminalState = {
  lines: StoredLine[];
  history: string[];
  introDone: boolean;
  nextId: number;
  push: (lines: TermLine[]) => void;
  clear: () => void;
  remember: (cmd: string) => void;
  markIntro: () => void;
};

export const useTerminal = create<TerminalState>()((set) => ({
  lines: [],
  history: [],
  introDone: false,
  nextId: 1,
  push: (add) =>
    set((s) => ({
      lines: [...s.lines, ...add.map((l, i) => ({ ...l, id: s.nextId + i }))].slice(-MAX_LINES),
      nextId: s.nextId + add.length,
    })),
  clear: () => set({ lines: [] }),
  remember: (cmd) => set((s) => ({ history: [...s.history, cmd].slice(-MAX_HISTORY) })),
  markIntro: () => set({ introDone: true }),
}));
