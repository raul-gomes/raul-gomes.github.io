---
lang: pt
title: Síndico Indica
tagline: App onde síndicos recomendam e encontram prestadores de confiança
status: wip
stack: [Expo, React Native, TypeScript, Supabase, PostgreSQL, PostGIS, Next.js, Jest, pgTAP, EAS]
icon: magnifier
order: 4
links:
  - { label: código, href: 'https://github.com/raul-gomes' }
  # Reservado: descomentar quando o app estiver publicado na Play Store.
  # - { label: Play Store, href: 'https://play.google.com/store/apps/details?id=com.sindicoindica.myapp' }
cover: /projects/sindico-indica/00-logo.webp
gallery:
  - { src: /projects/sindico-indica/01-home.webp, caption: Início com os prestadores mais bem avaliados, nota e distância }
  - { src: /projects/sindico-indica/02-categoria.webp, caption: Categoria ordenada pela nota e, no empate, pela distância do condomínio }
  - { src: /projects/sindico-indica/03-prestador.webp, caption: Perfil do prestador com avaliações e contato direto }
  - { src: /projects/sindico-indica/04-recomendar.webp, caption: Ao recomendar, um telefone já cadastrado mostra o perfil existente }
  - { src: /projects/sindico-indica/05-avaliar.webp, caption: Avaliação com estrelas, comentário e "contrataria de novo" }
  - { src: /projects/sindico-indica/06-meu-perfil.webp, caption: O prestador cuida da própria página }
---

App para síndicos de condomínio encontrarem prestadores de serviço indicados por outros síndicos: busca por categoria, nota e distância do condomínio, avaliações com "contrataria de novo", contato direto por WhatsApp e um perfil próprio para o prestador cuidar da sua página.

Foi o meu primeiro app mobile.

## O contexto

Síndicos indicam prestadores uns aos outros o tempo todo, mas essas indicações ficavam espalhadas em grupos de conversa. O Síndico Indica organiza isso num app: a base começou com os contatos que síndicos do DF já trocavam, normalizados para um cadastro por telefone (mais de 2.200 prestadores), e cresce com cada recomendação e avaliação.

## O que o app faz

- **Busca:** por categoria ou por texto (nome, empresa, especialidade e comentários), ordenada pela nota e, no empate, pelo prestador mais perto do condomínio
- **Avaliação:** estrelas, comentário e "contrataria de novo"; o prestador responde
- **Recomendar:** cadastro de um prestador novo com estado e cidade do IBGE; se o telefone já existe, o app mostra o perfil
- **Favoritos** e top 10 dos mais bem avaliados
- **Perfil do prestador:** o prestador cria ou assume o próprio perfil, edita, responde comentários e pode sair do app
- **Conta:** cadastro de síndico (condomínio e mandato) ou de prestador, recuperação de senha e exclusão de conta
- **Painel admin:** verificação de síndicos e moderação

## Stack

| Camada | Tecnologia |
| --- | --- |
| App | Expo SDK 57, React Native 0.86, TypeScript, Expo Router |
| Banco e autenticação | Supabase: PostgreSQL + PostGIS, Auth, Storage, Edge Functions |
| Painel | Next.js 16, React 19 |
| Notificações e cobrança | Expo Notifications; RevenueCat (pronto, desligado) |
| Qualidade | Jest, React Native Testing Library, Vitest, pgTAP, GitHub Actions |
| Build | EAS Build (APK e App Bundle) |

## Decisões técnicas

O banco faz o trabalho pesado. A lista de cada categoria e a busca vêm de uma única função no PostgreSQL que filtra, busca sem acento, ordena pela nota e pela distância até o condomínio (PostGIS) e devolve 20 por vez: cerca de 5 KB por página, em poucos milissegundos. O app só desenha.

O telefone é comparado pelos dígitos dentro do banco, com a mesma regra do índice único: um número salvo com máscara não escapa da busca, e quem recomenda vê na hora o prestador que já existe.

Uma mesma conta pode ser síndico e prestador: o síndico cria ou assume o perfil de prestador que já existe com o telefone dele, e o banco impede que alguém avalie o próprio perfil.

## Desempenho

Uma análise com números, feita depois da primeira versão, achou problemas que os testes não mostravam: a fonte da marca nunca tinha carregado (os arquivos eram uma página de erro), o pacote levava 24 fontes de ícone para usar uma, o app inteiro era desmontado a cada renovação do login e o registro de notificações rodava a cada troca de tela. Corrigido isso, os arquivos de imagem e fonte caíram de **5,5 MB para 1,7 MB**, e a lista de cada categoria passou a vir do banco em páginas de 20.

## Segurança e LGPD

Row Level Security em todas as 12 tabelas, papel do usuário protegido no banco, exclusão de conta real (dados pessoais e documentos apagados; avaliações ficam anônimas) e funções do servidor que só aceitam a chave de serviço. Chaves secretas ficam fora do app e do repositório, e a integração contínua barra qualquer uma que apareça no código.

## Testes e qualidade

| Camada | O que está coberto |
| --- | --- |
| App (Jest) | **654 testes, 99,2% das linhas**: telas, cadastro, busca e paginação, login e notificações |
| Painel (Vitest) | **83 testes, 100% das linhas** |
| Banco (pgTAP) | **36 testes**: busca, ordem, paginação, regras de acesso e exclusão de conta |

Antes de cada versão, uma auditoria visual roda o app no navegador contra um banco local e fotografa cada tela. Foi assim que apareceram fontes misturadas, campos desalinhados e textos desatualizados.

## O que aprendi

- **Medir antes de otimizar:** as maiores perdas só apareceram exportando o pacote e lendo o source map.
- **Deixar o banco trabalhar:** filtro, busca, ordem e paginação no PostgreSQL deixam o app simples e o resultado correto.
- **Regras de acesso no banco, testadas no banco**, com Row Level Security e pgTAP.
- **Efeitos e contexto no React custam caro quando mal amarrados:** rede, bateria e estado perdido.
- **Segredo não vai no app:** tudo que é público no build fica dentro do pacote; chave secreta mora no servidor.
- **Teste de regressão primeiro:** cada bug de produção virou um teste antes da correção.
- **Ver o app de verdade:** uma auditoria visual pelo navegador achou o que os testes não viam.

## Próximos passos

- Publicação na Play Store (política de privacidade e página de exclusão de conta)
- Ligar a assinatura quando a base de usuários justificar
