<!--
@component
Tooltip for chart.

Popover anchored to a chart element (or virtual point); renders as a
bottom sheet on mobile.

## Props
- `open` - Whether the tooltip is shown (bindable)
- `anchor` - Element or `{ x, y, width?, height? }` point to anchor to
- `side` - Preferred side: 'top' | 'bottom' | 'left' | 'right' (default 'top')
- `sideOffset` - Distance from anchor in pixels (default 10)
- `onClose` - Called when the tooltip is dismissed
- `children` - Snippet for tooltip content
- `class` - Optional CSS class

## Usage
```ts
let hoveredId = $state(null);
let hoveredElement = $state(null);
let hoveredData = $derived(
        hoveredCourse
            ? data.find(c => c.id === hoveredId)
            : null
    );
// Use with: 
//<ChartTooltip
//    open={!!hoveredId}
//    anchor={hoveredElement}
//    onClose={() => { hoveredId = null; hoveredElement = null; }}
//>
//    {#if hoveredData}
//        <h1 class="tooltip-title">{hoveredData.title}</h1>
//        <p class="tooltip-code">{hoveredData.code}</p>
//        <p class="tooltip-description">{hoveredData.description_clean}</p>
//    {/if}
//</ChartTooltip>
```
-->
<script lang="ts">
    import { Popover, Dialog } from 'bits-ui';
    import { X } from '@lucide/svelte';
    import { fly, fade } from 'svelte/transition';
    import { useIsMobile } from '../../utils/media.svelte';
    import type { Snippet } from 'svelte';

    let {
        open = $bindable(false),
        anchor = null,
        side = 'top',
        sideOffset = 10,
        onClose,
        children,
        class: className = '',
    }: {
        open?: boolean;
        anchor?: Element | { x: number; y: number; width?: number; height?: number } | null;
        side?: 'top' | 'bottom' | 'left' | 'right';
        sideOffset?: number;
        onClose?: () => void;
        children: Snippet;
        class?: string;
    } = $props();

    const mobile = useIsMobile();
    let isMobile = $derived(mobile.current);

    // Normalize anchor to a Measurable (object with getBoundingClientRect)
    let measurableAnchor = $derived.by(() => {
        if (!anchor) return undefined;
        // Element (HTML or SVG) — has getBoundingClientRect natively
        if (anchor instanceof Element) return anchor as unknown as HTMLElement;
        // Coordinate object — create a virtual anchor
        return {
            getBoundingClientRect: () => new DOMRect(
                anchor.x,
                anchor.y,
                anchor.width ?? 0,
                anchor.height ?? 0
            )
        } as unknown as HTMLElement;
    });

    function handleOpenChange(isOpen: boolean) {
        if (!isOpen) onClose?.();
    }
</script>

{#if isMobile}
    <!-- Mobile: centered Dialog modal -->
    <Dialog.Root {open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay forceMount>
                {#snippet child({ props, open: isOpen })}
                    {#if isOpen}
                        <div {...props} class="vcsi-tooltip-overlay" transition:fade={{ duration: 150 }}></div>
                    {/if}
                {/snippet}
            </Dialog.Overlay>
            <Dialog.Content forceMount>
                {#snippet child({ props, open: isOpen })}
                    {#if isOpen}
                        <div {...props} class="vcsi-chart-tooltip vcsi-chart-tooltip-mobile {className}" transition:fly={{ y: 20, duration: 200 }}>
                            <Dialog.Close class="vcsi-chart-tooltip-close" aria-label="Close tooltip">
                                <X size={20} aria-hidden="true" />
                            </Dialog.Close>
                            {@render children()}
                        </div>
                    {/if}
                {/snippet}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
{:else}
    <!-- Desktop: floating Popover anchored to data point -->
    <Popover.Root {open} onOpenChange={handleOpenChange}>
        <Popover.Content
            customAnchor={measurableAnchor}
            {side}
            {sideOffset}
            avoidCollisions
            updatePositionStrategy="always"
            trapFocus={false}
            interactOutsideBehavior="ignore"
            class="vcsi-chart-tooltip {className}"
        >
            {@render children()}
        </Popover.Content>
    </Popover.Root>
{/if}

<style>
    /* Tooltip base styles */
    :global(.vcsi-chart-tooltip) {
        padding: 0.75rem 1rem;
        background: var(--vcsi-tooltip-bg, #2a2a2a);
        color: var(--vcsi-tooltip-fg, #fff);
        box-shadow: rgba(0, 0, 0, 0.3) 2px 3px 8px;
        border-radius: var(--vcsi-radius-lg, 8px);
        max-width: var(--vcsi-tooltip-max-width, 400px);
        min-width: 160px;
        pointer-events: none;
        z-index: 100;
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 0.85rem);
        line-height: 1.4;
    }

    /* Mobile: centered modal with pointer events */
    :global(.vcsi-chart-tooltip-mobile) {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% - 2rem);
        max-width: 360px;
        pointer-events: auto;
        padding: 1.25rem;
    }

    /* Mobile overlay */
    :global(.vcsi-tooltip-overlay) {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
    }

    /* Mobile close button */
    :global(.vcsi-chart-tooltip-close) {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: #999;
        cursor: pointer;
        border-radius: 4px;
    }

    :global(.vcsi-chart-tooltip-close:hover) {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
    }
</style>
