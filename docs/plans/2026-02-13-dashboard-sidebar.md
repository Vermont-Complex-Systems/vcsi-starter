# Dashboard Sidebar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a collapsible sidebar with year/college filters to the dashboard-1 story.

**Architecture:** New `.dashboard-layout` CSS class in app.css provides a grid with sidebar + main areas. Sidebar collapses on desktop (48px), becomes slide-out drawer on mobile. Chart resizes when sidebar toggles.

**Tech Stack:** SvelteKit, CSS Grid, CSS transitions

---

### Task 1: Add Dashboard Layout Tokens to app.css

**Files:**
- Modify: `src/styles/app.css` (add to `:root` block around line 29-119)

**Step 1: Add sidebar CSS tokens**

Add these tokens inside the `:root` block after the existing layout tokens (around line 74):

```css
/* Dashboard */
--sidebar-width: 280px;
--sidebar-collapsed-width: 48px;
--sidebar-transition: 300ms ease;
--sidebar-bg: #ebe6e1;
```

**Step 2: Verify no syntax errors**

Run: `npm run check`
Expected: No CSS-related errors

**Step 3: Commit**

```bash
git add src/styles/app.css
git commit -m "feat: add dashboard sidebar CSS tokens"
```

---

### Task 2: Add Dashboard Layout CSS Classes

**Files:**
- Modify: `src/styles/app.css` (add after `.fullscreen-layout` section, around line 573)

**Step 1: Add dashboard-layout styles**

Add this section after the fullscreen-layout block:

```css
/* =============================================================================
   LAYOUT: DASHBOARD
   Grid layout with collapsible sidebar and main content area.
   Sidebar resizes on collapse, main content expands to fill space.

   Usage:
     <article class="dashboard-layout">
       <aside class="dashboard-sidebar">...</aside>
       <main class="dashboard-main">...</main>
     </article>
   ============================================================================= */

.dashboard-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
  width: 100%;
  transition: grid-template-columns var(--sidebar-transition);
}

.dashboard-layout.sidebar-collapsed {
  grid-template-columns: var(--sidebar-collapsed-width) 1fr;
}

.dashboard-sidebar {
  position: relative;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--color-border);
  overflow: hidden;
  transition: width var(--sidebar-transition);
}

.dashboard-sidebar .sidebar-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--sidebar-transition);
  z-index: 10;
}

.dashboard-layout.sidebar-collapsed .sidebar-toggle {
  right: 8px;
  transform: rotate(180deg);
}

.dashboard-sidebar .sidebar-content {
  padding: 4rem 1.5rem 1.5rem;
  opacity: 1;
  transition: opacity calc(var(--sidebar-transition) / 2);
}

.dashboard-layout.sidebar-collapsed .sidebar-content {
  opacity: 0;
  pointer-events: none;
}

.dashboard-main {
  position: relative;
  overflow: hidden;
}
```

**Step 2: Verify no syntax errors**

Run: `npm run check`
Expected: No CSS-related errors

**Step 3: Commit**

```bash
git add src/styles/app.css
git commit -m "feat: add dashboard-layout CSS classes"
```

---

### Task 3: Add Dashboard Sidebar Form Styles

**Files:**
- Modify: `src/styles/app.css` (add after dashboard-layout styles)

**Step 1: Add sidebar form element styles**

```css
/* Dashboard sidebar form elements */
.dashboard-sidebar h3 {
  font-family: var(--sans);
  font-size: var(--font-size-small);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1.5rem;
  color: var(--color-gray-700);
}

.dashboard-sidebar label {
  display: block;
  font-family: var(--sans);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-gray-700);
}

.dashboard-sidebar select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-family: var(--sans);
  font-size: var(--font-size-small);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-white);
  margin-bottom: 1.5rem;
}

.dashboard-sidebar fieldset {
  border: none;
  padding: 0;
  margin: 0 0 1.5rem;
}

.dashboard-sidebar legend {
  font-family: var(--sans);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: var(--color-gray-700);
}

.dashboard-sidebar .checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dashboard-sidebar .checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
  margin-bottom: 0;
  cursor: pointer;
}

.dashboard-sidebar .checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-uvm-green);
}
```

**Step 2: Verify no syntax errors**

Run: `npm run check`
Expected: No CSS-related errors

**Step 3: Commit**

```bash
git add src/styles/app.css
git commit -m "feat: add dashboard sidebar form styles"
```

---

### Task 4: Add Mobile Drawer Styles

**Files:**
- Modify: `src/styles/app.css` (add after sidebar form styles)

**Step 1: Add mobile responsive styles**

```css
/* Dashboard mobile: slide-out drawer */
@media (max-width: 768px) {
  .dashboard-layout {
    display: block;
    position: relative;
  }

  .dashboard-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    z-index: var(--z-overlay);
    transform: translateX(-100%);
    transition: transform var(--sidebar-transition);
  }

  .dashboard-layout.sidebar-open .dashboard-sidebar {
    transform: translateX(0);
  }

  /* Always show content in mobile drawer */
  .dashboard-sidebar .sidebar-content {
    opacity: 1;
    pointer-events: auto;
  }

  .dashboard-sidebar .sidebar-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    right: auto;
    z-index: calc(var(--z-overlay) + 1);
  }

  .dashboard-layout.sidebar-open .sidebar-toggle {
    left: calc(var(--sidebar-width) + 1rem);
    transform: rotate(180deg);
  }

  .dashboard-main {
    width: 100%;
    min-height: 100vh;
  }

  /* Backdrop */
  .dashboard-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: calc(var(--z-overlay) - 1);
  }

  .dashboard-layout.sidebar-open .dashboard-backdrop {
    display: block;
  }
}

/* Desktop: hide backdrop */
@media (min-width: 769px) {
  .dashboard-backdrop {
    display: none;
  }
}
```

**Step 2: Verify no syntax errors**

Run: `npm run check`
Expected: No CSS-related errors

**Step 3: Commit**

```bash
git add src/styles/app.css
git commit -m "feat: add dashboard mobile drawer styles"
```

---

### Task 5: Update Index.svelte with Dashboard Layout

**Files:**
- Modify: `src/lib/stories/dashboard-1/components/Index.svelte`

**Step 1: Add sidebar state and update template**

Replace the entire file with:

```svelte
<script>
    import { scaleLinear, scaleOrdinal, extent } from 'd3';

    import courses_viz from '../data/courses_viz.csv';
    import EmbeddingDotPlot from './EmbeddingDotPlot.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Legend from './Legend.svelte';
    import ChartTooltip from './ChartToolTip.svelte';
    import Xaxis from './Xaxis.svelte';
    import Yaxis from './Yaxis.svelte';

    let width = $state(800);
    let height = $state(600);

    let hoveredCourse = $state(null);

    // Sidebar state
    let sidebarCollapsed = $state(false);
    let sidebarOpen = $state(false); // mobile only
    let selectedYear = $state('2026');
    let selectedColleges = $state(new Set()); // empty = all selected

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

    function toggleCollege(college) {
        const newSet = new Set(selectedColleges);
        if (newSet.has(college)) {
            newSet.delete(college);
        } else {
            newSet.add(college);
        }
        selectedColleges = newSet;
    }

    const margin = { top: 100, right: 200, bottom: 100, left: 200 };

    let innerWidth = $derived(width - margin.right);
    let innerHeight = $derived(height - margin.top);

    const colleges = [...new Set(courses_viz.map(d => d.college))];

    const colorScale = scaleOrdinal()
        .domain(colleges)
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]);

    let xrange = extent(courses_viz, d => d.x);

    let xScale = $derived(
        scaleLinear()
            .domain(xrange)
            .range([margin.left, innerWidth])
    );

    let yScale = $derived(
        scaleLinear()
            .domain(extent(courses_viz, d => d.y))
            .range([innerHeight, margin.bottom])
    );

    let radiusScale = $derived(
        scaleLinear()
            .domain([0, 10])
            .range([3, 30])
    );

    let filteredData = $derived(() => {
        let data = courses_viz;
        // Filter by college if any are selected
        if (selectedColleges.size > 0) {
            data = data.filter(d => selectedColleges.has(d.college));
        }
        return data;
    });

    let hoveredData = $derived(
        hoveredCourse
            ? filteredData().find(c => c.code === hoveredCourse)
            : null
    );

    // Available years (fake data for now)
    const years = ['2024', '2025', '2026'];
</script>

<svelte:window onkeydown={handleKeydown} />

<article
    class="dashboard-layout story"
    class:sidebar-collapsed={sidebarCollapsed}
    class:sidebar-open={sidebarOpen}
    id="dashboard-1"
>
    <aside class="dashboard-sidebar">
        <button
            class="sidebar-toggle"
            onclick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <div class="sidebar-content">
            <h3>Filters</h3>

            <label for="year-select">Year</label>
            <select id="year-select" bind:value={selectedYear}>
                {#each years as year}
                    <option value={year}>{year}</option>
                {/each}
            </select>

            <fieldset>
                <legend>Colleges</legend>
                <div class="checkbox-group">
                    {#each colleges as college}
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedColleges.size === 0 || selectedColleges.has(college)}
                                onchange={() => toggleCollege(college)}
                            />
                            {college}
                        </label>
                    {/each}
                </div>
            </fieldset>
        </div>
    </aside>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="dashboard-backdrop" onclick={closeSidebar}></div>

    <main class="dashboard-main">
        <h1>UVM Spring 2026 course selector!</h1>

        <div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
            <svg viewBox={`0 0 ${width} ${height}`}>
                <g transform={`translate(${margin.left + 20}, 20)`}>
                    <Legend {colleges} {colorScale} {innerWidth} />
                </g>

                <Xaxis {xScale} {innerHeight} />
                <Yaxis {yScale} {innerWidth} />

                <EmbeddingDotPlot
                    data={filteredData()}
                    {xScale}
                    {yScale}
                    {colorScale}
                    {radiusScale}
                    bind:hoveredCourse
                />
            </svg>
        </div>
    </main>
</article>

<ChartTooltip
    data={hoveredData}
    {xScale}
    {yScale}
    {margin}
    {width}
/>

<Footer theme="light" />

<style>
    svg {
        width: 100%;
        height: 100%;
    }

    .chart-container {
        width: 100%;
        height: calc(100vh - 8rem);
        min-height: 500px;
        position: relative;
        overflow: hidden;
    }

    h1 {
        font-size: var(--font-size-lg);
        margin: 0 0 1rem;
        padding: 1.5rem 2rem 0;
    }
</style>
```

**Step 2: Run dev server and verify layout**

Run: `npm run dev`
Expected: Dashboard displays with sidebar on left, chart on right

**Step 3: Test collapse toggle**

Click the chevron button - sidebar should collapse to 48px, chart should expand.

**Step 4: Test mobile drawer**

Resize browser to <768px - sidebar should become a slide-out drawer.

**Step 5: Commit**

```bash
git add src/lib/stories/dashboard-1/components/Index.svelte
git commit -m "feat: integrate dashboard layout with collapsible sidebar"
```

---

### Task 6: Visual Testing and Polish

**Files:**
- Possibly adjust: `src/styles/app.css` or `src/lib/stories/dashboard-1/components/Index.svelte`

**Step 1: Test desktop collapse animation**

- Open dashboard at full width
- Click toggle - verify smooth 300ms animation
- Verify chart resizes without jank

**Step 2: Test mobile drawer**

- Resize to mobile (<768px)
- Click hamburger - drawer slides in
- Click backdrop - drawer closes
- Press Escape - drawer closes

**Step 3: Test filters (visual only)**

- Change year dropdown - verify it updates
- Toggle college checkboxes - verify filtering works

**Step 4: Final commit if any polish needed**

```bash
git add -A
git commit -m "fix: polish dashboard sidebar interactions"
```
