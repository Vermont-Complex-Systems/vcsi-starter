<script>
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import ShowcaseGrid from '$lib/components/ShowcaseGrid.svelte';
  import LinkableHeader from '$lib/components/LinkableHeader.svelte';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';

  import PageLayoutDiagram from '$lib/components/diagrams/PageLayoutDiagram.svelte';
  import StoryContainerDiagram from '$lib/components/diagrams/StoryContainerDiagram.svelte';
  import SplitLayoutDiagram from '$lib/components/diagrams/SplitLayoutDiagram.svelte';
  import CustomPanelSizeDiagram from '$lib/components/diagrams/CustomPanelSizeDiagram.svelte';
  import FullscreenLayoutDiagram from '$lib/components/diagrams/FullscreenLayoutDiagram.svelte';
  import StepPositionsDiagram from '$lib/components/diagrams/StepPositionsDiagram.svelte';
  import StepThemesDiagram from '$lib/components/diagrams/StepThemesDiagram.svelte';
  import DashboardLayoutDiagram from '$lib/components/diagrams/DashboardLayoutDiagram.svelte';


  const fullscreenExamples = [
    {
      title: 'Hello Stranger',
      url: 'https://pudding.cool/2025/06/hello-stranger/',
      thumbnail: '/hello-stranger.jpg',
      source: 'The Pudding'
    },
    {
      title: 'Visualizing neglect',
      url: 'https://endfund.org/visualizing-neglect/',
      thumbnail: '/visualizing-neglect.jpg',
      source: 'Nadieh Bremer'
    },
    {
      title: 'A Guide to the Circular Deals Underpinning the AI Boom',
      url: 'https://www.bloomberg.com/graphics/2026-ai-circular-deals/?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb3VyY2UiOiJTdWJzY3JpYmVyR2lmdGVkQXJ0aWNsZSIsImlhdCI6MTc3MTMzNjc1MCwiZXhwIjoxNzcxOTQxNTUwLCJhcnRpY2xlSWQiOiJUOUFENFhLSVVQU1QwMCIsImJjb25uZWN0SWQiOiIwQ0NDMzAxQUU3QTQ0RDI0QjcwQzhDQTIwNjdCNENFOSJ9.eqGZyj5Rg5VxDa-TzjWU98Am_xtYItKUU0SlXPe7UZA&leadSource=uverify%20wall',
      thumbnail: '/2026-ai-circular-deals.jpg',
      source: 'Bloomberg'
    }
  ];

  const sections = [
    { id: 'page', label: 'Page Layout' },
    { id: 'story', label: 'Story Container' },
    { id: 'split-layout', label: 'Split Layout' },
    { id: 'fullscreen-layout', label: 'Fullscreen Layout' },
    { id: 'dashboard-layout', label: 'Dashboard Layout' },
    { id: 'step-styling', label: 'Step Styling' },
    { id: 'css-variables', label: 'CSS Variables' }
  ];
</script>

<svelte:head>
  <title>Reference - scrolly-kit</title>
</svelte:head>

<div class="reference-layout">
  <article class="page">
    <h1>Reference</h1>
    <p>Layout patterns and CSS variables for scrollytelling stories.</p>

    <!-- PAGE LAYOUT -->
    <section id="page">
      <LinkableHeader id="page">Page Layout</LinkableHeader>
      <p>The <code>.page</code> class provides a centered, width-constrained container for standard content pages. It's typically used with <code>Nav</code> and <code>Footer</code> components.</p>

      <PageLayoutDiagram />

      <CopyCodeBlock language="svelte" command={`<script>
  import { Nav, Footer } from '@the-vcsi/scrolly-kit';
<\/script>

<Nav />

<article class="page">
  <h1>Page Title</h1>
  <p>Content goes here...</p>
</article>

<Footer />`} />

      <h3>CSS Variables</h3>
      <p>Nav, Footer, and <code>.page</code> all use the same width/padding variables for consistent alignment:</p>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-page-max-width</code></td><td>1200px</td><td>Maximum content width (shared by Nav, Footer, .page)</td></tr>
          <tr><td><code>--vcsi-page-inline-padding</code></td><td>5%</td><td>Side padding (shared by Nav, Footer, .page)</td></tr>
          <tr><td><code>--vcsi-nav-height</code></td><td>4.5rem</td><td>Nav height (.page has padding-top to clear it)</td></tr>
          <tr><td><code>--vcsi-bottom-padding</code></td><td>7.5rem</td><td>Bottom padding for pages and stories</td></tr>
        </tbody>
      </table>

      <h3>When to Use</h3>
      <ul>
        <li><strong>.page</strong> — Standard content pages (docs, about, home)</li>
        <li><strong>.story</strong> — Scrollytelling articles with layouts that break out</li>
      </ul>
    </section>

    <!-- STORY CONTAINER -->
    <section id="story">
      <LinkableHeader id="story">Story Container</LinkableHeader>
      <p>The <code>.story</code> class is the main container for scrollytelling content. It provides:</p>
      <ul>
        <li>Centered prose by default (max-width 600px)</li>
        <li>Light theme isolation from global dark mode</li>
        <li>Padding and spacing for readability</li>
      </ul>

      <StoryContainerDiagram />

      <CopyCodeBlock language="svelte" command={`<article class="story">
  <h1>Story Title</h1>
  <p>Centered prose content...</p>

  <section class="split-layout">
    <!-- Layout breaks out to full width -->
  </section>

  <p>Back to centered prose...</p>
</article>`} />

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default (Light)</th><th>Default (Dark)</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-story-bg</code></td><td>#f4efea</td><td>#353839</td><td>Story background color</td></tr>
          <tr><td><code>--vcsi-story-fg</code></td><td>rgb(55, 55, 55)</td><td>white</td><td>Story text color</td></tr>
          <tr><td><code>--vcsi-story-max-width</code></td><td colspan="2">600px</td><td>Max width for prose content</td></tr>
        </tbody>
      </table>

      <h3>Dark Theme</h3>
      <p>Add <code>data-theme="dark"</code> for dark stories:</p>
      <CopyCodeBlock language="svelte" command={`<article class="story" data-theme="dark">
  <!-- Dark background, light text -->
</article>`} />
    </section>


    <!-- SPLIT LAYOUT -->
    <section id="split-layout">
      <LinkableHeader id="split-layout">Split Layout</LinkableHeader>
      <p>Two-column layout with a sticky visualization panel and scrolling content. While it breaks out of the prose max-width, it maintains its own side padding (2rem by default) rather than going edge-to-edge like <code>.fullscreen-layout</code>.</p>

      <SplitLayoutDiagram />

      <CopyCodeBlock language="svelte" command={`<section class="split-layout">
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
</section>`} />

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-panel-width</code></td><td>45%</td><td>Width of sticky panel</td></tr>
          <tr><td><code>--vcsi-panel-min-width</code></td><td>450px</td><td>Minimum panel width</td></tr>
          <tr><td><code>--vcsi-panel-height</code></td><td>min(80vh, 600px)</td><td>Panel height</td></tr>
          <tr><td><code>--vcsi-panel-top-offset</code></td><td>auto-centered</td><td>Vertical position of sticky panel</td></tr>
          <tr><td><code>--vcsi-layout-gap</code></td><td>2rem</td><td>Gap between columns</td></tr>
          <tr><td><code>--vcsi-content-padding-inline</code></td><td>2rem</td><td>Horizontal padding for the layout</td></tr>
          <tr><td><code>--step-height</code></td><td>90vh</td><td>Vertical space between steps</td></tr>
          <tr><td><code>--spacer-height</code></td><td>65vh</td><td>Height of top/bottom spacers</td></tr>
        </tbody>
      </table>

      <h3>Mobile Behavior</h3>
      <p>On screens &lt;768px, the layout stacks with the sticky panel as a full-screen background and content overlaying it.</p>

      <h3>Cookbook</h3>
      <h4>Customizing Panel Size</h4>
      <p>To give the visualization more space while capping its absolute width:</p>

      <CustomPanelSizeDiagram />

      <CopyCodeBlock command={`.split-layout {
  --vcsi-panel-width: 60%;
  --vcsi-panel-min-width: 400px;
}

.sticky-panel {
  max-width: 700px;
}`} />
      <p>The grid uses <code>minmax(min-width, width)</code>, so the panel scales between the min and percentage values. Adding <code>max-width</code> on <code>.sticky-panel</code> caps the absolute size on wide screens.</p>
    </section>

    <!-- FULLSCREEN LAYOUT -->
    <section id="fullscreen-layout">
      <LinkableHeader id="fullscreen-layout">Fullscreen Layout</LinkableHeader>
      <p>Full-viewport immersive layout for dramatic visualizations.</p>

      <FullscreenLayoutDiagram />

      <CopyCodeBlock language="svelte" command={`<section class="fullscreen-layout">
  <div class="sticky-panel">
    <!-- Full-viewport visualization -->
  </div>
  <div class="scrolly-content">
    <!-- Overlaid step boxes -->
  </div>
</section>`} />

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-step-max-width</code></td><td>500px</td><td>Max width of step boxes</td></tr>
          <tr><td><code>--vcsi-step-padding</code></td><td>2rem</td><td>Padding inside steps</td></tr>
          <tr><td><code>--vcsi-step-pointer-events</code></td><td>none</td><td>Allows clicks to pass through to panel</td></tr>
        </tbody>
      </table>

      <h3>Cookbook</h3>
      <h4>Repositioning Step Boxes</h4>
      <p>By default, step boxes are horizontally centered via <code>margin: 0 auto</code> on <code>.scrolly-content</code>. Override to position them differently:</p>

      <StepPositionsDiagram />

      <CopyCodeBlock label="Repositioning step boxes (CSS)" command={`/* Left-aligned steps */
.fullscreen-layout .scrolly-content {
  margin-left: 2rem;
  margin-right: auto;
}
`} />
      <p>The <code>margin-left: auto</code> / <code>margin-right: auto</code> pattern pushes the content to the opposite side. Add a fixed margin on the aligned side for padding from the edge.</p>

      <h3>Examples in the Wild</h3>
      <p>Inspiring fullscreen scrollytelling stories from around the web.</p>
      <ShowcaseGrid examples={fullscreenExamples} />
    </section>

    <!-- DASHBOARD LAYOUT -->
    <section id="dashboard-layout">
      <LinkableHeader id="dashboard-layout">Dashboard Layout</LinkableHeader>
      <p>Sidebar + main content for interactive data dashboards.</p>

      <DashboardLayoutDiagram />

      <CopyCodeBlock language="svelte" command={`<article class="dashboard-layout">
  <aside class="dashboard-sidebar">
    <button class="sidebar-toggle">...</button>
    <div class="sidebar-content">
      <!-- Filters, controls -->
    </div>
  </aside>
  <main class="dashboard-main">
    <!-- Visualization -->
  </main>
</article>`} />

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-sidebar-width</code></td><td>280px</td><td>Sidebar width when open</td></tr>
          <tr><td><code>--vcsi-sidebar-collapsed-width</code></td><td>48px</td><td>Sidebar width when collapsed</td></tr>
          <tr><td><code>--vcsi-sidebar-bg</code></td><td>#ebe6e1</td><td>Sidebar background</td></tr>
          <tr><td><code>--vcsi-sidebar-transition</code></td><td>300ms ease</td><td>Animation timing for collapse/expand</td></tr>
          <tr><td><code>--vcsi-z-overlay</code></td><td>1000</td><td>Z-index for mobile overlay</td></tr>
        </tbody>
      </table>

      <h3>Collapsible Sidebar</h3>
      <p>Toggle <code>.sidebar-collapsed</code> class on <code>.dashboard-layout</code> to collapse/expand.</p>

      <h3>Mobile Behavior</h3>
      <p>On mobile, sidebar becomes a slide-down drawer. Toggle <code>.sidebar-open</code> class to show.</p>
    </section>

    <!-- STEP STYLING -->
    <section id="step-styling">
      <LinkableHeader id="step-styling">Step Styling</LinkableHeader>
      <p>Step boxes in scrolly layouts use these CSS variables for colors and sizing. These apply to both <code>.split-layout</code> and <code>.fullscreen-layout</code>.</p>

      <StepThemesDiagram />

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Light</th><th>Dark</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--story-step-bg</code></td><td>#fff</td><td>#2a2a2a</td><td>Active step background</td></tr>
          <tr><td><code>--story-step-fg</code></td><td>#333</td><td>#e8e8e8</td><td>Active step text color</td></tr>
          <tr><td><code>--story-step-bg-inactive</code></td><td>#f5f5f5</td><td>#222</td><td>Inactive step background</td></tr>
          <tr><td><code>--story-step-fg-inactive</code></td><td>#ccc</td><td>#666</td><td>Inactive step text color</td></tr>
          <tr><td><code>--step-box-shadow</code></td><td colspan="2">1px 1px 10px rgba(0,0,0,0.2)</td><td>Step box shadow</td></tr>
          <tr><td><code>--step-max-width</code></td><td colspan="2">600px</td><td>Maximum width of step box</td></tr>
          <tr><td><code>--step-padding</code></td><td colspan="2">1rem</td><td>Padding inside step box</td></tr>
          <tr><td><code>--step-border-radius</code></td><td colspan="2">5px</td><td>Step box corner radius</td></tr>
          <tr><td><code>--step-text-align</code></td><td colspan="2">center</td><td>Text alignment in steps</td></tr>
        </tbody>
      </table>
      <p><strong><code>--story-step-*</code></strong> variables control colors and are typically set globally in <code>app.css</code> for consistent theming across your story. <strong><code>--step-*</code></strong> variables control layout and can be set per-section for local customization.</p>

      <h3>Example Override</h3>
      <CopyCodeBlock label="Custom step colors" command={`.split-layout {
  --story-step-bg: #154734;
  --story-step-fg: #fff;
}`} />

      <p>For a minimal look where only text floats over the visualization:</p>
      <CopyCodeBlock label="Minimal floating text" command={`.split-layout {
  --story-step-bg: transparent;
  --story-step-bg-inactive: transparent;
  --step-box-shadow: none;
}`} />
    </section>

    <!-- CSS VARIABLES -->
    <section id="css-variables">
      <LinkableHeader id="css-variables">Global CSS Variables</LinkableHeader>
      <p>Design tokens available throughout your project. See <a href="https://github.com/Vermont-Complex-Systems/vcsi-starter/blob/main/packages/scrolly-kit/src/lib/styles/tokens.css" target="_blank" rel="noopener">tokens.css</a> for the full source.</p>

      <h3>Colors</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Value</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-color-accent</code></td><td>#154734</td><td>Brand accent (UVM Green)</td></tr>
          <tr><td><code>--vcsi-color-uvm-green</code></td><td>#154734</td><td>UVM Green</td></tr>
          <tr><td><code>--vcsi-color-uvm-gold</code></td><td>rgb(255, 209, 0)</td><td>UVM Gold</td></tr>
          <tr><td><code>--vcsi-color-beige</code></td><td>#f4efea</td><td>Warm beige</td></tr>
          <tr><td><code>--vcsi-gray-100</code> to <code>900</code></td><td>scale</td><td>Gray scale (100, 200, 300, 400, 600, 700, 800, 900)</td></tr>
        </tbody>
      </table>

      <h4>Semantic Colors (auto-switch with dark mode)</h4>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-bg</code></td><td>Background color</td></tr>
          <tr><td><code>--vcsi-fg</code></td><td>Text color</td></tr>
          <tr><td><code>--vcsi-border</code></td><td>Border color</td></tr>
          <tr><td><code>--vcsi-hover</code></td><td>Hover state</td></tr>
          <tr><td><code>--vcsi-link</code></td><td>Link color</td></tr>
          <tr><td><code>--vcsi-muted</code></td><td>Muted/secondary text</td></tr>
          <tr><td><code>--vcsi-code-bg</code></td><td>Code block background</td></tr>
          <tr><td><code>--vcsi-code-fg</code></td><td>Code text color</td></tr>
        </tbody>
      </table>

      <h3>Typography</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-font-sans</code></td><td>"Atlas Grotesk", system-ui, sans-serif</td></tr>
          <tr><td><code>--vcsi-font-serif</code></td><td>"Baskerville", Georgia, serif</td></tr>
          <tr><td><code>--vcsi-font-mono</code></td><td>"Atlas Typewriter", "SF Mono", monospace</td></tr>
          <tr><td><code>--vcsi-font-heading</code></td><td>var(--vcsi-font-serif)</td></tr>
        </tbody>
      </table>

      <h4>Font Sizes (responsive clamp)</h4>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Range</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-font-size-giant</code></td><td>3rem → 4rem</td></tr>
          <tr><td><code>--vcsi-font-size-xl</code></td><td>1.8rem → 3rem</td></tr>
          <tr><td><code>--vcsi-font-size-lg</code></td><td>1.5rem → 2.5rem</td></tr>
          <tr><td><code>--vcsi-font-size-md</code></td><td>1.25rem → 1.75rem</td></tr>
          <tr><td><code>--vcsi-font-size-base</code></td><td>1.125rem → 1.25rem</td></tr>
          <tr><td><code>--vcsi-font-size-small</code></td><td>1rem → 1.125rem</td></tr>
          <tr><td><code>--vcsi-font-size-xs</code></td><td>0.875rem → 1rem</td></tr>
        </tbody>
      </table>

      <h4>Font Weights &amp; Line Heights</h4>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-font-weight-light</code></td><td>300</td></tr>
          <tr><td><code>--vcsi-font-weight-regular</code></td><td>400</td></tr>
          <tr><td><code>--vcsi-font-weight-medium</code></td><td>500</td></tr>
          <tr><td><code>--vcsi-font-weight-semibold</code></td><td>600</td></tr>
          <tr><td><code>--vcsi-font-weight-bold</code></td><td>700</td></tr>
          <tr><td><code>--vcsi-line-height-tight</code></td><td>1.17 (headings)</td></tr>
          <tr><td><code>--vcsi-line-height-snug</code></td><td>1.33 (subheadings)</td></tr>
          <tr><td><code>--vcsi-line-height-normal</code></td><td>1.5 (body)</td></tr>
          <tr><td><code>--vcsi-line-height-relaxed</code></td><td>1.6 (long-form)</td></tr>
        </tbody>
      </table>

      <h3>Spacing</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-space-xs</code></td><td>0.25rem</td></tr>
          <tr><td><code>--vcsi-space-sm</code></td><td>0.5rem</td></tr>
          <tr><td><code>--vcsi-space-md</code></td><td>1rem</td></tr>
          <tr><td><code>--vcsi-space-lg</code></td><td>1.5rem</td></tr>
          <tr><td><code>--vcsi-space-xl</code></td><td>2rem</td></tr>
          <tr><td><code>--vcsi-space-2xl</code></td><td>3rem</td></tr>
        </tbody>
      </table>

      <h3>Border Radius</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-radius-sm</code></td><td>3px</td></tr>
          <tr><td><code>--vcsi-radius-md</code></td><td>6px</td></tr>
          <tr><td><code>--vcsi-radius-lg</code></td><td>8px</td></tr>
          <tr><td><code>--vcsi-radius-full</code></td><td>9999px</td></tr>
        </tbody>
      </table>

      <h3>Transitions</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-transition-fast</code></td><td>150ms ease</td></tr>
          <tr><td><code>--vcsi-transition-base</code></td><td>200ms ease</td></tr>
          <tr><td><code>--vcsi-transition-slow</code></td><td>300ms ease</td></tr>
        </tbody>
      </table>

    </section>
  </article>

  <TableOfContents {sections} />
</div>

<style>
  .reference-layout {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 2rem 0;
  }

  .page h1 {
    margin-top: 0;
  }

  section {
    margin-top: 2rem;
    padding-top: 1rem;
    scroll-margin-top: 5rem;
  }

  h3 {
    margin-top: 2rem;
  }

  code {
    background: var(--vcsi-gray-100);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  @media (max-width: 900px) {
    .reference-layout {
      padding: 1rem;
    }
  }

  /* Dark mode for inline code */
  :global(.dark) code {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
  }
</style>
