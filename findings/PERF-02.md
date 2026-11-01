# PERF-02 — Sitemap cache MISS and 3.0 s TTFB; region interpretation unverified

| Field | Value |
|---|---|
| Category | Performance |
| Severity | Low — affects crawlers rather than visitors; single sample |
| Evidence | `evidence/sitemap.headers`: `x-vercel-cache: MISS`, `age: 0`, `cache-control: public, max-age=0, must-revalidate`, `x-vercel-id: bom1::iad1::hvfsc-…`. Console log of the run: `GET /sitemap.xml -> http=200 ttfb=3.010458s bytes=14264`. For comparison, prerendered paths in the same run: `/robots.txt` 0.143 s, 404 page 0.145 s, homepage HEAD 0.19–0.39 s. |
| Observation | Unlike the homepage (`x-nextjs-prerender: 1`, edge `HIT`), the sitemap response was a cache MISS. The `x-vercel-id` includes `bom1::iad1`; this may indicate a function-region location on Vercel, but that interpretation is not independently verified from the saved response. |
| Caveat | One sample from one network. `time_starttransfer` includes DNS, TCP and TLS setup, so the ~0.1–0.4 s baseline contains connection time. A repeat measurement is needed before stating a rate. |
| Impact | In this single capture, the sitemap response was a cache MISS and had a 3.01 s time to first byte. This may affect crawler fetch latency; the capture does not establish that every request regenerates the sitemap or that the region causes the delay. |
| Recommendation | Make the sitemap static or time-revalidated so the CDN serves it, and run server functions near the audience. |
| Effort | S |

```js
// app/sitemap.js
export const revalidate = 3600;          // ISR: regenerate at most hourly, CDN-cached
// optional, plan permitting:
export const preferredRegion = "bom1";   // run the function near users
```
