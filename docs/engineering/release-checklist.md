# Release checklist (Phase 9 input)

Nothing is deployed without the owner's explicit approval in the current conversation; production deploys especially.

## Before a release candidate

1. `git status` clean, on a branch, CI green: typecheck, lint, format, unit tests, hook tests, `audit:prod`, PDF policy check, build, bundle budget, e2e.
2. All gates in `docs/engineering/quality-gates.md` PASS, or each exception explicitly accepted by the owner.
3. `NEXT_PUBLIC_SITE_URL` set in Vercel (Production and Preview) once the domain exists: this switches on canonical, hreflang, the sitemap and the JSON-LD `url`.
4. Content review with the owner using `docs/content/CONTENT-STATUS.md` (demo projects and placeholder certifications are still labelled).
5. Open the published CV PDF and read it.

## Vercel (free plan)

- Framework preset Next.js with `output: "export"` (static); the only environment variable is `NEXT_PUBLIC_SITE_URL`.
- Preview deployments for every PR; production only from `main` after approval.
- After the first deployment: `curl -I https://<domain>/es` (headers), Lighthouse on the real URL, Search Console sitemap, Rich Results Test, and field data later (CrUX).

## Rollback

Vercel keeps every deployment: promote the previous production deployment (Dashboard → Deployments → ⋯ → Promote to Production, or `vercel promote <url>`). In git, revert the merge commit on `main`; never force-push.

## Known limits to tell the owner

Real devices, screen readers and field performance are NOT_VERIFIED. The guided tour's dim layer blocks the mouse outside the highlight by design.
