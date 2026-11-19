---
lang: en
title: Databricks Data Pipeline
tagline: Medallion architecture with PySpark and Delta Lake, from API to dashboard
status: live
stack: [Databricks, PySpark, Delta Lake, Unity Catalog, Databricks SQL, Python, pytest]
icon: matrix
order: 5
cv:
  goal: "Take raw data from a REST API to analytical tables and dashboard views, in a medallion architecture on Databricks."
  highlights:
    - "Immutable bronze with load metadata, silver normalized with an explicit schema, and gold with metrics and rankings via window functions."
    - "Idempotent loads per partition and 7 tests that run the real notebooks on local Spark with Delta Lake."
links:
  - { label: code, href: 'https://github.com/raul-gomes/pokemon_databricks' }
cover: /projects/pipeline-dados-databricks/00-icon.svg
gallery:
  - { src: /projects/pipeline-dados-databricks/01-fluxo-e-tabelas.svg, caption: 'Flow from the API to the dashboard and the structure of the bronze, silver and gold tables' }
---

End-to-end data pipeline on Databricks, in a medallion architecture: data comes from a public REST API (PokeAPI), is stored raw, normalized into relational tables and turned into metrics, rankings and views that feed a dashboard.

## The goal

To practice, with a real and well-known data source, the flow used in everyday data engineering: ingestion that keeps the source's fidelity, cleaning with an explicit schema, an analytical layer ready to query, and orchestration of the steps. PokeAPI was chosen because its JSON is nested (types and stats come as lists), which forces real normalization.

## Architecture

Everything lives in Unity Catalog, in the `pokemons` catalog, with one schema per layer and Delta Lake tables.

| Layer | What it does | Tables |
| --- | --- | --- |
| Bronze | Stores the API JSON as text, untransformed, with load metadata (`ingestion_ts`, `ingestion_date`, `api_status_code`, `source_system`), partitioned by date | `pokemons_raw` |
| Silver | Reads the day's partition, applies `from_json` with an explicit schema and normalizes the lists with `explode` | `pokemon`, `types`, `pokemon_stats` |
| Gold | Joins the three tables, pivots the stats, computes total power and builds rankings | `pokemon_overview`, `type_power_ranking`, `pokemon_tier_list` |
| SQL | Dashboard views in Databricks SQL | 4 views (top ranking, comparison by type, attack × defense, summary) |

## Decisions worth highlighting

- **Bronze true to the source:** the response body is saved as a `STRING`, along with the HTTP status. If the silver schema changes, bronze allows reprocessing without calling the API again.
- **Explicit schema in silver:** the JSON is read with a declared `StructType` instead of inference, so a new or missing API field cannot silently break the tables.
- **Parameterized notebooks:** widgets set the number of records and the processing date, and each step reads only that date's partition.
- **Safe reprocessing:** bronze and silver write with `replaceWhere` on the date partition. Rerunning the same day replaces that load, without duplicating rows or deleting other days.
- **Metrics in gold:** `total_power` adds up the six base stats; window functions (`row_number`, `ntile`) build the overall ranking and the quartile tier list; an aggregate by primary type compares average attack, defense, HP and speed.
- **Orchestration:** a Databricks Job chains the three tasks, bronze → silver → gold.

## Numbers

- 3 notebooks (26 cells, about 280 lines of PySpark) and 1 SQL script with 4 views.
- 7 Delta tables in 3 schemas.
- 7 automated tests (pytest).
- Last load: 151 Pokémon, 218 type rows and 906 stat rows.

## Tests

The tests run the three notebooks exactly as they are in the repository, on a local Spark session with Delta Lake. Only what exists solely on Databricks is simulated: the widgets, `display`, the Unity Catalog name and PokeAPI, which answers with fixed data so the tests never depend on the network.

There are 7 tests, covering a network failure during ingestion, the idempotent load, reprocessing a day in silver, the unit conversion, the tier list with all four tiers and gold reading only the processed date.

## Challenges and lessons

Normalizing the nested JSON was the core of the work: types and stats arrive as lists of objects, and each becomes its own silver table, with one row per item. In gold, the opposite path: pivoting the stats brings back one row per Pokémon to compute the metrics.

The second version came from a code review. The tests exposed problems the notebooks hid when running in the workspace: tier B never appeared, a network failure recorded the previous request's status, running the same day twice duplicated bronze, and silver deleted earlier days when reprocessing. A unit error also showed up, because the API returns height in decimetres and weight in hectograms. Every fix came with a test that failed before it.
