---
lang: pt
title: Café com BPO
tagline: Plataforma SaaS para profissionais de BPO financeiro
status: live
stack: [FastAPI, Pydantic v2, SQLAlchemy, Alembic, PostgreSQL 16, React 18, TypeScript, Vite, TanStack Query, React Hook Form + Zod, Docker Compose, Nginx, SSE, Resend, Cloudinary, GitHub Actions]
icon: pacman
order: 1
links:
  - { label: site, href: 'https://cafecombpo.com/' }
cover: src/img/logo.svg
gallery:
  - { src: src/img/prospectar-clientes.png, caption: Prospectar clientes }
  - { src: src/img/comunidade.png, caption: Comunidade }
  - { src: src/img/gestor-de-tarefas.png, caption: Gestor de tarefas }
---

Cofundador e desenvolvedor da plataforma SaaS para profissionais de BPO financeiro. Levei o produto do levantamento de requisitos ao deploy; ele está no ar.

## O produto

- SaaS para operadores de BPO financeiro organizarem a operação de vários clientes.
- Fluxo completo: captação (prospecto → cliente, orçamento → contrato), operação recorrente (rotinas, atividades, calendário, governança mensal), gestão de equipe com convites e permissões, e comunidade de membros.
- Monetização por assinatura, com plano gratuito somente leitura, programa Beta e cupons.

## Arquitetura

- Monólito modular: 24 módulos de domínio no backend (auth, pricing, proposals, contracts, task_manager, subscriptions, network, entre outros). Cada módulo segue o padrão models → schemas → repository → service → router. A regra de negócio e a autorização ficam no serviço, nunca na rota nem na interface.
- Motor de precificação em DDD: um domínio isolado em dataclasses, sem framework. O servidor é a autoridade do preço; o cliente só exibe.
- API orientada à tela (BFF): agregações e cálculos no backend, DTOs explícitos, payload com apenas o que a tela usa. Validação nas duas bordas, com Pydantic v2 no backend e Zod v4 no frontend.
- Tempo real: SSE alimentado por triggers do PostgreSQL com LISTEN/NOTIFY, propagando mudanças de tarefas e de equipe entre usuários conectados.
- Infraestrutura: gateway Nginx como ponto único de entrada, serviços em Docker Compose, e-mails pelo Resend com webhook assinado, arquivos no Cloudinary.
- Decisões registradas em ADRs e em um glossário de evolução com status, decisões e histórico.

## Qualidade e testes

| Métrica | Backend | Frontend |
|---|---:|---:|
| Testes | 1.541 | 705 |
| Cobertura de linhas | 88% | 67,5% |
| Cobertura de branches | — | 73,8% |
| Piso que bloqueia o CI | 85% | 65% |

- TDD, com teste de regressão antes de cada mudança.
- Testes determinísticos, sem relógio real; cada teste roda isolado em SQLite em memória.
- Testes que protegem a infraestrutura: cadeia, lock de dependências e configuração do gateway.

## Segurança

- Autenticação JWT com refresh token em cookie, Google (OAuth) e rate limiting com SlowAPI.
- Webhooks do Stripe e do Resend com assinatura; sem o segredo configurado, o endpoint responde 503.
- Nginx com CORS restrito por origem e proxy com `Upgrade: websocket`. Consultas SQL montadas com identificadores seguros.
- Semgrep como gate antes da produção; dependências Python travadas com `uv pip compile`.

## Banco de dados

- PostgreSQL 16 com 95+ migrations Alembic.
- O CI ensaia todas as migrations em um Postgres real antes do merge.
- Migração do modelo de dados de clients para companies, com cutover planejado.

## Entrega

- 560 commits desde abril de 2026 e 22 pull requests.
- Git flow com `feature/*`, `develop` e `release/*`; deploy contínuo da `main` para a VPS.
