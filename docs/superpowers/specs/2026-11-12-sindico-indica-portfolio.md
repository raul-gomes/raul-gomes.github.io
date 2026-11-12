# Spec do portfólio — Síndico Indica

**Status:** rascunho para validação do Raul (não commitado; playbook `Portfolio-ao-finalizar-projeto`).
**Página alvo:** `src/content/projects/sindico-indica.pt.md` + `.en.md` (hoje é um placeholder `wip`).
**Números medidos em:** 12/11/2026, `main` na tag `v1.1.0`, banco Supabase local com todas as migrations.

> Trechos marcados com **[confirmar]** dependem de informação que só o Raul tem. Não invento história de produto.

---

## 1. Números medidos

| Item | Valor | Como foi medido |
| --- | --- | --- |
| Versão | 1.1.0 (versionCode 4 no Android) | `app.json`, build EAS `463dd3d0…` |
| Commits na `main` | 81 (desde 19/10/2026) | `git rev-list --count origin/main` |
| Telas do app | 20 rotas | arquivos em `src/app/` (sem `_layout`) |
| Código do app | 9.843 linhas TypeScript em 68 arquivos | `src/` |
| Painel admin | 966 linhas (Next.js 16.4, React 19) | `admin/src` |
| Banco | 24 migrations (2.778 linhas SQL); 12 tabelas, **todas com RLS**; 26 policies; 21 funções; 4 triggers | Supabase local, `pg_tables`/`pg_policies`/`pg_proc` |
| Edge Functions | 3: `delete-account`, `send-push`, `revenuecat-webhook` | `supabase/functions/` |
| Base de prestadores | 2.261 cadastrados em produção (importados de contatos de um grupo de síndicos do DF, normalizados por telefone) | consulta de leitura em produção |
| Testes do app | **654 testes Jest, 99,2% das linhas** (93,8% dos branches), 44 arquivos | `bunx jest --coverage` |
| Testes do admin | **83 testes Vitest, 100% das linhas**, 11 arquivos | `npm run test:coverage` (Node 24) |
| Testes do banco | **36 testes pgTAP** em 5 suítes | `supabase test db` |
| Pacote Android | JS 4,54 MB; assets 1,7 MB (eram 5,5 MB) | `expo export --source-maps` |
| CI | **configurada** no PR #12 (GitHub Actions: app, admin e banco, com checagem de chave secreta); ainda não rodou porque a cota do Actions da conta está esgotada | `.github/workflows/ci.yml` |

## 2. Análise técnica

### Arquitetura

```
 App (Expo / React Native)            Painel admin (Next.js)
 telas em src/app (Expo Router)       login + verificação de síndicos
        │  supabase-js (RLS)                  │ service role (só no servidor)
        ▼                                     ▼
 ┌──────────────────────── Supabase ────────────────────────┐
 │ PostgreSQL + PostGIS  ·  Auth  ·  Storage  ·  Edge Funcs  │
 │ RPCs: list_providers (busca, ordem e paginação no banco), │
 │ find_provider_by_contact, create_provider_profile…        │
 └───────────────────────────────────────────────────────────┘
        │ push (Expo Notifications)    │ webhook de assinatura (RevenueCat — desligado)
```

### Decisões que valem destacar

- **O banco faz o trabalho, a tela recebe pronto.** Listas (categoria, busca, top 10) vêm de uma RPC `list_providers` que filtra, busca sem acento (função `fold_text`), ordena pela nota exibida e, no empate, pela distância ao condomínio (PostGIS), e devolve 20 por vez (~5 KB por página, 2–4 ms por categoria com 2.500 prestadores).
- **Contato comparado por dígitos no banco**, igual ao índice único: número com máscara não escapa da busca e o formulário mostra o prestador já cadastrado.
- **Um mesmo usuário síndico e prestador:** o síndico pode criar ou assumir o perfil de prestador que já existe com o telefone dele; ninguém avalia o próprio perfil (RLS + teste pgTAP).
- **Análise de performance com números** (`docs/performance.md`):
  - auth que desmontava o app a cada renovação de token;
  - push registrado a cada navegação;
  - fonte da marca que nunca tinha carregado (os arquivos eram uma página 404);
  - 24 fontes de ícone no pacote;
  - carga da base inteira a cada abertura.

  Assets de 5,5 MB → 1,7 MB.
- **Exclusão de conta real (LGPD):** Edge Function apaga dados pessoais e documentos; avaliações ficam anônimas por decisão de produto.
- **Cobrança pronta e desligada:** RevenueCat + webhook gravando `subscriptions`; o app é gratuito por enquanto (`EXPO_PUBLIC_BILLING_ENABLED=false`).

### Segurança

- RLS nas 12 tabelas; papel do perfil protegido por trigger (cliente não muda o próprio papel).
- `send-push` só aceita a chave de serviço.
- Painel admin usa service role só no servidor, depois de checar o admin.

### Testes por camada

| Camada | Cobertura |
| --- | --- |
| App (Jest + React Native Testing Library) | 654 testes, 99,2% das linhas: telas, fluxos de cadastro, hooks de lista/paginação, auth, push, guardas de bundle (imports de ícone/fonte e `fontWeight`) |
| Admin (Vitest) | 83 testes, 100% das linhas |
| Banco (pgTAP) | 36 testes: busca/ordem/paginação, contato por dígitos, publicação, exclusão de conta, perfil síndico+prestador |
| Visual | auditoria pelo navegador (react-native-web + Supabase local + Playwright) antes da 1.1.0 |

### Pontos fracos (honestos)

- **CI ainda sem execução:** o workflow existe (PR #12), mas só roda quando a cota do GitHub Actions voltar; até lá, os testes rodam na máquina.
- **Suíte do admin depende de Node 24** (no Node 20 alguns workers do Vitest não sobem); fixado em `.nvmrc`.
- `eas.json` tem uma chave RevenueCat `sk_` versionada no perfil `store` (trocar por `goog_` e revogar antes de ligar a cobrança).
- Sem backup automático do banco (sem PITR).
- Política de privacidade e página web de exclusão (exigidas pela Play Store) ainda não publicadas.

## 2.1 Conhecimento técnico e aprendizados (primeiro app mobile)

O Síndico Indica foi o **primeiro app mobile** do Raul. A tabela abaixo é o mapa do que foi usado, por quê, e o que ficou aprendido — base para a seção "O que aprendi" da página.

### Tecnologias, o papel de cada uma e o aprendizado

| Tecnologia | Papel no projeto | O que ficou aprendido |
| --- | --- | --- |
| **Expo SDK 57 + React Native 0.86** | App Android (iOS pronto para build) a partir de um código TypeScript | Expo muda a cada SDK: ler a doc da versão em uso antes de codar; instalar pacote com `expo install` (versão compatível com o SDK); `expo-doctor` como checagem de saúde. |
| **Expo Router** | Navegação por arquivos em `src/app/` | Todo arquivo em `src/app` vira tela — por isso testes e componentes ficam fora dela; layouts (`_layout`) e grupos de abas. |
| **CNG (Continuous Native Generation)** | Pastas `android/` e `ios/` geradas | Configuração nativa só em `app.json` e config plugins; biblioteca com código nativo exige *development build* (Expo Go não basta). |
| **EAS Build / Update** | Builds de APK (teste) e App Bundle (loja) na nuvem, versionCode automático | Perfis de build (`apk`, `store`…); mudança em módulo nativo exige build novo — atualização OTA não basta. |
| **Supabase (PostgreSQL)** | Banco, autenticação, storage, Edge Functions | Autorização no banco com **Row Level Security** em todas as tabelas; RPCs (`security invoker`, `revoke` de `anon`) para o app receber dados prontos; migrations versionadas e nunca editadas depois de aplicadas. |
| **PostGIS** | Distância do prestador até o condomínio | Colunas `geography` geradas a partir de lat/long; `st_distance` em km; ordenação por distância no banco. |
| **Edge Functions (Deno)** | `delete-account` (LGPD), `send-push`, `revenuecat-webhook` | Código de servidor separado do app; segredos em `supabase secrets`, nunca no app. |
| **Expo Notifications** | Push para o celular | Registro do token uma vez por usuário (um efeito mal amarrado registrava a cada troca de tela). |
| **RevenueCat** | Assinaturas nas lojas (pronto, desligado) | Chave **pública** (`goog_`) vai no app; chave **secreta** (`sk_`) nunca — e tudo com prefixo `EXPO_PUBLIC_` é copiado para dentro do app no build. |
| **Next.js 16 + React 19** | Painel admin de verificação | Service role só no servidor, depois de checar se é admin. |
| **Jest + React Native Testing Library** | 654 testes do app | `render`/`fireEvent` assíncronos; mocks com prefixo `mock`; testar o que o usuário vê; assets viram o mesmo stub no Jest (mockar com marcadores para provar qual fonte entrou). |
| **Vitest** | 83 testes do painel | Piso de cobertura de 90% no config. |
| **pgTAP** | 36 testes de banco | Testar regra de acesso onde ela vale (no banco), com transação desfeita no fim e dados próprios do teste. |
| **Playwright + react-native-web** | Auditoria visual e prints | Rodar o app no navegador contra o banco local para fotografar cada tela sem aparelho. |
| **GitHub Actions** | CI em três blocos (app, admin, banco) | Actions fixadas por SHA; checagem automática de chave secreta. |

### Performance — o que foi medido e o que mudou

| Problema (ID da análise) | Como foi achado | Efeito | Correção |
| --- | --- | --- | --- |
| Lista da categoria filtrada no aparelho | leitura do código + relato de travamento | páginas quase vazias e busca em sequência ao rolar | RPC `list_providers`: filtro, ordem e 20 por vez no banco (~5 KB por página, 2–4 ms) |
| `seedIfEmpty` a cada abertura | leitura do código | ~100 KB baixados (id e telefone de toda a base) a cada carga | removido |
| Busca e top 10 só nas páginas carregadas | teste com a base real | resultado errado, além de pesado | busca no banco sem acento, top 10 da base inteira |
| PRF-1: renovar o login desmontava o app | leitura dos efeitos de auth | perda de estado (formulário, rolagem) e recarga de tudo a cada ~1 h | tratar o tipo do evento de auth |
| PRF-2: push registrado a cada navegação | leitura dos efeitos | 3 chamadas de rede por troca de tela | callback em `useRef`, registro uma vez por usuário |
| PRF-3: fonte da marca nunca carregou | export do pacote + `file` nos `.ttf` | os arquivos eram uma página 404; o app usava a fonte do sistema | `@expo-google-fonts/dm-sans` por peso |
| PRF-4: 24 fontes de ícone no pacote | source map do export | +4,5 MB no app | import por conjunto (`@expo/vector-icons/Ionicons`) + teste-guarda |
| PRF-5: logo de 1254 px exibido a 184 dp | dimensão do PNG | 498 KB | 552 px (3×), 104 KB |
| PRF-6: aviso redesenhava todas as linhas | leitura do contexto | renders desnecessários em listas | contexto próprio para o toast; linhas memoizadas com callback estável |
| PRF-9: listas do IBGE sem cache | leitura do código | download a cada formulário | cache em memória |

**Resultado:** assets 5,5 MB → 1,7 MB; JS 4,87 MB → 4,54 MB; nenhuma recarga de conta por renovação de token; uma chamada de push por usuário.

### Aprendizados (para a seção "O que aprendi")

1. **Medir antes de otimizar.** As maiores perdas (fonte 404, 24 fontes de ícone, app desmontando) não apareciam em teste nenhum — só com o pacote exportado, o source map e a leitura dos efeitos.
2. **O banco faz o trabalho pesado.** Filtro, busca, ordenação e paginação no PostgreSQL deixam o app simples e rápido; lista global no aparelho dá resultado errado.
3. **Regras de acesso no banco, testadas no banco.** RLS em todas as tabelas e pgTAP para provar quem vê o quê.
4. **Efeitos e contexto no React importam para desempenho.** Callback novo a cada render, estado volátil no mesmo contexto e evento de auth sem tratamento custam rede, bateria e estado.
5. **Segredo não vai no app.** Variável `EXPO_PUBLIC_` é pública por definição; chave secreta fica em servidor, e chave que vazou no git precisa ser revogada.
6. **TDD com teste que falha pelo motivo certo.** Vários bugs de produção (cadastro de prestador que não criava o perfil, cartão de número conhecido que não aparecia) começaram com um teste de regressão.
7. **Ver o app de verdade.** A auditoria visual pelo navegador achou fontes misturadas, campos desalinhados e textos desatualizados que os testes não viam.
8. **Fluxo de entrega:** feature → PR → release com tag e CHANGELOG → build no EAS; mudança nativa pede build novo.

## 3. Roteiro — texto da página (pt)

```markdown
---
lang: pt
title: Síndico Indica
tagline: App onde síndicos recomendam e encontram prestadores de confiança
status: live            # [confirmar] live (APK de teste) ou wip até sair na Play Store
stack: [Expo, React Native, TypeScript, Supabase, PostgreSQL, PostGIS, Next.js, Jest, pgTAP, EAS]
icon: magnifier
order: 4
links:
  - { label: código, href: 'https://github.com/raul-gomes' }
cover: /projects/sindico-indica/00-logo.webp
gallery:   # ver seção 4
---

App para síndicos de condomínio encontrarem prestadores de serviço indicados por outros síndicos: busca por categoria, nota e distância do condomínio, avaliações com "contrataria de novo", contato direto por WhatsApp e um perfil próprio para o prestador cuidar da sua página.

## A história

[confirmar] Indicação de prestador entre síndicos já acontecia, mas espalhada em grupos de WhatsApp: a mesma pergunta voltava toda semana e a resposta se perdia no histórico. O Síndico Indica organiza essas indicações num app: a base começou com os contatos que os síndicos do DF já compartilhavam (2.261 prestadores, um por telefone) e cresce com cada recomendação e avaliação.

## O que o app faz

- **Busca:** por categoria ou texto (nome, empresa, especialidade, comentários), ordenada pela nota e, no empate, pelo mais perto do condomínio
- **Avaliação:** estrelas, comentário e "contrataria de novo"; o prestador responde
- **Recomendar:** cadastro de um prestador novo com estado e cidade do IBGE; se o telefone já existe, o app mostra o perfil
- **Favoritos** e top 10 dos mais bem avaliados
- **Perfil do prestador:** o prestador cria ou assume o próprio perfil, edita, responde comentários e pode sair do app
- **Conta:** cadastro de síndico (condomínio e mandato) ou de prestador, recuperação de senha, exclusão de conta
- **Painel admin:** verificação de síndicos e moderação

## Stack

| Camada | Tecnologia |
| --- | --- |
| App | Expo SDK 57, React Native 0.86, TypeScript, Expo Router |
| Banco e autenticação | Supabase: PostgreSQL + PostGIS, Auth, Storage, Edge Functions |
| Painel | Next.js 16, React 19 |
| Notificações e cobrança | Expo Notifications; RevenueCat (pronto, desligado) |
| Qualidade | Jest, React Native Testing Library, Vitest, pgTAP |
| Build | EAS Build (APK e App Bundle) |

## Decisões técnicas

O banco faz o trabalho pesado: a lista de cada categoria e a busca vêm de uma única função no PostgreSQL que filtra, busca sem acento, ordena pela nota e pela distância (PostGIS) e devolve 20 por vez — cerca de 5 KB por página, em poucos milissegundos. O app só desenha.

Uma análise de desempenho com números achou e corrigiu problemas que não apareciam nos testes: o app inteiro era desmontado a cada renovação do login, o registro de notificações rodava a cada troca de tela e o pacote carregava 24 fontes de ícone para usar uma. Os arquivos de imagem e fonte caíram de 5,5 MB para 1,7 MB.

## Segurança e LGPD

Row Level Security nas 12 tabelas, papel do usuário protegido no banco, exclusão de conta real (dados pessoais e documentos apagados; avaliações ficam anônimas) e funções do servidor que só aceitam a chave de serviço.

## Testes e qualidade

| Camada | O que está coberto |
| --- | --- |
| App (Jest) | **654 testes, 99,2% das linhas**: telas, cadastro, busca e paginação, login, notificações |
| Painel (Vitest) | **83 testes, 100% das linhas** |
| Banco (pgTAP) | **36 testes**: busca, ordem, paginação, regras de acesso e exclusão de conta |

Antes de cada versão, uma auditoria visual roda o app no navegador contra um banco local e fotografa cada tela; foi assim que apareceram fontes misturadas, campos desalinhados e textos desatualizados.

## Desempenho

Uma análise com números, feita depois da primeira versão, achou problemas que os testes não mostravam: a fonte da marca nunca tinha carregado (os arquivos eram uma página de erro), o pacote levava 24 fontes de ícone para usar uma, o app inteiro era desmontado a cada renovação do login e o registro de notificações rodava a cada troca de tela. Corrigido isso, os arquivos de imagem e fonte caíram de 5,5 MB para 1,7 MB, e a lista de cada categoria passou a vir do banco em páginas de 20, com cerca de 5 KB e poucos milissegundos.

## O que aprendi

Este foi o meu primeiro app mobile. Os aprendizados que mais pesaram:

- **Medir antes de otimizar:** as maiores perdas só apareceram exportando o pacote e lendo o source map.
- **Deixar o banco trabalhar:** filtro, busca, ordem e paginação no PostgreSQL deixam o app simples e o resultado correto.
- **Regras de acesso no banco, testadas no banco**, com Row Level Security e pgTAP.
- **Efeitos e contexto no React custam caro quando mal amarrados:** rede, bateria e estado perdido.
- **Segredo não vai no app:** tudo que é público no build fica dentro do pacote; chave secreta mora no servidor.
- **Teste de regressão primeiro:** cada bug de produção virou um teste antes da correção.
- **Ver o app de verdade:** uma auditoria visual pelo navegador achou o que os testes não viam.

## Próximos passos

- Publicação na Play Store (política de privacidade e página de exclusão de conta)
- Ligar a integração contínua (configurada; aguardando a cota do GitHub Actions)
- Ligar a assinatura quando a base de usuários justificar
```

## 4. Galeria planejada

Prints em `public/projects/sindico-indica/` (webp, **dados fictícios** do banco local; nenhum dado real de usuário):

| Arquivo | Tela | Legenda |
| --- | --- | --- |
| `00-logo.webp` | logo (552 px) | capa |
| `01-home.webp` | início com top 10 | Os mais bem avaliados, com nota e distância |
| `02-categoria.webp` | lista de uma categoria | Ordenada pela nota e, no empate, pela distância |
| `03-prestador.webp` | perfil do prestador | Avaliações, "contrataria de novo" e contato direto |
| `04-recomendar.webp` | recomendar com cartão de número conhecido | Telefone já cadastrado mostra o perfil existente |
| `05-avaliar.webp` | avaliar | Estrelas, comentário e "contrataria de novo" |
| `06-meu-perfil.webp` | perfil do prestador (dono) | O prestador cuida da própria página |

Captura: mesmo método da auditoria (Expo web + Supabase local + Playwright, 390×844 @2x), convertida para webp.

## 5. Para o Raul confirmar

1. **História:** de onde veio a ideia e quem é o cliente/usuário inicial (o texto acima é uma hipótese a partir da base importada de grupos de síndicos).
2. **Status:** `live` (APK de teste em uso) ou `wip` até a Play Store.
3. **Link do código:** o repo `app_amarelhinhas` é público? Se não, o link aponta para o perfil.
4. Pode citar o número da base (2.261 prestadores)?
