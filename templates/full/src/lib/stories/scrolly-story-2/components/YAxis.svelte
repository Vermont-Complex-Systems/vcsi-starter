<script>
    let {
        yScale,
        innerWidth,
        innerHeight,
        ticks,
        label
    } = $props();
</script>

<!-- Grid lines (clipped) -->
<g clip-path="url(#chart-area)">
    {#each ticks as tick (tick)}
        <line
            x1={0}
            x2={innerWidth}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="rgba(255,255,255,0.2)"
            stroke-width="1"
        />
    {/each}
</g>

<!-- Axis line -->
<line x1={0} x2={0} y1={0} y2={innerHeight} stroke="white" stroke-width="1" />

<!-- Tick labels (clipped) -->
<g clip-path="url(#chart-area-y)">
    {#each ticks as tick (tick)}
        <text
            x={-10}
            y={yScale(tick)}
            text-anchor="end"
            alignment-baseline="middle"
            font-size="12"
            fill="white"
        >
            {tick}
        </text>
    {/each}
</g>

<!-- Axis label -->
<text
    x={-innerHeight / 2}
    y={-45}
    text-anchor="middle"
    font-size="14"
    font-weight="500"
    transform="rotate(-90)"
    fill="white"
>
    {label}
</text>
