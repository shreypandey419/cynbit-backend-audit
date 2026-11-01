# Evidence index

**Capture 1 — manual curl, 2026-10-31 ~18:27 UTC:** homepage_headers.txt, homepage.html, www_headers.txt, www_homepage.html (100,498 B), robots.txt, sitemap.xml (apex redirect body), sitemap_www.xml (82 URLs), 404.html, favicon_www.ico (byte-identical to 404.html).

**Capture 2 — `scripts/collect-evidence.sh`, 2026-11-01 08:06–08:07 UTC:** http_apex.*, https_apex.*, www_head.headers, www_head_compressed.headers, robots.*, sitemap.*, notfound.*, asset_*.headers (8 HEAD requests), dns.txt, tls.txt. Every request is listed in docs/request-log.md.

Manual request #16 (GET with Accept-Encoding, 2026-11-01 08:12:16 GMT): content-encoding br, 15,402 bytes; recorded in docs/observations.md and docs/request-log.md.
