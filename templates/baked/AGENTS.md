# AGENTS.md

A scrollytelling site built on `@the-vcsi/scrolly-kit` (SvelteKit + Svelte 5). The **baked** template is static, prerendered at build time (`adapter-static`).

## Creating a story — scaffold first

When asked to create or start a new story, your FIRST action is `npm run new-story <slug>`. Do **not** survey the project or search for data files (`find … *.csv`, `~/data`, the repo root) first — the story's `data/` folder doesn't exist until you scaffold. So: scaffold → ask about the layout/shape → drop the dataset into the new `src/lib/stories/{slug}/data/` → build iteratively.

## Keep the user in the loop

Story work is a conversation, not a delivery. Before building, make sure you know (ask if the brief doesn't say):

- **Data** — do they already have it, or should it be fetched from somewhere? Fetching should be auditable (see the scrolly-kit MCP's `getting-data` section): prefer a small loader script named after its output; a provenance note in a README is the fallback when scripting isn't possible.
- **Scope** — how many sections and steps? One scrolly section is a fine first deliverable.
- **Direction** — what is the narrative arc? Don't invent claims the user didn't make.

Then build the **smallest reviewable slice** (one working section), show it, and check in before expanding. Never grow scope unasked.

You have access to two MCP servers (configured by `@the-vcsi/scrolly-skills`):

### scrolly-kit MCP (`@the-vcsi/scrolly-mcp`)

Docs for scrolly-kit components, layouts, and story patterns. Call `list-sections` FIRST to discover sections, then `get-documentation` to fetch every section relevant to the task.

### Svelte MCP

Svelte 5 runes and SvelteKit docs. Run `svelte-autofixer` on any Svelte code you write, repeatedly, until it reports no issues.

## Conventions

- Stories live in `src/lib/stories/{slug}/`: `components/Index.svelte` + `data/copy.json` (datasets go in `data/` too).
- Run `npm run check` before considering work done.
- Static build: guard browser-only code (`window`/`document`/WebGL, e.g. DuckDB) with `{#if browser}`, and never set `export const ssr = false` globally (it breaks prerendered remote functions).
