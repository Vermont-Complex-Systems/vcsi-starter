<script>
    let {
        xScale,
        innerWidth,
        innerHeight,
        ticks,
        label,
        isLogScale = false
    } = $props();

    function formatTick(tick) {
        if (isLogScale) {
            return tick >= 1000 ? `${tick / 1000}k` : tick;
        }
        return tick;
    }
</script>

<!-- Grid lines -->
{#each ticks as tick}
    <line
        x1={xScale(tick)}
        x2={xScale(tick)}
        y1={0}
        y2={innerHeight}
        stroke="rgba(255,255,255,0.2)"
        stroke-width="1"
    />
{/each}

<!-- Axis line -->
<line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="white" stroke-width="1" />

<!-- Tick labels -->
{#each ticks as tick}
    <text
        x={xScale(tick)}
        y={innerHeight + 20}
        text-anchor="middle"
        font-size="12"
        fill="white"
    >
        {tick}
    </text>
{/each}

<!-- Axis label -->
<text
    x={innerWidth / 2}
    y={innerHeight + 50}
    text-anchor="middle"
    font-size="14"
    font-weight="500"
    fill="white"
>
    {label}
</text>
