# NET-01 — Two-hop redirect chain; canonical host signals conflict (apex vs www)

| Field | Value |
|---|---|
| Category | Architecture / Crawlability |
| Severity | Low — no security impact; extra hop and mixed canonical signals |
| Evidence | `evidence/http_apex.headers`: `GET http://cynbit.in/` → `HTTP/1.0 308 Permanent Redirect`, `Location: https://cynbit.in/`. `evidence/https_apex.headers`: `GET https://cynbit.in/` → `HTTP/2 307`, `location: https://www.cynbit.in/`. `evidence/robots.txt`: `Sitemap: https://cynbit.in/sitemap.xml` (apex). `evidence/sitemap_www.xml`: all 82 `<loc>` values use `https://cynbit.in` (apex). `evidence/www_homepage.html`: `og:url` = `https://cynbit.in`, no `<link rel="canonical">`. |
| Observation | Chain: `http://cynbit.in` →(308)→ `https://cynbit.in` →(307)→ `https://www.cynbit.in`. The HTTP→HTTPS hop is permanent, the apex→www hop is temporary. robots.txt, sitemap and `og:url` advertise the apex host, which is **not** where pages are served. |
| Impact | The sitemap’s `<loc>` entries use the apex host, which redirects to `www` in the captured response. A 307 is a temporary redirect; the saved homepage HTML also lacks a canonical link, leaving the preferred host less explicit. |
| Recommendation | Choose one canonical host. Make the apex→www redirect permanent (308) in Vercel Domains settings, emit that host in robots.txt, sitemap and `og:url`, and add a canonical tag. Optionally collapse the chain so HTTP goes straight to the final host. |
| Effort | S |

```js
// app/layout.js
export const metadata = {
  metadataBase: new URL("https://www.cynbit.in"),
  alternates: { canonical: "/" },
  openGraph: { url: "https://www.cynbit.in" },
};
```
