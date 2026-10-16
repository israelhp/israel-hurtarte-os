"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { AppId } from "@/shared/app-ids";
import { Icon } from "@/shared/icons/Icon";
import { cn } from "@/lib/cn";
import { useT } from "@/features/settings/hooks";
import { APP_ICONS, windowTitle } from "@/features/desktop/apps";
import { clampGeo, isCompact } from "./model";
import { dockButton, hasInteracted, isEditable } from "./interaction";
import { getViewport, useWm } from "./store";

const KEY_STEP = 16;
const KEY_STEP_BIG = 64;

type Drag = {
  pointerId: number;
  sx: number;
  sy: number;
  x: number;
  y: number;
  raf: number;
  cx: number;
  cy: number;
};

/**
 * One desktop window. Dragging moves the element with a transform inside requestAnimationFrame and
 * commits the final position to the store on release, so no other window re-renders while dragging.
 */
export function Window({ id, children }: { id: AppId; children: ReactNode }) {
  const t = useT();
  const w = useWm((s) => s.wins[id]);
  const active = useWm((s) => s.active === id);
  const { focus, close, minimize, toggleMax, move } = useWm.getState();
  const ref = useRef<HTMLElement>(null);
  // The window that opens on page load appears at once (a 220ms fade-in delayed the largest contentful paint).
  const [skipEnter] = useState(() => !hasInteracted());
  const drag = useRef<Drag | null>(null);
  const title = windowTitle(t, id);
  // The terminal title carries the prototype's shell-prompt suffix; the accessible name must start with what is shown.
  const shownTitle = id === "terminal" ? `${title} — visitor@hurtarte — zsh` : title;

  const openTick = useWm((s) => s.openTick);
  // Take keyboard focus only on an explicit open request (Dock, menu, shortcut, terminal), never on page
  // load and never just because another window closed and this one became active.
  useEffect(() => {
    const el = ref.current;
    if (
      useWm.getState().active === id &&
      hasInteracted() &&
      el &&
      !el.contains(document.activeElement)
    )
      el.focus({ preventScroll: true });
  }, [id, openTick]);

  useEffect(
    () => () => {
      if (drag.current) cancelAnimationFrame(drag.current.raf);
    },
    [],
  );

  /** Return focus to the Dock icon when a window that held focus goes away. */
  const leave = (action: () => void) => {
    // Safari does not focus buttons on click, so also act when this was the active window.
    const hadFocus = ref.current?.contains(document.activeElement) || active;
    action();
    if (hadFocus) dockButton(id)?.focus();
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    focus(id);
    const vp = getViewport();
    if (w.max || isCompact(vp)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      pointerId: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      x: w.x,
      y: w.y,
      raf: 0,
      cx: w.x,
      cy: w.y,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const g = clampGeo(
      { x: d.x + e.clientX - d.sx, y: d.y + e.clientY - d.sy, w: w.w, h: w.h },
      getViewport(),
    );
    d.cx = g.x;
    d.cy = g.y;
    if (!d.raf)
      d.raf = requestAnimationFrame(() => {
        d.raf = 0;
        if (ref.current)
          ref.current.style.transform = `translate(${d.cx - d.x}px, ${d.cy - d.y}px)`;
      });
  };

  const endDrag = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    cancelAnimationFrame(d.raf);
    if (ref.current) ref.current.style.transform = "";
    if (d.cx !== d.x || d.cy !== d.y) move(id, d.cx, d.cy);
  };

  const onTitleKey = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.shiftKey ? KEY_STEP_BIG : KEY_STEP;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (delta[e.key]) {
      e.preventDefault();
      move(id, w.x + delta[e.key][0], w.y + delta[e.key][1]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMax(id);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape" && !e.defaultPrevented && !isEditable(e.target)) leave(() => close(id));
  };

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-label={title}
      data-win={id}
      className={cn("win", w.max && "max", w.anim, active && "active", skipEnter && "no-enter")}
      style={{ left: w.x, top: w.y, width: w.w, height: w.h, zIndex: 10 + w.z }}
      onPointerDown={() => focus(id)}
      onKeyDown={onKeyDown}
    >
      <header
        className="titlebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) toggleMax(id);
        }}
      >
        <div className="lights">
          <button
            type="button"
            className="light l-close"
            aria-label={t.close}
            onClick={() => leave(() => close(id))}
          >
            <span />
          </button>
          <button
            type="button"
            className="light l-min"
            aria-label={t.minimize}
            onClick={() => leave(() => minimize(id))}
          >
            <span />
          </button>
          <button
            type="button"
            className="light l-max"
            aria-label={w.max ? t.restore : t.maximize}
            onClick={() => toggleMax(id)}
          >
            <span />
          </button>
        </div>
        <div
          className="wtitle"
          tabIndex={0}
          role="button"
          aria-label={`${shownTitle}. ${t.move_window}`}
          onKeyDown={onTitleKey}
        >
          <Icon name={APP_ICONS[id]} />
          <span>{shownTitle}</span>
        </div>
        <div className="tb-pad" />
      </header>
      <div className="wbody">{children}</div>
    </section>
  );
}
