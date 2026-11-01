#!/usr/bin/env bash
# Passive evidence collector for the Cynbit assessment.
# Rules: GET/HEAD only, sequential, 2 s apart, hard budget, every request logged BEFORE the next one.
# No scanning, no guessing of paths, no forms, no POST. Only URLs a normal browser would request.
#   Usage:  bash scripts/collect-evidence.sh
#   Test locally:  SCHEME=http HOST=localhost:8000 SKIP_DNS_TLS=1 bash scripts/collect-evidence.sh
set -u
SCHEME="${SCHEME:-https}"; HOST="${HOST:-cynbit.in}"; WWW="${WWW:-www.$HOST}"
[ "$HOST" = "localhost:8000" ] && WWW="localhost:8000"
UA="CynbitAssessment-PassiveAudit/1.0 (internship assessment)"
OUT="evidence"; LOG="docs/request-log.md"; BUDGET="${BUDGET:-25}"; N=0
mkdir -p "$OUT" docs
printf '# Request log\n\nUser-Agent: %s\n\n| # | UTC time | Method | URL | Result |\n|---|---|---|---|---|\n' "$UA" > "$LOG"

req() {  # req METHOD URL NAME [extra curl args...]
  if [ "$N" -ge "$BUDGET" ]; then echo "budget reached ($BUDGET)"; return 1; fi
  local m="$1" u="$2" name="$3"; shift 3
  N=$((N+1)); sleep 2
  local res
  if [ "$m" = "HEAD" ]; then
    res=$(curl -sS -I -A "$UA" --max-time 20 -D "$OUT/$name.headers" -o /dev/null \
      -w 'http=%{http_code} ttfb=%{time_starttransfer}s' "$@" "$u" 2>&1)
  else
    res=$(curl -sS -A "$UA" --max-time 20 -D "$OUT/$name.headers" -o "$OUT/$name.body" \
      -w 'http=%{http_code} ttfb=%{time_starttransfer}s total=%{time_total}s bytes=%{size_download}' "$@" "$u" 2>&1)
  fi
  printf '| %s | %s | %s | %s | %s |\n' "$N" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$m" "$u" "$res" >> "$LOG"
  echo "[$N/$BUDGET] $m $u -> $res"
}

AE='Accept-Encoding: gzip, br'
# 1-2: redirect behaviour (no -L: we look at each hop ourselves)
req GET  "http://$HOST/"            http_apex
req GET  "$SCHEME://$HOST/"         https_apex
# 3-4: homepage on www, plain and with compression negotiation
req HEAD "$SCHEME://$WWW/"          www_head
req HEAD "$SCHEME://$WWW/" www_head_compressed -H "$AE"
# 5-6: crawl files
req GET  "$SCHEME://$WWW/robots.txt"  robots
req GET  "$SCHEME://$WWW/sitemap.xml" sitemap
# 7: ONE non-existent path to see the error page, status code and headers
req GET  "$SCHEME://$WWW/this-page-should-not-exist-404-check" notfound

# 8+: only static assets that the saved homepage itself references (max 8), HEAD with compression header
if [ -f "$OUT/www_homepage.html" ]; then
  while read -r p; do
    req HEAD "$SCHEME://$WWW$p" "asset_$(echo "$p" | tr -c 'A-Za-z0-9\n' '_' | tail -c 40)" -H "$AE" || break
  done < <(grep -oE '/_next/static/[A-Za-z0-9_./()%-]+\.(js|css|woff2)' "$OUT/www_homepage.html" | sort -u | head -8)
fi

echo "HTTP requests made: $N"

if [ "${SKIP_DNS_TLS:-0}" != "1" ]; then
  {
    echo "# Public DNS lookups for $HOST  ($(date -u +%FT%TZ))"
    for t in A AAAA MX NS TXT CAA; do echo; echo "## $t $HOST"; dig +short "$t" "$HOST"; done
    echo; echo "## TXT _dmarc.$HOST";                dig +short TXT "_dmarc.$HOST"
    echo; echo "## CNAME selector1._domainkey.$HOST"; dig +short CNAME "selector1._domainkey.$HOST"
    echo; echo "## CNAME selector2._domainkey.$HOST"; dig +short CNAME "selector2._domainkey.$HOST"
    echo; echo "## A $WWW";                          dig +short A "$WWW"
  } > "$OUT/dns.txt" 2>&1
  {
    echo "# One TLS handshake to $WWW:443  ($(date -u +%FT%TZ))"
    echo | openssl s_client -connect "$WWW:443" -servername "$WWW" 2>/dev/null > "$OUT/tls_raw.txt"
    grep -E 'Protocol|Cipher|Verify return|subject=|issuer=|Server certificate' "$OUT/tls_raw.txt"
    echo | openssl x509 -noout -subject -issuer -dates < <(sed -n '/BEGIN CERT/,/END CERT/p' "$OUT/tls_raw.txt") 2>&1
  } > "$OUT/tls.txt" 2>&1
  rm -f "$OUT/tls_raw.txt"
  echo "Saved $OUT/dns.txt and $OUT/tls.txt"
fi
echo "Log: $LOG"
