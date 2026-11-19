---
lang: pt
title: Pipeline de Dados com Databricks
tagline: Arquitetura medalhão com PySpark e Delta Lake, da API ao dashboard
status: live
stack: [Databricks, PySpark, Delta Lake, Unity Catalog, Databricks SQL, Python, pytest]
icon: matrix
order: 5
cv:
  goal: "Levar dados brutos de uma API REST até tabelas analíticas e views de dashboard, em arquitetura medalhão no Databricks."
  highlights:
    - "Bronze imutável com metadados de carga, silver normalizada com schema explícito e gold com métricas e rankings via window functions."
    - "Cargas idempotentes por partição e 7 testes que rodam os notebooks reais em Spark local com Delta Lake."
links:
  - { label: código, href: 'https://github.com/raul-gomes/pokemon_databricks' }
cover: /projects/pipeline-dados-databricks/00-icon.svg
gallery:
  - { src: /projects/pipeline-dados-databricks/01-fluxo-e-tabelas.svg, caption: 'Fluxo da API ao dashboard e a estrutura das tabelas bronze, silver e gold' }
---

Pipeline de dados de ponta a ponta no Databricks, em arquitetura medalhão: os dados saem de uma API REST pública (PokeAPI), são guardados crus, normalizados em tabelas relacionais e transformados em métricas, rankings e views que alimentam um dashboard.

## O objetivo

Praticar, com uma fonte de dados real e conhecida, o fluxo que se usa em engenharia de dados no dia a dia: ingestão sem perder a fidelidade da fonte, limpeza com schema explícito, camada analítica pronta para consulta e orquestração das etapas. A PokeAPI foi escolhida porque o JSON dela é aninhado (tipos e stats em listas), o que obriga a normalizar de verdade.

## Arquitetura

Tudo fica no Unity Catalog, no catálogo `pokemons`, com um schema por camada e tabelas em Delta Lake.

| Camada | O que faz | Tabelas |
| --- | --- | --- |
| Bronze | Guarda o JSON da API como texto, sem transformar, com metadados de carga (`ingestion_ts`, `ingestion_date`, `api_status_code`, `source_system`), particionado por data | `pokemons_raw` |
| Silver | Lê a partição do dia, aplica `from_json` com schema explícito e normaliza as listas com `explode` | `pokemon`, `types`, `pokemon_stats` |
| Gold | Junta as três tabelas, faz o pivot dos stats, calcula o poder total e gera rankings | `pokemon_overview`, `type_power_ranking`, `pokemon_tier_list` |
| SQL | Views para o dashboard no Databricks SQL | 4 views (top ranking, comparação por tipo, ataque × defesa, resumo) |

## Decisões que valem destacar

- **Bronze fiel à fonte:** o corpo da resposta é salvo como `STRING`, junto com o status HTTP. Se o schema da silver mudar, a bronze permite reprocessar sem chamar a API de novo.
- **Schema explícito na silver:** o JSON é lido com um `StructType` declarado, e não com inferência, para que um campo novo ou ausente na API não quebre as tabelas sem aviso.
- **Notebooks parametrizados:** widgets definem a quantidade de registros e a data de processamento, e cada etapa lê só a partição daquela data.
- **Reprocessamento seguro:** bronze e silver gravam com `replaceWhere` na partição da data. Rodar o mesmo dia de novo substitui aquela carga, sem duplicar linhas nem apagar os outros dias.
- **Métricas na gold:** o `total_power` soma os seis stats base; window functions (`row_number`, `ntile`) geram o ranking geral e o tier list por quartil; um agregado por tipo primário compara as médias de ataque, defesa, HP e velocidade.
- **Orquestração:** um Job do Databricks encadeia as três tarefas, bronze → silver → gold.

## Números

- 3 notebooks (26 células, cerca de 280 linhas de PySpark) e 1 script SQL com 4 views.
- 7 tabelas Delta em 3 schemas.
- 7 testes automatizados (pytest).
- Última carga: 151 Pokémon, 218 linhas de tipo e 906 de stats.

## Testes

Os testes rodam os três notebooks exatamente como estão no repositório, numa sessão local de Spark com Delta Lake. Só o que existe apenas no Databricks é simulado: os widgets, o `display`, o catálogo do Unity Catalog e a PokeAPI, que responde com dados fixos para o teste não depender da rede.

São 7 testes, cobrindo a falha de rede na ingestão, a carga idempotente, o reprocessamento de um dia na silver, a conversão de unidades, o tier list com os quatro tiers e a gold lendo só a data processada.

## Desafios e aprendizados

Normalizar o JSON aninhado foi a parte central: os tipos e os stats chegam como listas de objetos, e cada um vira uma tabela própria na silver, com uma linha por item. Na gold, o caminho inverso: o pivot dos stats volta a ter uma linha por Pokémon para o cálculo das métricas.

A segunda versão veio de uma revisão do código. Os testes mostraram problemas que os notebooks escondiam ao rodar no workspace: o tier B nunca aparecia, uma falha de rede gravava o status da requisição anterior, rodar duas vezes o mesmo dia duplicava a bronze e a silver apagava os dias anteriores ao reprocessar. Também apareceu um erro de unidade, porque a API devolve altura em decímetros e peso em hectogramas. Cada correção entrou com um teste que falhava antes.
