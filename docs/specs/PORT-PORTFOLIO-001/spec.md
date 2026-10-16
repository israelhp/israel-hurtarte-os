# PORT-PORTFOLIO-001 — Portfolio View

Status: In Review (Phase 5) · Branch: `feature/phase-5-advanced`

## Behaviour

- Own static routes `/es/portfolio` and `/en/portfolio` (indexable, per-language title/description): sticky nav with section anchors, language and theme controls and a "Desktop mode" link; hero; 7 numbered sections (About, Tech Stack, Projects, Experience, Education, Certifications, Contact) from the same `src/content` data; footer.
- "View details" on a project and "Contact"/"Terminal" in the contact section open that window on the desktop and navigate there (the desktop does not add a Welcome window when something is already open).
- Desktop menu bar button and desktop shortcut lead here.

## Files

src/features/portfolio/PortfolioView.tsx, src/app/[lang]/portfolio/page.tsx, src/shared/theme/portfolio.css
