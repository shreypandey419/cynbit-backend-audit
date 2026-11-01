# INFO-03 — No CAA record

| Field | Value |
|---|---|
| Category | TLS / DNS hardening |
| Severity | Info |
| Evidence | `evidence/dns.txt`: `## CAA cynbit.in` returned nothing. Certificate for `www.cynbit.in` issued by Let's Encrypt (YR2), valid 25 Sep 2026 – 24 Dec 2026, TLS 1.3 (`evidence/tls.txt`). |
| Recommendation | Optional: add a CAA record restricting issuance to the CA in use (for example `0 issue "letsencrypt.org"`), after confirming all CAs that legitimately issue for the domain. |
| Effort | S |
