# Performance

- Static export. No new dependency without justification (size, maintenance). Animations in CSS, not a JS animation library.
- Window drag: transform + requestAnimationFrame, commit on release; one window moving must not re-render others (use Zustand selectors).
- Limit stacked `backdrop-filter`; solid background at <=760px. Lazy-load app window contents.
- Measure LCP/INP/CLS with Lighthouse and record real numbers; never estimate.
