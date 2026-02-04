<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
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
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);
    let isMobile = $derived(width < 768);

    // Current step index (default case handles overflow)
    let stepIndex = $derived(scrollyIndex ?? 0);

    // ============================================
    // STATIC DATA (computed once from imports)
    // ============================================

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
                    legend: null,
                    focus: null,
                    rotation: 0
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

                return { title: 'Population 2011', colors, labelsToShow, legend: colorScale, focus: null, rotation: 0 };
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

                return { title: 'Population Change 2011→2016', colors, labelsToShow, legend: colorScale, focus: null, rotation: 0 };
            }

            case 3: {
                // Zoom on Villeray - highlight the arrondissement
                const focusArr = 'Villeray-Saint-Michel-Parc-Extension';

                // Color focused districts, gray out others
                const colors = new Map(
                    [...pop2011.keys()].map(arr => [
                        arr,
                        arr === focusArr ? '#2a9d8f' : '#d3d3d3'
                    ])
                );

                return {
                    title: focusArr,
                    colors,
                    labelsToShow: new Set([focusArr]),
                    legend: null,
                    focus: focusArr,
                    rotation: 60
                };
            }
            default: {
                return {
                    title: null,
                    colors: null,
                    labelsToShow: null,
                    legend: null,
                    focus: null,
                    rotation: 0
                };
            }
        }
    });

    // Fixed projection that always shows all districts
    let projection = $derived(
        d3.geoMercator().fitExtent(
            [[20, 20], [innerWidth - 20, innerHeight - 20]],
            { type: "FeatureCollection", features: districts }
        )
    );

    // Path generator (fixed, doesn't change with zoom)
    let pathGenerator = $derived(d3.geoPath().projection(projection));

    // Animated view state (viewBox + rotation center)
    const viewState = tweened(
        { x: 0, y: 0, w: 800, h: 600, rotCx: 400, rotCy: 300, rotation: 0 },
        { duration: 1200, easing: cubicOut }
    );

    // Calculate target view state based on focus
    let targetViewState = $derived.by(() => {
        const rot = mapConfig.rotation ?? 0;

        if (!mapConfig.focus) {
            // Full view - rotate around map center
            return {
                x: 0, y: 0, w: width, h: height,
                rotCx: innerWidth / 2, rotCy: innerHeight / 2,
                rotation: rot
            };
        }

        // Find features to zoom to
        const focusFeatures = districts.filter(
            d => d.properties.arrondissement === mapConfig.focus
        );

        if (!focusFeatures.length) {
            return {
                x: 0, y: 0, w: width, h: height,
                rotCx: innerWidth / 2, rotCy: innerHeight / 2,
                rotation: rot
            };
        }

        // Calculate bounding box in screen coordinates
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const feature of focusFeatures) {
            const bounds = pathGenerator.bounds(feature);
            minX = Math.min(minX, bounds[0][0]);
            minY = Math.min(minY, bounds[0][1]);
            maxX = Math.max(maxX, bounds[1][0]);
            maxY = Math.max(maxY, bounds[1][1]);
        }

        // Calculate center of focused area (in local coords, before translate)
        const focusCenterX = (minX + maxX) / 2;
        const focusCenterY = (minY + maxY) / 2;
        const focusW = maxX - minX;
        const focusH = maxY - minY;

        // ViewBox center (in SVG coords, after translate)
        const viewCenterX = focusCenterX + margin.left;
        const viewCenterY = focusCenterY + margin.top;

        // Zoom factor: smaller = tighter zoom
        const zoomFactor = 0.8;

        // Maintain aspect ratio
        const aspectRatio = width / height;
        const zoomedSize = Math.max(focusW, focusH) * zoomFactor;
        const w = aspectRatio >= 1 ? zoomedSize * aspectRatio : zoomedSize;
        const h = aspectRatio >= 1 ? zoomedSize : zoomedSize / aspectRatio;

        return {
            x: viewCenterX - w / 2,
            y: viewCenterY - h / 2 - 10,
            w, h,
            rotCx: focusCenterX,  // Rotate around focus center
            rotCy: focusCenterY,
            rotation: rot
        };
    });

    // Update animation when target changes
    $effect(() => {
        viewState.set(targetViewState);
    });

    // Get centroid for labels
    function getCentroid(feature) {
        return pathGenerator.centroid(feature);
    }

</script>

<div
    class="chart-container"
    bind:clientWidth={width}
    bind:clientHeight={height}
>
    <div class="year-indicator">{mapConfig.title}</div>

    <svg
        viewBox={`${$viewState.x} ${$viewState.y} ${$viewState.w} ${$viewState.h}`}
        style="background: #a6cee3;"
    >
        <g transform={`translate(${margin.left},${margin.top}) rotate(${$viewState.rotation}, ${$viewState.rotCx}, ${$viewState.rotCy})`}>
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
                {#each districts as feature (feature.properties.id || feature.properties.nom)}
                    {@const arrondissement = feature.properties.arrondissement}
                    {@const color = mapConfig.colors?.get(arrondissement) ?? '#e0e0e0'}
                    <path
                        class="district"
                        d={pathGenerator(feature)}
                        fill={color}
                        stroke="#333"
                        stroke-width="0.5"
                        style="transition: fill 0.5s ease;"
                        pointer-events="none"
                    />
                {/each}

                <!-- District labels -->
                {#each districts as feature (feature.properties.id || feature.properties.nom)}
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
                            font-weight="600"
                            fill="#333"
                            stroke="white"
                            stroke-width="1"
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
        overflow: visible;
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
