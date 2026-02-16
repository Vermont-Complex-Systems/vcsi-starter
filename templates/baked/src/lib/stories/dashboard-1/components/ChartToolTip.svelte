<script>
    import { fly, fade } from 'svelte/transition';

    let {
        data,
        xScale,
        yScale,
        margin,
        width,
        height,
        isMobile = false,
        onClose
    } = $props();

    let tooltipWidth = $state(0);
    let tooltipHeight = $state(0);

    const xNudge = 15;
    const yNudge = 15;

    // Compute position from data point (desktop only)
    let x = $derived(data ? xScale(data.x) + margin.left : 0);
    let y = $derived(data ? yScale(data.y) + margin.top : 0);

    // Check if dot is in bottom half of chart
    let isBottomHalf = $derived(y > height / 2);

    // Auto-flip tooltip when near edge (horizontal)
    let xPosition = $derived(
        x + tooltipWidth + xNudge > width ? x - tooltipWidth - xNudge : x + xNudge
    );

    // Auto-flip tooltip vertically: above for bottom half, below for top half
    let yPosition = $derived(
        isBottomHalf ? y - tooltipHeight - yNudge : y + yNudge
    );
</script>

{#if data}
    {#if isMobile}
        <!-- Mobile: centered modal with backdrop -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="tooltip-backdrop" transition:fade={{ duration: 150 }} onclick={onClose}></div>
        <div
            class="tooltip tooltip-mobile"
            transition:fly={{ y: 20, duration: 200 }}
        >
            <button class="close-btn" onclick={onClose} aria-label="Close tooltip">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <h1>{data.title}</h1>
            <p class="code">{data.code}</p>
            <p class="description">{data.description_clean}</p>
        </div>
    {:else}
        <!-- Desktop: floating tooltip -->
        <div
            class="tooltip"
            transition:fly={{ y: 10, duration: 200 }}
            style="top: {yPosition}px; left: {xPosition}px"
            bind:clientWidth={tooltipWidth}
            bind:clientHeight={tooltipHeight}
        >
            <h1>{data.title}</h1>
            <p class="code">{data.code}</p>
            <p class="description">{data.description_clean}</p>
        </div>
    {/if}
{/if}

<style>
    .tooltip-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
    }

    .tooltip {
        position: absolute;
        padding: 12px 14px;
        background: #2a2a2a;
        color: #fff;
        box-shadow: rgba(0, 0, 0, 0.3) 2px 3px 8px;
        border-radius: 8px;
        max-width: 400px;
        pointer-events: none;
        transition: top 200ms ease, left 200ms ease;
        z-index: 100;
        min-width: 160px;
    }

    .tooltip-mobile {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% - 2rem);
        max-width: 360px;
        pointer-events: auto;
        padding: 1.25rem;
    }

    .close-btn {
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

    .close-btn:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
    }

    h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        padding-right: 1.5rem;
    }

    .code {
        margin: 0 0 0.75rem 0;
        font-size: 0.85rem;
        color: #aaa;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #444;
    }

    .description {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.4;
    }
</style>
