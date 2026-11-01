# EMAIL-01 — DMARC is monitoring-only without reporting; DKIM not observed at standard selectors

| Field | Value |
|---|---|
| Category | Email security |
| Severity | Low — hardening; SPF itself is consistent with the provider |
| Evidence (`evidence/dns.txt`, 2026-11-01T08:07:24Z) | NS `ns33/ns34.domaincontrol.com` (GoDaddy). MX `0 cynbit-in.mail.protection.outlook.com`. SPF TXT `"v=spf1 include:secureserver.net -all"`. TXT `"NETORG20603639.onmicrosoft.com"` (Microsoft 365 tenant verification). `_dmarc` TXT `"v=DMARC1; p=none;"`. `selector1/selector2._domainkey` CNAME: empty. CAA: empty. |
| SPF | GoDaddy's help pages state that Microsoft 365 from GoDaddy uses exactly `v=spf1 include:secureserver.net -all`. With GoDaddy nameservers and a Microsoft MX, the record looks **correct**. Do not replace it with an Outlook-only SPF. |
| DMARC | A policy exists but is `p=none` and has **no `rua`**, so receivers are told to take no action and no aggregate reports are requested. This gives no enforcement and no visibility. |
| DKIM | No CNAME at `selector1/selector2._domainkey` (the standard Microsoft 365 selectors). Other selectors cannot be enumerated passively, so DKIM for the custom domain is **not confirmed**. |
| Recommendation | Verify with the mail administrator: enable DKIM for the custom domain in Microsoft 365, add `rua=mailto:<address>` to DMARC, review reports, then move to `p=quarantine` and later `p=reject`. |
| Effort | S–M |

```
_dmarc.cynbit.in.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@cynbit.in; fo=1"
; later: p=quarantine; pct=25 → 100 → p=reject
```
