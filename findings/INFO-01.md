# INFO-01 — robots.txt names internal-looking paths

| Field | Value |
|---|---|
| Category | Information exposure |
| Severity | Info — robots.txt is public by design; the risk exists only if these routes lack authentication |
| Evidence | `evidence/robots.txt`: `Disallow: /api/`, `Disallow: /admin/`, `Disallow: /portal/`. None of these appear in `evidence/sitemap_www.xml`. |
| Observation | The file reveals that routes named `/api/`, `/admin/` and `/portal/` exist or are planned. These paths were deliberately **not requested** during this passive audit. |
| Recommendation | Treat robots.txt as a crawler hint, not access control. Ensure those routes enforce authentication/authorization server-side and return the same generic response for unauthenticated clients. Prefer `X-Robots-Tag: noindex` on the routes themselves instead of advertising them. Note: Google ignores `Crawl-delay`. |
| Effort | S |
