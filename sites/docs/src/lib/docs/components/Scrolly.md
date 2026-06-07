# Scrolly

Base scroll detection using IntersectionObserver. Tracks which child element is most in view and updates the `value` binding. Used internally by ScrollyContent, but can be used directly for custom layouts.

**Category:** Scrolling

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Index of most visible child (bindable) |
| `root` | `Element \| null` | `null` | IntersectionObserver root element |
| `top` | `number` | `0` | Top margin offset in pixels |
| `bottom` | `number` | `0` | Bottom margin offset in pixels |
| `increments` | `number` | `100` | Number of threshold steps |

## Usage

```svelte
<script>
  import { Scrolly } from '@the-vcsi/scrolly-kit';
  let index = $state(0);
</script>

<Scrolly bind:value={index}>
  <div>Step 1</div>
  <div>Step 2</div>
  <div>Step 3</div>
</Scrolly>

<p>Current step: {index}</p>
```
