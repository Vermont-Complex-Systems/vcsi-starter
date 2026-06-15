# ChartTooltip

Popover-style tooltip anchored to a chart element or a virtual point. Renders as a bottom sheet on mobile.

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| open | boolean | false | Whether the tooltip is shown (bindable) |
| anchor | Element or { x, y, width?, height? } or null | null | Element or virtual point to anchor to |
| side | 'top' or 'bottom' or 'left' or 'right' | 'top' | Preferred side |
| sideOffset | number | 10 | Distance from anchor in pixels |
| onClose | () => void | — | Called when the tooltip is dismissed |
| children | Snippet | — | Tooltip content (required) |
| class | string | '' | Optional CSS class |

## Usage

```svelte
<script>
  import { ChartTooltip } from '@the-vcsi/scrolly-kit';

  let hoveredId = $state(null);
  let hoveredElement = $state(null);
  let hoveredData = $derived(
    hoveredId ? data.find(d => d.id === hoveredId) : null
  );
</script>

<ChartTooltip
  open={!!hoveredId}
  anchor={hoveredElement}
  onClose={() => { hoveredId = null; hoveredElement = null; }}
>
  {#if hoveredData}
    <h1>{hoveredData.title}</h1>
    <p>{hoveredData.description}</p>
  {/if}
</ChartTooltip>
```
