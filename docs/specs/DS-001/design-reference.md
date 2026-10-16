# Design reference — DS-001

Source: `design/source/claude-design/…html` → extracted `template.html` (use `/analyze-design`). Line numbers refer to that file.

| Output                                              | Prototype lines                                                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `tokens.css` (themes, accents, root vars)           | 119–149                                                                                                                        |
| `base.css` (body, reset, keyframes, reduced motion) | 112–117, 242–248, 508                                                                                                          |
| `components.css`                                    | 166–170, 173, 180–183, 190–191, 196–201, 210–219, 250–263, 273, 282–310, 311–317, 324–326, 360, 362, 399–402, 427–433, 481–482 |
| Icons                                               | inline SVGs in markup 520–1060                                                                                                 |
| Fonts                                               | 11–109 (`@font-face`, Geist/Geist Mono from Google Fonts)                                                                      |

## Deviations (all in `src/shared/theme/a11y-overrides.css`; `tokens.css` is untouched)

1. **Button/filter fill contrast.** White on the prototype's blue/purple/pink/red = 3.4–4.1:1 (needs 4.5:1). Fill darkened 15% (`--acc-fill`); orange, green and graphite keep their fill and use black text (`--acc-on`).
2. **Link colour.** Raw accent as link colour fails on light surfaces (yellow ≈ 1.5:1). Links reuse the prototype's own `--ink-p/--ink-b` mix, a no-op in dark mode.
3. **Section heading level** is configurable (`SectionCard headingLevel`); prototype always used `h4`, which skips levels.
4. **Fonts** self-hosted through `next/font` instead of Google Fonts links (CSP: zero third-party origins).
5. Hex colours, `.5`→`0.5` and similar are reformatted by Prettier; the fidelity test normalises these.

## Known prototype-faithful behaviour kept

Hover on primary buttons uses `filter: brightness(1.08)` (slightly lowers contrast while hovered; not measurable by axe's static check).
