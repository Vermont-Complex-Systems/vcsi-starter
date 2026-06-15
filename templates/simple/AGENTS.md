# AGENTS.md

A scrollytelling website built on [@the-vcsi/scrolly-kit](https://www.npmjs.com/package/@the-vcsi/scrolly-kit) (SvelteKit 2 + Svelte 5 runes). This is the **simple** template: a pared-down static starter (`adapter-static`) with one example story.

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

## SSR gotcha (static build)

Every page is prerendered. Guard browser-only code (`window`/`document`/WebGL) with `{#if browser}` (`import { browser } from '$app/environment'`). Do **not** set `export const ssr = false` globally — it stops remote functions from being crawled and produces 404s at runtime.

## Deeper reference

- **scrolly-kit MCP** (`@the-vcsi/scrolly-mcp`): call `list-sections`, then `get-documentation` for component/layout/pattern docs.
- **Svelte MCP**: Svelte 5 runes & SvelteKit.
- Install the full Claude Code skill + MCP config with `npx sv add @the-vcsi/scrolly-skills`.
