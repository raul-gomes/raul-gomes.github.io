---
lang: en
title: Café com BPO
tagline: SaaS platform for financial BPO professionals
status: live
stack: [FastAPI, Pydantic v2, SQLAlchemy, Alembic, PostgreSQL 16, React 18, TypeScript, Vite, TanStack Query, React Hook Form + Zod, Docker Compose, Nginx, SSE, Resend, Cloudinary, GitHub Actions]
icon: pacman
order: 1
links:
  - { label: site, href: 'https://cafecombpo.com/' }
cover: src/img/logo.svg
gallery:
  - { src: src/img/prospectar-clientes.png, caption: Prospecting clients }
  - { src: src/img/comunidade.png, caption: Community }
  - { src: src/img/gestor-de-tarefas.png, caption: Task manager }
---

Co-founder and developer of the SaaS platform for financial BPO professionals. I took the product from requirements gathering to deployment; it is live.

## The product

- SaaS for financial BPO operators to organize operations across multiple clients.
- Full flow: acquisition (prospect → client, quote → contract), recurring operations (routines, activities, calendar, monthly governance), team management with invitations and permissions, and a member community.
- Subscription monetization, with a read-only free plan, a Beta program, and coupons.

## Architecture

- Modular monolith: 24 domain modules in the backend (auth, pricing, proposals, contracts, task_manager, subscriptions, network, among others). Each module follows models → schemas → repository → service → router. Business rules and authorization live in the service, never in the route or the UI.
- DDD pricing engine: an isolated domain built with dataclasses, no framework. The server is the price authority; the client only displays it.
- Screen-oriented API (BFF): aggregations and calculations happen in the backend, DTOs are explicit, and payloads carry only what the screen uses. Validation happens at both boundaries, with Pydantic v2 on the backend and Zod v4 on the frontend.
- Real time: SSE fed by PostgreSQL triggers with LISTEN/NOTIFY, propagating task and team changes across connected users.
- Infrastructure: Nginx gateway as the single entry point, services in Docker Compose, email through Resend with signed webhooks, files on Cloudinary.
- Decisions recorded in ADRs and in an evolution glossary with status, decisions, and history.

## Quality and tests

| Metric | Backend | Frontend |
|---|---:|---:|
| Tests | 1,541 | 705 |
| Line coverage | 88% | 67.5% |
| Branch coverage | — | 73.8% |
| CI blocking floor | 85% | 65% |

- TDD, with a regression test before each change.
- Deterministic tests, with no real clock; each test runs isolated in in-memory SQLite.
- Tests protecting infrastructure: chain, dependency lock, and gateway configuration.

## Security

- JWT authentication with refresh token in a cookie, Google (OAuth), and rate limiting with SlowAPI.
- Stripe and Resend webhooks with signatures; without the secret configured, the endpoint responds 503.
- Nginx with origin-restricted CORS and proxy with `Upgrade: websocket`. SQL queries built with safe identifiers.
- Semgrep as a gate before production; Python dependencies pinned with `uv pip compile`.

## Database

- PostgreSQL 16 with 95+ Alembic migrations.
- CI rehearses all migrations against a real Postgres before merge.
- Data model migration from clients to companies, with a planned cutover.

## Delivery

- 560 commits since April 2026 and 22 pull requests.
- Git flow with `feature/*`, `develop`, and `release/*`; continuous deployment from `main` to the VPS.
