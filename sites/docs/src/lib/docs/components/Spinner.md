# Spinner

Loading indicator with a text label. Size is fixed (40px); the color comes from `--vcsi-color-accent`.

**Category:** Utilities

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | 'Loading...' | Label rendered under the spinner |

## Usage

```svelte
<script>
  import { Spinner } from '@the-vcsi/scrolly-kit';
</script>

{#if loading}
  <Spinner text="Fetching papers..." />
{/if}
```

To recolor, override the accent token on a parent: `--vcsi-color-accent: #2c5aa0;`
