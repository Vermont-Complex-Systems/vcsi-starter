# SimpleSelect

Accessible dropdown select built on [bits-ui](https://bits-ui.com/docs/components/select). Keyboard navigation and ARIA come from the primitive.

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | `{ value, label, disabled? }[]` | — | Options to choose from (required) |
| value | string | — | Selected value (bindable) |
| placeholder | string | — | Text shown before a selection is made |
| disabled | boolean | false | Disable the whole control |

## Usage

```svelte
<script>
  import { SimpleSelect } from '@the-vcsi/scrolly-kit';

  let metric = $state('papers');
  const items = [
    { value: 'papers', label: 'Papers' },
    { value: 'citations', label: 'Citations' },
    { value: 'coauthors', label: 'Co-authors', disabled: true }
  ];
</script>

<SimpleSelect {items} bind:value={metric} placeholder="Pick a metric" />
```
