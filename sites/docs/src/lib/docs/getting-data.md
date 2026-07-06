# Getting Data

Every number in a story should be traceable. The principle: anyone reading the repo should be able to answer **where the data came from, when, and how it was transformed**. How you satisfy that depends on how you get the data, and there are more ways than one.

Everything data-related lives in the story's own folder, `src/lib/stories/{slug}/data/`, next to `copy.json` (see [Project Structure](project-structure)).

## The Ways People Get Data

| How you got it | What auditability looks like |
|---|---|
| A file you already have (experiment output, a collaborator's file) | A provenance note: source, date, version or DOI |
| A manual download that can't be scripted (gated portals, logins) | Same: document what a script can't reproduce |
| A scripted fetch (API, public URL) | A **loader**: a rerunnable script committed next to its output |
| Generated data (simulation, model) | The generating script plus its seed |
| A synced source | An add-on: [openalex](extensions/openalex) builds a local database, [msgraph](extensions/msgraph) pulls content from SharePoint |
| Fetched at runtime | The fetching code itself: client-side `fetch` for small public data, or a remote function in the `fresh` template |

The mechanisms differ in strength: a rerunnable script beats a written note, and a written note beats nothing. Use the strongest one your situation allows.

## Provenance Notes

For data no script can reproduce, write down what you did. A few lines in the story's `data/README.md` (or a comment block) is enough:

```
measurements.csv — downloaded 2026-07-06 from [portal name], dataset v2.1,
filtered to 2010-2020 in the portal's export UI. DOI: 10.xxxx/xxxxx
```

## Loaders

When the fetch *can* be scripted, our recommended convention comes from [Observable's data loaders](https://observablehq.com/framework/data-loaders): a loader is **named after its output**. `measurements.csv.sh` is the script that produces `measurements.csv`. Reading the folder tells you what made what.

One difference from Observable: their loaders run automatically at build time; here they are a convention you run by hand, and the output is committed next to the loader. Static builds need no network, anyone can rerun the loader to verify or refresh, and the git history shows when the data changed.

The simplest loader shows the source in one line:

```bash
# data/measurements.csv.sh
curl -s "https://example.org/api/measurements?from=2010" > measurements.csv
```

When the raw data needs reshaping, any language works; the convention is what matters. For Python we like [uv](https://docs.astral.sh/uv/) with dependencies declared inside the script (nothing to install but uv; run with `uv run measurements.json.py`):

```python
# /// script
# dependencies = ["polars", "requests"]
# ///
# data/measurements.json.py — fetch, keep the fields the story uses
```

A shell script driving [DuckDB](https://duckdb.org/) covers the case where the wrangling is one SQL query. An R script or a notebook works too, as long as it sits in `data/` and its name says what it produces.

## Runtime Data

Some data cannot be baked in: too large, too fresh, or queried per reader. Two options, in the usual start-simple order:

- **Client-side `fetch`** of a small public API works in any template, including static ones; the data arrives in the reader's browser.
- **Remote functions** (`data.remote.js` in the story folder) run on the server, for API keys, databases, or heavy queries. That is [`fresh`](getting-started) territory, and pairs with the database add-ons.

The auditability rule holds either way: the fetching code *is* the provenance, it just runs at request time instead of ahead of it.

## When the Pipeline Outgrows the Website

A story's `data/` folder is for story-scale pipelines: a loader, a wrangling script, maybe a notebook. If it starts accumulating many sources, scheduled jobs, models, or heavy dependencies, that is the signal to extract it. Give the pipeline its own project (for example a `backend/` built with [FastAPI](https://fastapi.tiangolo.com/), or a standalone pipeline repository) with its own environment and tests, and let the website go back to being a website.

The frontend then consumes your backend like any other source, at whichever level fits: a loader that curls your own API and commits the export, or a remote function that queries it at request time. Nothing about the auditability rule changes; the loader or remote function still shows exactly where the data comes from, it just points at a service you own.
