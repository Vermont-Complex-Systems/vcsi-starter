<script>
	let {
		data,
		xScale,
		yScale,
		colorScale,
		radiusScale,
		usePopulationSize = false,
		hoveredCountry = $bindable(null)
	} = $props();

	const DEFAULT_RADIUS = 6;
</script>

{#each data as country (country.entity)}
	{@const hovered = hoveredCountry === country.entity}
	{@const r = usePopulationSize && country.population
		? radiusScale(country.population)
		: DEFAULT_RADIUS}

	<circle
		cx={xScale(country.x_value)}
		cy={yScale(country.life_expectancy)}
		{r}
		fill={colorScale(country.owid_region)}
		opacity={hovered ? 1 : 0.7}
		stroke={hovered ? '#333' : 'white'}
		stroke-width={hovered ? 2 : 0.5}
		role="graphics-symbol"
		aria-label={country.entity}
		onmouseenter={() => (hoveredCountry = country.entity)}
		onmouseleave={() => (hoveredCountry = null)}
	/>
{/each}

<style>
	circle {
		cursor: pointer;
		transition:
			cx 0.8s ease-in-out,
			cy 0.8s ease-in-out,
			r 0.4s ease-out;
	}
</style>
