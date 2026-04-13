<script>
	import data from '../data/data.csv';

	let { scrollyIndex } = $props();

	const width = 300;
	const height = 250;
	const margin = { top: 20, right: 30, bottom: 40, left: 50 };
	const plotW = width - margin.left - margin.right;
	const plotH = height - margin.top - margin.bottom;

	const avgRate = data.reduce((s, d) => s + +d.rate, 0) / data.length;

	const colors = { A: '#e15759', B: '#4e79a7', C: '#76b7b2', D: '#f28e2b' };

	function x(d) { return margin.left + (+d.value / 60) * plotW; }
	function y(d) { return margin.top + (1 - +d.rate) * plotH; }

	let highlighted = $derived(
		scrollyIndex === 0 ? null :
		scrollyIndex === 1 ? 'AB' :
		'all'
	);

	let showAvgLine = $derived(scrollyIndex >= 2);
</script>

<div class="chart">
	<svg viewBox="0 0 {width} {height}">
		<!-- Axes -->
		<line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#ccc" />
		<line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#ccc" />

		<!-- Axis labels -->
		<text x={margin.left + plotW / 2} y={height - 5} text-anchor="middle" font-size="11" fill="#666">Count</text>
		<text x={12} y={margin.top + plotH / 2} text-anchor="middle" font-size="11" fill="#666"
			transform="rotate(-90, 12, {margin.top + plotH / 2})">Rate</text>

		<!-- Average rate line -->
		{#if showAvgLine}
			{@const avgY = margin.top + (1 - avgRate) * plotH}
			<line x1={margin.left} y1={avgY} x2={margin.left + plotW} y2={avgY}
				stroke="#999" stroke-dasharray="4,3" style="transition: opacity 0.5s;" />
			<text x={margin.left + plotW + 3} y={avgY + 4} font-size="9" fill="#999">avg</text>
		{/if}

		<!-- Points -->
		{#each data as d}
			{@const isHighlighted = highlighted === 'all' || (highlighted === 'AB' && (d.label === 'A' || d.label === 'B'))}
			<circle
				cx={x(d)}
				cy={y(d)}
				r={isHighlighted ? 8 : 6}
				fill={isHighlighted ? colors[d.label] : '#ccc'}
				style="transition: all 0.4s ease;"
			/>
			{#if isHighlighted}
				<text x={x(d)} y={y(d) - 12} text-anchor="middle" font-size="11" font-weight="600"
					fill={colors[d.label]} style="transition: opacity 0.3s;">
					{d.label}
				</text>
			{/if}
		{/each}
	</svg>
</div>

<style>
	.chart {
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