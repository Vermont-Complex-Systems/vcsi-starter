
<script>
    
    let { layoutMode = $bindable() } = $props();

</script>

<div class='layout-toggle'>
    <button
        class:active={layoutMode === 'split'}
        onclick={() => layoutMode = 'split'}
    >
        Split
    </button>
    <button
        class:active={ layoutMode === 'fullscreen' }
        onclick={() => layoutMode = 'fullscreen'}
    >
        Fullscreen
    </button>
</div>

<style>
    .layout-toggle {
        position: sticky;
        top: 1rem;
        z-index: 100;
        display: flex;
        gap: 0.5rem;
        background: var(--story-bg, var(--color-bg));
        padding: 0.5rem;
        border-radius: 8px;
        width: fit-content;
        margin-left: auto;
    }

    .layout-toggle button {
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        background: white;
        border-radius: 4px;
        font-size: 0.875rem;
        transition: all 150ms ease;
    }

    .layout-toggle button:hover {
        border-color: #999;
    }

    .layout-toggle button.active {
        background: #333;
        color: white;
        border-color: #333;
    }
</style>