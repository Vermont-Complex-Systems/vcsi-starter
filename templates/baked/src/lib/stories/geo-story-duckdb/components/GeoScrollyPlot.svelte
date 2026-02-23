<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import Legend from './Legend.svelte';
    import { database } from '$lib/db/duck.svelte';

    // GeoJSON stays static — no reason to push geometry through DuckDB
    import districtsGeo from '../data/districts.json';
    import boundaryGeo from '../data/boundary.json';

    let { scrollyIndex } = $props();

    // Fix winding order for GeoJSON features
    const districts = districtsGeo.features.map(f => rewind(f, { reverse: true }));
    const boundary = boundaryGeo.features.map(f => rewind(f, { reverse: true }));

    // Chart dimensions
    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);
    let isMobile = $derived(width < 768);

    let stepIndex = $derived(scrollyIndex ?? 0);

    // ── DuckDB data layer ──
    const db = database({ metadata: 'metadata.parquet' });
    const meta = db.from('metadata');

    // Population for 2011 (used in step 1)
    const pop2011 = meta.eq('year', () => 2011).rows();

    // Population change: self-join to compute % change per arrondissement
    const changeData = db.sql(t =>
        `SELECT a.arrondissement,
                ((b.population - a.population) * 100.0 / a.population) as change
         FROM ${t.metadata} a
         JOIN ${t.metadata} b ON a.arrondissement = b.arrondissement
         WHERE a.year = 2011 AND b.year = 2016`
    );

    // ── Map config driven by scroll step + reactive query results ──
    let mapConfig = $derived.by(() => {
        switch (stepIndex) {
            case 0:
                return {
                    title: 'Montreal',
                    colors: null,
                    labelsToShow: null,
                    legend: null
                };

            case 1: {
                const rows = pop2011.rows;
                if (rows.length === 0) return { title: 'Population 2011', colors: null, labelsToShow: null, legend: null };

                const maxPopulation = d3.max(rows, d => d.population);
                const colorScale = d3.scaleSequential(d3.interpolateSpectral)
                    .domain([maxPopulation, 0]);

                const colors = new Map(
                    rows.map(d => [d.arrondissement, colorScale(d.population)])
                );

                const labelsToShow = new Set(
                    rows
                        .toSorted((a, b) => b.population - a.population)
                        .slice(0, 5)
                        .map(d => d.arrondissement)
                );

                return { title: 'Population 2011', colors, labelsToShow, legend: colorScale };
            }

            case 2: {
                const rows = changeData.rows;
                if (rows.length === 0) return { title: 'Population Change 2011→2016', colors: null, labelsToShow: null, legend: null };

                const maxChange = Math.max(
                    Math.abs(d3.min(rows, d => d.change)),
                    Math.abs(d3.max(rows, d => d.change))
                );
                const colorScale = d3.scaleDiverging(d3.interpolateRdBu)
                    .domain([-maxChange, 0, maxChange]);

                const colors = new Map(
                    rows.map(d => [d.arrondissement, colorScale(d.change)])
                );
                const labelsToShow = new Set(
                    rows
                        .toSorted((a, b) => b.change - a.change)
                        .slice(0, 5)
                        .map(d => d.arrondissement)
                );

                return { title: 'Population Change 2011→2016', colors, labelsToShow, legend: colorScale };
            }

            default: {
                return { title: null, colors: null, labelsToShow: null, legend: null };
            }
        }
    });

    // Projection that fits the districts to the container
    let projection = $derived(
        d3.geoMercator().fitSize(
            [innerWidth, innerHeight],
            { type: "FeatureCollection", features: districts }
        )
    );

    let pathGenerator = $derived(d3.geoPath().projection(projection));

    function getCentroid(feature) {
        return pathGenerator.centroid(feature);
    }

    let isLoading = $derived(pop2011.loading || changeData.loading);
</script>

<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
    {#if isLoading && stepIndex > 0}
        <div class="loading-overlay">Loading DuckDB...</div>
    {/if}

    <div class="year-indicator">{mapConfig.title}</div>

    <svg viewBox={`0 0 ${width} ${height}`} style="background: #a6cee3;">
        <g transform={`translate(${margin.left},${margin.top})`}>
                <!-- Boundary (CMA land outside districts) -->
                {#each boundary as feature (feature.properties.id)}
                    <path
                        class="boundary"
                        d={pathGenerator(feature)}
                        fill="#f4efea"
                        stroke="#999"
                        stroke-width="0.5"
                        pointer-events="none"
                    />
                {/each}

                <!-- Districts -->
                {#each districts as feature (feature.properties.id)}
                    {@const arrondissement = feature.properties.arrondissement}
                    {@const fill = mapConfig.colors?.get(arrondissement) ?? '#e0e0e0'}
                    <path
                        class="district"
                        d={pathGenerator(feature)}
                        {fill}
                        stroke="#333"
                        stroke-width="0.5"
                        style="transition: fill 0.5s ease;"
                        pointer-events="none"
                    />
                {/each}

                <!-- District labels -->
                {#each districts as feature (feature.properties.id)}
                    {@const centroid = getCentroid(feature)}
                    {@const arrondissement = feature.properties.arrondissement}
                    {@const showLabel = mapConfig.labelsToShow
                        ? mapConfig.labelsToShow.has(arrondissement)
                        : !isMobile}
                    {#if centroid && !isNaN(centroid[0]) && showLabel}
                        <text
                            x={centroid[0]}
                            y={centroid[1]}
                            text-anchor="middle"
                            font-size="10"
                            font-weight="500"
                            fill="#333"
                            stroke="white"
                            stroke-width="3"
                            stroke-linejoin="round"
                            paint-order="stroke"
                        >
                            {feature.properties.nom}
                        </text>
                    {/if}
                {/each}
            </g>
    </svg>

    <Legend scale={mapConfig.legend} />
</div>

<style>
    .chart-container {
        width: 100%;
        height: 100%;
        min-height: min(500px, 80vh);
        position: relative;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        overflow: hidden;
    }

    @media (max-width: 767px) {
        .chart-container {
            aspect-ratio: 1;
            min-height: unset;
            height: auto;
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    svg {
        width: 100%;
        height: 100%;
    }

    .year-indicator {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        background: rgba(255, 255, 255, 0.8);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }

    .loading-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.9rem;
        color: #666;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        z-index: 10;
    }
</style>
