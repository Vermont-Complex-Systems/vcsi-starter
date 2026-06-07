# RenderContent

Renders a single content item based on its type. Supports html, markdown, math, and code types.

**Category:** Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | ContentItem | — | Content item with type and value |

## Usage

```svelte
<script>
  import { RenderContent } from '@the-vcsi/scrolly-kit';
</script>

<RenderContent item={{ type: 'markdown', value: '## Hello' }} />

<RenderContent item={{
  type: 'code',
  value: 'const x = 1;',
  language: 'javascript'
}} />
```
