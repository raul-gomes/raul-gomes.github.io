# Portfólio "Retro OS" — Especificação de Design

**Data:** 2026-10-10
**Autor:** Raul da Silva Gomes
**Status:** Aprovado (design) — pendente revisão do spec
**Arquivo de tarefas:** `docs/superpowers/plans/2026-10-10-portfolio-retro-os-tasks.md`

---

## 1. Objetivo

Criar uma página pessoal de vitrine para portfólio de desenvolvedor, com:
bio, projetos, stack, experiência, certificações/prêmios e contato.

O objetivo central de experiência é **fugir do visual genérico "feito por IA"**
(gradiente roxo/azul, glassmorphism, cards flutuantes com sombra suave, hero
centralizado com título gigante, blobs animados) e entregar algo autoral e
memorável.

**Conceito:** um "computador antigo ligado na mesa". A linguagem visual combina
**Nostromo / Alien (1983)** — fósforo âmbar de CRT — com **Blade Runner / cyberpunk
noir** — neon magenta/ciano, chuva, escuro.

## 2. Requisitos funcionais

- **RF1** — Página com duas apresentações do mesmo conteúdo:
  - **Modo Estático (ReaderShell)**: página que rola normalmente.
  - **Modo Interativo (DesktopShell)**: desktop retrô com janelas e terminal.
- **RF2** — Toggle de modo na interface. Ao alternar, grava a preferência e
  recarrega a página (`location.reload()`).
- **RF3** — Primeira visita abre no **modo estático**. O modo interativo começa
  com o "computador desligado" e um botão `[ POWER ON ]`; só ao clicar ocorre a
  sequência de boot e o desktop aparece.
- **RF4** — Internacionalização PT/EN por rota: `/` (PT-BR) e `/en` (EN).
  Switch de idioma navega entre as rotas (equivalente a reload).
- **RF5** — Conteúdo: bio, 4 projetos, stack, experiência (timeline curta),
  certificações/prêmios, contato e download do CV.
- **RF6** — Modo interativo: janelas (abrir, focar, arrastar, minimizar, fechar),
  taskbar com apps, e terminal com comandos.

## 3. Fora de escopo (YAGNI)

- CMS / painel administrativo. O conteúdo é editado em arquivos de dados.
- Backend, autenticação, banco de dados. Site 100% estático.
- Analytics, formulário de contato com envio (o contato é via links/email).
- Blog, comentários, multi-tema (dark/light) além do tema fixo.
- DOMínio próprio (não há, nesta fase).

## 4. Personas e cenários de uso

- **Recrutador / visitante rápido (mobile):** abre `/`, lê bio/projetos rolando,
  clica em links. Deve funcionar sem JS e ser legível.
- **Visitante explorador (desktop):** alterna para o modo interativo, liga o
  computador, abre janelas, testa o terminal. É o "uau" do portfólio.
- **Bot / indexador:** precisa encontrar o conteúdo em HTML estático.

## 5. Identidade visual

### 5.1 Paleta (design tokens)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0a0a0c` | fundo principal |
| `--bg-2` | `#101015` | painéis/janelulas |
| `--amber` | `#ffb000` | texto/chrome de fósforo |
| `--amber-dim` | `#a87400` | texto secundário |
| `--magenta` | `#ff2d95` | acento neon 1 |
| `--cyan` | `#00e5ff` | acento neon 2 |
| `--danger` | `#ff4d4d` | erros/close |
| `--ok` | `#39ff88` | status/sucesso |

### 5.2 Tipografia

- **Chrome / terminal:** monoespaçada "de CRT" (ex.: `VT323` ou `Share Tech Mono`).
- **Corpo:** `IBM Plex Mono`.
- **Self-hosted** em `public/fonts` (sem CDN externo).
- Fallback: `ui-monospace, "Courier New", monospace`.

### 5.3 Efeitos

Scanlines, vinheta, glow sutil de CRT, cursor piscando, flicker de texto e chuva
neon no fundo (canvas). **Todos** condicionados a `prefers-reduced-motion: no-preference`;
com `reduce`, os efeitos são desligados ou estáticos.

### 5.4 Anti-padrões (proibido)

Gradiente roxo/azul, glassmorphism, sombras suaves flutuando, hero centralizado
com título gigante, blobs animados, ícones genéricos de biblioteca.

## 6. Arquitetura

**Abordagem A — dois "shells", conteúdo compartilhado.**

O conteúdo vive em `src/data/`, independente de apresentação. Dois shells
consomem o mesmo conteúdo:

```
                 ┌───────────────┐
   conteúdo  →   │  src/data/*   │   (pt/en)
                 └──────┬────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
  ReaderShell                     DesktopShell
  (Astro, sem JS,                 (ilha JS, carregada
   HTML estático)                  só no modo desktop)
```

- **Controlador de modo** (`src/scripts/mode-controller`): script inline, antes da
  pintura, lê a preferência (query param → `localStorage` → default `reader`) e
  decide qual shell exibir. Alternar grava a preferência e chama `reload()`.
- **SEO**: o conteúdo do ReaderShell está sempre no HTML de `/` e `/en`. No modo
  desktop o conteúdo de leitura permanece no DOM (apenas oculto).
- **Carregamento sob demanda**: o JS do DesktopShell só é importado (`import()`)
  quando o modo desktop está ativo.

### 6.1 Árvore de arquivos

```
astro.config.mjs
package.json
public/
  fonts/
  cv/Raul_SGomes_CV.pdf      (cópia do CV)
  projects/                  (screenshots opcionais)
  favicon.svg
src/
  data/
    profile.ts
    projects.ts
    stack.ts
    experience.ts
    certs.ts
    i18n.ts                  (strings de UI pt/en)
  components/
    reader/                  (SectionBio, SectionProjects, ...)
    desktop/                 (Desktop, Taskbar, Window, Terminal, FileManager)
    shared/                  (ProjectCard, StackList, ...)
  layouts/
    Base.astro
    Reader.astro
    Desktop.astro
  pages/
    index.astro              (PT)
    en/index.astro           (EN)
  styles/
    tokens.css
    reader.css
    desktop.css
  scripts/
    mode-controller.ts
    window-manager.ts
    terminal.ts
    effects.ts               (scanlines, rain, flicker)
docs/superpowers/specs/2026-10-10-portfolio-retro-os-design.md
docs/superpowers/plans/2026-10-10-portfolio-retro-os-tasks.md
```

### 6.2 Modelo de dados (tipos)

```ts
// src/data/profile.ts
type Locale = 'pt' | 'en';
type Localized<T> = Record<Locale, T>;

interface Profile {
  name: string;
  handle: string;          // ex.: "raul@nostromo"
  role: Localized<string>;
  location: Localized<string>;
  email: string;
  github: string;
  linkedin: string;
  bioShort: Localized<string>;
  bioLong: Localized<string>;
}

// src/data/projects.ts
interface Project {
  id: string;
  title: string;
  tagline: Localized<string>;
  readme: Localized<string>;   // mini-README (markdown)
  stack: string[];
  status: 'live' | 'wip' | 'placeholder';
  links?: { repo?: string; demo?: string };
  screenshot?: string;         // caminho opcional em /public
}

// src/data/stack.ts
interface StackGroup { id: string; label: Localized<string>; items: string[]; }

// src/data/experience.ts
interface Experience {
  id: string;
  company: string;
  role: Localized<string>;
  period: string;              // ex.: "Mai/2025 – Set/2025"
  summary: Localized<string>;  // 1 linha
}

// src/data/certs.ts
interface Award { id: string; title: Localized<string>; issuer: string; year: number; }
```

## 7. Conteúdo (valores)

Conteúdo base extraído do CV (`docs/CV_Raul_SGomes.pdf`). Textos em PT; versão EN
traduzida.

- **Bio**: Engenheiro de Software, 3+ anos, backend Python (Django/FastAPI/Flask),
  arquitetura, cloud/DevOps, certificado Azure AI Engineer, Ciência de Dados,
  3º lugar Innovation Challenge Microsoft 2025.
- **Projetos (4):**
  1. `cafe-com-bpo` — Café com BPO: plataforma de BPO financeiro.
  2. `placo` — Placo: sistema de gestão financeira.
  3. `nacao-patina` — Nação Patina: rede social de grupo de patinação.
  4. `gerador-legenda` — Gerador de Legenda: **placeholder** (conteúdo a preencher).
- **Stack** (grupos): Backend, Frontend, Dados, Cloud/DevOps, Ferramentas.
- **Experiência** (timeline curta): Record Brasília, Freelancer, Instituto Eldorado, G&P.
- **Certificações/Prêmios**: Azure AI Engineer, Azure Foundation, Databricks Foundations,
  Scrum, ITIL; 3º lugar Innovation Challenge Microsoft 2025.
- **Contato**: email `rsgomes86@gmail.com`, GitHub `raul-gomes`,
  LinkedIn `raulsgomes` (`linkedin.com/in/raulsgomes`), local Brasília-DF.

## 8. Modo Estático (ReaderShell)

Página que rola, 6 seções em ordem:

1. **Header/BBB** — nome, handle, cargo, LED "status", toggle de modo e idioma.
2. **Bio** — bio curta + longa, cursor piscando.
3. **Projetos** — os 4 projetos em painéis estilo "janela/terminal".
4. **Stack** — grupos em grade.
5. **Experiência** — timeline curta.
6. **Certificações/Prêmios + Contato + download do CV** no rodapé.

- Renderizado por Astro, HTML estático, sem JS (exceto o controlador de modo e,
  opcionalmente, um reveal-on-scroll sob reduced-motion).
- Deve ser legível e navegável por teclado.

## 9. Modo Interativo (DesktopShell)

### 9.1 Máquina de estados

```
off  ──[POWER ON]──►  booting  ──[fim da sequência]──►  on
```
- `off`: tela CRT apagada + botão `[ POWER ON ]`.
- `booting`: sequência de texto (`BOOT… OK`) por ~1.5s (respeitando reduced-motion).
- `on`: desktop + taskbar + janelas.

### 9.2 Taskbar

Botões: `[sobre.txt]` `[projetos]` `[stack]` `[terminal]` `[contato]`
`[curriculo.pdf]`, relógio piscando, toggle de modo e `PT | EN`.

### 9.3 Janela (componente)

Comportamentos: abrir, focar (z-index incremental), **arrastar** (pointer events,
respeitando limites da viewport), minimizar (para a taskbar), maximizar (opcional),
fechar. Rodapé/barra de título com controls `_ □ ×`.

Acessibilidade: foco por teclado, `role="dialog"`, `aria-label`, `Esc` fecha,
`Tab` percorre controles.

### 9.4 App "projetos"

Gerenciador de arquivos listando os 4 projetos (ícones/pastas). Clicar abre uma
janela de detalhe com o mini-README (markdown → HTML) e screenshot opcional.

### 9.5 App "terminal"

Comandos suportados (parser puro e testável):

| Comando | Efeito |
|---|---|
| `help` | lista os comandos |
| `whoami` | perfil resumido |
| `ls` | lista "arquivos"/apps disponíveis |
| `open <app>` | abre a janela do app (`about`, `projects`, `stack`, `contact`) |
| `lang pt` / `lang en` | troca idioma (navega para a rota) |
| `mode reader` | alterna para o modo estático |
| `clear` | limpa a tela do terminal |

Comando desconhecido → mensagem de erro em estilo CRT.

## 10. Toggle de modo — contrato

- Chave canônica: `portfolio.mode` em `localStorage` (`reader` | `desktop`).
- Preferência de URL (`?mode=`) tem precedência sobre `localStorage`.
- Default (sem preferência): `reader`.
- Ao alternar: grava `localStorage`, atualiza a query e chama `location.reload()`.
- Idioma: rota (`/` ↔ `/en`). A preferência de idioma NÃO é persistida
  separadamente — a rota é a fonte da verdade.

## 11. i18n

- Rotas: `/` (PT) e `/en` (EN).
- Textos de conteúdo e de UI armazenados por locale (`Localized<T>` / `i18n.ts`).
- Switch de idioma = navegação entre rotas (equivale a reload).

## 12. Acessibilidade

- Modo leitura funciona sem JS e é a porta de entrada.
- Navegação por teclado em todas as seções e nas janelas.
- `prefers-reduced-motion` desliga flicker/chuva/animações.
- Contraste conforme WCAG AA nos textos principais.
- Sem dependência exclusiva de cor para transmitir informação.

## 13. Performance

- Modo leitura: HTML estático, CSS mínimo, sem JS de desktop.
- JS do desktop carregado sob demanda (`import()`).
- Fontes self-hosted com `font-display: swap` e pré-carregamento do subset usado.
- Meta: Lighthouse ≥ 90 em Performance/Acessibilidade/SEO para o modo leitura.

## 14. Verificação

- `astro check` (tipos) sem erros.
- Testes unitários (vitest) do parser de comandos do terminal.
- Checagem manual: teclado, reduced-motion, mobile, sem-JS, toggle+reload,
  consistência PT/EN, links.

## 15. Deploy

- `astro build` → `dist/` estático.
- **GitHub Pages** via GitHub Actions (recomendado) — repositório `raul-gomes`.
- Alternativa: subir o mesmo `dist/` na Hostinger.
- Sem domínio próprio nesta fase.

## 16. Pendências de conteúdo (a preencher depois)

- Textos reais, tagline, mini-README e stack do **Gerador de Legenda**.
- Screenshots dos 4 projetos (opcional).
- Links de repositório/demo de cada projeto.
- Confirmar URLs exatas de GitHub/LinkedIn e handles.

## 17. Contexto técnico

- Runtime disponível: Node v20.20.2, npm 10.8.2.
- Não há repositório git inicializado nesta pasta (commit do spec fica
  condicionado à inicialização do repositório).
