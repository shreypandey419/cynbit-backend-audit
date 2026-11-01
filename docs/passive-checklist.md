# Passive Observation Checklist (browser only)

Rules: normal browsing only. No scanners, no fuzzing, no brute force, no repeated form spam, no exploitation.

- [ ] Network tab → Fetch/XHR: list API calls (URL, method, status, payload shape)
- [ ] Main document response headers: HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- [ ] `Server` / `X-Powered-By` headers present?
- [ ] Cookies: Secure / HttpOnly / SameSite
- [ ] HTTP → HTTPS redirect
- [ ] CORS headers on API responses (`Access-Control-Allow-Origin`)
- [ ] Open one non-existent URL: custom 404? any stack trace / server info?
- [ ] Contact form: client-side validation, error/success messages (submit once or twice at most)
- [ ] `robots.txt`, `sitemap.xml`
- [ ] Source maps (`.map`) loaded in production?
- [ ] Lighthouse (Performance, Best Practices, SEO) screenshot
- [ ] TTFB, compression (gzip/br), cache headers on static assets, image sizes
- [ ] Third-party scripts count and weight
- [ ] SSL Labs public report grade
