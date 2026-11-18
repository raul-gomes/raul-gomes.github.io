---
lang: pt
title: Placo
tagline: Gestão financeira para quem tem CPF e CNPJ
status: wip
stack: [FastAPI, Python, PostgreSQL, SQLAlchemy, React, TypeScript, Vite, Supabase Auth, Docker Compose, GitHub Actions]
icon: tetris
order: 2
links:
  - { label: código, href: 'https://github.com/raul-gomes' }
cover: /projects/placo/00-logo.webp
gallery:
  - { src: /projects/placo/06-visao-geral-desktop.webp, caption: Visão geral do mês com entradas, saídas, saldo e limites }
  - { src: /projects/placo/07-financeiro-desktop.webp, caption: Rendimento anual com entradas, saídas e investimentos }
  - { src: /projects/placo/09-recorrentes-desktop.webp, caption: Contas recorrentes com filtro Ambos, PF e PJ }
  - { src: /projects/placo/08-limites-desktop.webp, caption: Categorias e subcategorias com limites por natureza }
  - { src: /projects/placo/01-inicio-celular.webp, caption: No celular, o saldo do mês e o que está perto do limite }
  - { src: /projects/placo/02-financeiro-celular.webp, caption: Formas de pagamento e os últimos seis meses }
  - { src: /projects/placo/04-limites-celular.webp, caption: Limite mensal, cartão e gasto por categoria }
  - { src: /projects/placo/05-novo-lancamento-celular.webp, caption: Novo lançamento em uma folha só }
---

Plataforma de gestão financeira para quem vive com duas contas: a pessoal (PF) e a da empresa (PJ). Os lançamentos, as categorias, os limites de gasto, as contas recorrentes e as metas ficam separados por natureza, e o dashboard mostra cada lado ou os dois juntos.

## A história

Quem tem CNPJ costuma misturar o dinheiro da empresa com o de casa. As planilhas e os apps de finanças pessoais tratam tudo como uma conta só, e os sistemas de gestão empresarial são pesados demais para um profissional autônomo. O resultado é não saber quanto a empresa realmente sobra e quanto a casa realmente gasta.

O Placo nasceu para resolver isso: cada lançamento tem natureza PF ou PJ, as categorias e os limites são definidos por natureza, e a visão consolidada continua a um clique. Hoje o produto está em uso pessoal, que é a fase em que as regras de negócio são validadas com dados reais antes de abrir para outras pessoas.

## O que a plataforma faz

- **Visão geral do mês:** entradas, saídas e saldo, com o acumulado até hoje. Saídas somam despesas e investimentos; os investimentos têm categoria própria para não se misturar com as despesas.
- **Gráficos:** fontes de renda, gastos por categoria, evolução no ano e gasto versus limite.
- **Categorias e subcategorias com limites:** limite de gasto por categoria, alerta em 80%, 90% e 100% por e-mail e no sino.
- **Contas recorrentes:** parcelas geradas automaticamente; mudar o valor ou o dia de vencimento atualiza as parcelas do mês atual em diante, sem reescrever o passado.
- **Metas de médio prazo** e **lista de compras**.
- **Importação e exportação:** CSV, OFX e QFX, com proteção contra lançamento duplicado.
- **Desktop e celular:** layout próprio para cada tamanho de tela.

## Arquitetura

Backend em **FastAPI assíncrono** com camadas bem separadas: a rota só cuida de HTTP, o serviço aplica a regra de negócio e a autorização, e o repositório só faz SQL filtrado pelo usuário. Cada requisição tem **um único commit** (unit of work), e efeitos colaterais como a avaliação de limites só rodam depois dele.

A API entrega a tela pronta: **totais e gráficos são agregados no PostgreSQL**, não no navegador. Isso derrubou a visão geral de 13 para 7 consultas, e cada número é conferido por teste de paridade.

O frontend é **React + TypeScript + Vite**, com react-query para cache e Zod validando toda resposta da API na entrada. Um orçamento de bundle no CI impede que qualquer pedaço do JavaScript passe de 64 kB gzip; o chunk principal caiu de 177 kB para 35 kB gzip.

Tudo roda em **Docker Compose** (PostgreSQL, API, frontend e nginx), com migrations versionadas em Alembic.

## Segurança

- Login pelo **Supabase Auth**; o backend confere assinatura, validade, audiência e emissor do token, e o algoritmo nunca é escolhido pelo token.
- O papel de cada pessoa é decidido no servidor, nunca enviado pelo cliente; todo SQL é filtrado pelo usuário autenticado.
- Erros de domínio viram mensagens fixas em pt-BR: nenhum detalhe interno, SQL ou dado de outro usuário chega à tela.
- A chave da integração bancária é **cifrada em repouso** com rotação de chaves, e o app se recusa a subir sem a chave de cifra.
- O CI roda **bandit, pip-audit e GitGuardian** a cada PR.

## Testes e qualidade

- **583 testes no backend** (mais 7 em PostgreSQL real no CI) e **426 no frontend**, todos verdes, com relógio congelado para não depender da data.
- Cobertura medida: **85% no backend** (serviços 88%, repositórios 84%) e **76% no frontend** (regras puras 99,6%, páginas 67%).
- **Validação ponta a ponta de PF e PJ:** cada número da API foi conferido contra consultas SQL independentes em 8 meses de dados, e 90 fluxos de cadastro foram exercitados no desktop e no celular, sem divergência nem erro de console.
- Lint, formatação e typecheck zerados; CI com testes de backend e frontend, `alembic check` e orçamento de bundle.

## Desafios e aprendizados

O projeto passou por uma auditoria completa: em dois dias, os testes de backend foram de 238 (4 falhando por depender da data atual) para 563, os de frontend de 118 para 424, e 785 avisos de lint foram a zero. A lição foi que o código "funcionando" escondia regras inconsistentes, como a saída que somava investimentos numa tela e não em outra. A validação ponta a ponta, número a número contra o banco, foi o que revelou e corrigiu essas diferenças.

## Próximos passos

- Refazer a integração com Open Finance (Pluggy), hoje desligada.
- Construir a tela de investimentos.
- Piso de cobertura no CI e mais testes em PostgreSQL real.
- Deploy contínuo e backup agendado com teste de restauração.
- Abrir o produto para outros usuários.
