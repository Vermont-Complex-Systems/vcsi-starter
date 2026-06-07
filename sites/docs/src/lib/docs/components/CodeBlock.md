# CodeBlock

Syntax-highlighted code display with optional line numbers and language badge.

**Category:** Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| code | string | — | Code content to display |
| language | string | — | Language for syntax highlighting |
| showLineNumbers | boolean | false | Show line numbers |

## Usage

```svelte
<script>
  import { CodeBlock } from '@the-vcsi/scrolly-kit';
</script>

<CodeBlock
  code="const x = 1;"
  language="javascript"
  showLineNumbers
/>
```
