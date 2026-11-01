# ARCH-01 — Observed / inferred architecture

| Claim | Evidence | Confidence |
|---|---|---|
| Hosted on Vercel | `server: Vercel`, `x-vercel-id: bom1::…`; `www` resolves to `e12d688042344235.vercel-dns-017.com`, `64.29.17.1`, `216.198.79.1`; apex A `216.198.79.1` (`dns.txt`) | High |
| Next.js App Router, prerendered | `x-nextjs-prerender: 1`, `vary: rsc, next-router-state-tree…`, chunk `app/(marketing)/page-*.js` | High |
| Sitemap response includes `iad1` in `x-vercel-id`; execution-region interpretation unverified | `x-vercel-id: bom1::iad1::…`, `x-vercel-cache: MISS`; may indicate a function-region location, but this is not independently verified | Low |
| TLS 1.3, Let's Encrypt YR2, cert CN=`www.cynbit.in` | `tls.txt` (only the `www` handshake was done; apex certificate not examined) | High |
| DNS at GoDaddy, mail at Microsoft 365 | NS `domaincontrol.com`, MX `*.mail.protection.outlook.com`, `onmicrosoft.com` TXT | High |
| No IPv6 | `AAAA` empty for the apex | High |
| GA via GTM (`G-LK6CQWCWX0`), Google Fonts stylesheet | homepage HTML | High |
| Homepage has no form and no client API call | grep of saved HTML | High (homepage only) |
| `/contact` page captured; form backend unknown | `evidence/contact.html` and its JavaScript chunk are saved; no backend request was captured or tested | Unknown |
| Routes `/api/`, `/admin/`, `/portal/` exist or are planned | robots.txt; **not requested** | Low |

Limited backend surface was observed: the public site is largely static. The `/contact` page was captured, but its backend behavior was not captured or tested; no form submission was made.
