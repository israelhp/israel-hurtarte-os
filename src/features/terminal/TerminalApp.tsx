"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useT } from "@/features/settings/hooks";
import { hasInteracted } from "@/features/window-manager/interaction";
import { useWm } from "@/features/window-manager/store";
import { CHIP_COMMANDS, MAX_INPUT, complete, runCommand, type LineKind } from "./commands";
import { useTerminal } from "./store";

const TYPE_MS = 16;

function Prompt() {
  return (
    <span className="tp">
      visitor<b>@hurtarte</b>:~$
    </span>
  );
}

/** Simulated terminal: matches input against a fixed allowlist, never evaluates or executes it. */
export function TerminalApp() {
  const t = useT();
  const lines = useTerminal((s) => s.lines);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState("");
  const [hist, setHist] = useState(-1);
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLInputElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Typed welcome line, once per page load (prototype `startTyping`).
  useEffect(() => {
    const term = useTerminal.getState();
    if (term.introDone) return;
    term.markIntro();
    const msg = t.term_intro;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      term.push([{ kind: "sys", text: msg }]);
      return;
    }
    let i = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      setTyping("");
      useTerminal.getState().push([{ kind: "sys", text: msg }]);
    };
    const timer = setInterval(() => {
      i += 1;
      if (i >= msg.length) finish();
      else setTyping(msg.slice(0, i));
    }, TYPE_MS);
    // If the window closes mid-animation, commit the full line instead of losing it.
    return finish;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasInteracted()) inRef.current?.focus({ preventScroll: true });
    return () => clearTimeout(openTimer.current);
  }, []);

  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  const run = (raw: string) => {
    const result = runCommand(raw, t);
    const term = useTerminal.getState();
    if (result.clear) term.clear();
    else term.push(result.lines);
    if (result.open) {
      const app = result.open;
      clearTimeout(openTimer.current);
      openTimer.current = setTimeout(() => useWm.getState().open(app), 200);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const history = useTerminal.getState().history;
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      if (input.trim()) useTerminal.getState().remember(input);
      setInput("");
      setHist(-1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = complete(input);
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1)
        useTerminal.getState().push([{ kind: "sys", text: matches.join("   ") }]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = hist < 0 ? history.length - 1 : Math.max(0, hist - 1);
      setHist(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hist < 0) return;
      const next = hist + 1;
      if (next >= history.length) {
        setHist(-1);
        setInput("");
      } else {
        setHist(next);
        setInput(history[next]);
      }
    }
  };

  return (
    <div className="term">
      <div ref={outRef} className="term-out" onClick={() => inRef.current?.focus()}>
        <div role="log" aria-label={t.term_output}>
          {lines.map((l) => (
            <div key={l.id} className={`tline ${cls(l.kind)}`}>
              {l.kind === "cmd" && (
                <>
                  <Prompt />{" "}
                </>
              )}
              {l.text}
            </div>
          ))}
        </div>
        {/* The animated line stays outside the live region so assistive tech only hears the final text. */}
        {typing && (
          <div className="tline sys" aria-hidden="true">
            {typing}
            <span className="caret" />
          </div>
        )}
      </div>
      <label className="tprompt">
        <Prompt />
        <input
          ref={inRef}
          type="text"
          value={input}
          maxLength={MAX_INPUT}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t.term_input}
          placeholder={t.term_ph}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>
      <div className="tchips" role="group" aria-label={t.chips_label}>
        <span className="muted" style={{ fontSize: 11.5, marginRight: 4 }}>
          {t.term_hint}
        </span>
        {CHIP_COMMANDS.map((c) => (
          <button key={c} type="button" className="tchip" onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

const cls = (k: LineKind) => (k === "cmd" ? "" : k);
