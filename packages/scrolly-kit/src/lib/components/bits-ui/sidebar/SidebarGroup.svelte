<!--
@component
Groups related controls within Sidebar.Content with consistent spacing.

## Props
- `label` - Optional group heading (rendered as styled `<h3>`)
- `children` - Group content
- `class` - Optional CSS class

## Usage
```svelte
<Sidebar.Group label="Filters">
    <SimpleSelect ... />
    <Legend ... />
</Sidebar.Group>
```
-->
<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        label,
        children,
        class: className = '',
    }: {
        label?: string;
        children: Snippet;
        class?: string;
    } = $props();
</script>

<div class="sidebar-group {className}">
    {#if label}
        <h3 class="sidebar-group-label">{label}</h3>
    {/if}
    {@render children()}
</div>

<style>
    .sidebar-group {
        padding-bottom: var(--vcsi-space-lg, 1.5rem);
    }
    
    .sidebar-group-label {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-small, 14px);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 var(--vcsi-space-md, 1rem);
        color: var(--vcsi-gray-700, rgb(78, 78, 78));
    }
</style>
