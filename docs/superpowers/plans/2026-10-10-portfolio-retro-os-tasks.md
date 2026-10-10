# Portfólio "Retro OS" — Lista de Tarefas (Plano de Implementação)

**Spec de referência:** [`../specs/2026-10-10-portfolio-retro-os-design.md`](../specs/2026-10-10-portfolio-retro-os-design.md)
**Data:** 2026-10-10
**Status:** Implementação concluída — pendentes apenas conteúdo real e publicação

> Este arquivo é para **consulta**. Toda decisão de design, contrato e conteúdo
> está no spec acima; aqui ficam apenas as tarefas executáveis e seu andamento.
> Marque `[x]` conforme concluir.

---

## Fase 0 — Setup do projeto

- [x] **T0.1** Inicializar repositório git (`git init`) e criar `.gitignore` (node, dist, .astro).
- [x] **T0.2** Criar projeto Astro (`npm create astro@latest`) em modo mínimo/blank, TypeScript strict.
  - *Nota: feito manualmente (sem scaffold interativo); Node LTS 24 via `.nvmrc`.*
- [x] **T0.3** Adicionar dependências: `vitest` (testes). Configurar `astro.config.mjs` com `site` (para GitHub Pages) e `base` se necessário.
- [x] **T0.4** Configurar `tsconfig` com paths (`@data`, `@components`, `@styles`, `@scripts`).
- [x] **T0.5** Commit inicial (`chore: scaffold astro project`).

## Fase 1 — Design tokens e visual base

- [x] **T1.1** `src/styles/tokens.css`: paleta, tipografia, espaçamentos, z-index, durações (spec §5.1).
- [x] **T1.2** Fontes self-hostadas (VT323 + Share Tech Mono + IBM Plex Mono) em `public/fonts`; `@font-face` com `font-display: swap`.
- [x] **T1.3** `Base.astro`: `<head>`, metas, preload de fontes, favicon, injeção de tokens.
- [x] **T1.4** Utilitários de efeitos CRT (scanlines, vinheta, glow) em `src/styles/effects.css` (spec §5.3, §12).
- [x] **T1.5** Commit (`feat: design tokens and base layout`).

## Fase 2 — Modelo de conteúdo

- [x] **T2.1** `src/data/profile.ts` com tipo `Profile` (spec §6.2, §7).
- [x] **T2.2** `src/data/projects.ts` com os 4 projetos; `gerador-legenda` como `status: 'placeholder'` (spec §7).
- [x] **T2.3** `src/data/stack.ts`, `experience.ts`, `certs.ts` a partir do CV.
- [x] **T2.4** `src/data/i18n.ts`: strings de UI (taskbar, help, boot, controls, toggle) em pt/en.
- [x] **T2.5** Commit (`feat: content data model and dictionaries`).

## Fase 3 — Controlador de modo e i18n

- [x] **T3.1** `src/lib/mode.ts` + `src/scripts/mode-controller.ts`: resolver preferência; toggle + `reload()` (spec §10).
- [x] **T3.2** `src/lib/i18n.ts` (resolver locale; trocar idioma navegando).
- [x] **T3.3** Estrutura de rotas `/` (PT) e `/en` (EN) com layout compartilhado (spec §11).
- [x] **T3.4** Testes unitários do resolver de preferência de modo (`src/lib/mode.test.ts`).
- [x] **T3.5** Commit (`feat: mode controller and i18n routing`).

## Fase 4 — Modo Estático (ReaderShell)

- [x] **T4.1** `src/layouts/Portfolio.astro` + `src/styles/reader.css` (scroll, 6 seções).
- [x] **T4.2** Componentes: bar, hero, bio, projetos, stack, experiência, certificações, contato (spec §8).
- [x] **T4.3** Painéis de projeto estilo "janela/terminal" reutilizando `shared/ProjectBody`.
- [x] **T4.4** Botão de download do CV; cópia de `docs/CV_Raul_SGomes.pdf` em `public/cv/`.
- [x] **T4.5** Acessibilidade básica (skip link, teclado, contraste, reduced-motion).
- [x] **T4.6** Commit (`feat: static reader mode`).

## Fase 5 — Modo Interativo: infraestrutura

- [x] **T5.1** `src/styles/desktop.css`.
- [x] **T5.2** Carregamento sob demanda do JS do desktop via `import()` (chunk separado).
- [x] **T5.3** `src/scripts/window-manager.ts`: janelas (abrir/focar/z-index/arrastar/minimizar/fechar) (spec §9.3).
- [x] **T5.4** Janelas com `role="dialog"`, controles `_ ×` (spec §9.3).
- [x] **T5.5** Taskbar com apps, relógio, toggles de modo e idioma (spec §9.2).
- [x] **T5.6** Máquina de estados `off → booting → on` + tela desligada + `[ POWER ON ]` (spec §9.1, RF3).
- [x] **T5.7** Sequência de boot em texto (respeitando reduced-motion).
- [x] **T5.8** Commit (junto com Fase 6).

## Fase 6 — Modo Interativo: apps

- [x] **T6.1** App `sobre.txt` (bio).
- [x] **T6.2** App `projetos` — gerenciador de arquivos + janela de detalhe (spec §9.4).
- [x] **T6.3** Apps `stack`, `contato`, `curriculo.pdf` (download).
- [x] **T6.4** App `terminal` com parser puro; comandos `help/whoami/ls/open/lang/mode/clear` (spec §9.5).
- [x] **T6.5** Testes unitários do parser do terminal (`src/lib/terminal.test.ts`).
- [x] **T6.6** Acessibilidade das janelas (foco, teclado).
- [x] **T6.7** Commit (`feat: interactive desktop shell with window manager, apps and terminal`).

## Fase 7 — Efeitos e polish

- [x] **T7.1** `src/scripts/effects.ts`: chuva neon em canvas, só no desktop e sob `no-preference`.
- [x] **T7.2** Ajustes finais de animação/transições e estados de foco/hover.
- [x] **T7.3** Revisar consistência PT/EN de todo o conteúdo (verificado no smoke test).
- [ ] **T7.4** Preencher conteúdo real pendente (Gerador de Legenda, links de repo/demo, screenshots) (spec §16).
- [x] **T7.5** Commit (`polish: neon rain effect and reader flicker`).

## Fase 8 — Verificação

- [x] **T8.1** `astro check` sem erros.
- [x] **T8.2** `vitest run` verde (25 testes: mode, terminal, window manager).
- [ ] **T8.3** Lighthouse (modo leitura): Performance/Acessibilidade/SEO ≥ 90 — **não executado (sem Chrome/Lighthouse no ambiente)**; pendente.
- [x] **T8.4** Smoke test E2E real (`npm run smoke`, Playwright/Chromium): 26/26 checks (modos, toggle+reload, terminal, arrastar, reduced-motion, sem erros de console).
- [x] **T8.5** Commit (`test: unit + e2e smoke verification`).

## Fase 9 — Deploy

- [x] **T9.1** Workflow `.github/workflows/deploy.yml` para build + deploy no GitHub Pages (spec §15).
- [x] **T9.2** `site`/`base` do Astro configurados para user pages (`raul-gomes.github.io`, `base: '/'`).
- [ ] **T9.3** Publicar e validar em produção (rotas `/` e `/en`, download do CV) — **pendente: criar/ligar o repo no GitHub e fazer push**.
- [ ] **T9.4** (Opcional) Subir o `dist/` na Hostinger.
- [x] **T9.5** Commit (`ci: deploy to github pages`).

---

## Rastreabilidade (tarefa → spec)

| Fase | Seções do spec |
|---|---|
| 0 | §6.1, §17 |
| 1 | §5, §12 |
| 2 | §6.2, §7 |
| 3 | §6, §10, §11 |
| 4 | §8, §12 |
| 5 | §6, §9.1–9.3, §13 |
| 6 | §9.4, §9.5 |
| 7 | §5.3, §16 |
| 8 | §13, §14 |
| 9 | §15 |

## Riscos e notas

- **Arrastar janelas em touchscreen**: pointer events cobrem, mas validar no mobile.
- **Reduced-motion**: boot e chuva com fallback estático (verificado).
- **Conteúdo placeholder**: itens de §16/T7.4 não bloqueiam o desenvolvimento.
- **Node**: projeto usa Node LTS 24 (`.nvmrc`); Astro 7 exige ≥22.12.
- **GitHub Pages**: confirmar nome do repo (`raul-gomes.github.io` ou projeto) antes de publicar; ajustar `base` se for repo de projeto.