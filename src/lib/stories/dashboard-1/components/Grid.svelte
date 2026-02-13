<script>
    let { xScale, yScale, width, height, margin, tickCount = 8 } = $props();

    let xTicks = $derived(xScale.ticks(tickCount));
    let yTicks = $derived(yScale.ticks(tickCount));
</script>

<g class="grid">
    {#each xTicks as tick (tick)}
        <line
            x1={xScale(tick)}
            y1={margin.top}
            x2={xScale(tick)}
            y2={height - margin.bottom}
            stroke="#ccc"
            stroke-width="1"
            stroke-dasharray="3,3"
        />
    {/each}
    {#each yTicks as tick (tick)}
        <line
            x1={margin.left}
            y1={yScale(tick)}
            x2={width - margin.right}
            y2={yScale(tick)}
            stroke="#ccc"
            stroke-width="1"
            stroke-dasharray="3,3"
        />
    {/each}
</g>
