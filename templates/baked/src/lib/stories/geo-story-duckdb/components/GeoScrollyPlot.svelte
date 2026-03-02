<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import Legend from './Legend.svelte';
    import DAPolygons from './DAPolygons.svelte';
    import DistrictOutlines from './DistrictOutlines.svelte';
    import { computeColors, DA_METRICS } from './color-utils.js';
    import DAInfoPanel from './DAInfoPanel.svelte';
    import { database } from '$lib/db/duck.svelte';

    import districtsGeo from '../data/districts.json';
    import boundaryGeo from '../data/boundary.json';

    let { scrollyIndex } = $props();

    // Static GeoJSON layers
    const districts = districtsGeo.features.map(f => rewind(f, { reverse: true }));
    const boundary = boundaryGeo.features.map(f => rewind(f, { reverse: true }));

    // Pre-compute Villeray-Saint-Michel-Parc-Extension zoom target
    const villerayDistricts = districts.filter(
        d => d.properties.nom === 'Villeray'
    );
    const villerayCollection = { type: 'FeatureCollection', features: villerayDistricts };

    const outremontDistricts = districts.filter(
        d => d.properties.arrondissement === 'Outremont'
    );
    const outremontCollection = { type: 'FeatureCollection', features: outremontDistricts };

    const isZoomStep = (step) => step >= 8 && step <= 12;
    const isHighlightStep = (step) => step === 7;

    // Chart dimensions
    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

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

    // We use ST_AsGeoJSON (DuckDB spatial
    // extension) to convert the binary WKB geometry stored in the parquet
    // back into a GeoJSON string the browser can render on an SVG map.
    const daQuery = db.sql(t =>
        `SELECT *,
                population / NULLIF(area_sqkm, 0) as pop_density,
                ST_AsGeoJSON(geom) as geojson
         FROM ${t.census_da}
         WHERE population > 0`
    );

    // Build GeoJSON features from DuckDB rows. All parquet columns are
    // forwarded as feature properties automatically — no need to list them
    // one by one. Numeric values (including BigInt from DuckDB) are cast
    // to JS Numbers; strings (like geo_uid) are kept as-is.
    let daFeatures = $derived(
        daQuery.rows
            .filter(r => r.geojson)
            .map(r => {
                const props = {};
                for (const [k, v] of Object.entries(r)) {
                    if (k === 'geojson' || k === 'geom') continue;
                    props[k] = typeof v === 'bigint' ? Number(v)
                             : v != null && typeof v !== 'string' ? Number(v)
                             : v;
                }
                return rewind(
                    { type: 'Feature', properties: props, geometry: JSON.parse(r.geojson) },
                    { reverse: true }
                );
            })
    );

    function isInVilleray(feature) {
        const centroid = d3.geoCentroid(feature);
        return villerayDistricts.some(d => d3.geoContains(d, centroid));
    }

    // ── Explore mode (step 12+) ──
    let isExploreMode = $derived(stepIndex >= 14);

    let metric = $state('population');
    let binning = $state('equal-interval');
    let normalizeGlobal = $state(false);
    let selectedDistrict = $state(null);
    let selectedDas = $state([]);

    let isZoomed = $derived(isExploreMode && selectedDistrict !== null);

    // The metric shown on the map: explore mode uses the dropdown, story steps are hardcoded
    let activeMetric = $derived.by(() => {
        if (isExploreMode) return metric;
        if (stepIndex >= 6 && stepIndex <= 12) return 'income';
        if (stepIndex === 4 || stepIndex === 5 || stepIndex === 13) return 'density';
        return 'population';
    });
    let selectedIds = $derived(new Set(selectedDas.map(f => f.properties.geo_uid)));

    function handleDistrictClick(feature) {
        selectedDistrict = feature;
        selectedDas = [];
        zoomToFeature(feature);
    }

    function handleZoomOut() {
        selectedDistrict = null;
        selectedDas = [];
        zoomReset();
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

    // ── d3.zoom (unified: story steps + explore mode) ──
    // d3.zoom computes the transform; we render via viewBox so the browser
    // always rasterizes paths at display resolution (no blurry GPU-cached bitmap).
    let svgEl;
    let zoomTransform = $state(d3.zoomIdentity);

    const zoom = d3.zoom()
        .scaleExtent([1, 20])
        .filter(event => !event.type.startsWith('wheel'))
        .on('zoom', ({ transform }) => {
            zoomTransform = transform;
        });

    // During animation: <g transform> for smooth GPU-accelerated rendering.
    // After settling: viewBox zoom so paths rasterize crisply at final resolution.
    let animating = $state(false);

    let activeViewBox = $derived.by(() => {
        const { x, y, k } = zoomTransform;
        if (animating) return `0 0 ${width} ${height}`;
        return `${-x / k} ${-y / k} ${width / k} ${height / k}`;
    });

    let activeGTransform = $derived(animating ? zoomTransform.toString() : '');

    // Use standard d3 zoom transitions (smooth GPU-accelerated via <g transform>
    // while animating=true), then switch to viewBox mode for crisp rendering.
    function smoothZoomTo(target, duration = 1500) {
        const svg = d3.select(svgEl);
        svg.interrupt();
        animating = true;
        svg.transition().duration(duration)
            .call(zoom.transform, target)
            .on('end', () => { animating = false; });
    }

    function computeZoomTransform(featureOrCollection) {
        const [[x0, y0], [x1, y1]] = pathGenerator.bounds(featureOrCollection);
        const dx = x1 - x0, dy = y1 - y0;
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        const k = 0.8 * Math.min(width / dx, height / dy);
        const tx = width / 2 - k * cx;
        const ty = height / 2 - k * cy;
        return d3.zoomIdentity.translate(tx, ty).scale(k);
    }

    function getStepZoomTarget(step) {
        if (step >= 8 && step <= 11) return villerayCollection;
        if (step === 12) return outremontCollection;
        return null;
    }

    // Unified zoom effect: drives story-step zooms and manages explore-mode attachment
    let prevStepTarget = null; // plain var, not $state
    $effect(() => {
        // Read reactive deps early so they're tracked even if svgEl isn't ready yet
        const step = stepIndex;
        const explore = isExploreMode;

        if (!svgEl) return;
        const svg = d3.select(svgEl);

        // Always attach the zoom behavior (needed for zoom.transform to work)
        svg.call(zoom);

        if (explore) return;

        // Detach interactive zoom for story steps (keep behavior initialized)
        svg.on('.zoom', null);
        selectedDistrict = null;
        hoveredDa = null;
        hoveredDistrict = null;

        // Compute target zoom for this step
        const target = getStepZoomTarget(step);
        const targetTransform = target ? computeZoomTransform(target) : d3.zoomIdentity;

        const targetKey = target === villerayCollection ? 'villeray'
                        : target === outremontCollection ? 'outremont'
                        : null;
        const changed = targetKey !== prevStepTarget;
        if (changed) selectedDas = [];
        const wasZoomed = prevStepTarget !== null;
        prevStepTarget = targetKey;

        if (changed && (target || wasZoomed)) {
            smoothZoomTo(targetTransform, 1500);
        } else {
            svg.call(zoom.transform, targetTransform);
        }
    });

    function zoomToFeature(feature) {
        smoothZoomTo(computeZoomTransform(feature), 750);
    }

    function zoomReset() {
        smoothZoomTo(d3.zoomIdentity, 750);
    }

    function zoomBy(factor) {
        const svg = d3.select(svgEl);
        svg.interrupt();
        animating = true;
        svg.transition().duration(300)
            .call(zoom.scaleBy, factor)
            .on('end', () => { animating = false; });
    }

    // ── All DAs always rendered (d3.zoom handles visual zoom) ──
    let visibleDAs = $derived(daFeatures);

    // DAs within Villeray (for local color normalization in steps 8-9)
    let villerayDAs = $derived(
        daFeatures.filter(isInVilleray)
    );

    // DAs within Outremont (for color normalization in step 10)
    let outremontDAs = $derived(
        daFeatures.filter(f => {
            const c = d3.geoCentroid(f);
            return outremontDistricts.some(d => d3.geoContains(d, c));
        })
    );

    // DAs within the selected district (for local color normalization)
    let districtDAs = $derived.by(() => {
        if (!selectedDistrict) return daFeatures;
        return daFeatures.filter(f => {
            const centroid = d3.geoCentroid(f);
            return d3.geoContains(selectedDistrict, centroid);
        });
    });

    let showDAs = $derived(stepIndex >= 3);

    // Constrain hover to zoomed-in area DAs (null = all DAs hoverable)
    let hoverableIds = $derived.by(() => {
        if (stepIndex >= 8 && stepIndex <= 11) return new Set(villerayDAs.map(f => f.properties.geo_uid));
        if (stepIndex === 12) return new Set(outremontDAs.map(f => f.properties.geo_uid));
        return null;
    });

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
                if (daFeatures.length === 0) return { ...baseView, title: 'Villeray\u2013Saint-Michel\u2013Parc-Extension' };
                const { colors } = computeColors(daFeatures, { metric: 'income', binning: 'equal-interval', percentileCap: 0.99 });
                return { ...baseView, title: 'Villeray\u2013Saint-Michel\u2013Parc-Extension', daColors: colors };
            }

            case 8: {
                if (villerayDAs.length === 0) return { ...baseView, title: 'Villeray\u2013Parc-Ex \u2014 City-wide scale' };
                const { colors, colorScale } = computeColors(villerayDAs, { metric: 'income', binning: 'equal-interval', percentileCap: 0.99, domainFeatures: daFeatures });
                return { ...baseView, title: 'Villeray\u2013Parc-Ex \u2014 City-wide scale', daColors: colors, legend: colorScale };
            }

            case 9: {
                if (villerayDAs.length === 0) return { ...baseView, title: 'Villeray\u2013Parc-Ex \u2014 Local scale' };
                const { colors, colorScale } = computeColors(villerayDAs, { metric: 'income', binning: 'equal-interval' });
                return { ...baseView, title: 'Villeray\u2013Parc-Ex \u2014 Local scale', daColors: colors, legend: colorScale };
            }

            case 10:
            case 11: {
                if (villerayDAs.length === 0) return { ...baseView, title: 'Villeray\u2013Parc-Ex \u2014 Click to explore' };
                const { colors, colorScale } = computeColors(villerayDAs, { metric: 'income', binning: 'equal-interval' });
                return { ...baseView, title: 'Villeray\u2013Parc-Ex \u2014 Click to explore', daColors: colors, legend: colorScale };
            }

            case 12: {
                if (outremontDAs.length === 0) return { ...baseView, title: 'Outremont \u2014 City-wide scale' };
                const { colors, colorScale } = computeColors(outremontDAs, { metric: 'income', binning: 'equal-interval', percentileCap: 0.99, domainFeatures: daFeatures });
                return { ...baseView, title: 'Outremont \u2014 City-wide scale', daColors: colors, legend: colorScale };
            }

            case 13: {
                if (daFeatures.length === 0) return { ...baseView, title: 'Population Density (Census 2021)' };
                const { colors, colorScale } = computeColors(daFeatures, { metric: 'density', binning: 'quantile' });
                return { ...baseView, title: 'Population Density (Census 2021)', daColors: colors, legend: colorScale };
            }

            case 14: default: {
                const features = isZoomed ? districtDAs : daFeatures;
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
        if (stepIndex === 7 || (stepIndex >= 8 && stepIndex <= 11)) return villerayDistricts;
        if (stepIndex === 12) return outremontDistricts;
        return [];
    });
    let hasHighlights = $derived(highlightDistricts.length > 0);

    // ── Fixed city-wide projection (d3.zoom handles all zoom transitions) ──
    let projection = $derived(
        d3.geoMercator().fitExtent(
            [[margin.left, margin.top], [width - margin.right, height - margin.bottom]],
            { type: 'FeatureCollection', features: districts }
        )
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

        <div class="zoom-btns">
            <button class="zoom-btn" onclick={() => zoomBy(2)}>+</button>
            <button class="zoom-btn" onclick={() => zoomBy(0.5)}>&minus;</button>
        </div>
    {/if}

    {#if mapConfig.title}
        <div class="title-indicator">{mapConfig.title}</div>
    {/if}

    <svg bind:this={svgEl} viewBox={activeViewBox} style="background: #a6cee3;">
        <g transform={activeGTransform}>
            <!-- Boundary (CMA land outside districts) -->
            {#each boundary as feature (feature.properties.id)}
                <path
                    d={pathGenerator(feature)}
                    fill="#f4efea"
                    stroke="#999"
                    stroke-width={0.5 / zoomTransform.k}
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
                        stroke-width={0.5 / zoomTransform.k}
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
                    selectedIds={(isZoomStep(stepIndex) || (isExploreMode && isZoomed)) ? selectedIds : new Set()}
                    {highlightDistricts}
                    enableHover={isZoomStep(stepIndex) || isExploreMode}
                    {hoverableIds}
                    zoomScale={zoomTransform.k}
                    onclick={(isZoomStep(stepIndex) || (isExploreMode && isZoomed)) ? toggleDa : null}
                    bind:hovered={hoveredDa}
                    bind:mouse
                />
                <DistrictOutlines
                    {districts}
                    {pathGenerator}
                    interactive={isExploreMode && !isZoomed}
                    {hasHighlights}
                    zoomScale={zoomTransform.k}
                    onclick={handleDistrictClick}
                    bind:hovered={hoveredDistrict}
                    bind:mouse
                />
            </g>
        </g>
    </svg>

    <Legend scale={mapConfig.legend} />

    {#if hoveredDa}
        {@const m = DA_METRICS[activeMetric]}
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

    {#if selectedDas.length > 0}
        <DAInfoPanel features={selectedDas} metric={activeMetric} onclear={() => selectedDas = []} />
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

    .zoom-btns {
        position: absolute;
        bottom: 16px;
        right: 16px;
        display: flex;
        flex-direction: column;
        gap: 1px;
        z-index: 10;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }

    .zoom-btn {
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        background: white;
        cursor: pointer;
        color: #333;
        line-height: 1;
    }
    .zoom-btn:hover { background: #f0f0f0; }

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

</style>
