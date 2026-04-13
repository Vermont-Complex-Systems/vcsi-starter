<script>
	import data from '../data/data.csv';

	const width = 360;
	const height = 200;
	const margin = { top: 30, right: 40, bottom: 20, left: 40 };
	const plotW = width - margin.left - margin.right;
	const plotH = height - margin.top - margin.bottom;

	const colors = { A: '#e15759', B: '#4e79a7', C: '#76b7b2', D: '#f28e2b' };

	// Normalize both to 0-1 for comparison
	const maxValue = Math.max(...data.map(d => +d.value));
	const rows = data.map(d => ({
		label: d.label,
		countNorm: +d.value / maxValue,
		rate: +d.rate,
	}));

	const colLeft = margin.left + plotW * 0.2;
	const colRight = margin.left + plotW * 0.8;

	function yPos(val) {
		return margin.top + (1 - val) * plotH;
	}
</script>

<div class="chart">
	<svg viewBox="0 0 {width} {height}">
		<!-- Column headers -->
		<text x={colLeft} y={margin.top - 14} text-anchor="middle" font-size="11" font-weight="600" fill="#666">Count</text>
		<text x={colRight} y={margin.top - 14} text-anchor="middle" font-size="11" font-weight="600" fill="#666">Rate</text>

		<!-- Vertical guides -->
		<line x1={colLeft} y1={margin.top} x2={colLeft} y2={margin.top + plotH} stroke="#e0e0e0" />
		<line x1={colRight} y1={margin.top} x2={colRight} y2={margin.top + plotH} stroke="#e0e0e0" />

		<!-- Slopes -->
		{#each rows as d}
			{@const y1 = yPos(d.countNorm)}
			{@const y2 = yPos(d.rate)}
			<line x1={colLeft} {y1} x2={colRight} {y2}
				stroke={colors[d.label]} stroke-width="1.5" opacity="0.6" />
			<circle cx={colLeft} cy={y1} r="4" fill={colors[d.label]} />
			<circle cx={colRight} cy={y2} r="4" fill={colors[d.label]} />
			<text x={colLeft - 10} y={y1 + 4} text-anchor="end" font-size="10" fill={colors[d.label]} font-weight="600">
				{d.label}
			</text>
		{/each}
	</svg>
</div>

<style>
	.chart {
		display: flex;
		justify-content: center;
		padding: 1rem 0;
	}

	svg {
		max-width: 360px;
		width: 100%;
		height: auto;
	}
</style>