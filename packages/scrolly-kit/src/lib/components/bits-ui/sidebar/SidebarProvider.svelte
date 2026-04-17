<script lang="ts">
    import { untrack } from 'svelte';
    import { SidebarState, setSidebarState } from './sidebar-state.svelte';
    import type { Snippet } from 'svelte';

    let {
        collapsed = $bindable(false),
        sidebarWidth = '280px',
        collapsedWidth = '48px',
        children,
    }: {
        collapsed?: boolean;
        sidebarWidth?: string;
        collapsedWidth?: string;
        children: Snippet;
    } = $props();

    const state = untrack(() => new SidebarState({ collapsed, sidebarWidth, collapsedWidth }));
    setSidebarState(state);

    // Sync bindable prop with state (bidirectional)
    $effect(() => { collapsed = state.collapsed; });
    $effect(() => { state.collapsed = collapsed; });
</script>

{@render children()}
