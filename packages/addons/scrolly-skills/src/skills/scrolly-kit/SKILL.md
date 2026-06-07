---
name: scrolly-kit
description: Use when building scrollytelling stories, working with split/fullscreen/triple/dashboard layouts, ScrollyContent steps, copy.json content, VCSI CSS variables, or story theming in a SvelteKit project using @the-vcsi/scrolly-kit
---

## MCP Tools

You have access to the scrolly-kit MCP server with full documentation for @the-vcsi/scrolly-kit.

### 1. list-sections

Use FIRST to discover available documentation sections. Returns titles, use_cases, and paths.

### 2. get-documentation

Fetch full documentation for specific sections. After list-sections, fetch ALL relevant sections for the user's task. Available sections: getting-started, reference (layouts, CSS vars), components (all 16 component APIs with usage), extensions/msgraph, extensions/openalex.

For generic Svelte 5 questions (runes, reactivity, SvelteKit routing), use the **Svelte MCP** instead.

## Quick Reference

### New story

**Check `package.json` for a `"new-story"` script first.** If it exists, use it -- do NOT scaffold manually:

```bash
npm run new-story <slug>             # minimal
npm run new-story <slug> --detailed  # with docs
```

Only create files by hand if the script does not exist. Structure: `src/lib/stories/{slug}/components/Index.svelte` + `data/copy.json`.

### Layouts

| Class | Pattern |
|-------|---------|
| `.split-layout` | Side-by-side: `.sticky-panel` + `.scrolly-content`. Add `.reversed` for chart-left. |
| `.fullscreen-layout` | Full-viewport background + overlay steps. |
| `.triple-layout` | Three columns: steps + code + chart. |
| `.dashboard-layout` | Sidebar + main content, no scrolly. |

### Key imports

```js
import { Scrolly, ScrollyContent, RenderContent, StoryHeader, Footer, ScrollIndicator } from '@the-vcsi/scrolly-kit';
import type { ContentItem, Author } from '@the-vcsi/scrolly-kit';
```

## Detailed Reference

- [COMPONENTS.md](COMPONENTS.md) -- props, CSS vars, usage
- [LAYOUTS.md](LAYOUTS.md) -- CSS classes, variables, containment rules
- [PATTERNS.md](PATTERNS.md) -- copy.json schema, multi-section, theming, SSR
