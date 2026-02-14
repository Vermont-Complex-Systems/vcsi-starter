<script>
    import { fly } from 'svelte/transition';

    let {
        data,
        xScale,
        yScale,
        margin,
        width,
        xLabel = 'X Value',
        isLogScale = false
    } = $props();

    let tooltipWidth = $state(0);

    const xNudge = 15;
    const yNudge = 30;

    // Compute position from data point
    let x = $derived(data ? xScale(data.x_value) + margin.left : 0);
    let y = $derived(data ? yScale(data.life_expectancy) + margin.top : 0);

    // Auto-flip tooltip when near edge
    let xPosition = $derived(
        x + tooltipWidth + xNudge > width ? x - tooltipWidth - xNudge : x + xNudge
    );
    let yPosition = $derived(y - yNudge);
</script>

{#if data}
    <div
        class="tooltip"
        transition:fly={{ y: 10, duration: 200 }}
        style="top: {yPosition}px; left: {xPosition}px"
        bind:clientWidth={tooltipWidth}
    >
        <h1>{data.entity}</h1>
        <p><strong>Life expectancy:</strong> {data.life_expectancy.toFixed(1)} years</p>
        <p><strong>{xLabel}:</strong> {isLogScale ? data.x_value.toLocaleString() : data.x_value.toFixed(2)}</p>
        {#if data.population}
            <p><strong>Population:</strong> {(data.population / 1e6).toFixed(1)}M</p>
        {/if}
    </div>
{/if}

<style>
    .tooltip {
        position: absolute;
        padding: 10px 12px;
        background: #2a2a2a;
        color: #fff;
        box-shadow: rgba(0, 0, 0, 0.3) 2px 3px 8px;
        border-radius: 6px;
        pointer-events: none;
        transition: top 200ms ease, left 200ms ease;
        z-index: 100;
        min-width: 160px;
    }

    h1 {
        margin: 0 0 8px 0;
        font-size: 0.95rem;
        font-weight: 600;
        border-bottom: 1px solid #444;
        padding-bottom: 6px;
    }

    p {
        margin: 4px 0;
        font-size: 0.8rem;
    }

    strong {
        color: #aaa;
    }
</style>
