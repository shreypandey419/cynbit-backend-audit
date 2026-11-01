# ARCH-01 — Observed / inferred architecture

| Claim | Evidence | Confidence |
|---|---|---|
| Hosted on Vercel | `server: Vercel`, `x-vercel-id: bom1::…`; `www` resolves to `e12d688042344235.vercel-dns-017.com`, `64.29.17.1`, `216.198.79.1`; apex A `216.198.79.1` (`dns.txt`) | High |
| Next.js App Router, prerendered | `x-nextjs-prerender: 1`, `vary: rsc, next-router-state-tree…`, chunk `app/(marketing)/page-*.js` | High |
| Dynamic route handler for sitemap runs in `iad1` | `x-vercel-id: bom1::iad1::…`, `x-vercel-cache: MISS` | Medium |
| TLS 1.3, Let's Encrypt YR2, cert CN=`www.cynbit.in` | `tls.txt` (only the `www` handshake was done; apex certificate not examined) | High |
| DNS at GoDaddy, mail at Microsoft 365 | NS `domaincontrol.com`, MX `*.mail.protection.outlook.com`, `onmicrosoft.com` TXT | High |
| No IPv6 | `AAAA` empty for the apex | High |
| GA via GTM (`G-LK6CQWCWX0`), Google Fonts stylesheet | homepage HTML | High |
| Homepage has no form and no client API call | grep of saved HTML | High (homepage only) |
| `/contact` page exists, form backend unknown | sitemap lists it; **not captured** | Unknown |
| Routes `/api/`, `/admin/`, `/portal/` exist or are planned | robots.txt; **not requested** | Low |

Limited backend surface was observed: the public site is largely static. Contact-form API behaviour is **pending** browser observation.
