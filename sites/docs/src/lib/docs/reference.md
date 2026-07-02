# Reference

Layout patterns and CSS variables for scrollytelling stories.

## Page Layout

The `.page` class provides a centered, width-constrained container for standard content pages. It's typically used with `Nav` and `Footer` components.

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

### CSS Variables

Nav, Footer, and `.page` all use the same width/padding variables for consistent alignment:

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-page-max-width` | 1200px | Maximum content width (shared by Nav, Footer, .page) |
| `--vcsi-page-inline-padding` | 5% | Side padding (shared by Nav, Footer, .page) |
| `--vcsi-nav-height` | 4.5rem | Nav height (.page has padding-top to clear it) |
| `--vcsi-bottom-padding` | 7.5rem | Bottom padding for pages and stories |

### When to Use

- **.page** -- Standard content pages (docs, about, home)
- **.story** -- Scrollytelling articles with layouts that break out

## Story Container

The `.story` class is the main container for scrollytelling content. It provides:

- Centered prose by default (max-width 600px)
- Light theme isolation from global dark mode
- Padding and spacing for readability

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

### CSS Variables

| Variable | Default (Light) | Default (Dark) | Description |
|----------|----------------|----------------|-------------|
| `--vcsi-story-bg` | #f4efea | #353839 | Story background color |
| `--vcsi-story-fg` | rgb(55, 55, 55) | white | Story text color |
| `--vcsi-story-max-width` | 600px | 600px | Max width for prose content |

### Dark Theme

Add `data-theme="dark"` for dark stories:

```svelte
<article class="story" data-theme="dark">
  <!-- Dark background, light text -->
</article>
```

## Split Layout

Two-column layout with a sticky visualization panel and scrolling content. While it breaks out of the prose max-width, it maintains its own side padding (2rem by default) rather than going edge-to-edge like `.fullscreen-layout`.

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

### CSS Variables

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

### Mobile Behavior

On screens &lt;768px, the layout stacks with the sticky panel as a full-screen background and content overlaying it.

### Cookbook

#### Customizing Panel Size

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

## Fullscreen Layout

Full-viewport immersive layout for dramatic visualizations.

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

### CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-step-max-width` | 500px | Max width of step boxes |
| `--vcsi-step-padding` | 2rem | Padding inside steps |
| `--vcsi-step-pointer-events` | none | Allows clicks to pass through to panel |

### Cookbook

#### Repositioning Step Boxes

By default, step boxes are horizontally centered via `margin: 0 auto` on `.scrolly-content`. Override to position them differently:

```css
/* Left-aligned steps */
.fullscreen-layout .scrolly-content {
  margin-left: 2rem;
  margin-right: auto;
}
```

The `margin-left: auto` / `margin-right: auto` pattern pushes the content to the opposite side. Add a fixed margin on the aligned side for padding from the edge.

### Examples in the Wild

Inspiring fullscreen scrollytelling stories from around the web.

## Dashboard Layout

Sidebar + main content for interactive data dashboards.

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

### CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--vcsi-sidebar-width` | 280px | Sidebar width when open |
| `--vcsi-sidebar-collapsed-width` | 48px | Sidebar width when collapsed |
| `--vcsi-sidebar-bg` | #ebe6e1 | Sidebar background |
| `--vcsi-sidebar-transition` | 300ms ease | Animation timing for collapse/expand |
| `--vcsi-z-overlay` | 1000 | Z-index for mobile overlay |

### Collapsible Sidebar

Toggle `.sidebar-collapsed` class on `.dashboard-layout` to collapse/expand.

### Mobile Behavior

On mobile, sidebar becomes a slide-down drawer. Toggle `.sidebar-open` class to show.

## Step Styling

Step boxes in scrolly layouts use these CSS variables for colors and sizing. These apply to both `.split-layout` and `.fullscreen-layout`.

### CSS Variables

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

All step variables use the `--vcsi-` prefix and are defined in `tokens.css`. Override them on any parent element to customize per-section.

### Example Override

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

Two rules to keep in mind when overriding `--vcsi-*` variables in your story's `<style>` block.

### Rule 1: Set variables on the element that reads them

CSS custom properties cascade **downward** to children. A variable must be set on the element that consumes it, or on an ancestor -- not on a descendant.

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

Svelte scopes `<style>` rules to elements in your component's template. Classes like `.split-layout` and `.scrolly-content` that appear directly in your markup work fine with scoped styles -- Svelte adds its hash to both the element and the rule.

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

Use `:global()` only when targeting classes on elements **inside imported components** -- elements you don't control in your own template:

```css
/* .step-box is rendered by ScrollyContent, not your template */
:global(.step-box) {
  font-size: 0.9rem;
}
```

## Multi-Section Stories

Stories can combine multiple scrolly sections with text interludes. The recommended pattern uses two approaches side by side:

| Pattern | Controlled by | Best for |
|---------|--------------|----------|
| **JSON-driven** | `copy.json` via `renderContent` | Text sections, inline components -- author-friendly |
| **Svelte-explicit** | Markup in `Index.svelte` | Scrolly layouts, component props, theming -- developer-controlled |

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

### Multiple scroll indices

Each scrolly section needs its own state variable. Don't share a single `scrollyIndex` across sections:

```js
let barIndex = $state(0);
let scatterIndex = $state(0);
```

See `scrolly-story-1` in the baked template for a complete example with two scrolly sections, text interludes, and inline components.

## Gotchas

Common pitfalls when building stories.

### Shared scrollyIndex across sections

Each scrolly section must have its **own state variable**. If two `ScrollyContent` components bind to the same `scrollyIndex`, scrolling in one section overwrites the other's value -- causing both visualizations to react to the wrong section.

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

This also means you can reuse the same visualization component in multiple sections -- just pass it a different index prop.

### CSS variables set on the wrong element

CSS custom properties cascade **downward**. Setting a variable on a child has no effect on a parent that reads it. See [Variable Scoping](#css-variable-scoping) for the full rule.

```css
/* Wrong — child can't set parent's variable */
.scrolly-content {
  --vcsi-panel-width: 65%;  /* .split-layout reads this, not .scrolly-content */
}
```

```css
/* Correct — set on the element that reads it */
.split-layout {
  --vcsi-panel-width: 65%;
}
```

### Global DOM selectors in plot components

Avoid `document.querySelector('.chart')` in visualization components. In a multi-section story, it may grab the wrong element from a different section. Instead, use Svelte's `bind:this` to reference your own DOM:

```svelte
<!-- Wrong -->
<script>
  // Could grab the chart from a different section!
  const el = document.querySelector('.chart');
</script>
```

```svelte
<!-- Correct -->
<script>
  let chartEl = $state();
</script>

<div class="chart" bind:this={chartEl}>
  <!-- chartEl always refers to THIS component's div -->
</div>
```

## Global CSS Variables

The complete `--vcsi-*` design-token catalog — the reference for styling any custom UI. Consume these in custom CSS (below) and override them on a scope to customize; never hardcode a value a token already covers.

### Using tokens in custom CSS

**When you write custom CSS — a home page, a card, a nav, a legend — consume these tokens instead of hardcoding values.** Hardcoded colors, fonts, and spacing drift from the brand and break dark mode: the semantic colors below auto-switch with the theme, but a hardcoded `#fff` will not.

```css
/* ❌ hardcoded — drifts from the theme, ignores dark mode */
.card { background: #fff; color: #333; padding: 20px; border-radius: 8px; font-family: system-ui; }

/* ✅ consume the tokens */
.card {
  background: var(--vcsi-bg);
  color: var(--vcsi-fg);
  padding: var(--vcsi-space-lg);
  border: 1px solid var(--vcsi-border);
  border-radius: var(--vcsi-radius-md);
  font-family: var(--vcsi-font-sans);
}
```

To customize, override a token on a scope (see [CSS Variable Scoping](#css-variable-scoping)) rather than writing a competing rule.

### Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--vcsi-color-accent` | #154734 | Brand accent (UVM Green) |
| `--vcsi-color-uvm-green` | #154734 | UVM Green |
| `--vcsi-color-uvm-gold` | rgb(255, 209, 0) | UVM Gold |
| `--vcsi-color-beige` | #f4efea | Warm beige |
| `--vcsi-gray-100` to `900` | scale | Gray scale (100, 200, 300, 400, 600, 700, 800, 900) |

#### Semantic Colors (auto-switch with dark mode)

| Variable | Description |
|----------|-------------|
| `--vcsi-bg` | Background color |
| `--vcsi-fg` | Text color |
| `--vcsi-border` | Border color |
| `--vcsi-hover` | Hover state |
| `--vcsi-link` | Link color |
| `--vcsi-muted` | Muted/secondary text |
| `--vcsi-code-bg` | Code block background |
| `--vcsi-code-fg` | Code text color |

### Typography

| Variable | Default |
|----------|---------|
| `--vcsi-font-sans` | "Atlas Grotesk", system-ui, sans-serif |
| `--vcsi-font-serif` | "Baskerville", Georgia, serif |
| `--vcsi-font-mono` | "Atlas Typewriter", "SF Mono", monospace |
| `--vcsi-font-heading` | var(--vcsi-font-serif) |

#### Font Sizes (responsive clamp)

| Variable | Range |
|----------|-------|
| `--vcsi-font-size-giant` | 3rem &rarr; 4rem |
| `--vcsi-font-size-xl` | 1.8rem &rarr; 3rem |
| `--vcsi-font-size-lg` | 1.5rem &rarr; 2.5rem |
| `--vcsi-font-size-md` | 1.25rem &rarr; 1.75rem |
| `--vcsi-font-size-base` | 1.125rem &rarr; 1.25rem |
| `--vcsi-font-size-small` | 1rem &rarr; 1.125rem |
| `--vcsi-font-size-xs` | 0.875rem &rarr; 1rem |

#### Font Weights & Line Heights

| Variable | Value |
|----------|-------|
| `--vcsi-font-weight-light` | 300 |
| `--vcsi-font-weight-regular` | 400 |
| `--vcsi-font-weight-medium` | 500 |
| `--vcsi-font-weight-semibold` | 600 |
| `--vcsi-font-weight-bold` | 700 |
| `--vcsi-line-height-tight` | 1.17 (headings) |
| `--vcsi-line-height-snug` | 1.33 (subheadings) |
| `--vcsi-line-height-normal` | 1.5 (body) |
| `--vcsi-line-height-relaxed` | 1.6 (long-form) |

### Spacing

| Variable | Value |
|----------|-------|
| `--vcsi-space-xs` | 0.25rem |
| `--vcsi-space-sm` | 0.5rem |
| `--vcsi-space-md` | 1rem |
| `--vcsi-space-lg` | 1.5rem |
| `--vcsi-space-xl` | 2rem |
| `--vcsi-space-2xl` | 3rem |

### Border Radius

| Variable | Value |
|----------|-------|
| `--vcsi-radius-sm` | 3px |
| `--vcsi-radius-md` | 6px |
| `--vcsi-radius-lg` | 8px |
| `--vcsi-radius-full` | 9999px |

### Transitions

| Variable | Value |
|----------|-------|
| `--vcsi-transition-fast` | 150ms ease |
| `--vcsi-transition-base` | 200ms ease |
| `--vcsi-transition-slow` | 300ms ease |
