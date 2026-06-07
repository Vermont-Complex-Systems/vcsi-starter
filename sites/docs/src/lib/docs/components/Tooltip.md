# Tooltip

Hover tooltip for providing additional context on elements.

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | — | Tooltip text content |
| position | 'top' or 'bottom' or 'left' or 'right' | 'top' | Tooltip position |

## Usage

```svelte
<script>
  import { Tooltip } from '@the-vcsi/scrolly-kit';
</script>

<Tooltip text="More information here">
  <button>Hover me</button>
</Tooltip>
```
