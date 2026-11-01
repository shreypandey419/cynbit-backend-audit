# Observations — cynbit.in (passive)

Two captures: manual curl on 2026-10-31 ~18:27 UTC, and `scripts/collect-evidence.sh` on 2026-11-01 08:06–08:07 UTC (15 HTTP requests, GET/HEAD, log in docs/request-log.md; DNS and one TLS handshake in addition).

## Redirects
| Request | Result | File |
|---|---|---|
| `GET http://cynbit.in/` | 308 → `https://cynbit.in/` (HTTP/1.0) | http_apex.headers |
| `GET https://cynbit.in/` | 307 → `https://www.cynbit.in/` | https_apex.headers |

## Response headers (https://www.cynbit.in/, HEAD with `Accept-Encoding: gzip, br`) — www_head_compressed.headers
HTTP/2 200 (HEAD does not show compression; see GET below) · `server: Vercel` · `strict-transport-security: max-age=63072000` · `cache-control: public, max-age=0, must-revalidate` · `etag: "babdce97…"` · `age: 240885` · `x-vercel-cache: HIT` · `x-nextjs-prerender: 1` · `access-control-allow-origin: *` · `content-length: 100498` · no `content-encoding` · no `x-content-type-options`, `x-frame-options`, `referrer-policy`, `content-security-policy`, `permissions-policy`.

## Compression (manual GET #16, 2026-11-01 08:12:16 GMT, `Accept-Encoding: gzip, br`)
HTTP/2 200 · `content-encoding: br` · `x-vercel-cache: HIT` · `age: 241204` · `size_download=15402` bytes (raw HTML 100,498 bytes) · weak ETag `W/"babdce97…"`.

## Other responses
| Path | Status | Notes | File |
|---|---|---|---|
| `/sitemap.xml` | 200 | `x-vercel-cache: MISS`, `age: 0`, `x-vercel-id: bom1::iad1::…`, TTFB 3.01 s | sitemap.headers |
| `/this-page-should-not-exist-404-check` | 404 | `x-matched-path: /404`, `x-vercel-cache: HIT`, 15,072 bytes | notfound.headers |
| 8 assets under `/_next/static/` (HEAD) | 200 | all: `cache-control: public,max-age=31536000,immutable`, `content-encoding: br`, `x-vercel-cache: HIT` | asset_*.headers |
| `/robots.txt` | 200 | Disallow `/api/`, `/admin/`, `/portal/`; Sitemap points to apex | robots.txt |

## TTFB (single samples, curl `time_starttransfer`, includes DNS+TCP+TLS setup, my network)
apex HTTP 0.34 s · apex HTTPS 0.13 s · www HEAD 0.39 s / 0.19 s · robots 0.14 s · sitemap **3.01 s** · 404 0.14 s · assets 0.10–0.19 s.

## DNS (2026-11-01T08:07:24Z) — dns.txt
A `216.198.79.1` · AAAA none · MX `0 cynbit-in.mail.protection.outlook.com` · NS `ns33/ns34.domaincontrol.com` · TXT: two `google-site-verification`, SPF `v=spf1 include:secureserver.net -all`, `NETORG20603639.onmicrosoft.com` · `_dmarc` `v=DMARC1; p=none;` · DKIM selector1/2 CNAME none · CAA none · `www` → `e12d688042344235.vercel-dns-017.com`, `64.29.17.1`, `216.198.79.1`.

## TLS — tls.txt
`www.cynbit.in`: TLSv1.3, `TLS_AES_128_GCM_SHA256`, issuer Let's Encrypt YR2, notBefore 25 Sep 2026, notAfter 24 Dec 2026, verify OK.

## Homepage HTML (offline) — www_homepage.html
Next.js App Router; no `<form>`, `/api/` URL or `fetch(`; no canonical link; `og:url` apex; GTM/GA `G-LK6CQWCWX0`; Google Fonts stylesheet.

## PENDING (browser / one extra GET)
Contact-form behaviour, cookies, Lighthouse, SSL Labs grade, screenshots.
