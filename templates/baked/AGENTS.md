# AGENTS.md

A scrollytelling site built on `@the-vcsi/scrolly-kit` (SvelteKit + Svelte 5). The **baked** template is static, prerendered at build time (`adapter-static`).

You have access to two MCP servers (configured by `@the-vcsi/scrolly-skills`):

### scrolly-kit MCP (`@the-vcsi/scrolly-mcp`)

Docs for scrolly-kit components, layouts, and story patterns. Call `list-sections` FIRST to discover sections, then `get-documentation` to fetch every section relevant to the task.

### Svelte MCP

Svelte 5 runes and SvelteKit docs. Run `svelte-autofixer` on any Svelte code you write, repeatedly, until it reports no issues.

## Conventions

- Stories live in `src/lib/stories/{slug}/` (`components/Index.svelte` + `data/copy.json`). Run `npm run new-story <slug>` to scaffold one — never hand-create the folders.
- Run `npm run check` before considering work done.
- Static build: guard browser-only code (`window`/`document`/WebGL, e.g. DuckDB) with `{#if browser}`, and never set `export const ssr = false` globally (it breaks prerendered remote functions).
