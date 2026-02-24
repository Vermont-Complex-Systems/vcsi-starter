<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import { Tween } from 'svelte/motion';
    import { cubicInOut } from 'svelte/easing';
    import Legend from './Legend.svelte';
    import DAPolygons from './DAPolygons.svelte';
    import DistrictOutlines from './DistrictOutlines.svelte';
    import { computeColors, DA_METRICS } from './color-utils.js';
    import { database } from '$lib/db/duck.svelte';

    import districtsGeo from '../data/districts.json';
    import boundaryGeo from '../data/boundary.json';

    let { scrollyIndex } = $props();

    // Static GeoJSON layers
    const districts = districtsGeo.features.map(f => rewind(f, { reverse: true }));
    const boundary = boundaryGeo.features.map(f => rewind(f, { reverse: true }));

    // Pre-compute Le Plateau-Mont-Royal zoom target
    const plateauDistricts = districts.filter(
        d => d.properties.arrondissement === 'Le Plateau-Mont-Royal'
    );
    const plateauCollection = { type: 'FeatureCollection', features: plateauDistricts };
    const isZoomStep = (step) => step >= 8 && step <= 9;
    const isHighlightStep = (step) => step === 7;

    // Chart dimensions
    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);
    let isMobile = $derived(width < 768);

    let stepIndex = $derived(scrollyIndex ?? 0);

    // ── DuckDB data layer ──
    const db = database(
        { metadata: 'metadata.parquet', census_da: 'census_da.parquet' },
        { extensions: ['spatial'] }
    );
    const meta = db.from('metadata');
    const pop2011 = meta.eq('year', () => 2011).rows();

    const changeData = db.sql(t =>
        `SELECT a.arrondissement,
                ((b.population - a.population) * 100.0 / a.population) as change
         FROM ${t.metadata} a
         JOIN ${t.metadata} b ON a.arrondissement = b.arrondissement
         WHERE a.year = 2011 AND b.year = 2016`
    );

    const daQuery = db.sql(t =>
        `SELECT geo_uid, population, avg_age, median_income,
                seniors_65plus, renters, households, english_only,
                area_sqkm,
                population / NULLIF(area_sqkm, 0) as pop_density,
                seniors_65plus * 100.0 / NULLIF(population, 0) as seniors_pct,
                renters * 100.0 / NULLIF(households, 0) as renter_pct,
                english_only * 100.0 / NULLIF(population, 0) as english_pct,
                ST_AsGeoJSON(geom) as geojson
         FROM ${t.census_da}
         WHERE population > 0`
    );

    let daFeatures = $derived(
        daQuery.rows
            .filter(r => r.geojson)
            .map(r => rewind({
                type: 'Feature',
                properties: {
                    geo_uid: r.geo_uid,
                    population: Number(r.population),
                    avg_age: Number(r.avg_age),
                    median_income: r.median_income != null ? Number(r.median_income) : null,
                    seniors_65plus: Number(r.seniors_65plus),
                    area_sqkm: Number(r.area_sqkm),
                    pop_density: r.pop_density != null ? Number(r.pop_density) : null,
                    seniors_pct: r.seniors_pct != null ? Number(r.seniors_pct) : null,
                    renter_pct: r.renter_pct != null ? Number(r.renter_pct) : null,
                    english_pct: r.english_pct != null ? Number(r.english_pct) : null,
                },
                geometry: JSON.parse(r.geojson)
            }, { reverse: true }))
    );

    function isInPlateau(feature) {
        const centroid = d3.geoCentroid(feature);
        return plateauDistricts.some(d => d3.geoContains(d, centroid));
    }

    // ── Explore mode (step 11+) ──
    let isExploreMode = $derived(stepIndex >= 11);

    let metric = $state('density');
    let binning = $state('equal-interval');
    let normalizeGlobal = $state(false);
    let selectedDistrict = $state(null);
    let selectedDas = $state([]);

    let isZoomed = $derived(isExploreMode && selectedDistrict !== null);
    let selectedIds = $derived(new Set(selectedDas.map(f => f.properties.geo_uid)));

    let selectionSummary = $derived.by(() => {
        if (selectedDas.length === 0) return null;
        const totalPop = selectedDas.reduce((s, f) => s + (f.properties.population ?? 0), 0);
        const totalArea = selectedDas.reduce((s, f) => s + (f.properties.area_sqkm ?? 0), 0);
        const incomes = selectedDas
            .map(f => f.properties.median_income)
            .filter(v => v != null);
        const avgIncome = incomes.length > 0
            ? Math.round(incomes.reduce((s, v) => s + v, 0) / incomes.length)
            : null;
        return { totalPop, totalArea, avgIncome };
    });

    function handleDistrictClick(feature) {
        selectedDistrict = feature;
        selectedDas = [];
    }

    function handleZoomOut() {
        selectedDistrict = null;
        selectedDas = [];
    }

    function toggleDa(feature) {
        const uid = feature.properties.geo_uid;
        if (selectedIds.has(uid)) {
            selectedDas = selectedDas.filter(f => f.properties.geo_uid !== uid);
        } else {
            selectedDas = [...selectedDas, feature];
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Escape' && isZoomed) handleZoomOut();
    }

    // ── Hover state (bound from layer components, used for tooltips) ──
    let hoveredDa = $state(null);
    let hoveredDistrict = $state(null);
    let mouse = $state({ x: 0, y: 0 });

    // ── Visible DAs (filtered by zoom target) ──
    let visibleDAs = $derived.by(() => {
        if (daFeatures.length === 0) return daFeatures;
        if (isExploreMode && isZoomed) {
            return daFeatures.filter(f => {
                const centroid = d3.geoCentroid(f);
                return d3.geoContains(selectedDistrict, centroid);
            });
        }
        if (isZoomStep(stepIndex)) {
            return daFeatures.filter(isInPlateau);
        }
        return daFeatures;
    });

    let showDAs = $derived(stepIndex >= 3);

    // ── Map config driven by scroll step ──
    const baseView = { title: null, daColors: null, districtColors: null, labelsToShow: null, legend: null };

    let mapConfig = $derived.by(() => {
        switch (stepIndex) {
            case 0:
                return { ...baseView, title: 'Montreal' };

            case 1: {
                const rows = pop2011.rows;
                if (rows.length === 0) return { ...baseView, title: 'Population 2011' };
                const maxPopulation = d3.max(rows, d => d.population);
                const colorScale = d3.scaleSequential(d3.interpolateSpectral).domain([maxPopulation, 0]);
                const districtColors = new Map(rows.map(d => [d.arrondissement, colorScale(d.population)]));
                const labelsToShow = new Set(
                    rows.toSorted((a, b) => b.population - a.population).slice(0, 5).map(d => d.arrondissement)
                );
                return { ...baseView, title: 'Population 2011', districtColors, labelsToShow, legend: colorScale };
            }

            case 2: {
                const rows = changeData.rows;
                if (rows.length === 0) return { ...baseView, title: 'Population Change 2011\u21922016' };
                const maxChange = Math.max(Math.abs(d3.min(rows, d => d.change)), Math.abs(d3.max(rows, d => d.change)));
                const colorScale = d3.scaleDiverging(d3.interpolateRdBu).domain([-maxChange, 0, maxChange]);
                const districtColors = new Map(rows.map(d => [d.arrondissement, colorScale(d.change)]));
                const labelsToShow = new Set(
                    rows.toSorted((a, b) => b.change - a.change).slice(0, 5).map(d => d.arrondissement)
                );
                return { ...baseView, title: 'Population Change 2011\u21922016', districtColors, labelsToShow, legend: colorScale };
            }

            case 3:
                return { ...baseView, title: 'Dissemination Areas' };

            case 4: {
                if (daFeatures.length === 0) return { ...baseView, title: 'Pop. Density \u2014 Equal Intervals' };
                const { colors, colorScale } = computeColors(daFeatures, { metric: 'density', binning: 'equal-interval' });
                return { ...baseView, title: 'Pop. Density \u2014 Equal Intervals', daColors: colors, legend: colorScale };
            }

            case 5: {
                if (daFeatures.length === 0) return { ...baseView, title: 'Pop. Density \u2014 Quantile Bins' };
                const { colors, colorScale } = computeColors(daFeatures, { metric: 'density', binning: 'quantile' });
                return { ...baseView, title: 'Pop. Density \u2014 Quantile Bins', daColors: colors, legend: colorScale };
            }

            case 6: {
                if (daFeatures.length === 0) return { ...baseView, title: 'Median Household Income ($)' };
                const { colors, colorScale } = computeColors(daFeatures, { metric: 'income', binning: 'equal-interval', percentileCap: 0.99 });
                return { ...baseView, title: 'Median Household Income ($)', daColors: colors, legend: colorScale };
            }

            case 7: {
                if (daFeatures.length === 0) return { ...baseView, title: 'Le Plateau-Mont-Royal' };
                const { colors } = computeColors(daFeatures, { metric: 'income', binning: 'equal-interval', percentileCap: 0.99 });
                return { ...baseView, title: 'Le Plateau-Mont-Royal', daColors: colors };
            }

            case 8: {
                if (visibleDAs.length === 0) return { ...baseView, title: 'Le Plateau \u2014 City-wide scale' };
                const { colors, colorScale } = computeColors(visibleDAs, { metric: 'income', binning: 'equal-interval', percentileCap: 0.99, domainFeatures: daFeatures });
                return { ...baseView, title: 'Le Plateau \u2014 City-wide scale', daColors: colors, legend: colorScale };
            }

            case 9: {
                if (visibleDAs.length === 0) return { ...baseView, title: 'Le Plateau \u2014 Local scale' };
                const { colors, colorScale } = computeColors(visibleDAs, { metric: 'income', binning: 'equal-interval' });
                return { ...baseView, title: 'Le Plateau \u2014 Local scale', daColors: colors, legend: colorScale };
            }

            case 10: {
                if (daFeatures.length === 0) return { ...baseView, title: 'Population Density (Census 2021)' };
                const { colors, colorScale } = computeColors(daFeatures, { metric: 'density', binning: 'quantile' });
                return { ...baseView, title: 'Population Density (Census 2021)', daColors: colors, legend: colorScale };
            }

            case 11: default: {
                const features = isZoomed ? visibleDAs : daFeatures;
                if (features.length === 0) return baseView;
                const { colors, colorScale } = computeColors(features, {
                    metric,
                    binning,
                    numBins: 9,
                    domainFeatures: isZoomed && normalizeGlobal ? daFeatures : null,
                    percentileCap: metric === 'income' ? 0.99 : null,
                });
                return { ...baseView, daColors: colors, legend: colorScale };
            }
        }
    });

    // Highlight districts
    let highlightDistricts = $derived.by(() => {
        if (isExploreMode && selectedDistrict) return [selectedDistrict];
        if (isZoomStep(stepIndex) || isHighlightStep(stepIndex)) return plateauDistricts;
        return [];
    });
    let hasHighlights = $derived(highlightDistricts.length > 0);

    // ── Projection with Tween animation ──
    let targetParams = $derived.by(() => {
        let target;
        if (isExploreMode && isZoomed) {
            target = selectedDistrict;
        } else if (isZoomStep(stepIndex)) {
            target = plateauCollection;
        } else {
            target = { type: 'FeatureCollection', features: districts };
        }
        const p = d3.geoMercator().fitSize([innerWidth, innerHeight], target);
        return { scale: p.scale(), translate: p.translate() };
    });

    const tweenOpts = { duration: 1200, easing: cubicInOut };
    const projScale = new Tween(targetParams.scale, tweenOpts);
    const projTranslate = new Tween(targetParams.translate, tweenOpts);

    // Animate on zoom transitions (in/out of Plateau or explore district),
    // snap instantly for regular scroll steps.
    let prevZoomTarget = null; // plain var, not $state — avoids re-triggering this effect
    $effect(() => {
        const nowZoomed = isZoomStep(stepIndex) || isZoomed;
        const currentTarget = isZoomed ? selectedDistrict : (isZoomStep(stepIndex) ? 'plateau' : null);
        const wasZoomed = prevZoomTarget !== null;
        const targetChanged = currentTarget !== prevZoomTarget;
        prevZoomTarget = currentTarget;

        if (targetChanged && (nowZoomed || wasZoomed)) {
            projScale.set(targetParams.scale);
            projTranslate.set(targetParams.translate);
        } else {
            projScale.set(targetParams.scale, { duration: 0 });
            projTranslate.set(targetParams.translate, { duration: 0 });
        }
    });

    let projection = $derived(
        d3.geoMercator().scale(projScale.current).translate(projTranslate.current)
    );

    let pathGenerator = $derived(d3.geoPath().projection(projection));

    let isLoading = $derived(
        pop2011.loading || changeData.loading || (showDAs && daQuery.loading)
    );
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
    {#if isLoading && stepIndex > 0}
        <div class="loading-overlay">Loading DuckDB{showDAs ? ' + Spatial' : ''}...</div>
    {/if}

    {#if isExploreMode}
        <div class="controls">
            <label>
                Metric
                <select bind:value={metric}>
                    {#each Object.entries(DA_METRICS) as [key, m] (key)}
                        <option value={key}>{m.label}</option>
                    {/each}
                </select>
            </label>
            <label>
                Binning
                <select bind:value={binning}>
                    <option value="equal-interval">Equal Interval</option>
                    <option value="quantile">Quantile</option>
                </select>
            </label>
            {#if isZoomed}
                <label>
                    Scale
                    <button
                        class="norm-toggle"
                        class:active={normalizeGlobal}
                        onclick={() => normalizeGlobal = !normalizeGlobal}
                    >
                        {normalizeGlobal ? 'City-wide' : 'Local'}
                    </button>
                </label>
                <button class="back-btn" onclick={handleZoomOut}>&larr; Back to city</button>
            {/if}
        </div>
    {/if}

    {#if mapConfig.title}
        <div class="title-indicator">{mapConfig.title}</div>
    {/if}

    <svg viewBox={`0 0 ${width} ${height}`} style="background: #a6cee3;">
        <g transform={`translate(${margin.left},${margin.top})`}>
            <!-- Boundary (CMA land outside districts) -->
            {#each boundary as feature (feature.properties.id)}
                <path
                    d={pathGenerator(feature)}
                    fill="#f4efea"
                    stroke="#999"
                    stroke-width="0.5"
                    pointer-events="none"
                />
            {/each}

            <!-- District fills (fade out when DAs appear) -->
            <g style="transition: opacity 0.8s ease;" opacity={showDAs ? 0 : 1}>
                {#each districts as feature (feature.properties.id)}
                    {@const fill = mapConfig.districtColors?.get(feature.properties.arrondissement) ?? '#e0e0e0'}
                    <path
                        d={pathGenerator(feature)}
                        {fill}
                        stroke="#333"
                        stroke-width="0.5"
                        style="transition: fill 0.5s ease;"
                        pointer-events="none"
                    />
                {/each}

                {#each districts as feature (feature.properties.id)}
                    {@const centroid = pathGenerator.centroid(feature)}
                    {@const showLabel = mapConfig.labelsToShow
                        ? mapConfig.labelsToShow.has(feature.properties.arrondissement)
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

            <!-- DA + district layers (fade in when showDAs) -->
            <g style="transition: opacity 0.8s ease;" opacity={showDAs ? 1 : 0}>
                <DAPolygons
                    features={visibleDAs}
                    colors={mapConfig.daColors}
                    {pathGenerator}
                    selectedIds={isExploreMode ? selectedIds : new Set()}
                    {highlightDistricts}
                    enableHover={isZoomStep(stepIndex) || isExploreMode}
                    onclick={isExploreMode && isZoomed ? toggleDa : null}
                    bind:hovered={hoveredDa}
                    bind:mouse
                />
                <DistrictOutlines
                    {districts}
                    {pathGenerator}
                    interactive={isExploreMode && !isZoomed}
                    {hasHighlights}
                    onclick={handleDistrictClick}
                    bind:hovered={hoveredDistrict}
                    bind:mouse
                />
            </g>
        </g>
    </svg>

    <Legend scale={mapConfig.legend} />

    {#if hoveredDa}
        {@const m = DA_METRICS[metric]}
        <div class="tooltip" style="left: {mouse.x + 12}px; top: {mouse.y - 12}px;">
            <strong>DA {hoveredDa.properties.geo_uid}</strong><br>
            Pop: {hoveredDa.properties.population?.toLocaleString()}<br>
            {m.label}: {m.fmt(hoveredDa.properties[m.prop])}
        </div>
    {/if}

    {#if hoveredDistrict}
        <div class="tooltip" style="left: {mouse.x + 12}px; top: {mouse.y - 12}px;">
            <strong>{hoveredDistrict.properties.nom}</strong><br>
            {hoveredDistrict.properties.arrondissement}<br>
            <span class="hint">Click to zoom</span>
        </div>
    {/if}

    {#if selectionSummary}
        <div class="da-info">
            <strong>{selectedDas.length} DA{selectedDas.length > 1 ? 's' : ''} selected</strong>
            &middot; Total pop: {selectionSummary.totalPop.toLocaleString()}
            &middot; Area: {selectionSummary.totalArea.toFixed(1)} km&sup2;
            {#if selectionSummary.avgIncome}
                &middot; Avg income: ${selectionSummary.avgIncome.toLocaleString()}
            {/if}
            <button class="clear-btn" onclick={() => selectedDas = []}>Clear</button>
        </div>
    {/if}
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

    .title-indicator {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        background: rgba(255, 255, 255, 0.8);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        z-index: 5;
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

    .controls {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.4rem 0.75rem;
        border-radius: 8px;
        z-index: 10;
    }

    .controls label {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.75rem;
        color: #555;
    }

    .controls select {
        font-size: 0.75rem;
        padding: 0.15rem 0.3rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
    }

    .norm-toggle {
        font-size: 0.75rem;
        padding: 0.15rem 0.4rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        color: #555;
    }
    .norm-toggle:hover { background: #f0f0f0; }
    .norm-toggle.active { background: #e8f4fd; border-color: #90caf9; }

    .back-btn {
        font-size: 0.75rem;
        padding: 0.15rem 0.4rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
    }
    .back-btn:hover { background: #f0f0f0; }

    .tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.75rem;
        line-height: 1.4;
        pointer-events: none;
        z-index: 20;
        white-space: nowrap;
    }

    .hint {
        color: #aaa;
        font-size: 0.65rem;
    }

    .da-info {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        font-size: 0.8rem;
        color: #333;
        padding: 0.4rem 0.75rem;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.25rem;
        z-index: 10;
    }

    .clear-btn {
        margin-left: auto;
        font-size: 0.7rem;
        padding: 0.1rem 0.3rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: white;
        cursor: pointer;
        color: #666;
    }
    .clear-btn:hover { background: #eee; }
</style>
