# SimpleToggle

On/off toggle switch with a text state label, built on [bits-ui](https://bits-ui.com/docs/components/toggle).

**Category:** UI Controls

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isTrue | boolean | — | Toggle state (bindable) |
| onText | string | 'Yes' | Label shown when on |
| offText | string | 'No' | Label shown when off |

## Usage

```svelte
<script>
  import { SimpleToggle } from '@the-vcsi/scrolly-kit';

  let showRaw = $state(false);
</script>

<SimpleToggle bind:isTrue={showRaw} onText="Raw counts" offText="Normalized" />
```
