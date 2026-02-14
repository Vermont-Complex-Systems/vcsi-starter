<script>
    /* =====================================================
     * Imports
     * =================================================== */
    import { scaleLinear, scaleLog, scaleOrdinal, scaleSqrt } from 'd3';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    import ChartTooltip from './ChartTooltip.svelte';
    import RegressionLines from './RegressionLines.svelte';
    import RegionLegend from './RegionLegend.svelte';
    import ScatterDots from './ScatterDots.svelte';
    import XAxis from './XAxis.svelte';
    import YAxis from './YAxis.svelte';
    import { SimpleToggle } from '@vcsi/scrolly-kit';

    import allData from '../data/owid_combined.csv';


    let { scrollyIndex } = $props();

    /* =====================================================
     * 1. Viewport & layout signals
     * =================================================== */
    let width = $state(800);
    let height = $state(600);

    const navHeight = 200;
    const margin = { top: 60, right: 40, bottom: 70, left: 70 };

    let innerWidth = $derived(
        width - margin.left - margin.right
    );

    let innerHeight = $derived(
        height - margin.top - margin.bottom - navHeight / 2
    );


    /* =====================================================
     * 2. User-controlled state (UI inputs)
     * =================================================== */
    let selectedXVar = $state('democracy');
    let selectedRegions = $state(new Set());
    let usePopulationSize = $state(true);
    let hoveredCountry = $state(null);


    /* =====================================================
     * Static configuration
     * =================================================== */
    const years = [2001, 2007, 2013, 2020, 2022];

    const xVariables = [
        { value: 'democracy', label: 'Electoral Democracy Index', domain: [0, 1], scale: 'linear' },
        { value: 'gdp', label: 'GDP per Capita', domain: [200, 150000], scale: 'log' }
    ];


    /* =====================================================
     * 3. Derived configuration signals
     * =================================================== */
    let currentYear = $derived(years[scrollyIndex ?? 0]);

    let xConfig = $derived(xVariables.find(v => v.value === selectedXVar));


    /* =====================================================
     * 4. Data filtering pipeline
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
     * 5. Encodings & derived metrics & Scales
     * =================================================== */
    const regions = [...new Set(allData.map(d => d.owid_region))];

    const colorScale = scaleOrdinal()
        .domain(regions)
        .range(['#e15759', '#f28e2c', '#4e79a7', '#76b7b2', '#59a14f', '#edc949']);

    let radiusScale = $derived(
        scaleSqrt()
            .domain([0, 1.4e9])
            .range([3, 30])
    );


    let xScale = $derived(
        xConfig.scale === 'log'
            ? scaleLog()
                .domain(xConfig.domain)
                .range([0, innerWidth])
            : scaleLinear()
                .domain(xConfig.domain)
                .range([0, innerWidth])
    );

    let xTicks = $derived(
        xConfig.scale === 'log'
            ? [200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]
            : [0, 0.2, 0.4, 0.6, 0.8, 1.0]
    );


    /* =====================================================
     * 6. Y-scale (data → extent → tween → scale)
     * =================================================== */
    let lifeExpExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : currentData;
        if (data.length === 0) return [40, 90];

        return [
            Math.floor(Math.min(...data.map(d => d.life_expectancy))) - 5,
            Math.ceil(Math.max(...data.map(d => d.life_expectancy))) + 5
        ];
    });

    const yMin = Tween.of(
        () => lifeExpExtent[0],
        { duration: 800, easing: cubicOut }
    );

    const yMax = Tween.of(
        () => lifeExpExtent[1],
        { duration: 800, easing: cubicOut }
    );

    let yScale = $derived(
        scaleLinear()
            .domain([yMin.current, yMax.current])
            .range([innerHeight, 0])
    );

    const yTicks = [20, 30, 40, 50, 60, 70, 80, 90];


    /* =====================================================
     * 7. Tooltip derived state
     * =================================================== */
    let hoveredData = $derived(
        hoveredCountry
            ? filteredData.find(c => c.entity === hoveredCountry)
            : null
    );
</script>


<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
    <svg viewBox={`0 0 ${width} ${height-navHeight}`}>
        
        <!-- Small hack to deal with Tweening axes ventring above and below the chart... -->
        <defs>
            <clipPath id="chart-area">
                <rect x={0} y={0} width={innerWidth} height={innerHeight} />
            </clipPath>
            <clipPath id="chart-area-y">
                <rect x={-60} y={0} width={60} height={innerHeight} />
            </clipPath>
        </defs>

        <g transform={`translate(${margin.left},${margin.top})`}>
            <XAxis {xScale} {innerWidth} {innerHeight} ticks={xTicks} label={xConfig.label} isLogScale={xConfig.scale === 'log'} />
            <YAxis {yScale} {innerWidth} {innerHeight} ticks={yTicks} label="Life Expectancy (years)" />

            <RegressionLines data={filteredData} {xScale} {yScale} {colorScale} isLogScale={xConfig?.scale === 'log'}/>

            <ScatterDots
                data={filteredData}
                {xScale}
                {yScale}
                {colorScale}
                {radiusScale}
                {usePopulationSize}
                bind:hoveredCountry
            />

            <!-- Year label -->
            <text
                x={margin.left + 35}
                y={30}
                text-anchor="end"
                font-size="48"
                font-weight="700"
                fill="#ccc"
                opacity="0.5"
            >
                {currentYear}
            </text>
        </g>

        <!-- Legend and X-variable selector -->
        <g transform={`translate(${margin.left + 20}, 20)`}>
            <RegionLegend {regions} {colorScale} bind:selectedRegions {innerWidth} />
        </g>

    </svg>

    <!-- Controls positioned outside SVG -->
    <div class="chart-controls">
        
        <!-- using vanilla html -->
        <select class="x-selector" bind:value={selectedXVar}>
            {#each xVariables as opt}
                <option value={opt.value}>{opt.label}</option>
            {/each}
        </select>
        
        <!-- using the bits-ui library -->
        <SimpleToggle bind:isTrue={usePopulationSize} onText="Show population size" offText="Show population size" />
    </div>
</div>

<ChartTooltip
    data={hoveredData}
    {xScale}
    {yScale}
    {margin}
    {width}
    xLabel={xConfig?.label}
    isLogScale={xConfig?.scale === 'log'}
/>

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
        border-radius: 4px;
        border: 1px solid #555;
        background: #2a2a2a;
        color: #fff;
        cursor: pointer;
    }

    text {
        fill: #333;
    }
</style>
