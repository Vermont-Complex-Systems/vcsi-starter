# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for VCSI scrollytelling websites. It contains:
- **@the-vcsi/scrolly-kit** - npm package with reusable components and CSS
- **@the-vcsi/scrolly-mcp** - MCP server serving scrolly-kit documentation
- **Templates** - SvelteKit starters that users scaffold via `degit`
- **sv add-ons** - Optional integrations (SharePoint, OpenAlex, AI skills) via Svelte CLI
- **Docs site** - GitHub Pages site that also serves `sections.json` + `llms.txt` for the MCP server

```
.
├── packages/
│   ├── scrolly-kit/           # @the-vcsi/scrolly-kit npm package
│   ├── mcp-server/            # @the-vcsi/scrolly-mcp MCP server (fetches from docs site)
│   └── addons/
│       ├── msgraph/           # SharePoint integration add-on
│       ├── openalex/          # Academic data add-on
│       └── scrolly-skills/    # Claude Code skill + MCP config add-on
├── sites/
│   └── docs/                  # Docs site (source of truth: src/lib/docs/*.md)
└── templates/
    ├── baked/                 # Static, pre-rendered template
    ├── fresh/                 # Dynamic, server-rendered template
    └── simple/                # Pared-down starter
```

## Commands

```bash
# Root (monorepo)
npm install              # Install all dependencies
npm run build            # Build all packages

# Template development (from templates/baked/ or templates/fresh/)
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run check            # Type check with svelte-check

# Package development (from packages/scrolly-kit/)
npm run package          # Build the npm package
npm run check            # Type check

# Database (when using drizzle add-on)
npm run db:push          # Push schema changes
npm run db:generate      # Generate migrations
npm run db:studio        # Open Drizzle Studio
```

## Scaffolding a New Project

```bash
# Scaffold baked template (static)
npx degit Vermont-Complex-Systems/vcsi-starter/templates/baked my-project

# Add optional integrations
cd my-project
npx sv add @the-vcsi/msgraph         # SharePoint integration
npx sv add @the-vcsi/openalex        # OpenAlex academic data
npx sv add @the-vcsi/scrolly-skills  # Claude Code skill + MCP servers
```

## Architecture

### Package: @the-vcsi/scrolly-kit

The "engine" - provides CSS and components that templates import.

```
packages/scrolly-kit/src/lib/
├── styles/
│   ├── reset.css        # CSS reset
│   ├── tokens.css       # Design tokens (--vcsi-* variables)
│   ├── typography.css   # Base typography
│   ├── layouts.css      # Story layouts (.story, .split-layout, etc.)
│   └── all.css          # Combined import
└── components/
    ├── Scrolly.svelte           # Core scrollytelling logic
    ├── ScrollyContent.svelte    # Step boxes with content rendering
    ├── MarkdownRenderer.svelte  # Markdown + KaTeX + syntax highlighting
    └── ...
```

Templates import styles:
```css
@import '@the-vcsi/scrolly-kit/styles/all.css';
```

### AI Layer (docs site → MCP server → skill)

- `sites/docs/src/lib/docs/*.md` is the documentation source of truth. The site (GitHub Pages) prerenders `sections.json` and per-section `llms.txt` endpoints; `use_cases.json` provides the per-section discovery hints.
- `packages/mcp-server` (`@the-vcsi/scrolly-mcp`) exposes `list-sections` / `get-documentation` tools that fetch from the docs site. It also works as a plain CLI: `npx @the-vcsi/scrolly-mcp list-sections`.
- `packages/addons/scrolly-skills` installs a Claude Code skill and wires both MCP servers into a scaffolded project's `.mcp.json`.

When adding a component to scrolly-kit: export it in `index.ts`, document it in `sites/docs/src/lib/docs/components/{Name}.md`, add a `use_cases.json` entry, and update the skill's `COMPONENTS.md`.

### Templates

Templates customize package defaults for their brand by overriding `--vcsi-*` tokens (and adding template-specific vars like `--vcsi-nav-height`) in `src/lib/styles/app.css`. See CSS Architecture below.

### Template Layout System
```
src/routes/
├── +layout.svelte       # Root: ModeWatcher, app.css only
├── (app)/               # Pages WITH Nav + Footer
│   ├── +layout.svelte   # Adds Nav and Footer
│   ├── +page.svelte     # Home
│   └── about/           # About pages
└── [slug]/              # Stories WITHOUT Nav/Footer (full freedom)
    └── +page.svelte
```

**Stories have full control** - no Nav, no Footer, just the root layout with ModeWatcher and global CSS. Stories import reusable components as needed.

### Data Flow
- CSV files in `src/lib/data/` (`members.csv`, `stories.csv`) define dynamic routes
- `svelte.config.js` reads CSVs at build time to generate route entries for `/about/{memberId}` and `/{storySlug}`
- Remote functions in `$lib/story.remote.ts` use SvelteKit's `prerender()` with Valibot validation to load data
- `$lib/story-loader.ts` resolves a slug to its `Index.svelte` component via a lazy `import.meta.glob`

### Story Structure
Each story lives in `src/lib/stories/{story-name}/`:
- `components/Index.svelte` - Main story component
- `components/*.svelte` - Visualization components (e.g., ScrollyPlot.svelte)
- `data/copy.json` - Content data with `type` (markdown/html/math/code/component) and `value` fields

### Key Components
Core components (`Scrolly`, `ScrollyContent`, `MarkdownRenderer`, `RenderContent`, `StoryHeader`, `Nav`, `Footer`, ...) are imported from `@the-vcsi/scrolly-kit` — they no longer live in the templates. Templates only keep template-specific helpers like `$lib/components/helpers/BackToHome.svelte`.

```js
import { Scrolly, ScrollyContent, RenderContent, StoryHeader, Footer } from '@the-vcsi/scrolly-kit';
```

> **Component usage (props, theming, CSS vars) lives in the AI layer, not here.** See the `scrolly-kit` skill's `COMPONENTS.md` or query the scrolly-kit MCP (`list-sections` → `get-documentation`). `BackToHome` is the one template-local helper: `$lib/components/helpers/BackToHome.svelte` (floating home button for stories; `colored` prop for light backgrounds).

### Paths (in templates)
- `$lib` → `src/lib` (data in `$lib/data`, styles in `$lib/styles`, stories in `$lib/stories`)

## Tech Stack
- **Svelte 5** with runes (`$state`, `$derived`, `$props`, snippets)
- **SvelteKit 2** with static adapter and prerendering
- **Vite 7** with DSV plugin for CSV imports
- **@the-vcsi/scrolly-kit** for scrollytelling components and CSS
- **Drizzle ORM** with SQLite (via sv add-on)
- **D3** and **svelteplot** for visualizations
- **mode-watcher** for dark/light theme management

## CSS Architecture

### Package vs Template CSS

**Package (@the-vcsi/scrolly-kit)** provides the engine:
- `tokens.css` - Design tokens (`--vcsi-*` variables)
- `typography.css` - Base typography, links, code blocks
- `layouts.css` - Story layouts (`.story`, `.split-layout`, `.fullscreen-layout`)
- `reset.css` - CSS reset

**Templates** provide brand customization:
```
src/lib/styles/
├── fonts.css    # @font-face declarations
└── app.css      # Brand overrides + template-specific styles
```

Templates override `--vcsi-*` tokens in `app.css` (e.g. `--vcsi-color-accent`, `--vcsi-font-sans`). The token architecture follows GCDS patterns with semantic naming: `--vcsi-[category]-[property]`.

> **Story-authoring CSS reference lives in the AI layer, not here.** Token lists, story theming (`data-theme`, `.story` isolation), the scrolly layout system (`.split-layout` / `.fullscreen-layout` / `.triple-layout` / `.dashboard-layout`), CSS variable scoping, and containment rules are documented in the docs site (`sites/docs/src/lib/docs/reference.md`), served via the scrolly-kit MCP, and mirrored in the `scrolly-kit` skill's `LAYOUTS.md` / `PATTERNS.md`. Query the MCP (`list-sections` → `get-documentation`) when building a story.

## Code Conventions
- Mobile-first responsive design (breakpoint: 768px)
- CSS custom properties and scrolly layouts defined in package, customized in template
- Remote functions use `prerender()` with `{ dynamic: true }` for parameterized routes
- When writing/editing Svelte, use the Svelte MCP server: query its docs and run `svelte-autofixer` until clean. See AGENTS.md for the scrolly-kit vs Svelte MCP split.

### Browser-only code in stories (SSR)

The `baked/` template uses `adapter-static` — stories are prerendered, so modules touching `window`/`document`/WebGL at import time crash `npm run build`. Guard them with `{#if browser}` (from `$app/environment`); never set `export const ssr = false` globally under `adapter-static`. Full explanation and the `inputs: () => [...]` workaround are in the `scrolly-kit` skill's `PATTERNS.md` ("SSR / Build Gotchas").

## sv Add-ons

Optional integrations installed via `npx sv add @the-vcsi/{name}`. Source in `packages/addons/{name}/`; user docs in `sites/docs/src/lib/docs/extensions/`.

| Add-on | Purpose |
|--------|---------|
| `@the-vcsi/msgraph=siteId:...` | Fetch story content from SharePoint Excel |
| `@the-vcsi/openalex=email:...` | Populate DB with OpenAlex data (pulls in `drizzle`) |
| `@the-vcsi/scrolly-skills` | AI layer: installs the `scrolly-kit` skill + `.mcp.json` |

Authoring details (the `defineAddon` pattern, what each add-on creates, AI-layer drift rules) load on demand from `.claude/rules/addon-authoring.md` when editing `packages/addons/**`.