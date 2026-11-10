---
lang: pt
title: Nação Patina
tagline: Rede social gratuita que ensina patinação para todas as idades
status: live
stack: [Next.js 16, React 19, TypeScript, Supabase, PostgreSQL, Cloudflare R2, Tailwind CSS, Vitest, pgTAP, Docker]
icon: mushroom
order: 3
links:
  - { label: site, href: 'https://nacaopatina.vercel.app' }
  - { label: código, href: 'https://github.com/raul-gomes' }
cover: /projects/nacao-patina/00-logo.webp
gallery:
  - { src: /projects/nacao-patina/02-feed.webp, caption: Feed com avisos do professor e agenda do mês }
  - { src: /projects/nacao-patina/10-chat.webp, caption: Chat flutuante em tempo real aberto pelo perfil }
  - { src: /projects/nacao-patina/05-comunidade.webp, caption: Comunidade com mural e membros }
  - { src: /projects/nacao-patina/06-agenda.webp, caption: Agenda de aulas e rolês com confirmação de presença }
  - { src: /projects/nacao-patina/07-desapego.webp, caption: Nação Desapego, os classificados entre membros }
  - { src: /projects/nacao-patina/11-gerenciar.webp, caption: Professor concede e remove moderadores }
  - { src: /projects/nacao-patina/08-aulas.webp, caption: Videoaulas do YouTube organizadas em playlists pelo professor }
---

Rede social gratuita de uma comunidade de patinação, feita para ensinar pessoas de todas as idades a andar de patins: feed com avisos do professor, comunidades, agenda de aulas e rolês, videoaulas, classificados entre membros, chat em tempo real e notificações.

## A história

Meu cliente, professor de patinação, queria fazer o projeto dele crescer, mas a comunidade inteira vivia dentro do WhatsApp. Aviso de aula, confirmação de presença, venda de patins usados, dúvidas de aluno: tudo passava por ele, e isso consumia o tempo que ele deveria usar para pensar no crescimento do projeto.

A solução foi tirar a comunidade do WhatsApp e dar a ela uma casa própria: uma rede social onde o professor publica um aviso uma vez e todos recebem, os alunos confirmam presença sozinhos, o equipamento usado troca de mãos sem intermediário e as conversas acontecem num chat integrado. O professor ganha tempo para a estratégia; a comunidade ganha um lugar organizado. O projeto é gratuito para os alunos.

## O que a plataforma faz

- **Feed e mural:** postagens com até 5 fotos, menções, curtidas e comentários; abas Mural, Feed e Eventos com contador de novidades; recados públicos no perfil de cada membro, com respostas em fórum
- **Avisos do professor:** normais ou urgentes, fixados no topo do feed
- **Comunidades:** grupos com mural próprio, visível só para quem participa
- **Agenda:** aulas e rolês com vagas, confirmação de presença e calendário mensal
- **Videoaulas:** playlists do YouTube organizadas pelo professor
- **Nação Desapego:** classificados de equipamento com contato direto pelo chat
- **Chat e notificações:** conversa 1:1 flutuante em todas as páginas, com contador de não lidas
- **Três papéis:** aluno, moderador e professor; o professor escolhe os moderadores

## Stack

| Camada | Tecnologia |
| --- | --- |
| Front-end | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript |
| Interface | Tailwind CSS v4, shadcn/ui, design system próprio (`Patina*`) |
| Banco e autenticação | Supabase: PostgreSQL, Auth, Realtime e Storage |
| Imagens | Cloudflare R2 (S3) e sharp |
| Qualidade | Vitest, React Testing Library, pgTAP, ESLint, TypeScript estrito |
| Infra | Docker Compose no desenvolvimento, Vercel no front, migrations versionadas com Supabase CLI |

## Arquitetura

Monólito modular: 9 módulos de domínio (identidade, feed, avisos, aulas, agenda, comunidades, classificados, mensagens, notificações). Cada módulo entrega no mesmo PR a migration com as regras de acesso no banco e as telas, e só é importado pela sua API pública. As fronteiras ficam claras sem o custo de microsserviços.

As páginas renderizam os primeiros dados no servidor e só usam JavaScript no navegador onde há interação. Contagens de curtidas, comentários e presenças são calculadas no banco numa consulta só, sem N+1. O resultado foi **49% menos JavaScript por página** e páginas com cerca de 780 KB no total, contra 2 MB antes.

## Segurança no banco

A autorização mora no PostgreSQL, não na tela: **Row Level Security em todas as 25 tabelas, com 80 políticas**, 49 funções e 41 triggers. O papel de cada pessoa não pode ser alterado pelo cliente (um trigger bloqueia) e só o professor concede moderador. Uma auditoria própria corrigiu enumeração de e-mails, spam de notificações e o plano de execução das políticas.

## Imagens: compressão e segurança

Toda foto passa por um pipeline próprio antes de ser publicada:

1. O navegador confere tipo e tamanho e envia o arquivo **direto para um bucket privado** do Cloudflare R2, por uma URL assinada que vale 120 segundos. O arquivo não passa pelo servidor da aplicação.
2. O servidor baixa, **decodifica e reencoda** com sharp: aceita JPEG, PNG e WebP; recusa SVG, animações e imagens acima de 40 megapixels; aplica a orientação e **remove EXIF e GPS**.
3. A foto vira **WebP com qualidade 80 e lado maior de até 1600 px**, sem ampliar imagens pequenas. O avatar vira um WebP de 256×256 com recorte central, e a qualidade cai em degraus até o arquivo caber em 200 KB.
4. A imagem final ganha uma chave nova num bucket privado e é entregue por **URL assinada**, gerada só para quem tem permissão de ver o post. O original nunca é guardado.

Uma fila de limpeza com cron diário apaga as fotos trocadas ou de posts excluídos. Limites por pessoa (uploads por hora e cota de 500 MB) são aplicados de forma atômica no banco.

## Tempo real com websockets

O chat usa o **Supabase Realtime**, que entrega as mensagens novas por websocket assim que elas são gravadas no PostgreSQL. Para não manter uma conexão aberta por usuário o tempo todo, o websocket é **sob demanda**: abre quando a pessoa envia uma mensagem ou deixa uma conversa aberta na tela, renova a cada mensagem e fecha depois de 5 minutos sem atividade. O cliente de tempo real só é baixado nesse momento. O contador de não lidas usa polling leve (troca de página, foco na aba e a cada 60 segundos com a aba visível). A experiência continua instantânea com uma fração das conexões.

## Testes e cobertura

| Camada | O que está coberto |
| --- | --- |
| Front-end (Vitest) | **1.021 testes, 99,2% das linhas** (95,8% dos branches). Telas testadas com React Testing Library, Server Actions e serviços com um Supabase simulado, hooks de tempo real com relógio falso, cada página verificada por papel (aluno, moderador, professor). O CI falha se a cobertura cair abaixo de 90%. |
| Banco (pgTAP) | **139 testes em 13 suítes**: regras de acesso de cada papel, privacidade do mural e dos membros, conversas, notificações, contagens e mídia (posse, limites e cota). |
| Estático | ESLint e TypeScript sem erros; o build falha com erro de tipo. |

As regras de acesso são testadas onde valem de verdade, no banco, e a interface é testada do ponto de vista de quem usa: o que cada papel vê, o que cada formulário envia e qual mensagem aparece quando algo dá errado.

## Próximos passos

- Gamificação (pontos e conquistas)
