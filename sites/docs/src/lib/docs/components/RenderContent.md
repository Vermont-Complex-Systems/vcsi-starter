# RenderContent

Renders one or more `ContentItem`s from a story's `copy.json`. Accepts a single item or an array, and can render Svelte components inline via a `components` map.

**Category:** Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | `ContentItem \| ContentItem[]` | — | One content item, or an array of them |
| components | `Record<string, Component>` | `undefined` | Map of Svelte components for `type: "component"` items |

## Content item types

Each item is `{ type, value }`:

| type | Renders as | Extra fields |
|------|-----------|--------------|
| `markdown` | Markdown via MarkdownRenderer (KaTeX: `$inline$`, `$$block$$`) | — |
| `html` | Raw HTML, inserted directly | — |
| `math` | Centered KaTeX expression | — |
| `code` | Syntax-highlighted code block | `language`, `highlightLines` (e.g. `"1-3,5"`) |
| `component` | A Svelte component named by `value`, looked up in the `components` map | — |

## Usage

Render a named section of `copy.json` (an array of items):

```svelte
<script>
  import { RenderContent } from '@the-vcsi/scrolly-kit';
  let { data } = $props();
</script>

<RenderContent items={data.introduction} />
```

## Embedding a component inline

To drop a chart into the middle of prose, add a `component` item in `copy.json` and pass a `components` map. The `value` must match a map key exactly; inline components render with **no props**, so make them self-contained.

```json
// copy.json
"interlude": [
  { "type": "markdown", "value": "Before the chart." },
  { "type": "component", "value": "SlopeChart" },
  { "type": "markdown", "value": "After the chart." }
]
```

```svelte
<script>
  import { RenderContent } from '@the-vcsi/scrolly-kit';
  import SlopeChart from './SlopeChart.svelte';

  let { data } = $props();
  const components = { SlopeChart };
</script>

<RenderContent items={data.interlude} {components} />
```

*(This is the exact pattern used in the `baked` template's `scrolly-story-1`.)*
