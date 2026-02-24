<!--
@component
A styled select dropdown built on bits-ui Select primitives.

## Props
- `value` - Selected value (bindable)
- `items` - Array of `{ value, label, disabled? }` objects
- `placeholder` - Placeholder text when no value selected
- `contentProps` - Additional props passed to Select.Content
- Plus all Select.RootProps (without children)

## Usage
```svelte
<SimpleSelect
    items={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
    bind:value={selected}
    placeholder="Choose..."
/>
```
-->
<script lang="ts">
  import { Select, type WithoutChildren } from "bits-ui";
  import { ChevronDown, ChevronUp, Check } from "@lucide/svelte";

  type Props = WithoutChildren<Select.RootProps> & {
    placeholder?: string;
    items: { value: string; label: string; disabled?: boolean }[];
    contentProps?: WithoutChildren<Select.ContentProps>;
  };

  let {
    value = $bindable(),
    items,
    contentProps,
    placeholder,
    type,
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
<Select.Root bind:value={value as never} {...restProps} type={"single"}>
  <Select.Trigger class="vcsi-select-trigger">
    <span class="vcsi-select-value" class:placeholder={!selectedLabel}>
      {selectedLabel ? selectedLabel : placeholder}
    </span>
    <ChevronDown size={16} aria-hidden="true" class="vcsi-select-chevron" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content class="vcsi-select-content" {...contentProps}>
      <Select.ScrollUpButton class="vcsi-select-scroll-btn">
        <ChevronUp size={14} aria-hidden="true" />
      </Select.ScrollUpButton>
      <Select.Viewport>
        {#each items as { value: itemValue, label, disabled } (itemValue)}
          <Select.Item value={itemValue} {label} {disabled} class="vcsi-select-item">
            {#snippet children({ selected })}
              <span class="vcsi-select-item-indicator">
                {#if selected}<Check size={14} aria-hidden="true" />{/if}
              </span>
              {label}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
      <Select.ScrollDownButton class="vcsi-select-scroll-btn">
        <ChevronDown size={14} aria-hidden="true" />
      </Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>

<style>
    :global(.vcsi-select-trigger) {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 0.9rem;
        font-family: inherit;
        line-height: 1.4;
        color: inherit;
        transition: border-color 0.15s, box-shadow 0.15s;
    }

    :global(.vcsi-select-trigger:hover) {
        border-color: #999;
    }

    :global(.vcsi-select-trigger:focus-visible) {
        outline: none;
        border-color: var(--vcsi-color-accent, #007155);
        box-shadow: 0 0 0 2px rgba(0, 113, 85, 0.15);
    }

    :global(.vcsi-select-trigger[data-state="open"]) {
        border-color: var(--vcsi-color-accent, #007155);
        box-shadow: 0 0 0 2px rgba(0, 113, 85, 0.15);
    }

    :global(.vcsi-select-value.placeholder) {
        color: #999;
    }

    :global(.vcsi-select-chevron) {
        flex-shrink: 0;
        color: #666;
        transition: transform 0.15s;
    }

    :global(.vcsi-select-trigger[data-state="open"] .vcsi-select-chevron) {
        transform: rotate(180deg);
    }

    :global(.vcsi-select-content) {
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        padding: 0.25rem;
        z-index: 50;
        min-width: var(--bits-select-anchor-width);
        max-height: var(--bits-select-content-available-height, 300px);
        overflow: auto;
    }

    :global(.vcsi-select-item) {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.1s;
    }

    :global(.vcsi-select-item:hover),
    :global(.vcsi-select-item[data-highlighted]) {
        background-color: rgba(0, 0, 0, 0.05);
    }

    :global(.vcsi-select-item[data-selected]) {
        font-weight: 500;
    }

    :global(.vcsi-select-item[data-disabled]) {
        opacity: 0.4;
        cursor: not-allowed;
    }

    :global(.vcsi-select-item-indicator) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        flex-shrink: 0;
        color: var(--vcsi-color-accent, #007155);
    }

    :global(.vcsi-select-scroll-btn) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem;
        color: #666;
        cursor: pointer;
    }
</style>
