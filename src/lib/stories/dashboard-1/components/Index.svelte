<script>
    import { scaleLinear, scaleOrdinal, extent } from 'd3';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    import courses_viz from '../data/courses_viz.csv';
    import EmbeddingDotPlot from './EmbeddingDotPlot.svelte';
    import Grid from './Grid.svelte';
    import Legend from './Legend.svelte';
    import ChartTooltip from './ChartToolTip.svelte';
    import MobileToggle from './MobileToggle.svelte';
    
    let width = $state(800);
    let height = $state(600);

    let hoveredCourse = $state(null);

    // Sidebar state
    let sidebarCollapsed = $state(false);
    let sidebarOpen = $state(false); // mobile only
    let selectedYear = $state('2026');
    let selectedColleges = $state(new Set()); // empty = all selected
    let searchQuery = $state('');

    // Detect mobile
    let isMobile = $state(false);
    $effect(() => {
        const checkMobile = () => {
            isMobile = window.innerWidth < 769;
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    });

    function toggleSidebar() {
        if (isMobile) {
            sidebarOpen = !sidebarOpen;
        } else {
            sidebarCollapsed = !sidebarCollapsed;
        }
    }

    function closeSidebar() {
        sidebarOpen = false;
    }

    function handleKeydown(event) {
        if (event.key === 'Escape' && sidebarOpen) {
            closeSidebar();
        }
    }

    let margin = $derived(
        isMobile
            ? { top: 10, right: 10, bottom: 10, left: 10 }
            : { top: 50, right: 50, bottom: 50, left: 50 }
    );

    const colleges = [...new Set(courses_viz.map(d => d.college))];

    const colorScale = scaleOrdinal()
        .domain(colleges)
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]);

    let filteredData = $derived.by(() => {
        let data = courses_viz;
        if (selectedColleges.size > 0) {
            data = data.filter(d => selectedColleges.has(d.college));
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            data = data.filter(d =>
                d.title?.toLowerCase().includes(query) ||
                d.description?.toLowerCase().includes(query)
            );
        }
        return data;
    });

    // Compute extents based on filtered data (fall back to all data if empty)
    let xExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : courses_viz;
        const [min, max] = extent(data, d => d.x);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    });

    let yExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : courses_viz;
        const [min, max] = extent(data, d => d.y);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    });

    // Tween the domain values for smooth transitions
    const xMin = Tween.of(() => xExtent[0], { duration: 600, easing: cubicOut });
    const xMax = Tween.of(() => xExtent[1], { duration: 600, easing: cubicOut });
    const yMin = Tween.of(() => yExtent[0], { duration: 600, easing: cubicOut });
    const yMax = Tween.of(() => yExtent[1], { duration: 600, easing: cubicOut });

    let xScale = $derived(
        scaleLinear()
            .domain([xMin.current, xMax.current])
            .range([margin.left, width - margin.right])
    );

    let yScale = $derived(
        scaleLinear()
            .domain([yMin.current, yMax.current])
            .range([height - margin.bottom, margin.top])
    );

    let radiusScale = $derived(
        scaleLinear()
            .domain([0, 10])
            .range([3, 30])
    );

    let hoveredData = $derived(
        hoveredCourse
            ? filteredData.find(c => c.code === hoveredCourse)
            : null
    );

    const years = ['2024', '2025', '2026'];
</script>

<svelte:window onkeydown={handleKeydown} />

<article
    class="dashboard-layout"
    class:sidebar-collapsed={sidebarCollapsed}
    class:sidebar-open={sidebarOpen}
    id="dashboard-1"
>

    <MobileToggle {isMobile} {sidebarOpen} {sidebarCollapsed} {toggleSidebar} />

    <aside class="dashboard-sidebar">
        <div class="sidebar-content">
            <h2 class="sidebar-title">UVM Course Explorer</h2>

            <label for="search-input">Search</label>
            <input
                id="search-input"
                type="text"
                placeholder="Title or description..."
                bind:value={searchQuery}
                class="search-input"
            />

            <h3>Filters</h3>

            <label for="year-select">Year</label>
            <select id="year-select" bind:value={selectedYear}>
                {#each years as year (year)}
                    <option value={year}>{year}</option>
                {/each}
            </select>

            <fieldset>
                <legend>Colleges</legend>
                <Legend {colleges} {colorScale} bind:selectedColleges />
            </fieldset>
        </div>
    </aside>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="dashboard-backdrop" onclick={closeSidebar}></div>

    <div class="dashboard-main">

        <div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
            <svg viewBox={`0 0 ${width} ${height}`}>
                <Grid {xScale} {yScale} {width} {height} {margin} />

                <EmbeddingDotPlot
                    data={filteredData}
                    {xScale}
                    {yScale}
                    {colorScale}
                    {radiusScale}
                    {isMobile}
                    bind:hoveredCourse
                />
            </svg>
        </div>
    </div>
</article>

<ChartTooltip
    data={hoveredData}
    {xScale}
    {yScale}
    {margin}
    {width}
    {height}
    {isMobile}
    onClose={() => hoveredCourse = null}
/>

<style>
    svg {
        width: 100%;
        height: 100%;
    }

    .chart-container {
        flex: 1;
        width: 100%;
        min-height: 0;
        position: relative;
        overflow: hidden;
    }

    .sidebar-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid var(--color-uvm-green, #007155);
    }

    .search-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--color-uvm-green, #007155);
        box-shadow: 0 0 0 2px rgba(0, 113, 85, 0.1);
    }
</style>
