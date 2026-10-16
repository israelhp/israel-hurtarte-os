/** Set once the visitor has pressed a key or pointer, so windows opened at page load do not steal focus. */
let interacted = false;
export const hasInteracted = () => interacted;
export function trackInteraction(): () => void {
  const mark = () => {
    interacted = true;
  };
  window.addEventListener("pointerdown", mark, { capture: true, once: true });
  window.addEventListener("keydown", mark, { capture: true, once: true });
  return () => {
    window.removeEventListener("pointerdown", mark, { capture: true });
    window.removeEventListener("keydown", mark, { capture: true });
  };
}

/** Elements where Escape/arrow keys belong to the control, not the window. */
export function isEditable(el: EventTarget | null): boolean {
  return (
    el instanceof HTMLElement &&
    el.closest("input, textarea, select, [contenteditable='true']") !== null
  );
}

export const dockButton = (id: string) =>
  document.querySelector<HTMLElement>(`[data-dock-app="${id}"]`);
