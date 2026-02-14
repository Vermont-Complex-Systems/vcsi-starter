<script>
    let {
        data, 
        xScale, 
        yScale, 
        colorScale, 
        radiusScale, 
        usePopulationSize = false, 
        hoveredCountry = $bindable()
    } = $props();

</script>

{#each data as d (d.entity)}
    <circle
        cx={xScale(d.x_value)}
        cy={yScale(d.life_expectancy)}
        r={usePopulationSize && d.population ? radiusScale(d.population) : 6}
        fill={colorScale(d.owid_region)}
        opacity={hoveredCountry === d.entity ? 1 : 0.7}
        stroke={hoveredCountry === d.entity ? '#333' : 'white'}
        stroke-width={hoveredCountry === d.entity ? 2 : 0.5}
        style="transition: cx 0.8s ease-in-out, cy 0.8s ease-in-out, r 0.4s ease-out;"
        role="graphics-symbol"
        aria-label={d.entity}
        onmouseenter={() => hoveredCountry = d.entity}
        onmouseleave={() => hoveredCountry = null}
    />
{/each}

<style>
    circle {
        cursor: pointer;
    }
</style>
