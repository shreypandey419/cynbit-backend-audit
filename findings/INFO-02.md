# INFO-02 — Wildcard CORS header on HTML and static responses

| Field | Value |
|---|---|
| Category | Security (configuration awareness) |
| Severity | Info — public content, no credentials involved |
| Evidence | `access-control-allow-origin: *` on the homepage (`www_head_compressed.headers`), the 404 page (`notfound.headers`) and a JS asset. |
| Observation | Typical of static/prerendered responses on Vercel; harmless for public pages. |
| Recommendation | Confirm that real API routes (INFO-01) do not inherit `*`, especially if they use cookies or tokens; use an explicit origin allow-list there. |
