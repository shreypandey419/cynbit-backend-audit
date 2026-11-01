# Architecture (inferred from public observation)

```mermaid
graph TD
    U[Visitor / crawler] -->|HTTPS, TLS 1.3| E[Vercel edge - bom1]
    E -->|prerendered, x-vercel-cache HIT| P[Next.js App Router pages]
    E -->|dynamic route, MISS, ~3 s| S[Sitemap function - iad1]
    P --> GA[Google Tag Manager / GA]
    P --> GF[Google Fonts stylesheet]
    P -.->|/contact - not captured| F[Contact form backend - unknown]
    R[robots.txt] -.->|names /api/ /admin/ /portal/ - not requested| X[Possible server routes]
    DNS[GoDaddy DNS] --> E
    DNS --> M[Microsoft 365 mail - MX outlook.com]
```

## Redirect chain (NET-01)
```mermaid
sequenceDiagram
    participant C as Client
    participant A as cynbit.in
    participant W as www.cynbit.in
    C->>A: GET http://cynbit.in/
    A-->>C: 308 → https://cynbit.in/
    C->>A: GET https://cynbit.in/
    A-->>C: 307 → https://www.cynbit.in/
    C->>W: GET /
    W-->>C: 200 (HIT)
```

## Proposed changes
One canonical host with a permanent redirect and canonical tag; hardening headers via `next.config.js` (CSP Report-Only first); sitemap as ISR near the audience; DKIM + DMARC `rua`. If the contact form posts to a server route: validation, rate limit, honeypot, size limit, strict CORS, consistent errors, request IDs — demonstrated with 11 tests in `src/` (**my own reference code, not Cynbit's**).
