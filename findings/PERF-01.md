# PERF-01 — Static caching and compression are in good shape

| Field | Value |
|---|---|
| Category | Performance |
| Severity | Info (no issue) |
| Evidence — HTML | Homepage (`evidence/www_head_compressed.headers`): `x-nextjs-prerender: 1`, `x-vercel-cache: HIT`, `age: 240885` (≈2.8 days), `etag`, `cache-control: public, max-age=0, must-revalidate` (Vercel default for HTML, revalidated by ETag). A normal GET with `Accept-Encoding: gzip, br` (manual request #16, 2026-11-01 08:12:16 GMT) returned `content-encoding: br`, `x-vercel-cache: HIT` and `size_download=15402` bytes, against 100,498 bytes uncompressed (`evidence/www_homepage.html`): about 85% smaller on the wire. |
| Evidence — assets | All 8 asset HEAD captures (`evidence/asset_*.headers`: `layout-db39…`, `1255-…`, `1356-…`, `2619-…`, `4773-…`, `5563-…`, `4bd1b696-…`, `page-786d…`) show `cache-control: public,max-age=31536000,immutable`, `content-encoding: br`, `x-vercel-cache: HIT`. |
| Observation | Content-hashed assets are cached for a year and Brotli-compressed; HTML and the 404 page are prerendered, served from the CDN and compressed. An earlier HEAD request showed no `content-encoding` for the HTML; that was a property of HEAD, not of the site. |
| Remaining opportunities | Homepage HTML is about 100 KB before compression (largely inline Next.js flight data); Lighthouse (**PENDING**) will show unused JavaScript. A Google Fonts stylesheet (Material Symbols) is loaded in addition to self-hosted fonts, which adds a third-party round trip. |
| Effort | S–M |
