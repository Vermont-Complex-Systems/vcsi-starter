<script>
    /* =====================================================
     * Imports
     * =================================================== */
    import { extent, scaleLinear, scaleLog, scaleOrdinal, scaleSqrt } from 'd3';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { SvelteSet } from 'svelte/reactivity';

    import ChartTooltip from './ChartTooltip.svelte';
    import RegressionLines from './RegressionLines.svelte';
    import RegionLegend from './RegionLegend.svelte';
    import ScatterDots from './ScatterDots.svelte';
    import XAxis from './XAxis.svelte';
    import YAxis from './YAxis.svelte';
    import { SimpleToggle } from '@the-vcsi/scrolly-kit';

    import allData from '../data/owid_combined.csv';


    let { scrollyIndex } = $props();

    /* =====================================================
     * 1. Static configuration
     * =================================================== */
    const years = [2001, 2007, 2013, 2020, 2022];

    const xVariables = [
        { value: 'democracy', label: 'Electoral Democracy Index', domain: [0, 1], scale: 'linear' },
        { value: 'gdp', label: 'GDP per Capita', domain: [200, 150000], scale: 'log' }
    ];

    const regions = [...new Set(allData.map(d => d.owid_region))];

    const colorScale = scaleOrdinal()
        .domain(regions)
        .range(['#e15759', '#f28e2c', '#4e79a7', '#76b7b2', '#59a14f', '#edc949']);


    /* =====================================================
     * 2. Viewport & layout state
     * =================================================== */
    let width = $state(800);
    let height = $state(600);

    // Mobile breakpoint
    let isMobile = $derived(width < 768);

    // On mobile, make chart square by using width as height
    let chartHeight = $derived(isMobile ? width : height);

    // Desktop-only breathing room: the drawing surface gives up this much
    // height (and the plot area half of it), which nudges the chart down
    // and keeps it clear of the screen edges. Zero on mobile.
    let verticalClearance = $derived(isMobile ? 0 : 200);

    // Responsive margins - tighter on mobile
    let margin = $derived(isMobile
        ? { top: 40, right: 20, bottom: 50, left: 50 }
        : { top: 60, right: 40, bottom: 70, left: 70 }
    );

    let innerWidth = $derived(
        width - margin.left - margin.right
    );

    let innerHeight = $derived(
        chartHeight - margin.top - margin.bottom - verticalClearance / 2
    );


    /* =====================================================
     * 3. User-controlled state (UI inputs)
     * =================================================== */
    let selectedXVar = $state('democracy');
    let usePopulationSize = $state(true);
    let hoveredCountry = $state(null);

    // SvelteSet so the legend's .add()/.delete() calls trigger updates
    // ($state does not make a plain Set reactive)
    const selectedRegions = new SvelteSet();


    /* =====================================================
     * 4. Derived configuration
     * =================================================== */
    // Clamp so extra scrolly steps hold the last year instead of
    // going out of bounds and emptying the chart
    let currentYear = $derived(years[Math.min(scrollyIndex ?? 0, years.length - 1)]);

    let xConfig = $derived(xVariables.find(v => v.value === selectedXVar));

    let isLogScale = $derived(xConfig.scale === 'log');


    /* =====================================================
     * 5. Data filtering pipeline
     * =================================================== */
    let currentData = $derived(
        allData.filter(d =>
            d.year === currentYear &&
            d.x_variable === selectedXVar
        )
    );

    let filteredData = $derived(
        selectedRegions.size === 0
            ? currentData
            : currentData.filter(d =>
                selectedRegions.has(d.owid_region)
            )
    );


    /* =====================================================
     * 6. X-scale & size encoding
     * =================================================== */
    let radiusScale = $derived(
        scaleSqrt()
            .domain([0, 1.4e9])
            .range(isMobile ? [2, 18] : [3, 30])
    );

    let xScale = $derived(
        (isLogScale ? scaleLog() : scaleLinear())
            .domain(xConfig.domain)
            .range([0, innerWidth])
    );

    let xTicks = $derived(
        isLogScale
            ? (isMobile ? [500, 5000, 50000] : [200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000])
            : (isMobile ? [0, 0.5, 1.0] : [0, 0.2, 0.4, 0.6, 0.8, 1.0])
    );


    /* =====================================================
     * 7. Y-scale (data → extent → tween → scale)
     * =================================================== */
    let lifeExpExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : currentData;
        if (data.length === 0) return [40, 90];

        const [min, max] = extent(data, d => d.life_expectancy);
        return [Math.floor(min) - 5, Math.ceil(max) + 5];
    });

    const yDomain = Tween.of(
        () => lifeExpExtent,
        { duration: 800, easing: cubicOut }
    );

    let yScale = $derived(
        scaleLinear()
            .domain(yDomain.current)
            .range([innerHeight, 0])
    );

    let yTicks = $derived(isMobile ? [40, 60, 80] : [20, 30, 40, 50, 60, 70, 80, 90]);


    /* =====================================================
     * 8. Tooltip derived state
     * =================================================== */
    let hoveredData = $derived(
        hoveredCountry
            ? filteredData.find(c => c.entity === hoveredCountry)
            : null
    );
</script>


<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
    <svg viewBox={`0 0 ${width} ${chartHeight - verticalClearance}`}>

        <!--
            The y-axis animates while its ticks stay put, so mid-transition
            some ticks fall outside the plot. These clips let gridlines and
            tick labels slide out of view instead of spilling over the chart.
            (The ids are global to the page — fine here, where only one
            chart renders at a time.)
        -->
        <defs>
            <clipPath id="chart-area">
                <rect x={0} y={0} width={innerWidth} height={innerHeight} />
            </clipPath>
            <clipPath id="chart-area-y">
                <rect x={-60} y={0} width={60} height={innerHeight} />
            </clipPath>
        </defs>

        <g transform={`translate(${margin.left},${margin.top})`}>
            <XAxis {xScale} {innerWidth} {innerHeight} ticks={xTicks} label={xConfig.label} {isLogScale} />
            <YAxis {yScale} {innerWidth} {innerHeight} ticks={yTicks} label="Life Expectancy (years)" />

            {#if !isMobile || (selectedRegions.size >= 1 && selectedRegions.size <= 3)}
                <RegressionLines data={filteredData} {xScale} {yScale} {colorScale} {isLogScale} />
            {/if}

            <ScatterDots
                data={filteredData}
                {xScale}
                {yScale}
                {colorScale}
                {radiusScale}
                {usePopulationSize}
                bind:hoveredCountry
            />

            <text
                class="year-label"
                x={isMobile ? innerWidth / 2 : margin.left + 35}
                y={isMobile ? innerHeight / 2 : 30}
                text-anchor={isMobile ? 'middle' : 'end'}
                font-size={isMobile ? 72 : 48}
            >
                {currentYear}
            </text>
        </g>

        <!-- Region legend -->
        <g transform={`translate(${margin.left + 20}, 20)`}>
            <RegionLegend {regions} {colorScale} {selectedRegions} {innerWidth} {isMobile} />
        </g>

    </svg>

    <!-- Controls (desktop only) -->
    {#if !isMobile}
        <div class="chart-controls">
            <select class="x-selector" bind:value={selectedXVar}>
                {#each xVariables as opt (opt.value)}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
            <SimpleToggle bind:isTrue={usePopulationSize} onText="Show population size" offText="Show population size" />
        </div>
    {/if}
</div>

{#if !isMobile}
    <ChartTooltip
        data={hoveredData}
        {xScale}
        {yScale}
        {margin}
        {width}
        xLabel={xConfig.label}
        {isLogScale}
    />
{/if}

<style>
    .chart-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        width: 100%;
        height: 100%;
        max-height: 100%;
    }

    /* Mobile: constrain SVG to square aspect ratio */
    @media (max-width: 768px) {
        svg {
            width: 100%;
            height: auto;
            aspect-ratio: 1;
        }
    }

    .chart-controls {
        position: absolute;
        top: 5rem;
        right: 2.5rem;
        gap: 1rem;
        display: flex;
        align-items: center;
        z-index: 10;
    }

    .x-selector {
        padding: 0 12px;
        height: 30px;
        font-size: 13px;
        border-radius: var(--vcsi-radius-sm);
        border: 1px solid var(--vcsi-border);
        background: var(--vcsi-bg);
        color: var(--vcsi-fg);
        cursor: pointer;
    }

    .year-label {
        fill: var(--vcsi-muted);
        font-weight: 700;
        opacity: 0.3;
    }
</style>
