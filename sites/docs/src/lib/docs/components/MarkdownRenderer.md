# MarkdownRenderer

Renders markdown text with KaTeX math support and syntax highlighting. Supports inline and block math expressions.

**Category:** Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | — | Markdown text to render |
| base | string | '' | Prepended to absolute `/links` and `/images` in the markdown. Only needed on subpath deploys (e.g. GitHub Pages under `/repo`): pass SvelteKit's `base` from `$app/paths` |

## Usage

```svelte
<script>
  import { MarkdownRenderer } from '@the-vcsi/scrolly-kit';
</script>

<MarkdownRenderer text="## Hello **World**" />

<!-- With math -->
<MarkdownRenderer text="The equation $E = mc^2$ shows..." />
```
