# ERR-01 — 404 handling (positive observation)

| Field | Value |
|---|---|
| Category | Error handling |
| Severity | Info (no issue) |
| Evidence | `evidence/notfound.headers`: `GET /this-page-should-not-exist-404-check` → `HTTP/2 404`, `content-type: text/html; charset=utf-8`, `x-matched-path: /404`, `x-next-error-status: 404`, `x-vercel-cache: HIT`. `evidence/404.html`: branded Next.js not-found page, no stack-trace markers. |
| Observation | The site returns a correct 404 status with a branded page that is prerendered and CDN-cached. No framework or path detail leaks in headers or body. This replaces the earlier "mixed signals" idea, which the evidence does not support. |
| Note | The 404 page shares the homepage `<title>`; harmless. `access-control-allow-origin: *` also appears here (see INFO-02). |
