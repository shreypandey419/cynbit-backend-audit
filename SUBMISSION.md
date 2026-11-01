# Submission

## Links
- Primary: https://github.com/shreypandey419/cynbit-backend-audit
- Additional (optional): REPORT.md · findings/INDEX.md · docs/architecture.md · docs/improvements.md

## Execution Notes (≤150 words)
Passive audit of cynbit.in: browser-style GET requests, offline analysis of saved responses, public DNS lookups and one TLS handshake. No scanning, fuzzing, form submission, load or exploitation; routes listed in robots.txt were not requested. Findings are limited to what saved evidence supports (evidence/, docs/request-log.md); unverified items are marked PENDING. A small Express reference implementation with 11 tests demonstrates the recommended practices; it is my own code, not Cynbit's. AI tools assisted with drafting and scripting; I verified each claim against the saved evidence.

## Publish
```bash
git init
git add .
git commit -m "Backend technical audit of cynbit.in (passive)"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Before submitting
- [ ] `bash scripts/collect-evidence.sh` run; evidence/ and docs/request-log.md committed
- [ ] Manual items in docs/manual-todo.md done; PENDING markers in REPORT.md replaced
- [ ] `npm test` shows 11 passing
