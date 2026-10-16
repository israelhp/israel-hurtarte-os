# Design fidelity (DESIGN_FIDELITY_GATE, Phase 8)

`tests/e2e/visual.spec.ts` renders the **original prototype** (`design/source/claude-design/…html`, opened with
`file://`) and the app under identical conditions — same viewport, theme, language (English, the prototype's default),
no tour, no animation, the prototype's real Geist font (the test skips itself if the font could not load) — and
compares screenshots pixel by pixel with `pixelmatch` (threshold 0.12). Diff images go to `test-results/visual/`.

## Results (1440×900, share of differing pixels, dark / light)

| Region                                                                                 | Result                                | Tolerance          |
| -------------------------------------------------------------------------------------- | ------------------------------------- | ------------------ |
| Wallpaper, menu bar (left part), Dock                                                  | **0.00 % / 0.00 %** (pixel-identical) | 1–2 %              |
| Window: Home · Experience · Projects                                                   | 0.00 % · 0.00 % · 0.06 %              | 0.5 %              |
| Window: Education · Certifications · Terminal                                          | 0.22 % · 0.13 % · 0.17 %              | 1 %                |
| Window: Tech Stack                                                                     | 0.12 %                                | 2 %                |
| Window: About                                                                          | 1.6 %                                 | 3 %                |
| Window: Contact                                                                        | 5.8 % / 9.5 %                         | 12 %               |
| States: project detail · stack selection · expanded experience · terminal after `help` | 0.00 % · 0.11 % · 0.00 % · 0.17 %     | 0.5–2 %            |
| Settings popover · Tour card                                                           | 0.32 % · 0.07 %                       | 4 % · 1 %          |
| Tablet 1024×768: menu bar, Welcome window, Dock                                        | 0.00 % each                           | 1–2 %              |
| Phone 390×844: menu bar / Welcome / Dock                                               | 20 % / 10 % / 39 % (see D6 below)     | 28 % / 14 % / 45 % |

## Differences that remain, all intentional

- **WCAG AA contrast** (a11y-overrides.css): primary button/filter fill darkened 15 %, links in the light theme.
- **Content**: 31 skills instead of 29 (two from the owner's CV), 13 specialties instead of 10, enabled CV button.
- **Contact**: honest `mailto:` banner (longer text pushes the form down) instead of the fake "demo" banner.
- **Phone (≤ 760 px)**: surfaces are solid instead of blurred glass (owner decision D6). The test injects the same rule into the prototype so everything else is compared tightly.
- Menu bar right side: Portfolio View link and tour button exist in both; the clock differs by time.

## Defects this comparison found (all fixed)

1. **Heading weight**: Tailwind's reset made every heading regular weight; the prototype's headings are bold (browser default).
2. **Bullets**: `ul` showed no discs (preflight); the prototype has discs (project features/challenges, experience bullets).
3. **Inline icons** became `display:block`, so `text-align:center` stopped centring them (Tech Stack empty state).
4. **Terminal window title** had lost its ` — visitor@hurtarte — zsh` suffix.
5. **Link rows** were 1–2 px taller after the Phase 6 target-size change.
6. **Project detail**: card heading margin is 8 px there (prototype `.pd h4`), not 10 px. 7. **Settings popover** lacked the prototype's "Portfolio View" button (size mismatch 288 px vs 337 px, found when the test started asserting equal sizes).
7. **Terminal window title**: its accessible name did not contain the visible text (axe `label-content-name-mismatch`).
   Earlier phases had also been checked "by eye" only; the unstyled tour card (Phase 5) would have been caught here.

## How the comparison is kept honest

- Both images must have **the same size**; a mismatch fails (an earlier version silently cropped to the smaller one and reported meaningless phone numbers).
- The prototype must really have loaded the Geist web font (`document.fonts.check` is true when no font is declared, so the loaded `FontFace` is checked); otherwise the test skips instead of comparing fallback fonts.
- The phone/tablet contexts are not "mobile": the prototype has no `<meta viewport>` and a mobile browser would lay it out at 980 px.
- Mutation check performed: removing the heading-weight rule makes the Education/Contact/About/Certifications comparisons fail.

## Not covered

Real browsers other than Chromium, other viewports of every window, and animations (reduced motion is forced).
