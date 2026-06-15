# RangeSlider

Dual-thumb range slider for selecting a numeric range (e.g. a span of years). Supports a single-value mode when both thumbs coincide.

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| min | number | 1880 | Minimum value |
| max | number | 2020 | Maximum value |
| value | [number, number] | [1950, 1959] | Selected range (bindable) |
| step | number | 1 | Step increment |

## Usage

```svelte
<script>
  import { RangeSlider } from '@the-vcsi/scrolly-kit';

  let range = $state([1950, 1960]);
</script>

<RangeSlider min={1900} max={2020} bind:value={range} />

<p>Showing {range[0]}–{range[1]}</p>
```

Clicking inside the selected range drags the whole range; the bracket handles adjust each end individually.
