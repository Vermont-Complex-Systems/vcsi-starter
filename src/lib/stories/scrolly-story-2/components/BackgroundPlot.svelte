<!--
    SVELTE 5 COMPONENT OVERVIEW
    ===========================
    This is a scatter plot visualization built with Svelte 5 and D3.

    Svelte components have 3 sections:
    1. <script> - JavaScript logic and reactive declarations
    2. Markup (HTML) - The template that renders to the DOM
    3. <style> - Scoped CSS (styles only apply to this component)
-->

<script>
    // D3 imports for scales (mapping data values to pixel positions/colors)
    import { scaleLinear, scaleOrdinal } from 'd3';

    // COMPONENT IMPORTS
    // In Svelte, you import other .svelte files as components
    // They can then be used in the markup like HTML tags: <RegionLegend />
    import RegionLegend from './RegionLegend.svelte';
    import ScatterDots from './ScatterDots.svelte';
    import XAxis from './XAxis.svelte';
    import YAxis from './YAxis.svelte';
    import data from '../data/owid_democracy.csv';

    // PROPS (Svelte 5 Runes)
    // $props() is a Svelte 5 "rune" - a special compiler instruction
    // It declares which values this component receives from its parent
    // Usage in parent: <BackgroundPlot scrollyIndex={2} />
    let { scrollyIndex } = $props();

    // REACTIVE STATE with $state()
    // $state() creates reactive state - when it changes, the UI updates automatically
    // Here, 'width' starts at 800 but will be updated by bind:clientWidth below
    let width = $state(800);

    // Regular constants (not reactive - they never change)
    const height = 800;
    const navHeight = 200;
    const margin = { top: 60, right: 40, bottom: 70, left: 70 };

    // DERIVED VALUES with $derived()
    // $derived() creates a computed value that automatically updates
    // when its dependencies change. Here, innerWidth recalculates
    // whenever 'width' changes (e.g., on window resize)
    let innerWidth = $derived(
        width - margin.left - margin.right
    );

    // This could also be $derived, but since height/margin never change,
    // a regular variable works fine
    let innerHeight = height - margin.top - margin.bottom - navHeight / 2;

    const years = [2001, 2007, 2013, 2020, 2022];

    // We want regions to be an array, not a set...
    const regions = [...new Set(data.map(d => d.owid_region))];

    // DERIVED VALUES BASED ON PROPS
    // These automatically update when scrollyIndex changes from the parent
    // The ?? 0 provides a fallback if scrollyIndex is null/undefined
    let currentYear = $derived(years[scrollyIndex ?? 0]);
    let currentData = $derived(data.filter(d =>d.year === currentYear && d.life_expectancy > 40));


    // D3 SCALES
    // Scales map data values to visual values (positions, colors, etc.)

    // colorScale: maps region names → colors
    const colorScale = scaleOrdinal()
        .domain(regions)
        .range(['#e15759', '#f28e2c', '#4e79a7', '#76b7b2', '#59a14f', '#edc949']);

    // xScale: maps democracy index (0-1) → horizontal pixel position
    // This is $derived because it depends on innerWidth (which can change)
    let xScale = $derived(
        scaleLinear().domain([0, 1.0]).range([0, innerWidth])
    );

    // Hardcoding xTicks
    let xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

    //                           ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ Cheating a little bit because of an outlier
    const ymin = Math.min(...data.filter(d => d.life_expectancy > 40).map(d => d.life_expectancy)) - 10;
    const ymax = Math.max(...data.map(d => d.life_expectancy)) + 10;

    // yScale: maps life expectancy → vertical pixel position
    // Note: range is [innerHeight, 0] because SVG y-axis is inverted (0 is top)
    let yScale = scaleLinear().domain([ymin, ymax]).range([innerHeight, 0]);

    const yTicks = [30, 40, 50, 60, 70, 80, 90];

</script>


<!--
    MARKUP SECTION
    ==============
    This is Svelte's template syntax - HTML with superpowers!
-->

<!--
    bind:clientWidth={width}
    This is TWO-WAY BINDING - a powerful Svelte feature!
    It automatically updates our 'width' $state variable whenever
    the div's width changes (e.g., on window resize)
-->
<div class="chart-container" bind:clientWidth={width}>

    <!--
        Template expressions use {curly braces}
        Backticks create template literals for string interpolation
    -->
    <svg viewBox={`0 0 ${width} ${height-navHeight}`}>

        <!-- SVG <g> groups elements and applies transforms to all children -->
        <g transform={`translate(${margin.left},${margin.top})`}>

            <!--
                PASSING PROPS TO CHILD COMPONENTS

                Full syntax: <XAxis xScale={xScale} />
                Shorthand:   <XAxis {xScale} />  (when prop name matches variable name)
            -->
            <XAxis {xScale} {innerWidth} {innerHeight} ticks={xTicks} label="Democracy Index"/>
            <YAxis {yScale} {innerWidth} {innerHeight} ticks={yTicks} label="Life Expectancy (years)" />

            <!--
                The ScatterDots component receives filtered data
                When currentData changes (via $derived), this component re-renders
            -->
            <ScatterDots
                data={currentData}
                {xScale}
                {yScale}
                {colorScale}
            />

            <!--
                Regular SVG elements work as expected
                {currentYear} outputs the value reactively - it updates automatically
            -->
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
            <RegionLegend {regions} {colorScale} {innerWidth} />
        </g>

    </svg>
</div>

<!--
    SCOPED STYLES
    =============
    Styles in Svelte are SCOPED by default!
    These styles only apply to elements in THIS component.
    You won't accidentally affect other components' .chart-container classes.

    Svelte achieves this by adding unique class attributes at compile time.
-->
<style>
    .chart-container {
        width: 100%;
        height: 100%;
    }

    svg {
        width: 100%;
        height: 100%;
    }
</style>
