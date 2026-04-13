<!-- Static slope chart comparing top 5 names: rank by count vs rank by name length -->
<script>
	import boys1980 from '../data/boys-1980.json';

	const top10 = boys1980
		.sort((a, b) => b.counts - a.counts)
		.slice(0, 10)
		.map((d, i) => ({ ...d, countRank: i }));

	// Re-rank by name length (shorter = higher rank)
	const byLength = [...top10].sort((a, b) => a.types.length - b.types.length);
	const rows = top10.map(d => ({
		name: d.types,
		countRank: d.countRank,
		lengthRank: byLength.findIndex(b => b.types === d.types),
		count: d.counts,
		length: d.types.length,
	}));

	const width = 360;
	const height = 240;
	const margin = { top: 30, right: 50, bottom: 20, left: 50 };
	const plotW = width - margin.left - margin.right;
	const plotH = height - margin.top - margin.bottom;

	const n = rows.length;
	const colors = ['#e15759','#4e79a7','#76b7b2','#f28e2b','#59a14f','#edc949','#af7aa1','#ff9da7','#9c755f','#bab0ab'];

	const colLeft = margin.left + plotW * 0.15;
	const colRight = margin.left + plotW * 0.85;

	function yPos(rank) {
		return margin.top + (rank / (n - 1)) * plotH;
	}
</script>

<figure class="chart">
	<svg viewBox="0 0 {width} {height}">
		<text x={colLeft} y={margin.top - 14} text-anchor="middle" font-size="11" font-weight="600" fill="#666">By count</text>
		<text x={colRight} y={margin.top - 14} text-anchor="middle" font-size="11" font-weight="600" fill="#666">By name length</text>

		<line x1={colLeft} y1={margin.top} x2={colLeft} y2={margin.top + plotH} stroke="#e0e0e0" />
		<line x1={colRight} y1={margin.top} x2={colRight} y2={margin.top + plotH} stroke="#e0e0e0" />

		{#each rows as d, i}
			{@const y1 = yPos(d.countRank)}
			{@const y2 = yPos(d.lengthRank)}
			<line x1={colLeft} {y1} x2={colRight} {y2}
				stroke={colors[i]} stroke-width="1.5" opacity="0.5" />
			<circle cx={colLeft} cy={y1} r="4" fill={colors[i]} />
			<circle cx={colRight} cy={y2} r="4" fill={colors[i]} />
			<text x={colLeft - 8} y={y1 + 4} text-anchor="end" font-size="9" fill={colors[i]} font-weight="600">
				{d.name}
			</text>
			<text x={colRight + 8} y={y2 + 4} text-anchor="start" font-size="9" fill={colors[i]}>
				{d.length} chars
			</text>
		{/each}
	</svg>
</figure>

<style>
	.chart {
		display: flex;
		justify-content: center;
		padding: 1rem 0;
		margin: 0;
	}

	svg {
		max-width: 360px;
		width: 100%;
		height: auto;
	}
</style>