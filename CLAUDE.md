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

Templates customize the package defaults for their brand:

```css
/* templates/baked/src/lib/styles/app.css */
:root {
  /* Override VCSI tokens */
  --vcsi-color-accent: #154734;  /* UVM Green */
  --vcsi-font-sans: "Atlas Grotesk", system-ui;

  /* Template-specific variables */
  --vcsi-color-uvm-green: #154734;
  --vcsi-nav-height: 4.5rem;
}
```

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

### Reusable UI Components

Self-contained components that stories can optionally import. They work with sensible defaults but accept props for customization.

#### Footer

```svelte
import { Footer } from '@the-vcsi/scrolly-kit';

<Footer />
```

Footer accepts a `theme` prop to control appearance:

```svelte
<Footer />                <!-- Respects global dark mode (for app pages) -->
<Footer theme="light" />  <!-- Forces UVM green (for light stories) -->
<Footer theme="dark" />   <!-- Forces dark theme -->
```

For custom colors, set `--footer-bg` and `--footer-border` CSS variables on a parent element.

#### Nav

```svelte
import { Nav } from '@the-vcsi/scrolly-kit';

<Nav />
```

The Nav component is typically used via the `(app)/` layout. Stories that need navigation usually use `BackToHome` instead.

#### BackToHome

```svelte
import BackToHome from '$lib/components/helpers/BackToHome.svelte';

<!-- Default (white logo) -->
<BackToHome />

<!-- Colored logo for light backgrounds -->
<BackToHome colored />
```

Floating home button for stories. Positioned top-left, stays visible during scroll.

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

### Customizing Tokens

Override `--vcsi-*` variables in your template's `app.css`:

```css
:root {
  /* Brand colors */
  --vcsi-color-accent: #154734;

  /* Custom fonts */
  --vcsi-font-sans: "Atlas Grotesk", system-ui;
  --vcsi-font-serif: "Baskerville", Georgia;
}
```

The token architecture follows GCDS patterns with semantic naming: `--vcsi-[category]-[property]`.

### Key Principles

**1. Global styles provide nice defaults; stories control their own theming**
- Global dark mode (via mode-watcher) should NOT affect stories unless they explicitly opt in
- Stories are isolated using `color-scheme: light` by default
- Stories that want dark mode use `data-theme="dark"` which sets `color-scheme: dark`

**2. Use modern CSS patterns**
- `:global(.dark)` selector for dark mode (avoid `light-dark()` due to Safari compatibility)
- `color-scheme` property to control theme rendering
- Modern viewport units (`dvh`, `svh`, `lvh`) for mobile browser handling
- Flexbox/Grid for centering and layout
- `:has()` selector for parent-based styling when needed

**3. Extract semantic variables for repeated patterns**
```css
/* Interactive states */
--color-hover: rgba(0, 0, 0, 0.05);
--color-border-on-dark: rgba(255, 255, 255, 0.2);
```

### Story Content Layout

Direct children of `.story` get prose styling (centered, max-width 600px) by default. Layout classes break out to full width.

```svelte
<article class="story">
  <StoryHeader ... />              <!-- centered automatically -->
  <section id="intro">             <!-- centered automatically -->
    <p>Intro text...</p>
  </section>

  <section class="split-layout">   <!-- full width (layout class) -->
    ...
  </section>

  <h2>Conclusion</h2>              <!-- centered automatically -->
  <section id="conclusion">        <!-- centered automatically -->
    ...
  </section>
</article>
```

**No `.prose` class needed** - content is centered by default, layouts break out.

### Story Theming Pattern

Stories control their own visual theme independently of global dark mode.

```svelte
<!-- Light story (default) -->
<article class="story">...</article>
<Footer theme="light" />

<!-- Dark story -->
<article class="story" data-theme="dark">...</article>
<Footer theme="dark" />
```

**Footer theming:**
- `theme="light"` → UVM green
- `theme="dark"` → dark grey
- Custom: `<Footer style="--footer-bg: #353839;" />`

### Scrolly Layout System

Two layout patterns for scrollytelling:

```svelte
<!-- Split layout: side-by-side on desktop, overlay on mobile -->
<section class="split-layout">
  <div class="sticky-panel"><!-- visualization --></div>
  <div class="scrolly-content"><!-- steps --></div>
</section>

<!-- Fullscreen layout: immersive full-viewport background -->
<section class="fullscreen-layout">
  <div class="sticky-panel"><!-- visualization --></div>
  <div class="scrolly-content"><!-- steps --></div>
</section>
```

Add `.reversed` to `.split-layout` to flip panel/content sides.

### CSS Containment Rules

**Layouts define space, content fills it.** This prevents child elements from breaking out of their containers.

| Layer | Responsibility | Units |
|-------|---------------|-------|
| Layout (`app.css`) | Defines dimensions via variables | `vh`, `vw`, `%` allowed |
| Component (`.svelte`) | Fills available space | `100%`, `inherit`, `auto` only |

**Rules:**
1. **Layouts define dimensions** - `.split-layout`, `.fullscreen-layout` set sizes via CSS variables (`--panel-height`, etc.)
2. **Content uses relative units** - Children use `100%`, `inherit`, `auto` - never `vh/vw` for sizing
3. **Containers contain** - Add `overflow: hidden` to prevent content blowout
4. **Height chains must connect** - For `height: 100%` to work, every ancestor needs explicit height

**Example - WRONG:**
```css
/* Component trying to size itself with viewport units */
.my-chart { max-height: 80vh; } /* Ignores container bounds */
```

**Example - CORRECT:**
```css
/* Component respecting its container */
.my-chart {
  max-height: 100%;    /* Respects parent */
  overflow: hidden;    /* Contains children */
}
```

## Code Conventions
- Mobile-first responsive design (breakpoint: 768px)
- CSS custom properties and scrolly layouts defined in package, customized in template
- Remote functions use `prerender()` with `{ dynamic: true }` for parameterized routes

### Browser-only code in stories

The `baked/` template uses `adapter-static`, which means every story is
prerendered at build time. If a story imports a module that touches
`window`/`document`/`canvas`/WebGL at module-load time (e.g. DuckDB-wasm, some
d3 measurement code, certain observablehq libs), `npm run build` will crash
with an SSR error like `ReferenceError: document is not defined`.

**The escape hatch:** guard browser-only components with `browser` from
`$app/environment`:

```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import MyWebGLChart from './MyWebGLChart.svelte';
</script>

{#if browser}
  <MyWebGLChart {data} />
{/if}
```

For code (not components) that must only run in the browser, use `$effect` or
dynamic `import()` inside `onMount` — those only execute client-side.

**Do not disable SSR globally.** Setting `export const ssr = false` in
`[slug]/+page.ts` *will* silence build errors, but in `adapter-static` it also
means remote functions like `getStory()` won't be crawled at build time and
their static JSON endpoints won't be generated, producing 404s at runtime. If
you truly need SSR off on a route, you must also add an `inputs: () => [...]`
option to every `prerender()` remote function the page calls so SvelteKit
knows which static endpoints to bake.

The `fresh/` template (adapter-node) does not have this constraint — `ssr =
false` is safe there because the server is live at runtime.

## sv Add-ons

Optional integrations installed via Svelte CLI.

### @the-vcsi/msgraph (SharePoint Integration)

Fetches story content from SharePoint Excel files.

```bash
npx sv add @the-vcsi/msgraph=siteId:your-site-id
```

Creates:
- `scripts/fetch-msgraph.js` - Fetch script
- `src/appSettings.js` - Azure config
- `.env.example` - Credential template

Adds npm script: `npm run fetch:sharepoint`

### @the-vcsi/openalex (Academic Data)

Populates database with OpenAlex author/paper data.

```bash
npx sv add @the-vcsi/openalex=email:your@email.edu
```

Depends on: `drizzle` (auto-triggered if not installed)

Creates:
- `scripts/populate-openalex-db.js` - Populate script
- Appends tables to `src/lib/server/db/schema.ts`

Adds npm script: `npm run db:populate-openalex`

### @the-vcsi/scrolly-skills (AI Layer)

Installs the AI tooling for a scaffolded project.

```bash
npx sv add @the-vcsi/scrolly-skills
```

Creates:
- `.claude/skills/scrolly-kit/` - Claude Code skill (SKILL.md + COMPONENTS/LAYOUTS/PATTERNS references)
- `.mcp.json` - Configures the `scrolly-kit` MCP server (`npx @the-vcsi/scrolly-mcp`) and the Svelte MCP server

The skill reference files duplicate content from `sites/docs/src/lib/docs/` — when updating component or layout docs, update both.

### Creating New Add-ons

Add-ons live in `packages/addons/{name}/`. See existing add-ons for the pattern:

```javascript
import { defineAddon, defineAddonOptions } from 'sv';

const options = defineAddonOptions()
  .add('optionName', { question: 'Prompt?', type: 'string' })
  .build();

export default defineAddon({
  id: '@the-vcsi/addon-name',
  options,
  run: ({ sv, options: opts }) => {
    sv.file('path/to/file.js', () => TEMPLATE);
    sv.file('package.json', (content) => {
      const pkg = JSON.parse(content);
      pkg.scripts['my-script'] = 'node scripts/my-script.js';
      return JSON.stringify(pkg, null, 2);
    });
  }
});
```

## MCP Tools (Svelte Server)

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation:

### 1. list-sections
Use FIRST to discover documentation sections. Returns titles, use_cases, and paths.

### 2. get-documentation
Fetch full documentation for specific sections. After list-sections, analyze use_cases and fetch ALL relevant sections.

### 3. svelte-autofixer
Analyzes Svelte code for issues. MUST use when writing Svelte code. Keep calling until no issues remain.

### 4. playground-link
Generates Svelte Playground links. Ask user before calling. Never use if code was written to project files.