
<script lang="ts">
  import { Select, type WithoutChildren } from "bits-ui";

  type Props = WithoutChildren<Select.RootProps> & {
    placeholder?: string;
    items: { value: string; label: string; disabled?: boolean }[];
    contentProps?: WithoutChildren<Select.ContentProps>;
    // any other specific component props if needed
  };

  let {
    value = $bindable(),
    items,
    contentProps,
    placeholder,
    ...restProps
  }: Props = $props();

  const selectedLabel = $derived(
    items.find((item) => item.value === value)?.label
  );
</script>

<!--
TypeScript Discriminated Unions + destructing (required for "bindable") do not
get along, so we shut typescript up by casting `value` to `never`, however,
from the perspective of the consumer of this component, it will be typed appropriately.
-->
<Select.Root bind:value={value as never} {...restProps} class="simple-select">
  <Select.Trigger>
    {selectedLabel ? selectedLabel : placeholder}
  </Select.Trigger>
  <Select.Portal>
    <Select.Content {...contentProps}>
      <Select.ScrollUpButton>up</Select.ScrollUpButton>
      <Select.Viewport>
        {#each items as { value, label, disabled } (value)}
          <Select.Item {value} {label} {disabled}>
            {#snippet children({ selected })}
              {selected ? "✅" : ""}
              {label}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
      <Select.ScrollDownButton>down</Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>

<style>
    :global(.simple-select) {
        display: flex !important;
        align-items: center;
        margin-top: 1rem;
        margin-bottom: 1rem;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        background: white;
        cursor: pointer;
        font-size: 0.75rem;
    }
</style>
