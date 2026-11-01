# Remaining items

## A. Terminal — DONE (compression confirmed: br, 15,402 B; assets: immutable + br + HIT). Only the log line remains:
```bash
echo '| 16 (manual) | 2026-11-01T08:12:16Z | GET | https://www.cynbit.in/ | http=200 size_download=15402 content-encoding=br |' >> docs/request-log.md
tail -3 docs/request-log.md
```

(original commands, for reference)
1. Homepage compression (one normal GET, bytes transferred are what the server sent):
```bash
curl -sS -A "CynbitAssessment-PassiveAudit/1.0 (internship assessment)" -H "Accept-Encoding: gzip, br" -o /dev/null -D - -w 'size_download=%{size_download}\n' https://www.cynbit.in/
```
   Add one line to docs/request-log.md (manual, #16, time, GET, URL, result).
2. Headers of all assets already captured:
```bash
grep -H -iE '^(cache-control|content-encoding|x-vercel-cache)' evidence/asset_*.headers
```

## B. Browser
1. **Contact form** (`https://www.cynbit.in/contact`): submit ONCE with invalid data; DevTools → Network → Fetch/XHR: URL, method, status, request body shape, response body, client- or server-side validation.
2. **Cookies**: DevTools → Application → Cookies (name, Secure, HttpOnly, SameSite; "none" is valid).
3. **Lighthouse** (mobile) on the homepage: 4 scores + top 3 opportunities → screenshots/lighthouse.png.
4. **SSL Labs** grade for www.cynbit.in (tick "Do not show the results on the boards").
5. Screenshot of response headers → screenshots/headers.png.
