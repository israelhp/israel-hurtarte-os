# CV vs. site content — reconciliation (Phase 7)

Source: `CV Israel Hurtarte.pdf` supplied by the owner on 2026-10-16 (2 pages).
Legend: ✔ confirmed by the CV · ◐ on the site from the owner's earlier input (master prompt / approved design) but **not in the CV** — nothing was removed, please confirm · ✱ taken from the CV and added in Phase 7 · ✖ in the CV, deliberately **not** published.

## Identity and contact

| Item     | Site                                            | CV                                                                      | Status                                                                   |
| -------- | ----------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Name     | Israel Hurtarte                                 | Israel Hurtarte Pinto                                                   | ✔ (the owner asked for "Israel Hurtarte" on the site)                    |
| Headline | Full Stack Developer / Desarrollador Full Stack | Desarrollador de Software                                               | ◐ owner brief                                                            |
| Email    | israelhurtarte@gmail.com                        | same                                                                    | ✔                                                                        |
| GitHub   | github.com/israelhp                             | same                                                                    | ✔                                                                        |
| LinkedIn | in/israel-hurtarte…                             | not listed                                                              | ◐                                                                        |
| Phone    | —                                               | present                                                                 | ✖ not published (decision D11)                                           |
| Location | Guatemala                                       | —                                                                       | ◐ owner brief                                                            |
| Summary  | passion-based bio from the design               | "4 años de experiencia … banca empresarial y tarjetas de crédito … ACH" | ◐ different text; site makes no years-of-experience claim (decision D14) |

## Experience

| Item                                                                                                                                                                                                                                   | Status                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Banco G&T Continental — Junior Development Engineer, Mar 2021 – Mar 2024                                                                                                                                                               | ✔ role, company, dates                                    |
| Banco G&T Continental — Mid-Level Development Engineer, Mar 2024 – present                                                                                                                                                             | ✔ role, company, dates                                    |
| Junior responsibilities: ACH features, e-banking support, ACH technical support/maintenance, solutions meeting financial-sector standards                                                                                              | ✔                                                         |
| Junior achievements: QR payments integrated into ACH; fixes that made ACH more reliable                                                                                                                                                | ✔                                                         |
| Junior extras on the site: SQL queries for data extraction, operational reports, incident diagnosis, "reports that make operational data easier to query"                                                                              | ◐                                                         |
| Mid-level responsibilities: real-time ACH, maintenance/improvements of ACH, scheduled payments and online banking, specialized ACH support                                                                                             | ✔                                                         |
| Mid-level achievement: ICG certification of the real-time ACH project                                                                                                                                                                  | ✔                                                         |
| Mid-level extras on the site: reports/dashboards and data analysis, SQL optimization, REST API services/integrations, "contributed to stability of financial platforms"                                                                | ◐                                                         |
| Technology groups of both roles: C++, C#, .NET, Node.js, SQL Server, Git are in the CV; **Angular, Ionic, Apache Cordova, ASP.NET, Express.js, Postman, T-SQL, ETL, KPI monitoring and the whole "Data Analytics & BI" group are not** | ◐                                                         |
| VisionBitt — independent Full Stack developer, Jan 2025 – present (whole entry, all bullets and tech)                                                                                                                                  | ◐ not in the CV; stated by the owner in the master prompt |

## Education — all ✔

Master's in Information Security (UMG, Jan 2025 – present) · Systems Engineering (UMG, Jan 2018 – Jan 2024, "cierre de pensum" → "Coursework completed") · High-school diploma, Sciences and Letters, Computing track (Colegio Verbo No. 4, Jan 2015 – Jan 2018).

## Skills

| CV skill                                                                                                                                                                                                                      | Site                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| HTML, CSS, JavaScript, Node.js, React, Git, C++, MongoDB, SQL Server, SQL                                                                                                                                                     | ✔ already in the list                                                                                       |
| Java – Spring Boot, C# – .NET Core                                                                                                                                                                                            | ✱ added to Tech Stack (Backend): "Java / Spring Boot", "C# / .NET Core"                                     |
| Programación orientada a objetos, Domain-Driven Design, Principios ágiles                                                                                                                                                     | ✱ added to Specialties                                                                                      |
| Technologies on the site that the CV does not list (Next.js, TypeScript, Express, NestJS, Tailwind, Redux, Vite, PostgreSQL, Redis, Supabase, Prisma, Docker, GitHub Actions, REST, React Native, Expo, Linux, Vercel, CI/CD) | ◐ owner's list in the master prompt                                                                         |
| Soft skills (rápido aprendizaje, trabajo en equipo, adaptabilidad, resolución de problemas, escucha activa, aprendizaje continuo)                                                                                             | not shown — the design has no slot for them (decision D15)                                                  |
| Languages: "Español" only                                                                                                                                                                                                     | no language-proficiency claims anywhere; the English version of the site is a UI translation (decision D16) |

## References (personal and work)

✖ Names and phone numbers of four people who did not consent to being published. **Never published.** Tests act as a safety net: they fail if phone-shaped digit runs, `tel:`/WhatsApp links or "references" headings appear in the content or in any rendered page. They cannot detect a person's name, so the real protection is that none of it was ever copied in.

## What Phase 7 changed in the product

- Skills: 29 → 31 (two CV technologies). Specialties: 10 → 13 and now **localized** (they were English-only in the Spanish view, a mixed-language screen).
- "Website" link label is translated ("Sitio web").
- Demo/placeholder notices (DEMO DATA banner, "demo projects" wording, certification note, DEMO tag in Portfolio View) now appear **only while** demo/placeholder items exist, so replacing them with real content leaves no stale labels.
- e2e tests derive counts and names from `src/content`; replacing projects/certifications does not require editing tests (verified by swapping in different content, running the suites and restoring).
