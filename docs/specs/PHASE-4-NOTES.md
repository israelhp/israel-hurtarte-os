# Phase 4 notes — deviations and decisions

Content and strings were migrated from the prototype script by evaluating its data block in an isolated Node `vm` context (no I/O), then writing typed modules in `src/content/` and the dictionaries in `src/i18n/`. Those files are now the source of truth.

## Deviations from the prototype

1. **Contact form** (decision D5): the prototype showed a fake "demo" success. It now opens a `mailto:` draft and says so; validation errors are announced. Strings `form_demo` and `form_sent` were rewritten accordingly.
2. **Terminal**: input capped at 200 characters; history 100; 500 output lines; Tab/arrow behaviour unchanged. Typed intro commits the full line if the window closes mid-animation.
3. **Headings**: app titles are `h2`, card names `h3`, section cards `h3` (prototype used `h1`/`h4`).
4. **Safe links**: every URL from content goes through `safeHref` (http/https/mailto only); an empty URL renders "Not configured" / hides the button, as in the prototype.
5. **Project selection and filters live in a shared store** so the Tech Stack "related projects" can open Projects on a given project (prototype did the same through component state).
6. Each app window is a separate code-split chunk.
7. Prototype labels kept verbatim by owner decision D9: "DEMO", "DEMO DATA", "PLACEHOLDER", the demo/placeholder notes (`demo_note`, `cert_note`, `demo_entries`).

## Deferred

- Portfolio View sections, tour, preference persistence (Phase 5).
- Real project/certification content, CV URL, website, screenshots (owner, Phase 7).
- Terminal behaviour with a real screen reader; touch interactions on real devices.

## Independent review (code-reviewer subagent, 2026-10-15) and what changed

- **Fixed:** an e2e assertion without `await` (the "hostile input opens nothing" check proved nothing); the animated terminal line is now outside the `role=log` live region (`aria-hidden`), so assistive tech only hears the final line; the pending "open window" timer of a terminal command is cleared when the terminal unmounts; focus moves to the first invalid contact field; the mailto anchor is attached to the document before clicking; `form_sent` no longer claims the client "was opened" (it says the message was prepared); `aria-controls` only set while the entry is expanded; removed an `as never` cast.
- **New tests:** typing animation with real motion (partial text outside the log, final line inside), closing the terminal mid-typing keeps the full line, focus on invalid field.
- **Skills provenance (reviewer finding #5):** the 29 technologies are exactly the list the owner supplied in the master prompt (section 6). `content.test.ts` now pins the list, so any addition or removal must be a deliberate, owner-approved change. No per-skill status flag was added.
- **Known limit:** under React StrictMode (`next dev` only) the typing animation does not play because the simulated effect cleanup commits the line; production behaviour is the animated one.
- Long axe loops have an explicit 120s timeout because the development machine was heavily loaded; they normally take under 30s.
