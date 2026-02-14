<script>
    let {
        data,
        xScale,
        yScale,
        colorScale,
        radiusScale,
        hoveredCourse = $bindable(),
        isMobile = false
    } = $props();

</script>

{#each data as d (d.code)}
    <circle
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        r={6}
        fill={colorScale(d.college)}
        opacity={hoveredCourse === d.code ? 1 : 0.7}
        stroke={hoveredCourse === d.code ? '#333' : 'white'}
        stroke-width={hoveredCourse === d.code ? 2 : 0.5}
        style="transition: cx 0.8s ease-in-out, cy 0.8s ease-in-out, r 0.4s ease-out;"
        role="graphics-symbol"
        aria-label={d.code}
        onclick={() => hoveredCourse = d.code}
        onmouseenter={() => { if (!isMobile) hoveredCourse = d.code; }}
        onmouseleave={() => { if (!isMobile) hoveredCourse = null; }}
    />
{/each}

<style>
    circle {
        cursor: pointer;
    }
</style>
