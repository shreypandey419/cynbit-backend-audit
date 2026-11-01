# PERF-02 — Sitemap is generated on demand in a distant region (3.0 s TTFB, cache MISS)

| Field | Value |
|---|---|
| Category | Performance |
| Severity | Low — affects crawlers rather than visitors; single sample |
| Evidence | `evidence/sitemap.headers`: `x-vercel-cache: MISS`, `age: 0`, `cache-control: public, max-age=0, must-revalidate`, `x-vercel-id: bom1::iad1::hvfsc-…`. Console log of the run: `GET /sitemap.xml -> http=200 ttfb=3.010458s bytes=14264`. For comparison, prerendered paths in the same run: `/robots.txt` 0.143 s, 404 page 0.145 s, homepage HEAD 0.19–0.39 s. |
| Observation | Unlike the homepage (`x-nextjs-prerender: 1`, edge `HIT`), the sitemap is a dynamic route. The `x-vercel-id` carries a second region code (`iad1`); on Vercel the second code is the region where the function ran, i.e. the request was served from the Mumbai edge (`bom1`) but computed in `iad1` (US East). |
| Caveat | One sample from one network. `time_starttransfer` includes DNS, TCP and TLS setup, so the ~0.1–0.4 s baseline contains connection time. A repeat measurement is needed before stating a rate. |
| Impact | Each crawler fetch regenerates 82 URLs far from the audience. Together with SEO-01 (lastmod stamped at generation time) it shows the sitemap is rebuilt per request. |
| Recommendation | Make the sitemap static or time-revalidated so the CDN serves it, and run server functions near the audience. |
| Effort | S |

```js
// app/sitemap.js
export const revalidate = 3600;          // ISR: regenerate at most hourly, CDN-cached
// optional, plan permitting:
export const preferredRegion = "bom1";   // run the function near users
```
