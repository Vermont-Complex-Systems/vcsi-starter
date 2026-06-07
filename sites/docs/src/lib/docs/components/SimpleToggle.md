# SimpleToggle

Simple on/off toggle switch with label support.

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | false | Toggle state (bindable) |
| label | string | — | Optional label |

## Usage

```svelte
<script>
  import { SimpleToggle } from '@the-vcsi/scrolly-kit';
  let enabled = $state(false);
</script>

<SimpleToggle bind:checked={enabled} label="Enable feature" />
```
