# AGENTS.md

A scrollytelling site built on `@the-vcsi/scrolly-kit` (SvelteKit + Svelte 5). The **simple** template is a pared-down static starter (`adapter-static`) with one example story.

You have access to two MCP servers (configured by `@the-vcsi/scrolly-skills`):

### scrolly-kit MCP (`@the-vcsi/scrolly-mcp`)

Docs for scrolly-kit components, layouts, and story patterns. Call `list-sections` FIRST to discover sections, then `get-documentation` to fetch every section relevant to the task.

### Svelte MCP

Svelte 5 runes and SvelteKit docs. Run `svelte-autofixer` on any Svelte code you write, repeatedly, until it reports no issues.

## Conventions

- Stories live in `src/lib/stories/{slug}/` (`components/Index.svelte` + `data/copy.json`). Run `npm run new-story <slug>` to scaffold one — never hand-create the folders.
- **Workflow order:** scaffold *first* (`npm run new-story <slug>`) — that command *creates* the story's `data/` folder. Datasets (yours or the user's) then go into that new `src/lib/stories/{slug}/data/`, next to `copy.json`. The folder doesn't exist before scaffolding, so don't hunt the filesystem (`~/data`, repo root, …) for data — scaffold, then drop the file in, then build.
- Run `npm run check` before considering work done.
- Static build: guard browser-only code (`window`/`document`/WebGL) with `{#if browser}`, and never set `export const ssr = false` globally (it breaks prerendered remote functions).
