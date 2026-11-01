# Cynbit — Backend Technical Audit

Passive, evidence-based review of cynbit.in (Backend Developer Intern assessment).

- **Full report:** [REPORT.md](REPORT.md)
- **Findings:** [findings/INDEX.md](findings/INDEX.md) — 0 High · 0 Medium · 4 Low · 7 Info
- **Architecture:** [docs/architecture.md](docs/architecture.md) · **Improvements:** [docs/improvements.md](docs/improvements.md)
- **Evidence:** [evidence/](evidence/README.md) · **Request log:** [docs/request-log.md](docs/request-log.md)
- **Reference implementation (my own Express code, not Cynbit's):** `src/`, `test/` — `npm install && npm test`
- **Re-collect evidence (GET/HEAD only):** `bash scripts/collect-evidence.sh`

Scope: public pages, ordinary GET/HEAD requests, public DNS, one TLS handshake. No scanning, fuzzing, form submission or exploitation.
