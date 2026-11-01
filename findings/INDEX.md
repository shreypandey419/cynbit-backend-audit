# Findings index (evidence captured 2026-10-31 18:27 UTC and 2026-11-01 08:06–08:07 UTC)

| ID | Category | Severity | Title |
|---|---|---|---|
| NET-01 | Architecture / Crawlability | Low | Two-hop redirect (308 then 307); apex vs www canonical conflict |
| SEC-01 | Security | Low | Hardening headers not observed (all responses) |
| PERF-02 | Performance | Low | Sitemap cache MISS and 3.0 s TTFB; region interpretation unverified |
| EMAIL-01 | Email security | Low | DMARC p=none without rua; DKIM not observed at standard selectors |
| INFO-01 | Info exposure | Info | robots.txt names /api/, /admin/, /portal/ |
| INFO-02 | Security config | Info | `ACAO: *` on HTML and static responses |
| INFO-03 | TLS / DNS | Info | No CAA record |
| PERF-01 | Performance | Info | Strong static caching; HTML and assets Brotli-compressed |
| SEO-01 | Crawlability | Info | Sitemap `lastmod` partly = generation time |
| ERR-01 | Error handling | Info | 404 handled correctly (positive) |
| ARCH-01 | Architecture | Info | Observed / inferred architecture |

Totals: High 0 · Medium 0 · Low 4 · Info 7. No directly exploitable issue observed.

## What is done well
- HTTPS everywhere with HSTS (2 years); HTTP→HTTPS is a permanent redirect (308).
- TLS 1.3, valid Let's Encrypt certificate (CN=www.cynbit.in, to 24 Dec 2026).
- Prerendered pages served from the CDN (`x-vercel-cache: HIT`) and Brotli-compressed (15.4 KB on the wire vs 100 KB raw); hashed assets `max-age=31536000, immutable` with Brotli.
- Correct 404 status with a branded, cached page; no server details leaked.
- SPF uses a hard fail (`-all`) consistent with the provider's documented value; a DMARC policy is published.
- No cookies set by the homepage response.
