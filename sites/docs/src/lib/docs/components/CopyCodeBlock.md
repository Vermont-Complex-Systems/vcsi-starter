# CopyCodeBlock

Copyable code block with one-click clipboard support. Shows a checkmark when successfully copied.

**Category:** Content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| command | string | — | The text to display and copy (required) |
| label | string | '' | Optional label above the code block |
| language | string | '' | Enables syntax highlighting when set |

## Usage

```svelte
<script>
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
</script>

<CopyCodeBlock command="npm install @the-vcsi/scrolly-kit" />

<CopyCodeBlock
  command="npx degit Vermont-Complex-Systems/vcsi-starter my-project"
  label="Scaffold a new project"
/>
```
