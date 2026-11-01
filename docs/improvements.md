# Recommended Improvements

> Two kinds of content below. Do not mix them in the report:
> - **For Cynbit (observed site):** config-level suggestions based on findings. Cynbit appears (inferred) to run Next.js on Vercel.
> - **Reference implementation (my own code, not Cynbit's):** `src/` + `test/` demonstrate the same practices in Express and prove them with tests.

## 1. Finding → Fix → Proof

| Finding | Recommendation for Cynbit | Reference implementation | Test |
|---|---|---|---|
| SEC-01 Missing hardening headers | Add headers in `next.config.js` (section 2) | `src/middleware/security.js` | `security headers present, x-powered-by absent` |
| PERF-01 Cache headers / TTFB | Keep fingerprinted assets immutable; consider ISR/static generation for HTML so the CDN can serve it with `s-maxage` + `stale-while-revalidate` | `Cache-Control: no-store` on API responses in `src/app.js` | `health, ready and API no-store` |
| ERR-01 404 behaviour (already good on Cynbit) | None needed; the reference implementation shows the same principle for an API | `src/middleware/errorHandler.js` | `unknown route -> clean JSON 404`, `malformed JSON -> 400, no stack trace leaked` |
| EMAIL-01 DMARC monitoring-only, DKIM not observed | Enable DKIM, add DMARC `rua`, tighten gradually (section 3) | n/a (DNS, not code) | n/a |
| Contact-form hardening (if/when a backend endpoint exists) | Server-side validation, rate limit, honeypot, size limit, CORS allowlist | `src/routes/contact.js`, `src/middleware/*` | validation matrix, 413, 429+Retry-After, honeypot, CORS, request-id tests |

## 2. Next.js security headers (for Cynbit)

```js
// next.config.js
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS is already served by Vercel (max-age=63072000 observed); add includeSubDomains/preload only after confirming all subdomains are HTTPS.
];

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```
A Content-Security-Policy should be introduced in `Content-Security-Policy-Report-Only` mode first, because Next.js inline scripts and third-party tags can break under a strict policy.

## 3. Email authentication (for Cynbit) — verify before changing

Observed (`evidence/dns.txt`): MX `cynbit-in.mail.protection.outlook.com`, SPF `v=spf1 include:secureserver.net -all` (this matches GoDaddy's documented value for Microsoft 365 from GoDaddy — **keep it**), DMARC `v=DMARC1; p=none;` (no `rua`), no CNAME at `selector1/selector2._domainkey`.

```
; DMARC with reporting (confirm the mailbox exists first)
_dmarc.cynbit.in.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@cynbit.in; fo=1"
; Microsoft 365 DKIM: enable for the custom domain in the admin center, then publish the two CNAMEs it shows
```
Roll out DMARC as `p=none` with reports → `quarantine` → `reject` after reviewing the reports. Confirm every sending system (Microsoft 365, any marketing tool) is covered by SPF/DKIM before tightening.

## 4. Reference implementation: run

```bash
npm install
npm test        # 11 tests
npm run dev
```
