# Spinner

Loading spinner indicator for async operations.

**Category:** Utilities

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | number | 24 | Spinner size in pixels |
| color | string | 'currentColor' | Spinner color |

## Usage

```svelte
<script>
  import { Spinner } from '@the-vcsi/scrolly-kit';
</script>

{#if loading}
  <Spinner size={32} />
{/if}
```
