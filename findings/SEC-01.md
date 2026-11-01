# SEC-01 — Browser hardening headers not observed (consistent across responses)

| Field | Value |
|---|---|
| Category | Security (hardening) |
| Severity | Low — best-practice gap on a mostly static marketing site; no exploit demonstrated |
| Evidence | HSTS `strict-transport-security: max-age=63072000` is present on every HTTPS response. In **all** captured HTTPS responses (`https_apex.headers`, `www_head_compressed.headers`, `notfound.headers`, `sitemap.headers`, asset headers) these are absent: `x-content-type-options`, `x-frame-options` / CSP `frame-ancestors`, `referrer-policy`, `permissions-policy`, `content-security-policy`. |
| Impact | No `nosniff` (MIME sniffing), no framing protection (clickjacking possible in principle), no CSP (no script-injection backstop). HSTS has no `includeSubDomains`/`preload`. |
| Recommendation | Add the headers in `next.config.js`. Start CSP as Report-Only: the page uses Google Tag Manager/GA (`G-LK6CQWCWX0`) and a Google Fonts stylesheet. |
| Effort | S (headers) / M (CSP tuning) |

```js
// next.config.js
const headers = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value:
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; connect-src 'self' https://*.google-analytics.com; frame-ancestors 'self'" },
];
module.exports = { async headers() { return [{ source: "/(.*)", headers }]; } };
```
