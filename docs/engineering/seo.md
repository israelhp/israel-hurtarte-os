# SEO (SEO_GATE, Phase 8)

| Item                                                | State                                                                                                                                                                                                                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Titles / descriptions                               | per language and page, set at build time (`generateMetadata`); 4 distinct titles                                                                                                                                                                               |
| `html[lang]`, one `h1`, semantic landmarks          | verified by e2e                                                                                                                                                                                                                                                |
| Open Graph                                          | title, description, locale per language; **no image yet** (none exists; the owner has not provided one)                                                                                                                                                        |
| Canonical + hreflang (`es`, `en`, `x-default`→`es`) | implemented; emitted only when `NEXT_PUBLIC_SITE_URL` is set. Verified once with an example domain (canonical, 3 alternates, sitemap alternates)                                                                                                               |
| `sitemap.xml` / `robots.txt`                        | generated at build time. Without a domain the sitemap is empty (valid) and robots has no `Sitemap:` line; with a domain they list 4 URLs with hreflang alternates including `x-default`                                                                        |
| Indexing                                            | `/es`, `/en`, `/es/portfolio`, `/en/portfolio` indexable; `/` (client redirect doorway) and `/design-system` are `noindex`                                                                                                                                     |
| Structured data                                     | schema.org `Person` JSON-LD on all four pages: name, job title, bio, country (GT), current employer, schools, skills, GitHub/LinkedIn. **No phone, e-mail or CV link**; no invented URLs. Not yet checked with Google's Rich Results Test (needs a public URL) |
| Icons / theme color                                 | `icon.svg` (derived from the prototype logo), `theme-color` for light/dark                                                                                                                                                                                     |
| Lighthouse SEO                                      | 100 on both pages (mobile and desktop)                                                                                                                                                                                                                         |

## To do when the domain exists

1. Set `NEXT_PUBLIC_SITE_URL` in Vercel (Production and Preview) → canonical, hreflang, sitemap and JSON-LD `url` switch on.
2. Submit the sitemap in Search Console; run the Rich Results Test on `/es` and `/en`.
3. Optional: an Open Graph image (1200×630) — needs a design decision.
4. Decide whether `/` should be indexable with `x-default` (currently a `noindex` doorway).
