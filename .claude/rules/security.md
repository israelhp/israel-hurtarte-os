# Security

- No secrets in the repo; document variables in `.env.example`. External links use `rel="noopener noreferrer"`.
- No `dangerouslySetInnerHTML` with non-static content. Contact is `mailto:`; collect no visitor data.
- Fonts self-hosted via next/font; CSP and security headers defined in `vercel.json`; keep third-party origins at zero unless justified.
- `npm run audit:prod` must pass at high severity before release. Dev-only advisories are tracked in docs/engineering/decisions.md.
