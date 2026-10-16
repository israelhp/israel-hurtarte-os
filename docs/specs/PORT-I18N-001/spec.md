# PORT-I18N-001 — Language routes and bilingual SEO basics

Status: In Review (Phase 5) · Branch: `feature/phase-5-advanced`

## Behaviour

- Pages live under `/es/*` and `/en/*` (`app/[lang]/layout.tsx` is the root layout, `generateStaticParams`, `dynamicParams = false`). `html[lang]`, title, description and Open Graph locale are rendered per language at build time.
- The language is a React context fed by the URL (`LangProvider`), not client state, so server HTML is already in the right language. The ES/EN control navigates to the same page under the other prefix (`router.replace`); windows, terminal history and settings survive; focus returns to the language control.
- `/` is a tiny client redirect page (static export has no HTTP redirects): stored language (`ihos:lang`) or Spanish. `/design-system` stays outside the language tree (noindex). `global-not-found.tsx` serves `404.html`.
- Canonical + hreflang (`es`, `en`, `x-default`→`es`) are emitted only when `NEXT_PUBLIC_SITE_URL` is set (no invented domain).

## Files

src/app/[lang]/layout.tsx, src/app/(root)/page.tsx, src/app/global-not-found.tsx, src/features/settings/{LangProvider,useSwitchLang,lang-path}.ts*, src/lib/seo.ts, src/i18n/*
