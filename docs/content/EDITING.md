# Editing the portfolio content

All editable content lives in `src/content/` (TypeScript, validated by `types.ts`). No database or CMS. After any change run `npm run check` and `npm run test:e2e` (build first), then ask for a review if you want.

## Rules the tests enforce

- Every localized value needs `es` **and** `en`.
- Every URL must be `http(s)://` or `mailto:`; empty string = "not configured" (the UI shows "No configurado" or hides the button).
- Never put phone numbers or references' contact data in content. The privacy tests are a **safety net, not proof**:
  they fail on anything shaped like a phone number (7+ digits, with or without spaces, dots, dashes, parentheses or `+`),
  on `tel:`/WhatsApp links, and on the headings "Referencias personales/laborales" / "personal/work references". They
  cannot recognise a person's **name**, so never add references at all.
- Write year ranges with an **en dash** or words (`2018 – 2024`, `March 2021 – March 2024`). A plain hyphen (`2018-2024`)
  looks like a phone number to the guard and the test will fail with a message saying so.
- `status`: `verified` (real), `demo` (fictional, shown with a DEMO label, no URLs), `placeholder` (empty slot, PLACEHOLDER label).

## Replace a demo project with a real one — `projects.ts`

1. Edit or delete an entry; set `status: "verified"` and fill `demoUrl` / `repoUrl` (or leave them empty).
2. `stack` entries must match a skill `name` in `skills.ts` (a test checks).
3. `tags` choose the folders it appears in (`featured`, `personal`, `professional`, `web`, `mobile`, `backend`, `databases`, `devops`); `primary` is the category label; `cover` (1–5) picks one of the generated cover gradients.
4. A project without a public site leaves `demoUrl: ""`. To show a screen recording in its detail view add
   `video: { src: "/videos/<name>.mp4" }` and put the file in `public/videos/<name>.mp4` (served as `/videos/<name>.mp4`).
   Use H.264 MP4 (`ffmpeg -i in.mov -c:v libx264 -crf 28 -preset slow -vf scale=-2:720 -an -movflags +faststart out.mp4`),
   ideally under ~25 MB. It never autoplays and only its metadata is fetched until play; if the file is missing the
   section is hidden. Quetxal TV expects `public/videos/quetxal-tv.mp4`.
5. Real screenshots are not supported yet (covers are generated); say so when you have images.
   The DEMO banners disappear by themselves when no demo project is left.

## Certifications — `certifications.ts`

Real entries use `status: "verified"`, `name`, `org`, `cat` and, ideally, a public `link` to the credential. `date` is optional: **leave it out unless the source shows one** (never invent it); the date row is hidden when absent. A "verified" entry containing the template text fails the tests. Filter buttons are generated from the categories in use, so an empty category never shows up. Currently 14 courses are `dev` and Docker is `cloud` (the closest of the four prototype categories); a finer split (Web, Backend, Mobile, DevOps) only needs new entries in `certCategories` and the `CertCategory` type.

## CV download — `profile.cvUrl`

Currently `/cv/Israel-Hurtarte-CV.pdf`: the owner's CV **without the references section** (their own phone number stays,
by the owner's decision). To replace it: put the new PDF in `public/cv/`, set `cvUrl`, and **open it and read it page by
page first** — everything under `public/` is published and no test looks inside a PDF.
`python3 tools/check-public-pdf.py public/cv/<file>.pdf` (needs `pip install pymupdf`) reports how many phone-shaped
numbers, e-mails and links it contains without printing them. A test fails if the file does not exist.
Empty string = a disabled "Download CV · Not configured" button.

## Other links — `social-links.ts`

Fill `value` (text shown) and `href` for `website`. LinkedIn/GitHub/email are already set.

## Texts

UI strings: `src/i18n/es.ts` and `en.ts` (keys must match). Guided-tour copy: `src/i18n/tour.ts`. Bio, tagline and role: `profile.ts`.

## Experience, education, skills

`experience.ts`, `education.ts`, `skills.ts`. Career facts (roles/dates) are pinned by `content.test.ts` on purpose, so an accidental edit cannot change your history. If a role or date really changes, update the matching lines in that test (or ask me to) in the same commit.
