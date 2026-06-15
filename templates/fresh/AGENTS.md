# AGENTS.md

A scrollytelling website built on [@the-vcsi/scrolly-kit](https://www.npmjs.com/package/@the-vcsi/scrolly-kit) (SvelteKit 2 + Svelte 5 runes). This is the **fresh** template: dynamic, server-rendered (`adapter-node`).

## Stories

Each story lives in `src/lib/stories/{slug}/`:
- `components/Index.svelte` — the story component (imports from `@the-vcsi/scrolly-kit`)
- `data/copy.json` — content; items are `{ "type", "value" }` where `type` is `markdown | html | math | code | component`

A slug resolves to its story automatically; `src/lib/data/stories.csv` lists the stories.

## Workflow

- `npm run new-story <slug>` — scaffold a new story (do NOT hand-create the folders)
- `npm run dev` / `npm run build` — develop / build
- `npm run check` — type-check; run this before considering work done

## Layouts & components

Layouts are CSS classes from scrolly-kit: `.story`, `.split-layout`, `.fullscreen-layout`, `.triple-layout`, `.dashboard-layout`. Import components (`Scrolly`, `ScrollyContent`, `RenderContent`, `StoryHeader`, `Footer`, …) from `@the-vcsi/scrolly-kit`.

## Dynamic rendering

This template runs on a live Node server (`adapter-node`). Remote functions in `$lib/story.remote.ts` use `query()` and execute on the server per request. Unlike the static `baked` template, `export const ssr = false` is safe here if a route needs client-only rendering.

## Deeper reference

- **scrolly-kit MCP** (`@the-vcsi/scrolly-mcp`): call `list-sections`, then `get-documentation` for component/layout/pattern docs.
- **Svelte MCP**: Svelte 5 runes & SvelteKit.
- Install the full Claude Code skill + MCP config with `npx sv add @the-vcsi/scrolly-skills`.
