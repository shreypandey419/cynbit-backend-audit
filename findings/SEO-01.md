# SEO-01 — Sitemap `lastmod` partly reflects generation time

| Field | Value |
|---|---|
| Category | Crawlability / Data accuracy |
| Severity | Info |
| Evidence | `evidence/sitemap_www.xml`: 82 URLs; 16 carry `lastmod` = `2026-10-31T18:27:55Z`, the moment of capture (static routes such as `/`, `/story`, `/team`, `/contact`), while blog and case-study URLs have fixed historical dates. |
| Observation | In the saved sitemap, 16 static-route entries have `lastmod` equal to the capture timestamp. The single cache-MISS response and `iad1` identifier are noted in PERF-02; they do not establish that every fetch regenerates the sitemap or that the timestamp changes on every fetch. |
| Impact | If these `lastmod` values are refreshed on fetch without corresponding content changes, search engines may receive a less useful crawl signal. The available capture does not establish that this happens on every fetch. |
| Recommendation | Use real content-update dates (build time or CMS field) for `lastmod`, or omit it. |
| Effort | S |

```js
// app/sitemap.js
const BUILD_DATE = new Date(process.env.NEXT_PUBLIC_BUILD_DATE || "2026-10-01");
export default function sitemap() {
  return staticPaths.map((p) => ({ url: `https://www.cynbit.in${p}`, lastModified: BUILD_DATE }));
}
```
