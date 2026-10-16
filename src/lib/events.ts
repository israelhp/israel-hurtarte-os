/** Tiny pub/sub so features (window manager, settings, projects) can notify the tour without importing it. */
type Listener = (name: string) => void;
const listeners = new Set<Listener>();

export function emit(name: string): void {
  listeners.forEach((l) => l(name));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
