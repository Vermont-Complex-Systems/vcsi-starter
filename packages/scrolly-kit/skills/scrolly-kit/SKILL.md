---
name: scrolly-kit
description: Use when building scrollytelling stories, working with split/fullscreen/triple/dashboard layouts, ScrollyContent steps, copy.json content, VCSI CSS variables, or story theming in a SvelteKit project using @the-vcsi/scrolly-kit
---

# @the-vcsi/scrolly-kit

Scrollytelling components, layouts, and CSS for SvelteKit. Stories are Svelte components that combine layout CSS classes with reactive scroll-tracking components.

## Quick Start: Create a Story

A story lives in `src/lib/stories/{slug}/` with two parts:

**1. Content data** (`data/copy.json`):
```json
{
  "title": "My Story",
  "subtitle": "A data-driven exploration",
  "authors": [{ "name": "Alice Smith", "url": "https://..." }],
  "date": "April 2026",
  "introduction": [
    { "type": "markdown", "value": "Opening paragraph with **bold** and $math$." }
  ],
  "steps": [
    { "type": "markdown", "value": "## Step 1\nFirst insight..." },
    { "type": "markdown", "value": "## Step 2\nSecond insight..." },
    { "type": "html", "value": "<strong>Step 3</strong> with raw HTML" }
  ],
  "conclusion": [
    { "type": "markdown", "value": "Wrapping up..." }
  ]
}
```

**2. Story component** (`components/Index.svelte`):
```svelte
<script>
  import { ScrollyContent, RenderContent, StoryHeader, Footer, ScrollIndicator } from '@the-vcsi/scrolly-kit';
  import BackToHome from '$lib/components/helpers/BackToHome.svelte';

  let { story, data } = $props();
  let scrollyIndex = $state(0);
</script>

<BackToHome />
<ScrollIndicator />

<article class="story">
  <StoryHeader title={data.title} subtitle={data.subtitle} authors={data.authors} date={data.date} />

  <section id="intro">
    <RenderContent items={data.introduction} />
  </section>

  <section class="split-layout">
    <div class="sticky-panel">
      <!-- Your visualization here, reacts to {scrollyIndex} -->
    </div>
    <div class="scrolly-content">
      <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
    </div>
  </section>

  <section id="conclusion">
    <RenderContent items={data.conclusion} />
  </section>
</article>

<Footer theme="light" />
```

## Layout Options

| Layout | Class | Use when |
|--------|-------|----------|
| **Split** | `.split-layout` | Side-by-side: text scrolls, chart sticks. Default: chart right. Add `.reversed` for chart left. |
| **Fullscreen** | `.fullscreen-layout` | Immersive: chart fills viewport, text overlays on top. |
| **Triple** | `.triple-layout` | Three columns: steps + code panel + chart panel. |
| **Dashboard** | `.dashboard-layout` | Sidebar + main content. No scrolly mechanics. |

All layouts stack to single-column on mobile (768px breakpoint).

## Key Imports

```js
// Core scrolly
import { Scrolly, ScrollyContent } from '@the-vcsi/scrolly-kit';

// Content rendering
import { RenderContent, MarkdownRenderer, CodeBlock, CopyCodeBlock } from '@the-vcsi/scrolly-kit';

// Layout components
import { StoryHeader, Nav, Footer, Meta } from '@the-vcsi/scrolly-kit';

// UI controls
import { ThemeToggle, SimpleSelect, SimpleToggle, Tooltip } from '@the-vcsi/scrolly-kit';

// Types
import type { ContentItem, Author, ScrollyContentProps } from '@the-vcsi/scrolly-kit';
```

## Deeper Reference

- **Component props, CSS vars, usage examples** → Read COMPONENTS.md in this directory
- **Layout CSS classes, variables, responsive behavior, containment rules** → Read LAYOUTS.md in this directory
- **Story structure, copy.json schema, multi-section, theming, SSR gotchas** → Read PATTERNS.md in this directory
