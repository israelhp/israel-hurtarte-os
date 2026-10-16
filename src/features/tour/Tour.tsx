"use client";

import { useEffect, useRef, useState } from "react";
import { AppTile, Button, Kbd } from "@/shared/components";
import { TOUR_STEPS, TOUR_TEXT } from "@/i18n/tour";
import { cn } from "@/lib/cn";
import { useSettings } from "@/features/settings/store";
import { isEditable } from "@/features/window-manager/interaction";
import { useLang, useT } from "@/features/settings/hooks";
import { measure, tourGeometry } from "./geometry";
import { useTour } from "./store";

const MEASURE_MS = 250;

/**
 * Guided tour overlay: dims the screen, highlights the element for the current step and shows a card.
 * It is a non-modal dialog on purpose: the highlighted control must stay usable (also by keyboard), so
 * there is no focus trap. Focus moves to the card on every step, "Next" is always available and Esc skips.
 */
export function Tour({ onFinish }: { onFinish: () => void }) {
  const t = useT();
  const lang = useLang();
  const { on, step, spot, go, end, setSpot } = useTour();
  const cardRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  const def = TOUR_STEPS[step];

  // Re-measure the highlighted element while the tour is open (windows animate and move).
  useEffect(() => {
    if (!on) return;
    const tick = () => {
      setVp((v) =>
        v.w === window.innerWidth && v.h === window.innerHeight
          ? v
          : { w: window.innerWidth, h: window.innerHeight },
      );
      setSpot(measure(def.target));
    };
    tick();
    const timers = [setTimeout(tick, 60), setTimeout(tick, 320)];
    const interval = setInterval(tick, MEASURE_MS);
    window.addEventListener("resize", tick);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
      window.removeEventListener("resize", tick);
    };
  }, [on, step, def.target, setSpot]);

  // Each step announces itself by moving focus to the card; Escape skips the tour.
  useEffect(() => {
    if (on) cardRef.current?.focus({ preventScroll: true });
  }, [on, step]);
  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      // Esc belongs to the settings dialog or a text field first; only a bare Esc skips the tour.
      if (e.key === "Escape" && !useSettings.getState().settingsOpen && !isEditable(e.target)) {
        e.stopPropagation();
        end();
        onFinish();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [on, end, onFinish]);

  if (!on) return null;

  const text = TOUR_TEXT[lang][def.id];
  const geo = tourGeometry(def.target ? spot : null, vp.w, vp.h);
  const isIntro = def.id === "intro";
  const isDone = def.id === "done";
  const isMid = !isIntro && !isDone;
  const midCount = TOUR_STEPS.length - 2;
  const finish = () => {
    end();
    onFinish();
  };

  return (
    <div className="os tour-root">
      <div className="tour" role="dialog" aria-modal="false" aria-labelledby="tour-title">
        <div className={cn("tour-dim", geo.dimClass)} style={{ clipPath: geo.clip }} />
        {geo.hasSpot && (
          <div
            className="tour-ring"
            style={{ left: geo.ring.x, top: geo.ring.y, width: geo.ring.w, height: geo.ring.h }}
          />
        )}
        <div
          ref={cardRef}
          tabIndex={-1}
          className={cn("tour-card", geo.cardClass)}
          style={{ left: geo.cardX, top: geo.cardY, width: geo.cardW }}
        >
          {isMid && (
            <div className="tour-top">
              <span className="tour-step">
                {t.tour_step} {step} / {midCount}
              </span>
              <button type="button" className="tour-skip" onClick={finish}>
                {t.tour_skip}
              </button>
            </div>
          )}
          {isIntro && <AppTile app="home" size="tour" icon="shield-check" />}
          {isDone && <AppTile app="experience" size="tour" icon="check" />}
          <h3 id="tour-title">{text.title}</h3>
          <p>{text.body}</p>
          {text.hint && geo.hasSpot && (
            <div className="tour-hint">
              <i />
              <span>
                <b>{t.tour_try}</b> {text.hint}
              </span>
            </div>
          )}
          {isDone && (
            <div className="tour-keys">
              <Kbd>help</Kbd>
              <Kbd>projects</Kbd>
              <Kbd>whoami</Kbd>
            </div>
          )}
          <div className="tour-foot">
            <div className="tour-dots" aria-hidden="true">
              {TOUR_STEPS.map((s, i) => (
                <span key={s.id} className={i === step ? "on" : undefined} />
              ))}
            </div>
            <div className="tour-btns">
              {isIntro && (
                <>
                  <Button onClick={finish}>{t.tour_later}</Button>
                  <Button variant="primary" onClick={() => go(step + 1)}>
                    {t.tour_start}
                  </Button>
                </>
              )}
              {isMid && (
                <>
                  <Button size="sm" onClick={() => go(step - 1)}>
                    {t.tour_back}
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => go(step + 1)}>
                    {t.tour_next}
                  </Button>
                </>
              )}
              {isDone && (
                <Button variant="primary" onClick={finish}>
                  {t.tour_finish}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
