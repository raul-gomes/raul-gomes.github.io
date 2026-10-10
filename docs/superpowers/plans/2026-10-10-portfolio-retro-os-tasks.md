# Portfólio "Retro OS" — Lista de Tarefas (Plano de Implementação)

**Spec de referência:** [`../specs/2026-10-10-portfolio-retro-os-design.md`](../specs/2026-10-10-portfolio-retro-os-design.md)
**Data:** 2026-10-10
**Status:** Pendente (aguardando aprovação do spec)

> Este arquivo é para **consulta**. Toda decisão de design, contrato e conteúdo
> está no spec acima; aqui ficam apenas as tarefas executáveis e seu andamento.
> Marque `[x]` conforme concluir.

---

## Fase 0 — Setup do projeto

- [ ] **T0.1** Inicializar repositório git (`git init`) e criar `.gitignore` (node, dist, .astro).
- [ ] **T0.2** Criar projeto Astro (`npm create astro@latest`) em modo mínimo/blank, TypeScript strict.
- [ ] **T0.3** Adicionar dependências: `vitest` (testes). Configurar `astro.config.mjs` com `site` (para GitHub Pages) e `base` se necessário.
- [ ] **T0.4** Configurar `tsconfig` com paths (`@data`, `@components`, `@styles`, `@scripts`).
- [ ] **T0.5** Commit inicial (`chore: scaffold astro project`).

Tarefas relacionadas no spec: §6.1, §17.

## Fase 1 — Design tokens e visual base

- [ ] **T1.1** `src/styles/tokens.css`: paleta, tipografia, espaçamentos, z-index, durações (spec §5.1).
- [ ] **T1.2** Baixar/self-hostar fontes (CRT mono + IBM Plex Mono) em `public/fonts`; declarar `@font-face` com `font-display: swap`.
- [ ] **T1.3** `Base.astro`: `<head>`, metas, preload de fontes, favicon, injeção de tokens.
- [ ] **T1.4** Utilitários de efeitos CRT (scanlines, vinheta, glow) em CSS, condicionados a `prefers-reduced-motion` (spec §5.3, §12).
- [ ] **T1.5** Commit (`feat: design tokens and base layout`).

## Fase 2 — Modelo de conteúdo

- [ ] **T2.1** `src/data/profile.ts` com tipo `Profile` (spec §6.2, §7).
- [ ] **T2.2** `src/data/projects.ts` com os 4 projetos; `gerador-legenda` como `status: 'placeholder'` (spec §7).
- [ ] **T2.3** `src/data/stack.ts`, `experience.ts`, `certs.ts` a partir do CV.
- [ ] **T2.4** `src/data/i18n.ts`: strings de UI (taskbar, help, boot, controls, toggle) em pt/en.
- [ ] **T2.5** Commit (`feat: content data model and dictionaries`).

## Fase 3 — Controlador de modo e i18n

- [ ] **T3.1** `src/scripts/mode-controller.ts`: resolver preferência (query → localStorage → default `reader`); aplicar/ocultar shell; toggle + `reload()` (spec §10).
- [ ] **T3.2** Helper de i18n (resolver locale a partir da rota; trocar idioma navegando).
- [ ] **T3.3** Estrutura de rotas `/` (PT) e `/en` (EN) com layout compartilhado (spec §11).
- [ ] **T3.4** Testes unitários do resolver de preferência de modo (vitest).
- [ ] **T3.5** Commit (`feat: mode controller and i18n routing`).

## Fase 4 — Modo Estático (ReaderShell)

- [ ] **T4.1** `layouts/Reader.astro` + `styles/reader.css` (scroll, 6 seções).
- [ ] **T4.2** Componentes: Header, Bio, Projects, Stack, Experience, Certifications/Awards, Contact/Footer (spec §8).
- [ ] **T4.3** Painéis de projeto estilo "janela/terminal" reutilizando `shared/ProjectCard` (spec §8, §6.1).
- [ ] **T4.4** Botão de download do CV; copiar `docs/CV_Raul_SGomes.pdf` para `public/cv/`.
- [ ] **T4.5** Verificar acessibilidade básica (teclado, contraste, sem-JS) e reduced-motion.
- [ ] **T4.6** Commit (`feat: static reader mode`).

## Fase 5 — Modo Interativo: infraestrutura

- [ ] **T5.1** `layouts/Desktop.astro` + `styles/desktop.css` (spec §9).
- [ ] **T5.2** Carregamento sob demanda do JS do desktop via `import()` só quando modo desktop ativo (spec §6, §13).
- [ ] **T5.3** `scripts/window-manager.ts`: modelo de janelas (abrir/focar/z-index/arrastar/minimizar/fechar), pointer events, limites de viewport (spec §9.3).
- [ ] **T5.4** Componente `Window` (Astro + ilha JS) com controles `_ □ ×` e `role="dialog"` (spec §9.3).
- [ ] **T5.5** `Taskbar` com apps, relógio, toggle de modo e idioma (spec §9.2).
- [ ] **T5.6** Máquina de estados `off → booting → on` + tela desligada + `[ POWER ON ]` (spec §9.1, RF3).
- [ ] **T5.7** Sequência de boot em texto (respeitando reduced-motion).
- [ ] **T5.8** Commit (`feat: interactive desktop shell infrastructure`).

## Fase 6 — Modo Interativo: apps

- [ ] **T6.1** App `sobre.txt` (bio) — janela de conteúdo.
- [ ] **T6.2** App `projetos` — gerenciador de arquivos + janela de detalhe (mini-README + screenshot opcional) (spec §9.4).
- [ ] **T6.3** App `stack`, `contato`, `curriculo.pdf` (download).
- [ ] **T6.4** App `terminal` com parser puro; comandos `help/whoami/ls/open/lang/mode/clear` (spec §9.5).
- [ ] **T6.5** Testes unitários do parser do terminal (vitest) — comandos válidos, inválidos e `open` desconhecido.
- [ ] **T6.6** Acessibilidade das janelas (foco, Esc, Tab) (spec §9.3, §12).
- [ ] **T6.7** Commit (`feat: interactive apps and terminal`).

## Fase 7 — Efeitos e polish

- [ ] **T7.1** `scripts/effects.ts`: chuva neon em canvas + flicker, ativos só no modo desktop e sob `no-preference` (spec §5.3).
- [ ] **T7.2** Ajustes finais de animação/transições e estados de foco/hover.
- [ ] **T7.3** Revisar consistência PT/EN de todo o conteúdo.
- [ ] **T7.4** Preencher conteúdo real pendente (Gerador de Legenda, links, screenshots) (spec §16).
- [ ] **T7.5** Commit (`polish: effects and final content pass`).

## Fase 8 — Verificação

- [ ] **T8.1** `astro check` sem erros.
- [ ] **T8.2** `vitest run` verde.
- [ ] **T8.3** Lighthouse (modo leitura): Performance/Acessibilidade/SEO ≥ 90 (spec §13).
- [ ] **T8.4** Checklist manual: teclado, reduced-motion, mobile, sem-JS, toggle+reload, links (spec §14).
- [ ] **T8.5** Commit (`test: verification pass`).

## Fase 9 — Deploy

- [ ] **T9.1** Workflow do GitHub Actions para build + deploy no GitHub Pages (spec §15).
- [ ] **T9.2** Ajustar `site`/`base` do Astro conforme repositório público.
- [ ] **T9.3** Publicar e validar em produção (rotas `/` e `/en`, download do CV).
- [ ] **T9.4** (Opcional) Subir o `dist/` na Hostinger.
- [ ] **T9.5** Commit (`ci: deploy to github pages`).

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
- **Reduced-motion**: garantir fallback estático de boot e chuva.
- **Git**: repositório ainda não iniciado — T0.1 é o primeiro passo.
- **Conteúdo placeholder**: itens de §16 não bloqueiam o desenvolvimento.
