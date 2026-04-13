<!-- Rank-frequency scatter plot showing Zipf's law in boys names -->
<script>
	import { scaleLog, scaleLinear } from 'd3';
	import boys1980 from '../data/boys-1980.json';

	let { scrollyIndex } = $props();

	const sorted = boys1980
		.sort((a, b) => b.counts - a.counts)
		.map((d, i) => ({ ...d, rank: i + 1 }));

	const top5 = sorted.slice(0, 5);

	let width = $state(400);
	const height = 400;
	const margin = { top: 20, right: 20, bottom: 45, left: 55 };
	const innerW = $derived(width - margin.left - margin.right);
	const innerH = height - margin.top - margin.bottom;

	let xScale = $derived(scaleLog().domain([1, sorted.length]).range([0, innerW]));
	let yScale = $derived(scaleLinear().domain([0, sorted[0].counts]).range([innerH, 0]));

	let showLabels = $derived(scrollyIndex >= 1);
	let showTail = $derived(scrollyIndex >= 2);
</script>

<div class="chart-container" bind:clientWidth={width}>
	<svg viewBox="0 0 {width} {height}">
		<g transform="translate({margin.left},{margin.top})">
			<!-- Axes -->
			<line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#ccc" />
			<line x1={0} y1={0} x2={0} y2={innerH} stroke="#ccc" />

			<text x={innerW / 2} y={innerH + 35} text-anchor="middle" font-size="11" fill="#666">Rank (log scale)</text>
			<text x={-10} y={innerH / 2} text-anchor="middle" font-size="11" fill="#666"
				transform="rotate(-90, -10, {innerH / 2})">Count</text>

			<!-- All points -->
			{#each sorted as d}
				{@const isTop5 = d.rank <= 5}
				{@const isTail = d.rank > 50}
				<circle
					cx={xScale(d.rank)}
					cy={yScale(d.counts)}
					r={isTop5 ? 4 : 2.5}
					fill={isTop5 ? 'var(--vcsi-color-accent, #154734)' : isTail && showTail ? '#e15759' : '#ccc'}
					opacity={isTail && !showTail ? 0.3 : 0.7}
					style="transition: fill 0.4s, opacity 0.4s;"
				/>
			{/each}

			<!-- Top 5 labels -->
			{#if showLabels}
				{#each top5 as d}
					<text
						x={xScale(d.rank) + 6}
						y={yScale(d.counts) - 6}
						font-size="9"
						font-weight="600"
						fill="var(--vcsi-color-accent, #154734)"
						style="transition: opacity 0.4s;"
					>
						{d.types}
					</text>
				{/each}
			{/if}

			<!-- Tail annotation -->
			{#if showTail}
				<text x={xScale(100)} y={yScale(50) - 10} font-size="10" fill="#e15759" font-weight="500">
					{sorted.filter(d => d.rank > 50).length} names in the long tail
				</text>
			{/if}
		</g>
	</svg>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	svg {
		max-width: 100%;
		height: auto;
	}
</style>