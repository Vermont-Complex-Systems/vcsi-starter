<!-- <script>
    let {
        yScale,
        innerWidth
    } = $props();
</script>

<g clip-path="url(#chart-area)">
    {#each yScale.ticks() as tick (tick)}
        <line
            x1={200}
            x2={innerWidth+50}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="lightgrey"
            stroke-width="1"
        />
    {/each}
</g> -->