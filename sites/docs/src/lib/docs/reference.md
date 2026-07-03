# Reference

Layout patterns and CSS variables for scrollytelling stories.

Everything you build renders inside one of two containers:

- **`.page`** — a centered, width-constrained column for standard content pages (docs, about, home). One fixed layout, typically paired with `Nav` and `Footer`.
- **`.story`** — the scrollytelling container. Centered prose by default, but its layouts break out to full width. This is where the scrolly layouts, step styling, and multi-section patterns below apply.

Pick your container, then style within it. The [scoping rules](#css-variable-scoping) below apply to either container, and the full [design-token catalog](tokens) (colors, spacing, fonts, radius) lives on its own page.

## How the Styles Are Organized

The package ships four CSS files. Each has one job, and knowing the split tells you where any styling behavior comes from:

```css
/* your app.css imports them all, in this order */
@import '@the-vcsi/scrolly-kit/styles/all.css';
```

| File | Job |
|------|-----|
| `reset.css` | Neutral baseline: [Josh Comeau's custom reset](https://www.joshwcomeau.com/css/custom-css-reset/). Sane box-sizing, no default margins, responsive media. No opinions. |
| `tokens.css` | The vocabulary: every global `--vcsi-*` variable with a good default. Nothing renders from this file; it only defines values that the other files, the components, and your own CSS consume. Full catalog on the [Tokens](tokens) page. |
| `typography.css` | Text defaults for bare HTML elements: everything markdown emits (headings, paragraphs, code, blockquotes, links, tables) renders decently with zero classes. |
| `layouts.css` | The scrollytelling vocabulary: `.page`, `.story` with its prose column and breakouts, the scrolly layouts (`.split-layout`, `.fullscreen-layout`, `.triple-layout`, `.dashboard-layout`), and story theme isolation. This is the part you won't find in other frameworks. |

Four contracts fall out of that split:

- **Tokens are the styling API.** They are responsive by construction (sizes use `clamp()`, so `--vcsi-font-size-giant` scales from phone to desktop with no media queries) and theme-aware (semantic tokens like `--vcsi-bg` flip with dark mode). The `--vcsi-` prefix is a namespace for autocomplete and collision-avoidance, not branding. Customizing means overriding a token, not writing a competing rule.
- **The untweaked default is decent.** Scaffold a template, change nothing, and you still get readable type, sensible spacing, and working dark mode. Inspired by [pico.css](https://picocss.com/) and the [GC](https://design-system.canada.ca/) / [GOV.UK](https://frontend.design-system.service.gov.uk/) design systems.
- **Typography stops at markdown.** If a markdown renderer can emit it, typography.css styles it, classlessly. Anything that needs a class is either structure (layouts.css) or yours (your `app.css`). Text properties are set once on `body` and inherit, so styling a container just works: see [how text styling cascades](#how-text-styling-cascades).
- **Layouts own space; your components fill it.** The layout classes set dimensions with `vh`/`vw`/`%`; what you put inside fills with `100%` and bound sizes. Each layout documents its own tokens in the sections below.

## Page

The `.page` class provides a centered, width-constrained container for standard content pages. It's typically used with `Nav` and `Footer` components.

![Page layout: a body flex-column stacks Nav, a flex:1 main holding the centered .page — 5% side padding, max-width 1200px, 5.5rem top padding and 7.5rem bottom margin — then Footer. Nav, Footer, and .page share --vcsi-page-inline-padding and --vcsi-page-max-width, so their content edges align.](/diagrams/page-layout.svg "The .page container, with Nav and Footer sharing the same width tokens")

```svelte
<script>
  import { Nav, Footer } from '@the-vcsi/scrolly-kit';
</script>

<Nav />

<article class="page">
  <h1>Page Title</h1>
  <p>Content goes here...</p>
</article>

<Footer />
```

`Nav`, `Footer`, and `.page` all use the same width/padding variables for consistent alignment:

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-page-max-width` | 1200px | Maximum content width (shared by Nav, Footer, .page) |
| `--vcsi-page-inline-padding` | 5% | Side padding (shared by Nav, Footer, .page) |
| `--vcsi-nav-height` | 4.5rem | Nav height (.page has padding-top to clear it) |
| `--vcsi-bottom-padding` | 7.5rem | Bottom padding for pages and stories |

`Nav` and `Footer` are customizable components with their own props and tokens — see their component docs.

## Stories

The `.story` class is the main container for scrollytelling content. It provides:

- Centered prose by default (max-width 600px)
- Light theme isolation from global dark mode
- Padding and spacing for readability

Its layouts break out of that prose column to full width. Everything in this section — the story container, each layout, and step styling — is customized with `--vcsi-*` variables (see [Variable Scoping](#css-variable-scoping) for *where* to set them).

### The .story container

![The .story container: prose is centered at max-width 600px with 5.5rem top padding and 7.5rem bottom padding; layout sections break out to full width while keeping the story's 2rem inline padding, then content returns to the centered prose column.](/diagrams/story-container.svg "The .story container — centered prose with full-width layout breakouts")

```svelte
<article class="story">
  <h1>Story Title</h1>
  <p>Centered prose content...</p>

  <section class="split-layout">
    <!-- Layout breaks out to full width -->
  </section>

  <p>Back to centered prose...</p>
</article>
```

| Variable | Default (Light) | Default (Dark) | Description |
|----------|----------------|----------------|-------------|
| `--vcsi-story-bg` | #f4efea | #353839 | Story background color |
| `--vcsi-story-fg` | rgb(55, 55, 55) | white | Story text color |
| `--vcsi-story-max-width` | 600px | 600px | Max width for prose content |

Add `data-theme="dark"` for dark stories:

```svelte
<article class="story" data-theme="dark">
  <!-- Dark background, light text -->
</article>
```

### Split Layout

Two-column layout with a sticky visualization panel and scrolling content. While it breaks out of the prose max-width, it maintains its own side padding (2rem by default) rather than going edge-to-edge like `.fullscreen-layout`.

![Split layout: inside a .story, a full-width split-layout section keeps 2rem side padding and forms two columns — a scrolly-content column (1fr) with stacked steps and top/bottom spacers, a 2rem gap, and a sticky-panel column (minmax(450px, 45%)) whose visualization stays pinned while the steps scroll. Add .reversed to swap the columns.](/diagrams/split-layout.svg "Split layout: scrolly-content scrolls past a pinned sticky-panel")

```svelte
<section class="split-layout">
  <div class="sticky-panel">
    <!-- Your visualization component -->
  </div>
  <div class="scrolly-content">
    <!-- ScrollyContent or custom steps -->
  </div>
</section>

<!-- Reversed: panel on left -->
<section class="split-layout reversed">
  ...
</section>
```

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-panel-width` | 45% | Width of sticky panel |
| `--vcsi-panel-min-width` | 450px | Minimum panel width |
| `--vcsi-panel-height` | min(80vh, 600px) | Panel height |
| `--vcsi-panel-top-offset` | auto-centered | Vertical position of sticky panel |
| `--vcsi-layout-gap` | 2rem | Gap between columns |
| `--vcsi-content-padding-inline` | 2rem | Horizontal padding for the layout |
| `--vcsi-step-height` | 90vh | Vertical space between steps |
| `--vcsi-spacer-height` | 65vh | Height of top/bottom spacers |

On screens &lt;768px, the layout stacks with the sticky panel as a full-screen background and content overlaying it.

#### Customizing panel size

To give the visualization more space while capping its absolute width:

```css
.split-layout {
  --vcsi-panel-width: 60%;
  --vcsi-panel-min-width: 400px;
}

.sticky-panel {
  max-width: 700px;
}
```

The grid uses `minmax(min-width, width)`, so the panel scales between the min and percentage values. Adding `max-width` on `.sticky-panel` caps the absolute size on wide screens.

### Fullscreen Layout

Full-viewport immersive layout for dramatic visualizations.

![Fullscreen layout: spans 100vw edge-to-edge; the sticky-panel fills the viewport (100vh) with the visualization, and width-constrained step boxes (max-width 500px) are overlaid centered near the bottom. It escapes the prose container with margin-left: calc(-50vw + 50%).](/diagrams/fullscreen-layout.svg "Fullscreen layout — a viewport-filling panel with overlaid steps")

```svelte
<section class="fullscreen-layout">
  <div class="sticky-panel">
    <!-- Full-viewport visualization -->
  </div>
  <div class="scrolly-content">
    <!-- Overlaid step boxes -->
  </div>
</section>
```

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-step-max-width` | 500px | Max width of step boxes |
| `--vcsi-step-padding` | 2rem | Padding inside steps |
| `--vcsi-step-pointer-events` | none | Allows clicks to pass through to panel |

#### Repositioning step boxes

By default, step boxes are horizontally centered via `margin: 0 auto` on `.scrolly-content`. Override to position them differently:

![Step positioning: two fullscreen viewports side by side — on the left the overlaid step box is pushed to the left edge with margin-left; on the right it is centered with margin: 0 auto, the default. The overlaid step is positioned by the .scrolly-content margins.](/diagrams/step-positions.svg "Left-aligned vs centered overlaid step boxes")

```css
/* Left-aligned steps */
.fullscreen-layout .scrolly-content {
  margin-left: 2rem;
  margin-right: auto;
}
```

The `margin-left: auto` / `margin-right: auto` pattern pushes the content to the opposite side. Add a fixed margin on the aligned side for padding from the edge.

#### Examples in the Wild

Fullscreen scrollytelling stories from around the web:

[![Hello Stranger — an immersive scrollytelling piece by The Pudding](/hello-stranger.jpg "Hello Stranger · The Pudding")](https://pudding.cool/2025/06/hello-stranger/)
[![Visualizing Neglect — a scrollytelling story by Nadieh Bremer](/visualizing-neglect.jpg "Visualizing Neglect · Nadieh Bremer")](https://endfund.org/visualizing-neglect/)
[![A Guide to the Circular Deals Underpinning the AI Boom — Bloomberg](/2026-ai-circular-deals.jpg "Circular Deals in the AI Boom · Bloomberg")](https://www.bloomberg.com/graphics/2026-ai-circular-deals/)

### Triple Layout

Three columns — scrolling steps, a sticky code panel, and a sticky chart panel — for code-walkthrough stories.

```svelte
<section class="triple-layout">
  <div class="scrolly-content">
    <!-- ScrollyContent steps -->
  </div>
  <div class="code-panel">
    <!-- Sticky code, e.g. CodeExplainer -->
  </div>
  <div class="chart-panel">
    <!-- Sticky visualization -->
  </div>
</section>
```

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-layout-gap` | 1.5rem | Gap between columns |
| `--vcsi-panel-height` | min(95vh, 900px) | Height of the sticky code/chart panels |
| `--vcsi-panel-top-offset` | auto-centered | Vertical position of the sticky panels |
| `--vcsi-content-padding-inline` | 2rem | Horizontal padding for the layout |

On tablets (&lt;1024px) the code panel is hidden, leaving steps + chart. On phones (&lt;768px) it collapses to a single column with the chart as a full-viewport sticky background and the steps overlaid.

### Full Bleed

Escape the prose column to full viewport width — for a standalone chart, image, or map that is *not* a scrolly section. Use it as a direct child of `.story`.

```svelte
<article class="story">
  <p>Prose stays centered…</p>
  <div class="full-bleed">
    <!-- Full-width chart / image / map -->
  </div>
</article>
```

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-bleed-padding-inline` | 2rem | Horizontal padding inside the full-bleed area |

### Dashboard Layout

Sidebar + main content for interactive data dashboards.

![Dashboard layout: a two-column grid with a fixed-width dashboard-sidebar (280px) of filters and controls beside a dashboard-main column (1fr) holding the chart. The sidebar collapses to 48px and becomes a slide-down drawer on mobile.](/diagrams/dashboard-layout.svg "Dashboard layout — a sidebar of controls beside the main chart")

```svelte
<article class="dashboard-layout">
  <aside class="dashboard-sidebar">
    <button class="sidebar-toggle">...</button>
    <div class="sidebar-content">
      <!-- Filters, controls -->
    </div>
  </aside>
  <main class="dashboard-main">
    <!-- Visualization -->
  </main>
</article>
```

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-sidebar-width` | 280px | Sidebar width when open |
| `--vcsi-sidebar-collapsed-width` | 48px | Sidebar width when collapsed |
| `--vcsi-sidebar-bg` | #ebe6e1 | Sidebar background |
| `--vcsi-sidebar-transition` | 300ms ease | Animation timing for collapse/expand |
| `--vcsi-z-overlay` | 1000 | Z-index for mobile overlay |

Toggle the `.sidebar-collapsed` class on `.dashboard-layout` to collapse/expand. On mobile, the sidebar becomes a slide-down drawer — toggle `.sidebar-open` to show it.

### Step Styling

Step boxes work the same across every layout. These variables control their colors and sizing (they apply to `.split-layout`, `.fullscreen-layout`, and any layout using `ScrollyContent`).

![Step theme states: the same step box in the light theme and the dark theme, each with an active state (bright background, soft shadow) and an inactive, dimmed state. Active uses --vcsi-story-step-bg and -fg; inactive uses --vcsi-story-step-bg-inactive and -fg-inactive.](/diagrams/step-themes.svg "Active vs inactive step boxes in light and dark themes")

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--vcsi-story-step-bg` | #fff | #2a2a2a | Active step background |
| `--vcsi-story-step-fg` | #333 | #e8e8e8 | Active step text color |
| `--vcsi-story-step-bg-inactive` | #f5f5f5 | #222 | Inactive step background |
| `--vcsi-story-step-fg-inactive` | #ccc | #666 | Inactive step text color |
| `--vcsi-step-box-shadow` | 1px 1px 10px rgba(0,0,0,0.2) | 1px 1px 10px rgba(0,0,0,0.2) | Step box shadow |
| `--vcsi-step-max-width` | 600px | 600px | Maximum width of step box |
| `--vcsi-step-padding` | 1rem | 1rem | Padding inside step box |
| `--vcsi-step-border-radius` | 5px | 5px | Step box corner radius |
| `--vcsi-step-text-align` | center | center | Text alignment in steps |

All step variables use the `--vcsi-` prefix and are defined in `tokens.css`. Override them on any parent element to customize per-section:

```css
.split-layout {
  --vcsi-story-step-bg: #154734;
  --vcsi-story-step-fg: #fff;
}
```

For a minimal look where only text floats over the visualization:

```css
.split-layout {
  --vcsi-story-step-bg: transparent;
  --vcsi-story-step-bg-inactive: transparent;
  --vcsi-step-box-shadow: none;
}
```

## CSS Variable Scoping

Two rules govern *where* you set `--vcsi-*` variables. Getting them wrong is the single most common styling mistake — a variable set on the wrong element silently does nothing.

### Rule 1: Set variables on the element that reads them

CSS custom properties cascade **downward** to children. A variable must be set on the element that consumes it, or on an ancestor — never on a descendant.

```css
/* Layout vars → set on .split-layout (the element that reads them) */
.split-layout {
  --vcsi-panel-width: 65%;
  --vcsi-layout-gap: 0.5rem;
}

/* Step vars → set on .scrolly-content (ancestor of .step-box that reads them) */
.scrolly-content {
  --vcsi-step-height: 40vh;
  --vcsi-step-box-shadow: none;
}
```

```css
/* This does NOT work — .scrolly-content is inside .split-layout */
.scrolly-content {
  --vcsi-panel-width: 65%;  /* .split-layout reads this, not .scrolly-content */
}
```

#### Quick reference

| Variable | Set on | Why |
|----------|--------|-----|
| `--vcsi-panel-width`, `--vcsi-layout-gap`, `--vcsi-content-padding-inline` | `.split-layout` | Read by the layout grid itself |
| `--vcsi-step-height`, `--vcsi-step-box-shadow`, `--vcsi-step-max-width` | `.scrolly-content` or higher | Read by `.step` / `.step-box` inside ScrollyContent |
| `--vcsi-story-step-bg`, `--vcsi-story-step-fg` | `.scrolly-content` or higher | Read by `.step-box` for active/inactive colors |
| `--vcsi-story-bg`, `--vcsi-story-fg` | `.story` | Read by the story container itself |

### Rule 2: Scoped styles vs global classes

Svelte scopes `<style>` rules to elements in your component's template. Classes like `.split-layout` and `.scrolly-content` that appear directly in your markup work fine with scoped styles — Svelte adds its hash to both the element and the rule.

```css
/* Your Index.svelte has <section class="split-layout"> in its markup */
.split-layout {
  --vcsi-panel-width: 65%;
}

/* Your Index.svelte has <div class="scrolly-content"> in its markup */
.scrolly-content {
  --vcsi-step-height: 40vh;
}
```

Use `:global()` only when targeting classes on elements **inside imported components** — elements you don't control in your own template:

```css
/* .step-box is rendered by ScrollyContent, not your template */
:global(.step-box) {
  font-size: 0.9rem;
}
```

### How text styling cascades

Inheritable text properties (`font-family`, `font-size`, `line-height`, `color`) are set **once on `body`**, and everything inherits them. So styling a container works the way you'd expect:

```css
/* every <p>, <li>, and inline text inside follows */
.my-callout {
  font-size: 0.875rem;
}
```

Only a few elements carry their own sizes, so a container's `font-size` won't resize them: headings (`--vcsi-font-h1`…`--vcsi-font-h6` tokens), code (`pre` and inline `code`, sized in relative `em`), and blockquotes (`1.1em`). Everything else inherits.

## Multi-Section Stories

Most stories are **single-section**: one `ScrollyContent` bound to one `scrollyIndex`, driving one visualization. More complex stories combine **multiple scrolly sections** with text interludes — the main thing to get right there is that each section needs its own index.

The recommended multi-section pattern uses two approaches side by side:

| Pattern | Controlled by | Best for |
|---------|--------------|----------|
| **JSON-driven** | `copy.json` via `renderContent` | Text sections, inline components — author-friendly |
| **Svelte-explicit** | Markup in `Index.svelte` | Scrolly layouts, component props, theming — developer-controlled |

### The renderContent snippet

Define a snippet that handles both text items and component markers from `copy.json`:

```svelte
<script>
  import { RenderContent, ScrollyContent, Footer } from '@the-vcsi/scrolly-kit';
  import MyChart from './MyChart.svelte';
  import MyPlot from './MyPlot.svelte';

  let { story, data } = $props();
  let scrollyIndex = $state(0);

  // Register components that copy.json can reference
  const components = { MyChart };
</script>

<article class="story">
  <!-- Text section (JSON-driven) -->
  <section id="intro">
    <RenderContent items={data.introduction} />
  </section>

  <!-- Scrolly section (Svelte-explicit) -->
  <section class="split-layout">
    <div class="sticky-panel">
      <MyPlot {scrollyIndex} />
    </div>
    <div class="scrolly-content">
      <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
    </div>
  </section>

  <!-- Text section with inline component (JSON-driven) -->
  <section id="interlude">
    <RenderContent items={data.interlude} {components} />
  </section>
</article>
```

### Component markers in copy.json

Place a component marker anywhere in a content array. The `renderContent` snippet looks up the component by `value` and renders it inline:

```json
{
  "interlude": [
    { "type": "markdown", "value": "Text before the chart..." },
    { "type": "component", "value": "MyChart" },
    { "type": "markdown", "value": "Text after the chart..." }
  ]
}
```

This pairs with the `@the-vcsi/msgraph` add-on for teams where non-technical contributors author content in a shared Excel spreadsheet (section | key | value format).

### One index per section

Each scrolly section must have its **own state variable**. If two `ScrollyContent` components bind to the same `scrollyIndex`, scrolling in one section overwrites the other's value — both visualizations then react to the wrong section.

```svelte
<!-- Wrong — shared state -->
<script>
  let scrollyIndex = $state(0);  // one index for both sections
</script>

<!-- Section 1 -->
<ScrollyContent steps={data.steps1} bind:value={scrollyIndex} />

<!-- Section 2 — overwrites scrollyIndex when you scroll here -->
<ScrollyContent steps={data.steps2} bind:value={scrollyIndex} />
```

```svelte
<!-- Correct — independent state -->
<script>
  let barIndex = $state(0);
  let scatterIndex = $state(0);
</script>

<!-- Section 1 -->
<ScrollyContent steps={data.steps1} bind:value={barIndex} />

<!-- Section 2 — independent -->
<ScrollyContent steps={data.steps2} bind:value={scatterIndex} />
```

This also means you can reuse the same visualization component in multiple sections — just pass it a different index prop.

See `scrolly-story-1` in the baked template for a complete example with two scrolly sections, text interludes, and inline components.
