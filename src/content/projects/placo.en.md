---
lang: en
title: Placo
tagline: Financial management for people with both a personal and a business tax ID
status: wip
stack: [FastAPI, Python, PostgreSQL, SQLAlchemy, React, TypeScript, Vite, Supabase Auth, Docker Compose, GitHub Actions]
icon: tetris
order: 2
links:
  - { label: code, href: 'https://github.com/raul-gomes' }
cover: /projects/placo/00-logo.webp
gallery:
  - { src: /projects/placo/06-visao-geral-desktop.webp, caption: 'Monthly overview with income, outflows, balance and limits' }
  - { src: /projects/placo/07-financeiro-desktop.webp, caption: 'Yearly performance with income, outflows and investments' }
  - { src: /projects/placo/09-recorrentes-desktop.webp, caption: 'Recurring bills filtered by Both, Personal and Business' }
  - { src: /projects/placo/08-limites-desktop.webp, caption: 'Categories and subcategories with limits per account type' }
  - { src: /projects/placo/01-inicio-celular.webp, caption: 'On mobile, the month''s balance and what is close to its limit' }
  - { src: /projects/placo/02-financeiro-celular.webp, caption: 'Payment methods and the last six months' }
  - { src: /projects/placo/04-limites-celular.webp, caption: 'Monthly limit, credit card and spending per category' }
  - { src: /projects/placo/05-novo-lancamento-celular.webp, caption: 'A new transaction in a single sheet' }
---

A financial management platform for people who live with two accounts: their personal one and their company's. In Brazil these are the CPF (personal, PF) and the CNPJ (business, PJ). Transactions, categories, spending limits, recurring bills and goals are kept apart by account type, and the dashboard shows each side or both together.

## The story

People who run their own company tend to mix the business's money with the household's. Spreadsheets and personal finance apps treat everything as a single account, and business management systems are far too heavy for a self-employed professional. The result is not knowing how much the company really keeps and how much the household really spends.

Placo was born to solve that: every transaction is either personal or business, categories and limits are set per account type, and the combined view is one click away. Today the product is in personal use, the stage where the business rules are validated against real data before opening it to other people.

## What the platform does

- **Monthly overview:** income, outflows and balance, with the running total up to today. Outflows add up expenses and investments; investments have their own category so they do not blend in with expenses.
- **Charts:** income sources, spending per category, the year's evolution and spending versus limit.
- **Categories and subcategories with limits:** a spending limit per category, with alerts at 80%, 90% and 100% by email and in the notification bell.
- **Recurring bills:** installments generated automatically; changing the amount or the due day updates the installments from the current month on, without rewriting the past.
- **Medium-term goals** and a **shopping list**.
- **Import and export:** CSV, OFX and QFX, with protection against duplicate transactions.
- **Desktop and mobile:** a dedicated layout for each screen size.

## Architecture

The backend is **async FastAPI** with clearly separated layers: the route only handles HTTP, the service applies the business rule and the authorization, and the repository only runs SQL filtered by the user. Each request has **a single commit** (unit of work), and side effects such as evaluating limits only run after it.

The API delivers the screen ready to render: **totals and charts are aggregated in PostgreSQL**, not in the browser. That brought the overview down from 13 to 7 queries, and every number is checked by a parity test.

The frontend is **React + TypeScript + Vite**, with react-query for caching and Zod validating every API response on the way in. A bundle budget in CI keeps any JavaScript chunk under 64 kB gzipped; the main chunk went from 177 kB to 35 kB gzipped.

Everything runs on **Docker Compose** (PostgreSQL, API, frontend and nginx), with migrations versioned in Alembic.

## Security

- Sign-in through **Supabase Auth**; the backend checks the token's signature, expiry, audience and issuer, and the algorithm is never chosen by the token.
- Each person's role is decided on the server, never sent by the client; every SQL query is filtered by the authenticated user.
- Domain errors become fixed messages in Portuguese: no internal detail, SQL or another user's data reaches the screen.
- The bank integration key is **encrypted at rest** with key rotation, and the app refuses to start without the encryption key.
- CI runs **bandit, pip-audit and GitGuardian** on every PR.

## Tests and quality

- **583 backend tests** (plus 7 on real PostgreSQL in CI) and **426 frontend tests**, all green, with a frozen clock so they do not depend on the date.
- Measured coverage: **85% on the backend** (services 88%, repositories 84%) and **76% on the frontend** (pure rules 99.6%, pages 67%).
- **End-to-end validation of personal and business accounts:** every API number was checked against independent SQL queries over 8 months of data, and 90 data-entry flows were exercised on desktop and mobile, with no divergence and no console errors.
- Lint, formatting and typecheck at zero; CI with backend and frontend tests, `alembic check` and the bundle budget.

## Challenges and lessons

The project went through a full audit: in two days, backend tests went from 238 (4 failing because they depended on the current date) to 563, frontend tests from 118 to 424, and 785 lint warnings went to zero. The lesson was that "working" code was hiding inconsistent rules, such as outflows that included investments on one screen and not on another. The end-to-end validation, number by number against the database, is what revealed and fixed those differences.

## Next steps

- Rebuild the Open Finance integration (Pluggy), currently switched off.
- Build the investments screen.
- A coverage floor in CI and more tests on real PostgreSQL.
- Continuous deployment and scheduled backups with restore testing.
- Open the product to other users.
