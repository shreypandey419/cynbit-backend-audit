# Backend Technical Audit — cynbit.in

Role: Backend Developer Intern · Date: 1 Nov 2026 · Scope: passive, publicly observable behaviour only.

> Items marked **PENDING** need browser results (contact form, cookies, Lighthouse, SSL Labs) or one extra GET. Everything else is backed by files in `evidence/`.

## 1. Executive summary
cynbit.in is a statically prerendered Next.js site on Vercel, served from the CDN cache over TLS 1.3 with HSTS, Brotli-compressed HTML (15.4 KB on the wire) and immutable Brotli-compressed assets, and a correct branded 404. No directly exploitable issue was observed (0 High, 0 Medium). Four Low findings: a two-hop redirect with conflicting canonical host signals (NET-01), missing browser hardening headers (SEC-01), a sitemap computed on demand in a distant region with a 3.0 s TTFB sample (PERF-02), and email authentication that is monitoring-only (DMARC `p=none` without reporting) with DKIM not observed at the standard selectors (EMAIL-01). The contact-form API could not be assessed from the homepage and is **PENDING**.

## 2. Scope, methodology, ethics
- Passive only: ordinary GET/HEAD requests, offline analysis of saved responses, public DNS lookups, one TLS handshake.
- Not done: scanning, fuzzing, path guessing, brute force, form submission, load testing, exploitation. `/api/`, `/admin/`, `/portal/` were **not** requested.
- Tools: curl, dig, openssl, offline grep/parse. Browser DevTools, Lighthouse, SSL Labs: **PENDING**.
- Requests: a first manual capture (2026-10-31 ~18:27 UTC) and a scripted run (`scripts/collect-evidence.sh`, 2026-11-01 08:06–08:07 UTC): 15 HTTP requests, GET/HEAD only, ≥2 s apart, plus one manual GET (#16, 08:12 UTC) to confirm compression; User-Agent `CynbitAssessment-PassiveAudit/1.0 (internship assessment)`. Log: `docs/request-log.md`.

## 3. Observed architecture
Vercel (edge `bom1`), Next.js App Router with prerendered pages, a dynamic sitemap route computed in `iad1`, GA via GTM, Google Fonts, DNS at GoDaddy, mail at Microsoft 365. Details and confidence levels: `findings/ARCH-01.md`, `docs/architecture.md`.

## 4. API and payload observations
The homepage HTML contains no `<form>`, no `/api/` URL and no `fetch(` calls: limited backend surface on that page. `/contact` exists in the sitemap but was not captured. **PENDING:** request URL/method/status, payload shape, validation and error format.

## 5. Findings summary
| ID | Category | Severity | Title |
|---|---|---|---|
| NET-01 | Architecture / Crawlability | Low | 308→307 redirect chain; apex/www canonical conflict |
| SEC-01 | Security | Low | Hardening headers not observed |
| PERF-02 | Performance | Low | Sitemap computed in iad1, 3.0 s TTFB, MISS |
| EMAIL-01 | Email security | Low | DMARC p=none without rua; DKIM not observed |
| INFO-01 | Info exposure | Info | robots.txt names /api/, /admin/, /portal/ |
| INFO-02 | Security config | Info | `ACAO: *` on HTML/static |
| INFO-03 | TLS / DNS | Info | No CAA record |
| PERF-01 | Performance | Info | Strong static caching; HTML and assets Brotli-compressed |
| SEO-01 | Crawlability | Info | Sitemap `lastmod` partly generation time |
| ERR-01 | Error handling | Info | 404 handled correctly |
| ARCH-01 | Architecture | Info | Inferred architecture |

## 6. Security findings
- **TLS:** TLS 1.3, `TLS_AES_128_GCM_SHA256`, Let's Encrypt (YR2), certificate for `www.cynbit.in`, valid 25 Sep – 24 Dec 2026, verification OK (`evidence/tls.txt`). SSL Labs grade: **PENDING**.
- **HSTS** on all HTTPS responses (`max-age=63072000`, no `includeSubDomains`/`preload`). HTTP→HTTPS is a permanent 308.
- **Headers:** SEC-01. **CORS:** INFO-02. **robots.txt:** INFO-01. **CAA:** INFO-03.
- **Email authentication:** SPF `v=spf1 include:secureserver.net -all` matches GoDaddy's documented value for Microsoft 365 from GoDaddy; DMARC `v=DMARC1; p=none;`; DKIM selectors not found (EMAIL-01).
- **Cookies:** the homepage response sets none; browser cookie flags **PENDING**.

## 7. Performance findings
- Prerendered HTML served from the edge (`HIT`, `age` ≈ 2.8 days) and compressed with Brotli: 15,402 bytes transferred vs 100,498 raw. All 8 sampled assets: `max-age=31536000, immutable`, `br`, `HIT` (PERF-01).
- TTFB single samples (include DNS/TCP/TLS setup, my network): 0.13–0.39 s for static paths, **3.01 s** for `/sitemap.xml` (PERF-02).
- Lighthouse: **PENDING**.

## 8. Validation, authentication, error handling
- Error handling: correct 404 with branded, cached page; no information leakage (ERR-01).
- Authentication: none observable on public pages; routes named in robots.txt should enforce server-side auth (INFO-01).
- Input validation: **PENDING** (contact form).

## 9. Recommended improvements
| When | Action | Finding |
|---|---|---|
| This week | Permanent apex→www (or reverse), canonical tag, same host in sitemap/robots/og:url | NET-01 |
| This week | `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` | SEC-01 |
| This week | Static/ISR sitemap with real `lastmod`; function region near users | PERF-02, SEO-01 |
| 30 days | CSP Report-Only → enforce; review GTM and font loading | SEC-01 |
| 30 days | Enable DKIM, add DMARC `rua`, then tighten policy | EMAIL-01 |
| 30 days | Confirm auth on `/api/`, `/admin/`, `/portal/`; restrict API CORS | INFO-01/02 |
| Later | CAA record | INFO-03 |

Snippets: `findings/*.md`, `docs/improvements.md`.

## 10. Reference implementation (my own code, not Cynbit's)
`src/` and `test/`: an Express service demonstrating security headers, CORS allow-list, Zod validation, rate limiting with `Retry-After`, honeypot, safe request IDs, consistent errors without stack traces, health/ready. `npm install && npm test` → 11 tests, 11 passing.

## 11. Limitations
Public observation only; no source or backend access. Two captures from one network. TTFB values are single samples that include connection setup. Architecture statements carry confidence levels in ARCH-01. PENDING items are not claimed as findings.

## 12. Appendix
`evidence/README.md` · `docs/request-log.md` · `docs/observations.md` · `docs/passive-checklist.md`.
