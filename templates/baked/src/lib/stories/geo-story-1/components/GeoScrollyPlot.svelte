<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import Legend from './Legend.svelte';

    // Local data imports
    import metadataRaw from '../data/metadata.csv';
    import districtsGeo from '../data/districts.json';
    import boundaryGeo from '../data/boundary.json';

    let { scrollyIndex } = $props();

    // Fix winding order for GeoJSON features
    // https://observablehq.com/@john-guerra/d3-black-box-map
    const districts = districtsGeo.features.map(f => rewind(f, { reverse: true }));
    const boundary = boundaryGeo.features.map(f => rewind(f, { reverse: true }));

    // Chart dimensions
    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);
    let isMobile = $derived(width < 768);

    // Current step index (default case handles overflow)
    let stepIndex = $derived(scrollyIndex ?? 0);

    // Parse CSV data (year and population are strings, convert to numbers)
    const metadata = metadataRaw.map(d => ({
        arrondissement: d.arrondissement,
        year: parseInt(d.year),
        population: parseFloat(d.population)
    }));

    // Lookup maps for population by year
    const pop2011 = new Map(
        metadata.filter(d => d.year === 2011).map(d => [d.arrondissement, d.population])
    );
    const pop2016 = new Map(
        metadata.filter(d => d.year === 2016).map(d => [d.arrondissement, d.population])
    );
    
    // Percentage change for each arrondissement
    const changeMap = new Map();
    for (const [arr, pop11] of pop2011) {
        const pop16 = pop2016.get(arr);
        if (pop11 && pop16) {
            const change = ((pop16 - pop11) / pop11) * 100;
            changeMap.set(arr, change);
        }
    }

    // Map configuration based on current step
    // Only title, colors, labels, and legend are changing
    // The map itself is static
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
                // Population view 2011 only
                const maxPopulation = d3.max([...pop2011.values()]);
                const colorScale = d3.scaleSequential(d3.interpolateSpectral)
                    .domain([maxPopulation, 0]);

                const colors = new Map(
                    [...pop2011.entries()].map(([arr, pop]) => [arr, colorScale(pop)])
                );
                
                const labelsToShow = new Set(
                    [...pop2011.entries()]
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(d => d[0])
                );

                return { title: 'Population 2011', colors, labelsToShow, legend: colorScale };
            }

            case 2: {
                // Change view
                const changeValues = [...changeMap.values()];
                const maxChange = Math.max(Math.abs(d3.min(changeValues)), Math.abs(d3.max(changeValues)));
                const colorScale = d3.scaleDiverging(d3.interpolateRdBu)
                    .domain([-maxChange, 0, maxChange]);

                const colors = new Map(
                    [...changeMap.entries()].map(([arr, change]) => [arr, colorScale(change)])
                );
                const labelsToShow = new Set(
                    [...changeMap.entries()]
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(d => d[0])
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

    // Path generator
    let pathGenerator = $derived(d3.geoPath().projection(projection));

    // Get centroid for labels
    function getCentroid(feature) {
        return pathGenerator.centroid(feature);
    }

</script>

<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
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

    /* Mobile: Square container centered within sticky parent
       - aspect-ratio: 1 creates a square based on width
       - position absolute + transform centers it vertically and horizontally
       - Parent (.scrolly-chart) must have position: sticky/relative for this to work
       - Results in a compact, centered map that fits mobile viewport
    */
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

</style>
