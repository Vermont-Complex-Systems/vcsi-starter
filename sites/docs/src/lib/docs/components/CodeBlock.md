# CodeBlock

Syntax-highlighted code display with an optional filename badge.

**Category:** Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| code | string | — | Code content to display |
| language | string | 'typescript' | Language for syntax highlighting |
| filename | string | '' | Filename rendered as a badge tab above the code |

## Usage

```svelte
<script>
  import { CodeBlock } from '@the-vcsi/scrolly-kit';
</script>

<CodeBlock
  code="const x = 1;"
  language="javascript"
  filename="example.js"
/>
```
