# PORT-ABOUT-001 — About Me

Status: In Review (Phase 4) · Branch: `feature/phase-4-apps`

## Files

src/features/apps/about/AboutApp.tsx + LinkList.tsx

## Behaviour

Avatar, name, role, location, bio, 10 specialties, links list, CV button. CV is disabled with an honest label while `cvUrl` is empty. Links pass through `safeHref`; `mailto:` has no `target=_blank`.

## Content status

profile + social-links (verified); CV/website not configured
