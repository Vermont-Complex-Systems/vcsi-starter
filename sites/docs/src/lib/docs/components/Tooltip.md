# Tooltip

Positioned annotation box for charts. It has **no hover behavior of its own**: the parent tracks the pointer (e.g. `onmousemove` over an SVG) and drives `visible`/`x`/`y`. For an interactive tooltip with triggers and a mobile bottom sheet, use [ChartTooltip](ChartTooltip) instead.

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| visible | boolean | false | Show/hide the box |
| x | number | 0 | Pointer x (viewport px) |
| y | number | 0 | Pointer y (viewport px) |
| content | string | '' | Text content (`white-space: pre-line`, so `\n` breaks lines) |
| offset | `{ x, y }` | `{ x: 10, y: -30 }` | Offset from the pointer |

## Usage

```svelte
<script>
  import { Tooltip } from '@the-vcsi/scrolly-kit';

  let tip = $state({ visible: false, x: 0, y: 0, content: '' });

  function onPoint(event, d) {
    tip = { visible: true, x: event.clientX, y: event.clientY, content: `${d.name}\n${d.value}` };
  }
</script>

<svg onmouseleave={() => (tip.visible = false)}>
  <!-- circles calling onPoint(event, d) on mousemove -->
</svg>

<Tooltip {...tip} />
```

Note: hover-only annotations are invisible to keyboard and screen-reader users; provide the underlying data as text or a table alongside the chart.
