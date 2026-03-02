<script>
	import { scaleLinear, scaleOrdinal, extent, zoomIdentity } from 'd3';

	import { Sidebar, ChartTooltip, Spinner, useIsMobile } from '@the-vcsi/scrolly-kit';
	import { database, ilike, or } from '$lib/db/duck.svelte';

	import AppSidebar from './AppSidebar.svelte';
	import SectionCards from './SectionCards.svelte';
	import DataTable from './DataTable.svelte';
	import EmbeddingDotPlot from './EmbeddingDotPlot.svelte';
	import Grid from './Grid.svelte';

	let { story, data } = $props();

	// ── Filter state ──
	let selectedYear = $state([]);
	let selectedColleges = $state(new Set());
	let searchQuery = $state('');

	// ── DuckDB queries via builder ──

	const db = database({ embeddings: `${story.slug}.parquet` });
	const embeddings = db.from('embeddings');

	// Unfiltered — runs once, stable scales & background dots
	const allData    = embeddings.rows();
	const totalCount = embeddings.count();
	const colleges   = embeddings.distinct('college');
	// 2000 is just a reasonable placeholder
	const yearMinVal = embeddings.min('publication_year', 2000);
	const yearMaxVal = embeddings.max('publication_year', 2025);

	let yearMin = $derived(Number(yearMinVal.value));
	let yearMax = $derived(Number(yearMaxVal.value));

	// Initialize slider to full range once metadata loads
	$effect(() => {
		if (yearMinVal.value != null && selectedYear.length === 0) {
			selectedYear = [yearMin, yearMax];
		}
	});

	
	// Filtered view — re-queries when any filter changes
	// Pretty powerful if you ask me.
	const q = embeddings
		.between('publication_year',
			() => selectedYear,         // adds a year range filter.
			() => [yearMin, yearMax])   // "full range" from the data
		.in('college', () => [...selectedColleges]) // filter IN colleges
		.where(() => or(
			ilike('title', searchQuery),
			ilike('ego_display_name', searchQuery),
			ilike('coauthor_names', searchQuery),
			ilike('abstract', searchQuery)
		));

	const filtered = q.rows();
	let isFiltered = $derived(q.isFiltered);

	const stats = q.summarize({
		paper_count:   'COUNT(*)',
		author_count:  'COUNT(DISTINCT ego_display_name)',
		dept_count:    'COUNT(DISTINCT host_dept)',
		college_count: 'COUNT(DISTINCT college)',
	});

	// ── Chart state ──

	let width = $state(800);
	let height = $state(600);

	let hoveredId = $state(null);
	let hoveredElement = $state(null);
	let zoomTransform = $state(zoomIdentity);

	let selectedId = $state(null);
	let detailData = $derived(
		selectedId ? filtered.rows.find(d => d.id === selectedId) : null
	);

	function onDotClick(id) {
		selectedId = selectedId === id ? null : id;
	}

	const mobile = useIsMobile();
	let isMobile = $derived(mobile.current);

	let margin = $derived(
		isMobile
			? { top: 10, right: 10, bottom: 10, left: 10 }
			: { top: 50, right: 50, bottom: 50, left: 50 }
	);

	const colorScale = scaleOrdinal()
		.domain(["CALS","CAS","CEMS","CNHS","COM","CESS","GSB","GRAD","HON","LCOM","RSENR","SGA"])
		.range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#aec7e8","#ffbb78"]);

	let xExtent = $derived.by(() => {
		const d = allData.rows;
		if (d.length === 0) return [0, 1];
		const [min, max] = extent(d, r => r.umap_1);
		const padding = (max - min) * 0.05;
		return [min - padding, max + padding];
	});

	let yExtent = $derived.by(() => {
		const d = allData.rows;
		if (d.length === 0) return [0, 1];
		const [min, max] = extent(d, r => r.umap_2);
		const padding = (max - min) * 0.05;
		return [min - padding, max + padding];
	});

	let xScale = $derived(
		scaleLinear()
			.domain(xExtent)
			.range([margin.left, width - margin.right])
	);

	let yScale = $derived(
		scaleLinear()
			.domain(yExtent)
			.range([height - margin.bottom, margin.top])
	);

	// Zoomed scales for the grid — rescaled by the zoom transform
	let zoomedXScale = $derived(zoomTransform.rescaleX(xScale));
	let zoomedYScale = $derived(zoomTransform.rescaleY(yScale));

	let hoveredData = $derived(
		hoveredId ? filtered.rows.find(d => d.id === hoveredId) : null
	);
</script>

{#if filtered.loading && filtered.rows.length === 0}
	<div class="loading-container">
		<Spinner />
		<p class="loading-text">Loading DuckDB...</p>
	</div>
{:else if filtered.error}
	<div class="loading-container">
		<p class="loading-text">Failed to load data. Please refresh the page.</p>
	</div>
{:else}
	<Sidebar.Provider>
		<Sidebar.Root id="dashboard-duckdb">
			<AppSidebar
				bind:searchQuery
				bind:selectedYear
				bind:selectedColleges
				colleges={colleges.items}
				{yearMin}
				{yearMax}
				{colorScale}
			/>

			<Sidebar.Inset>
				<SectionCards stats={stats.rows[0]} totalCount={totalCount.value} />
				<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
					<svg viewBox={`0 0 ${width} ${height}`}>
						<Grid xScale={zoomedXScale} yScale={zoomedYScale} {width} {height} {margin} />
					</svg>

					<EmbeddingDotPlot
						data={filtered.rows}
						backgroundData={isFiltered ? allData.rows : []}
						{xScale}
						{yScale}
						{colorScale}
						{width}
						{height}
						{isMobile}
						bind:hoveredId
						bind:hoveredElement
						bind:zoomTransform
						ondotclick={onDotClick}
					/>
				</div>

				{#if detailData}
					<div class="detail-panel">
						<div class="detail-header">
							<h3 class="detail-title">{detailData.title}</h3>
							<button class="detail-close" onclick={() => selectedId = null} aria-label="Close">&times;</button>
						</div>
						<p class="detail-meta">
							{detailData.ego_display_name} · {detailData.college} · {detailData.publication_year}
						</p>
						{#if detailData.abstract}
							<p class="detail-abstract">{detailData.abstract}</p>
						{/if}
						<div class="detail-footer">
							{#if detailData.cited_by_count != null}
								<span class="detail-badge">Cited by {detailData.cited_by_count}</span>
							{/if}
							{#if detailData.doi}
								<a class="detail-link" href={detailData.doi} target="_blank" rel="noopener">
									View on DOI &rarr;
								</a>
							{/if}
						</div>
					</div>
				{/if}

				<DataTable data={filtered.rows} />
			</Sidebar.Inset>
		</Sidebar.Root>
	</Sidebar.Provider>

	<ChartTooltip
		open={!!hoveredId}
		anchor={hoveredElement}
		onClose={() => { hoveredId = null; hoveredElement = null; }}
	>
		{#if hoveredData}
			<h1 class="tooltip-title">{hoveredData.title}</h1>
			<p class="tooltip-meta">{hoveredData.ego_display_name}; {hoveredData.coauthor_names} · {hoveredData.college}</p>
			<p class="tooltip-detail">{hoveredData.publication_year} · Cited by {hoveredData.cited_by_count}</p>
		{/if}
	</ChartTooltip>
{/if}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		gap: 1rem;
	}

	.loading-text {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-small, 14px);
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
	}

	svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.chart-title {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-small, 14px);
		font-weight: 600;
		color: var(--vcsi-gray-700, rgb(78, 78, 78));
		margin: 0;
		padding: var(--vcsi-space-md, 1rem) var(--vcsi-space-lg, 1.5rem) 0;
		flex-shrink: 0;
	}

	.chart-container {
		flex: 1;
		width: 100%;
		min-height: 800px;
		position: relative;
		overflow: hidden;
	}

	.tooltip-title {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
		padding-right: 1.5rem;
	}

	.tooltip-meta {
		margin: 0 0 0.25rem 0;
		font-size: 0.85rem;
		color: var(--vcsi-tooltip-muted, #aaa);
	}

	.tooltip-detail {
		margin: 0;
		font-size: 0.85rem;
		color: var(--vcsi-tooltip-muted, #aaa);
	}

	.detail-panel {
		margin: 0 var(--vcsi-space-lg, 1.5rem);
		padding: var(--vcsi-space-md, 1rem) var(--vcsi-space-lg, 1.5rem);
		background: white;
		border: 1px solid var(--vcsi-border, #ddd);
		border-radius: var(--vcsi-radius-md, 6px);
		flex-shrink: 0;
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.detail-title {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: var(--vcsi-gray-900, rgb(38, 38, 38));
	}

	.detail-close {
		border: none;
		background: none;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
		padding: 0;
		flex-shrink: 0;
	}

	.detail-close:hover {
		color: var(--vcsi-gray-900, rgb(38, 38, 38));
	}

	.detail-meta {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-xs, 12px);
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
		margin: 0 0 0.75rem;
	}

	.detail-abstract {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-small, 14px);
		line-height: 1.6;
		color: var(--vcsi-gray-700, rgb(78, 78, 78));
		margin: 0 0 0.75rem;
	}

	.detail-footer {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.detail-badge {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-xs, 12px);
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
		background: var(--vcsi-sidebar-bg, #ebe6e1);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.detail-link {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-xs, 12px);
		color: var(--color-uvm-green, #007155);
		text-decoration: none;
	}

	.detail-link:hover {
		text-decoration: underline;
	}
</style>
