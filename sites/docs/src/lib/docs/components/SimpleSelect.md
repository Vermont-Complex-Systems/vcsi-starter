# SimpleSelect

Minimal dropdown select component with clean styling.

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | string[] | — | Array of option values |
| value | string | — | Selected value (bindable) |
| label | string | — | Optional label |

## Usage

```svelte
<script>
  import { SimpleSelect } from '@the-vcsi/scrolly-kit';
  let selected = $state('option1');
</script>

<SimpleSelect
  options={['option1', 'option2', 'option3']}
  bind:value={selected}
  label="Choose an option"
/>
```
