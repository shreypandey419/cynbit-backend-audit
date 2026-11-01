# SEO-01 — Sitemap `lastmod` partly reflects generation time

| Field | Value |
|---|---|
| Category | Crawlability / Data accuracy |
| Severity | Info |
| Evidence | `evidence/sitemap_www.xml`: 82 URLs; 16 carry `lastmod` = `2026-10-31T18:27:55Z`, the moment of capture (static routes such as `/`, `/story`, `/team`, `/contact`), while blog and case-study URLs have fixed historical dates. |
| Observation | The sitemap is a dynamic route (cache MISS, age 0, computed in iad1 — see PERF-02) and stamps the current time for static routes. |
| Impact | Search engines learn to distrust `lastmod` when it changes on every fetch, reducing its value for crawl scheduling. |
| Recommendation | Use real content-update dates (build time or CMS field) for `lastmod`, or omit it. |
| Effort | S |

```js
// app/sitemap.js
const BUILD_DATE = new Date(process.env.NEXT_PUBLIC_BUILD_DATE || "2026-10-01");
export default function sitemap() {
  return staticPaths.map((p) => ({ url: `https://www.cynbit.in${p}`, lastModified: BUILD_DATE }));
}
```
