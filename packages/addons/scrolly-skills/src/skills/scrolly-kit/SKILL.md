---
name: scrolly-kit
description: Use when building scrollytelling stories, working with split/fullscreen/triple/dashboard layouts, ScrollyContent steps, copy.json content, VCSI CSS variables, or story theming in a SvelteKit project using @the-vcsi/scrolly-kit
---

## New story

**Check `package.json` for a `"new-story"` script first.** If it exists, use it -- do NOT scaffold manually:

```bash
npm run new-story <slug>             # minimal
npm run new-story <slug> --detailed  # with docs
```

Only create files by hand if the script does not exist. Structure: `src/lib/stories/{slug}/components/Index.svelte` + `data/copy.json`.

**Workflow order & data.** Scaffold *first* with `npm run new-story <slug>` — that command **creates** the story's `data/` folder, which does not exist beforehand. A story's datasets (CSV, JSON, …) then live in that `src/lib/stories/{slug}/data/` folder, next to `copy.json`, imported relatively (`import rows from '../data/data.csv'`). So when the user has data to provide, scaffold first and they drop the file into the new folder — do **not** hunt the filesystem (`~/data`, repo root, …) for it before scaffolding.

### Layouts — ask first, don't assume

Don't silently pick a layout; the right one depends on what the reader should *do*. If the request doesn't already make the shape obvious, ask 2-3 quick questions first (guided narrative or explorable tool? visual beside the text or filling the screen? roughly how many steps? what's the data, and do they have it yet?), confirm a direction, then build **iteratively** — scaffold, get one section working, show the user, adjust — rather than generating the whole story in one shot.

| Layout | Use when | Pattern |
|--------|----------|---------|
| `.split-layout` | Guided narrative, visual beside the text | `.sticky-panel` + `.scrolly-content`; add `.reversed` for chart-left |
| `.fullscreen-layout` | Immersive, full-viewport visual | Full-viewport background + overlay steps |
| `.triple-layout` | Code walkthrough | Three columns: steps + code + chart |
| `.dashboard-layout` | Explorable filters, no scrolling | Sidebar + main content, no scrolly |

### Key imports

```js
import { Scrolly, ScrollyContent, RenderContent, StoryHeader, Footer, ScrollIndicator } from '@the-vcsi/scrolly-kit';
import type { ContentItem, Author } from '@the-vcsi/scrolly-kit';
```

## Detailed Reference

- [COMPONENTS.md](COMPONENTS.md) -- props, CSS vars, usage
- [LAYOUTS.md](LAYOUTS.md) -- CSS classes, variables, containment rules
- [PATTERNS.md](PATTERNS.md) -- copy.json schema, multi-section, theming, SSR
