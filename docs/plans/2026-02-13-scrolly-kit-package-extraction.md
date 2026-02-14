# Scrolly-Kit Package Extraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract reusable scrollytelling components, CSS, and utilities into an npm package (`@vcsi/scrolly-kit`), then create minimal and full templates that depend on it.

**Architecture:** Monorepo with pnpm workspaces. The package exports Svelte components and CSS files. Templates import from the package. Users degit a template and `npm install` pulls the package from npm.

**Tech Stack:** pnpm workspaces, svelte-package, Svelte 5, SvelteKit 2

---

## Phase 1: Monorepo Setup

### Task 1: Initialize monorepo structure

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `packages/scrolly-kit/package.json`
- Create: `packages/scrolly-kit/svelte.config.js`
- Create: `packages/scrolly-kit/tsconfig.json`
- Create: `packages/scrolly-kit/src/lib/index.ts`
- Modify: `package.json` (root)

**Step 1: Create pnpm workspace config**

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'templates/*'
```

**Step 2: Create package directory and package.json**

```json
// packages/scrolly-kit/package.json
{
  "name": "@vcsi/scrolly-kit",
  "version": "0.0.1",
  "description": "Scrollytelling components and layouts for SvelteKit",
  "type": "module",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./styles/reset.css": "./dist/styles/reset.css",
    "./styles/tokens.css": "./dist/styles/tokens.css",
    "./styles/layouts.css": "./dist/styles/layouts.css",
    "./styles/typography.css": "./dist/styles/typography.css",
    "./styles/all.css": "./dist/styles/all.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && npm run package",
    "package": "svelte-kit sync && svelte-package -o dist",
    "prepublishOnly": "npm run package",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "peerDependencies": {
    "svelte": "^5.0.0"
  },
  "devDependencies": {
    "@sveltejs/kit": "^2.49.1",
    "@sveltejs/package": "^2.3.0",
    "@sveltejs/vite-plugin-svelte": "^6.2.1",
    "svelte": "^5.45.6",
    "svelte-check": "^4.3.4",
    "typescript": "^5.9.3",
    "vite": "^7.2.6"
  },
  "dependencies": {
    "bits-ui": "^2.15.5",
    "highlight.js": "^11.11.1",
    "katex": "^0.16.27",
    "mode-watcher": "^1.1.0",
    "rehype-highlight": "^7.0.2",
    "rehype-highlight-code-lines": "^1.2.1",
    "rehype-katex": "^7.0.1",
    "rehype-raw": "^7.0.0",
    "remark-math": "^6.0.0",
    "svelte-exmarkdown": "^5.0.2"
  },
  "keywords": [
    "svelte",
    "sveltekit",
    "scrollytelling",
    "data-visualization",
    "journalism"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/Vermont-Complex-Systems/vcsi-scrollytelling"
  },
  "license": "MIT"
}
```

**Step 3: Create svelte.config.js for the package**

```javascript
// packages/scrolly-kit/svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;
```

**Step 4: Create tsconfig.json**

```json
// packages/scrolly-kit/tsconfig.json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

**Step 5: Create main entry point**

```typescript
// packages/scrolly-kit/src/lib/index.ts
// Components
export { default as Scrolly } from './components/Scrolly.svelte';
export { default as ScrollyContent } from './components/ScrollyContent.svelte';
export { default as MarkdownRenderer } from './components/MarkdownRenderer.svelte';
export { default as CodeBlock } from './components/CodeBlock.svelte';
export { default as SimpleToggle } from './components/SimpleToggle.svelte';
export { default as SimpleSelect } from './components/SimpleSelect.svelte';
export { default as ThemeToggle } from './components/ThemeToggle.svelte';
export { default as Tooltip } from './components/Tooltip.svelte';
export { default as ScrollIndicator } from './components/ScrollIndicator.svelte';
export { default as CopyCodeBlock } from './components/CopyCodeBlock.svelte';
export { default as CodeExplainer } from './components/CodeExplainer.svelte';
export { default as Spinner } from './components/Spinner.svelte';

// Snippets and utilities
export { renderTextContent, renderCodeHtml, type ContentItem } from './components/ScrollySnippets.svelte';

// Actions
export { scrollReveal } from './actions/scrollReveal';
```

**Step 6: Update root package.json for workspaces**

Add to root `package.json`:
```json
{
  "private": true,
  "workspaces": ["packages/*", "templates/*"]
}
```

**Step 7: Run pnpm install to link workspaces**

Run: `pnpm install`
Expected: Workspaces linked, node_modules created

---

### Task 2: Move components to package

**Files:**
- Create: `packages/scrolly-kit/src/lib/components/Scrolly.svelte`
- Create: `packages/scrolly-kit/src/lib/components/ScrollyContent.svelte`
- Create: `packages/scrolly-kit/src/lib/components/ScrollySnippets.svelte`
- Create: `packages/scrolly-kit/src/lib/components/MarkdownRenderer.svelte`
- Create: `packages/scrolly-kit/src/lib/components/CodeBlock.svelte`
- Create: `packages/scrolly-kit/src/lib/components/SimpleToggle.svelte`
- Create: `packages/scrolly-kit/src/lib/components/SimpleSelect.svelte`
- Create: `packages/scrolly-kit/src/lib/components/ThemeToggle.svelte`
- Create: `packages/scrolly-kit/src/lib/components/Tooltip.svelte`
- Create: `packages/scrolly-kit/src/lib/components/ScrollIndicator.svelte`
- Create: `packages/scrolly-kit/src/lib/components/CopyCodeBlock.svelte`
- Create: `packages/scrolly-kit/src/lib/components/CodeExplainer.svelte`
- Create: `packages/scrolly-kit/src/lib/components/Spinner.svelte`
- Create: `packages/scrolly-kit/src/lib/actions/scrollReveal.ts`

**Step 1: Copy core scrolly components**

Copy these files from `src/lib/components/helpers/` to `packages/scrolly-kit/src/lib/components/`:
- `Scrolly.svelte`
- `ScrollyContent.svelte`
- `ScrollySnippets.svelte` (update import path for MarkdownRenderer)
- `MarkdownRenderer.svelte`

**Step 2: Update ScrollySnippets.svelte import**

Change line 2 from:
```typescript
import Md from '$lib/components/helpers/MarkdownRenderer.svelte';
```
to:
```typescript
import Md from './MarkdownRenderer.svelte';
```

**Step 3: Copy UI helper components**

Copy these files from `src/lib/components/helpers/` to `packages/scrolly-kit/src/lib/components/`:
- `CodeBlock.svelte`
- `SimpleToggle.svelte`
- `SimpleSelect.svelte`
- `ThemeToggle.svelte`
- `Tooltip.svelte`
- `ScrollIndicator.svelte`
- `CopyCodeBlock.svelte`
- `CodeExplainer.svelte`
- `Spinner.svelte`

**Step 4: Copy scrollReveal action**

Copy `src/lib/utils/scrollReveal.ts` to `packages/scrolly-kit/src/lib/actions/scrollReveal.ts`

**Step 5: Verify package builds**

Run: `cd packages/scrolly-kit && pnpm package`
Expected: `dist/` folder created with compiled components

---

### Task 3: Extract and split CSS into package

**Files:**
- Create: `packages/scrolly-kit/src/lib/styles/reset.css`
- Create: `packages/scrolly-kit/src/lib/styles/tokens.css`
- Create: `packages/scrolly-kit/src/lib/styles/layouts.css`
- Create: `packages/scrolly-kit/src/lib/styles/typography.css`
- Create: `packages/scrolly-kit/src/lib/styles/all.css`

**Step 1: Create reset.css**

Copy `src/styles/reset.css` to `packages/scrolly-kit/src/lib/styles/reset.css`

**Step 2: Create tokens.css (extract from app.css lines 1-146)**

```css
/* packages/scrolly-kit/src/lib/styles/tokens.css */
/* Design tokens for scrollytelling - override these in your app */

:root {
  color-scheme: light dark;

  /* Core palette - customize these for your brand */
  --scrolly-color-black: #000;
  --scrolly-color-white: #fff;
  --scrolly-color-beige: #f4efea;
  --scrolly-color-accent: #154734;

  /* Gray scale */
  --scrolly-gray-100: rgb(239, 239, 239);
  --scrolly-gray-200: rgb(223, 223, 223);
  --scrolly-gray-300: rgb(202, 202, 202);
  --scrolly-gray-400: rgb(168, 168, 168);
  --scrolly-gray-600: rgb(109, 109, 109);
  --scrolly-gray-700: rgb(78, 78, 78);
  --scrolly-gray-800: rgb(55, 55, 55);
  --scrolly-gray-900: rgb(38, 38, 38);

  /* Typography */
  --scrolly-sans: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --scrolly-serif: Georgia, "Times New Roman", Times, serif;
  --scrolly-mono: "SF Mono", Monaco, Consolas, monospace;

  /* Type scale */
  --scrolly-font-size-giant: clamp(3rem, 10vw, 4rem);
  --scrolly-font-size-xl: clamp(1.8rem, 5vw, 3rem);
  --scrolly-font-size-lg: clamp(1.5rem, 2.5vw, 2.5rem);
  --scrolly-font-size-md: clamp(1rem, 1.75vw, 1.5rem);
  --scrolly-font-size-base: clamp(18px, 1.2vw, 1.5rem);
  --scrolly-font-size-small: clamp(14px, 1.18vw, 1.2rem);
  --scrolly-font-size-sm: clamp(12px, 1vw, 0.9rem);

  /* Layout */
  --scrolly-page-max-width: 1200px;
  --scrolly-content-padding-inline: 2rem;
  --scrolly-border-radius: 3px;
  --scrolly-transition: 200ms ease;

  /* Scrolly steps */
  --scrolly-step-box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
  --scrolly-step-height: 90vh;
  --scrolly-step-max-width: 400px;
  --scrolly-step-padding: 1.5rem;
  --scrolly-step-border-radius: 8px;
  --scrolly-max-width: 600px;
  --scrolly-pointer-events: auto;

  /* Raw tokens (light/dark pairs) */
  --scrolly-bg-light: var(--scrolly-color-beige);
  --scrolly-bg-dark: #1a1a1a;
  --scrolly-fg-light: rgb(55, 55, 55);
  --scrolly-fg-dark: #e8e8e8;
  --scrolly-hover-light: rgba(0, 0, 0, 0.05);
  --scrolly-hover-dark: rgba(255, 255, 255, 0.1);
  --scrolly-border-light: rgb(202, 202, 202);
  --scrolly-border-dark: rgba(255, 255, 255, 0.15);

  /* Semantic tokens (auto-switch with theme) */
  --scrolly-bg: var(--scrolly-bg-light);
  --scrolly-fg: var(--scrolly-fg-light);
  --scrolly-hover: var(--scrolly-hover-light);
  --scrolly-border: var(--scrolly-border-light);
}

/* Dark mode via system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --scrolly-bg: var(--scrolly-bg-dark);
    --scrolly-fg: var(--scrolly-fg-dark);
    --scrolly-hover: var(--scrolly-hover-dark);
    --scrolly-border: var(--scrolly-border-dark);
  }
}

/* Dark mode via class toggle */
:root.dark {
  color-scheme: dark;
  --scrolly-bg: var(--scrolly-bg-dark);
  --scrolly-fg: var(--scrolly-fg-dark);
  --scrolly-hover: var(--scrolly-hover-dark);
  --scrolly-border: var(--scrolly-border-dark);
}
```

**Step 3: Create layouts.css (extract layout classes)**

```css
/* packages/scrolly-kit/src/lib/styles/layouts.css */
/* Scrollytelling layout systems */

/* =============================================================================
   STORY CONTAINER
   ============================================================================= */

.story {
  color-scheme: light;
  --scrolly-bg: var(--scrolly-bg-light);
  --scrolly-fg: var(--scrolly-fg-light);

  --story-bg: var(--scrolly-color-beige, #f4efea);
  --story-fg: var(--scrolly-gray-800, rgb(55, 55, 55));
  --story-step-bg: #fff;
  --story-step-fg: #333;
  --story-step-bg-inactive: #f5f5f5;
  --story-step-fg-inactive: #ccc;
  --story-max-width: 600px;

  width: 100%;
  padding-top: 5.5rem;
  padding-bottom: 7.5rem;
  background: var(--story-bg);
  color: var(--story-fg);
}

.story.dark {
  color-scheme: dark;
  --story-bg: #353839;
  --story-fg: white;
  --story-step-bg: #2a2a2a;
  --story-step-fg: #e8e8e8;
  --story-step-bg-inactive: #222;
  --story-step-fg-inactive: #666;
}

/* Story prose defaults */
.story > h1, .story > h2, .story > h3, .story > p,
.story > section, .story > header, .story > ul, .story > ol,
.story > blockquote, .story > pre {
  width: 100%;
  max-width: var(--story-max-width);
  margin-inline: auto;
  padding-inline: 1rem;
}

/* Layout classes break out to full width */
.story > .split-layout,
.story > .fullscreen-layout,
.story > .triple-layout,
.story > .scrolly-section {
  max-width: none;
  padding-inline: 0;
}

/* =============================================================================
   SPLIT LAYOUT (Two-Column)
   ============================================================================= */

.split-layout {
  --panel-min-width: 450px;
  --panel-width: 45%;
  --panel-height: min(80vh, 600px);
  --panel-top-offset: calc((100vh - var(--panel-height)) / 2);
  --layout-gap: 2rem;

  position: relative;
  display: grid;
  grid-template-columns: 1fr minmax(var(--panel-min-width), var(--panel-width));
  gap: var(--layout-gap);
  align-items: start;
  padding-inline: var(--scrolly-content-padding-inline, 2rem);
  --scrolly-max-width: none;
}

.split-layout.reversed {
  grid-template-columns: minmax(var(--panel-min-width), var(--panel-width)) 1fr;
}

.split-layout .sticky-panel {
  position: sticky;
  top: var(--panel-top-offset);
  height: var(--panel-height);
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.split-layout.reversed .sticky-panel { grid-column: 1; }
.split-layout .scrolly-content { grid-column: 1; margin: 0; }
.split-layout.reversed .scrolly-content { grid-column: 2; }

@media (max-width: 768px) {
  .split-layout {
    grid-template-columns: 1fr;
    padding-inline: 0;
    --scrolly-step-max-width: 100%;
    max-width: 100vw;
    overflow-x: clip;
  }

  .split-layout .sticky-panel {
    position: sticky;
    top: 0;
    height: 100vh;
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    min-width: 0;
    z-index: 0;
  }

  .split-layout .scrolly-content,
  .split-layout .scrolly-outer {
    grid-column: 1;
    grid-row: 1;
    z-index: 1;
    pointer-events: none;
    padding-inline: var(--scrolly-content-padding-inline, 2rem);
  }

  .split-layout.reversed .sticky-panel,
  .split-layout.reversed .scrolly-content { grid-column: 1; }
}

/* =============================================================================
   FULLSCREEN LAYOUT
   ============================================================================= */

.fullscreen-layout {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  --scrolly-step-max-width: 500px;
  --scrolly-step-padding: 2rem;
  --scrolly-pointer-events: none;
}

.fullscreen-layout .sticky-panel {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

.fullscreen-layout .scrolly-content {
  position: relative;
  z-index: 1;
  margin: 0 auto;
}

/* =============================================================================
   TRIPLE LAYOUT (Three-Column)
   ============================================================================= */

.triple-layout {
  --panel-height: min(95vh, 900px);
  --panel-top-offset: calc((100vh - var(--panel-height)) / 2);
  --layout-gap: 1.5rem;

  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--layout-gap);
  align-items: start;
  padding-inline: var(--scrolly-content-padding-inline, 2rem);
}

.triple-layout .scrolly-content { grid-column: 1; }
.triple-layout .code-panel {
  position: sticky;
  top: var(--panel-top-offset);
  height: var(--panel-height);
  grid-column: 2;
}
.triple-layout .chart-panel {
  position: sticky;
  top: var(--panel-top-offset);
  height: var(--panel-height);
  grid-column: 3;
}

@media (max-width: 1024px) {
  .triple-layout { grid-template-columns: 1fr 1fr; }
  .triple-layout .chart-panel { grid-column: 2; grid-row: 1; }
  .triple-layout .code-panel { display: none; }
}

@media (max-width: 768px) {
  .triple-layout { grid-template-columns: 1fr; }
  .triple-layout .chart-panel {
    position: sticky;
    top: 0;
    height: 100vh;
    grid-column: 1;
    grid-row: 1;
    z-index: 0;
  }
  .triple-layout .scrolly-content {
    grid-column: 1;
    grid-row: 1;
    z-index: 1;
    pointer-events: none;
    padding-inline: var(--scrolly-content-padding-inline, 2rem);
  }
}

/* =============================================================================
   DASHBOARD LAYOUT
   ============================================================================= */

.dashboard-layout {
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 48px;
  --sidebar-transition: 300ms ease;
  --sidebar-bg: #ebe6e1;

  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  height: 100vh;
  width: 100%;
  transition: grid-template-columns var(--sidebar-transition);
}

.dashboard-layout.sidebar-collapsed {
  grid-template-columns: var(--sidebar-collapsed-width) 1fr;
}

.dashboard-sidebar {
  position: relative;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--scrolly-border);
  overflow: hidden;
  transition: width var(--sidebar-transition);
}

.dashboard-main {
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}
```

**Step 4: Create typography.css**

```css
/* packages/scrolly-kit/src/lib/styles/typography.css */
/* Typography styles for scrollytelling */

body {
  font-family: var(--scrolly-serif, Georgia, serif);
  font-size: var(--scrolly-font-size-base, 1rem);
  background: var(--scrolly-bg);
  color: var(--scrolly-fg);
}

h1, h2, h3, h4 {
  font-family: var(--scrolly-serif, Georgia, serif);
  font-weight: 700;
}

h1 { font-size: var(--scrolly-font-size-xl); margin: 2.5rem 0 1rem; }
h2 { font-size: var(--scrolly-font-size-lg); margin: 2.5rem 0 1rem; }
h3 { font-size: var(--scrolly-font-size-md); margin: 2rem 0 0.75rem; }
h4 { font-size: var(--scrolly-font-size-base); margin: 1.5rem 0 0.5rem; }

p {
  font-size: var(--scrolly-font-size-base);
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Code blocks */
pre {
  background: light-dark(#f6f8fa, #161b22);
  border: 1px solid light-dark(#d1d9e0, #30363d);
  border-radius: 6px;
  padding: 1rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  font-family: var(--scrolly-mono, monospace);
  font-size: 0.85em;
  line-height: 1.45;
}

pre code {
  background: none;
  padding: 0;
  border: none;
  color: light-dark(#1f2328, #e6edf3);
}

/* Inline code */
:where(p, li) code {
  font-family: var(--scrolly-mono, monospace);
  font-size: 0.8em;
  background: light-dark(rgb(235, 235, 235), rgb(55, 55, 55));
  padding: 0.125rem 0.35rem;
  border-radius: 3px;
}

/* Blockquotes */
blockquote {
  margin: 2rem 0;
  padding: 0 0 0 1.5rem;
  font-size: 1.1em;
  line-height: 1.5;
  color: light-dark(#2c5aa0, #4a90e2);
  border-left: 3px solid light-dark(#2c5aa0, #4a90e2);
}

blockquote p { margin: 0; }

/* Links */
a {
  color: var(--scrolly-fg);
  cursor: pointer;
}

a:hover {
  color: var(--scrolly-color-accent, #154734);
}

/* Code line highlighting */
pre code .code-line {
  display: inline-block;
  min-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: -1rem;
  margin-right: -1rem;
  border-left: 3px solid transparent;
}

pre code .numbered-code-line::before {
  content: attr(data-line-number);
  display: inline-block;
  width: 2rem;
  margin-right: 1rem;
  text-align: right;
  color: #6e7781;
  user-select: none;
}

pre code .highlighted-code-line {
  background: light-dark(rgba(255, 220, 100, 0.3), rgba(255, 220, 100, 0.15));
  border-left-color: #f0c000;
}
```

**Step 5: Create all.css bundle**

```css
/* packages/scrolly-kit/src/lib/styles/all.css */
/* Import all scrolly-kit styles at once */

@import './reset.css';
@import './tokens.css';
@import './typography.css';
@import './layouts.css';
```

**Step 6: Verify CSS files are included in package build**

Run: `cd packages/scrolly-kit && pnpm package`
Expected: `dist/styles/` contains all CSS files

---

## Phase 2: Create Templates

### Task 4: Create full template

**Files:**
- Create: `templates/full/package.json`
- Create: `templates/full/svelte.config.js`
- Create: `templates/full/vite.config.ts`
- Create: `templates/full/tsconfig.json`
- Create: `templates/full/src/app.html`
- Create: `templates/full/src/app.css`
- Move: Current `src/` contents (routes, stories, data) to `templates/full/src/`

**Step 1: Create template package.json**

```json
// templates/full/package.json
{
  "name": "scrolly-template-full",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.49.1",
    "@sveltejs/vite-plugin-svelte": "^6.2.1",
    "svelte": "^5.45.6",
    "svelte-check": "^4.3.4",
    "typescript": "^5.9.3",
    "vite": "^7.2.6"
  },
  "dependencies": {
    "@vcsi/scrolly-kit": "^0.0.1",
    "@lucide/svelte": "^0.562.0",
    "@rollup/plugin-dsv": "^3.0.5",
    "d3": "^7.9.0",
    "mode-watcher": "^1.1.0",
    "valibot": "^1.2.0"
  }
}
```

**Step 2: Create template app.css that imports from package**

```css
/* templates/full/src/styles/app.css */
/* Import base styles from scrolly-kit */
@import '@vcsi/scrolly-kit/styles/reset.css';
@import '@vcsi/scrolly-kit/styles/tokens.css';
@import '@vcsi/scrolly-kit/styles/typography.css';
@import '@vcsi/scrolly-kit/styles/layouts.css';

/* Import custom fonts (keep in template) */
@import './fonts.css';

/* =============================================================================
   TEMPLATE CUSTOMIZATIONS
   Override scrolly-kit tokens for your brand
   ============================================================================= */

:root {
  /* Brand colors */
  --scrolly-color-accent: #154734; /* UVM Green */

  /* Custom fonts (loaded from fonts.css) */
  --scrolly-sans: "Atlas Grotesk", system-ui, sans-serif;
  --scrolly-serif: "Baskerville", Georgia, serif;
  --scrolly-mono: "Atlas Typewriter", "SF Mono", monospace;
}

/* =============================================================================
   TEMPLATE-SPECIFIC STYLES
   Styles specific to this template (Nav, Footer, etc.)
   ============================================================================= */

/* Nav styling */
nav {
  --nav-height: 4.5rem;
  --nav-bg: var(--scrolly-bg);
  --nav-fg: var(--scrolly-fg);
}

/* Footer styling */
footer {
  --footer-bg: var(--scrolly-color-accent);
  --footer-border: rgba(255, 255, 255, 0.2);
}
```

**Step 3: Move current src/ to templates/full/src/**

Move all files from current `src/` to `templates/full/src/`, including:
- `routes/`
- `lib/stories/`
- `lib/components/` (keep Nav, Footer, Home, About, StoryGrid, etc. - template-specific)
- `data/`
- `styles/fonts.css` (keep custom fonts in template)

**Step 4: Update imports in template to use package**

In story files, change:
```typescript
// Before
import { Scrolly, ScrollyContent } from '$lib/components/helpers/Scrolly.svelte';

// After
import { Scrolly, ScrollyContent } from '@vcsi/scrolly-kit';
```

**Step 5: Verify template builds**

Run: `cd templates/full && pnpm install && pnpm build`
Expected: Build succeeds, static site generated

---

### Task 5: Create minimal template

**Files:**
- Create: `templates/minimal/` (copy from full, then strip)
- Modify: Remove example stories, simplify routes

**Step 1: Copy full template as starting point**

```bash
cp -r templates/full templates/minimal
```

**Step 2: Create minimal story scaffold**

Replace `templates/minimal/src/lib/stories/` with single example:

```
templates/minimal/src/lib/stories/
└── my-first-story/
    ├── components/
    │   └── Index.svelte
    └── data/
        └── copy.json
```

**Step 3: Create minimal Index.svelte**

```svelte
<!-- templates/minimal/src/lib/stories/my-first-story/components/Index.svelte -->
<script lang="ts">
  import { Scrolly, ScrollyContent, type ContentItem } from '@vcsi/scrolly-kit';

  let { story, data } = $props();

  let scrollIndex = $state(0);

  const steps: ContentItem[] = data.steps || [
    { type: 'markdown', value: '## Step 1\n\nYour first step content here.' },
    { type: 'markdown', value: '## Step 2\n\nAdd more steps as needed.' },
    { type: 'markdown', value: '## Step 3\n\nTell your story!' }
  ];
</script>

<article class="story">
  <header>
    <h1>{story.title}</h1>
    {#if story.subtitle}<p class="subtitle">{story.subtitle}</p>{/if}
  </header>

  <section class="split-layout">
    <div class="sticky-panel">
      <!-- Your visualization goes here -->
      <div class="placeholder">
        <p>Step {scrollIndex + 1} of {steps.length}</p>
      </div>
    </div>

    <ScrollyContent {steps} bind:value={scrollIndex} />
  </section>
</article>

<style>
  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 8px;
    font-family: var(--scrolly-sans);
  }
</style>
```

**Step 4: Create minimal copy.json**

```json
{
  "title": "My First Story",
  "subtitle": "A scrollytelling template",
  "authors": [{ "name": "Your Name", "url": "" }],
  "date": "2026-02-13",
  "steps": [
    { "type": "markdown", "value": "## Welcome\n\nThis is your first scrollytelling story. Edit this file to add your content." },
    { "type": "markdown", "value": "## Add Visualizations\n\nReplace the placeholder in `Index.svelte` with your D3 or svelteplot visualization." },
    { "type": "markdown", "value": "## Publish\n\nRun `npm run build` to generate a static site ready for deployment." }
  ]
}
```

**Step 5: Update stories.csv for minimal**

```csv
slug,title,description,author,date,externalUrl,tags,level
my-first-story,My First Story,A scrollytelling template,Your Name,2026-02-13,,starter,getting-started
```

**Step 6: Simplify minimal home page**

Update `templates/minimal/src/routes/(app)/+page.svelte` to show simpler getting-started content.

**Step 7: Verify minimal template builds**

Run: `cd templates/minimal && pnpm install && pnpm build`
Expected: Build succeeds with minimal example story

---

## Phase 3: Testing & Documentation

### Task 6: Test the full workflow

**Step 1: Simulate degit for full template**

```bash
# From a temp directory
mkdir /tmp/test-full && cd /tmp/test-full
cp -r /path/to/vcsi-scrollytelling/templates/full/* .
pnpm install
pnpm dev
```

Expected: Dev server runs, stories work

**Step 2: Simulate degit for minimal template**

```bash
mkdir /tmp/test-minimal && cd /tmp/test-minimal
cp -r /path/to/vcsi-scrollytelling/templates/minimal/* .
pnpm install
pnpm dev
```

Expected: Dev server runs, minimal story works

**Step 3: Test package update flow**

```bash
# In test project
cd /tmp/test-full
pnpm update @vcsi/scrolly-kit
pnpm build
```

Expected: Build succeeds with updated package

---

### Task 7: Create README and documentation stubs

**Files:**
- Create: `README.md` (root)
- Create: `packages/scrolly-kit/README.md`
- Create: `templates/full/README.md`
- Create: `templates/minimal/README.md`

**Step 1: Create root README**

```markdown
# VCSI Scrollytelling

A scrollytelling framework for data-driven visual essays.

## Quick Start

### Full Template (with examples)

```bash
npx degit Vermont-Complex-Systems/vcsi-scrollytelling/templates/full my-project
cd my-project
npm install
npm run dev
```

### Minimal Template (clean slate)

```bash
npx degit Vermont-Complex-Systems/vcsi-scrollytelling/templates/minimal my-project
cd my-project
npm install
npm run dev
```

## Documentation

Visit [docs.vcsi.dev](https://docs.vcsi.dev) for full documentation.

## Packages

- `@vcsi/scrolly-kit` - Core components and CSS
- `templates/full` - Full template with example stories
- `templates/minimal` - Minimal starter template
```

**Step 2: Create package README**

Document exports, CSS imports, and basic usage.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: extract scrolly-kit package and create templates

- Create @vcsi/scrolly-kit npm package with components and CSS
- Create full template with example stories
- Create minimal template for clean starts
- Set up pnpm monorepo structure

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

After completing all tasks:

```
vcsi-scrollytelling/
├── packages/
│   └── scrolly-kit/           ← npm publish this
│       ├── src/lib/
│       │   ├── components/    ← Scrolly, MarkdownRenderer, etc.
│       │   ├── styles/        ← tokens.css, layouts.css, etc.
│       │   └── actions/       ← scrollReveal
│       └── package.json
├── templates/
│   ├── full/                  ← degit target
│   │   └── src/
│   │       ├── lib/stories/   ← 6 example stories
│   │       └── styles/app.css ← imports @vcsi/scrolly-kit
│   └── minimal/               ← degit target
│       └── src/
│           ├── lib/stories/   ← 1 starter scaffold
│           └── styles/app.css
├── pnpm-workspace.yaml
└── README.md
```

Users run:
```bash
npx degit Vermont-Complex-Systems/vcsi-scrollytelling/templates/minimal my-project
cd my-project
npm install  # pulls @vcsi/scrolly-kit from npm
npm run dev
```
