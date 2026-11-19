# Comandos

Node 22.12+ (o CI usa Node 24).

| Ação | Comando |
| --- | --- |
| Instalar dependências | `npm ci` |
| Servidor de desenvolvimento | `npm run dev` |
| Ver o CV em HTML (dev) | `npm run dev` e abrir `/cv/` ou `/en/cv/` |
| Typecheck | `npm run check` |
| Testes unitários | `npm test` |
| Build (site + PDFs do CV) | `npm run build` |
| Só gerar os PDFs do CV (depois do build) | `node scripts/render-cv.mjs` |
| Build com um Chrome específico | `PW_EXECUTABLE=/caminho/do/chrome npm run build` |
| Smoke E2E | `npm run smoke` |
| Screenshots dos projetos | `node scripts/screenshots.mjs` |

## CV dinâmico

O CV é montado a partir do mesmo conteúdo do site e impresso em PDF a cada build:

- **Habilidades**: `src/data/stack.ts`. Skill nova entra aqui e aparece no site e no CV.
- **Projetos**: `src/content/projects/*.md`. Entram os de status `live` e `wip`, ordenados por `order`.
  Cada um precisa do campo `cv` no frontmatter (`goal` + até 2 `highlights`); sem ele o build falha.
  O CV mostra as 6 primeiras tecnologias de `stack`.
- **Experiência**: `src/content/experience/*.md` (os itens de lista do corpo viram os tópicos).
- **Resumo, contato, formação, certificações e idiomas**: `src/data/profile.ts`, `education.ts`, `certs.ts`.

Os PDFs saem em `dist/cv/Raul_SGomes_CV-pt.pdf` e `dist/cv/Raul_SGomes_CV-en.pdf`; o botão
"baixar CV" aponta para o PDF do idioma da página.
