<script>
  import TableOfContents from '$lib/components/TableOfContents.svelte';

  const sections = [
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

    <!-- STORY CONTAINER -->
    <section id="story">
      <h2>Story Container</h2>
      <p>The <code>.story</code> class is the main container for scrollytelling content. It provides:</p>
      <ul>
        <li>Centered prose by default (max-width 600px)</li>
        <li>Light theme isolation from global dark mode</li>
        <li>Padding and spacing for readability</li>
      </ul>

      <div class="layout-diagram">
        <div class="diagram-story">
          <div class="diagram-label">.story</div>
          <div class="diagram-padding-top">
            <span>padding-top: 5.5rem</span>
          </div>
          <div class="diagram-prose">
            <div class="diagram-label">Centered prose (600px)</div>
            <p>Title & intro text...</p>
          </div>
          <div class="diagram-layout-break">
            <div class="diagram-label">Layout (full width)</div>
          </div>
          <div class="diagram-prose">
            <p>More prose content...</p>
          </div>
          <div class="diagram-padding-bottom">
            <span>padding-bottom: 7.5rem</span>
          </div>
        </div>
      </div>

      <pre class="docs-code">{`<article class="story">
  <h1>Story Title</h1>
  <p>Centered prose content...</p>

  <section class="split-layout">
    <!-- Layout breaks out to full width -->
  </section>

  <p>Back to centered prose...</p>
</article>`}</pre>

      <h3>Dark Theme</h3>
      <p>Add <code>data-theme="dark"</code> for dark stories:</p>
      <pre class="docs-code">{`<article class="story" data-theme="dark">
  <!-- Dark background, light text -->
</article>`}</pre>
    </section>


    <!-- SPLIT LAYOUT -->
    <section id="split-layout">
      <h2>Split Layout</h2>
      <p>Two-column layout with a sticky visualization panel and scrolling content.</p>

      <div class="layout-diagram">
        <div class="diagram-story">
          <div class="diagram-label">.story</div>
          <div class="diagram-padding-top">
            <span>padding-top: 5.5rem</span>
          </div>
          <div class="diagram-prose">
            <div class="diagram-label">Centered prose (600px)</div>
            <p>Title & intro text...</p>
          </div>
          <div class="diagram-split">
            <div class="diagram-content">
              <div class="diagram-label">scrolly-content</div>
              <div class="diagram-spacer">spacer</div>
              <div class="diagram-steps">
                <div class="diagram-step">Step 1</div>
                <div class="diagram-step">Step 2</div>
                <div class="diagram-step">Step 3</div>
              </div>
              <div class="diagram-spacer">spacer</div>
            </div>
            <div class="diagram-panel">
              <div class="diagram-label">sticky-panel</div>
              <div class="diagram-viz">Visualization</div>
            </div>
          </div>
          <div class="diagram-prose">
            <p>More prose content...</p>
          </div>
          <div class="diagram-padding-bottom">
            <span>padding-bottom: 7.5rem</span>
          </div>
        </div>
      </div>

      <pre class="docs-code">{`<section class="split-layout">
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
</section>`}</pre>

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-panel-width</code></td><td>45%</td><td>Width of sticky panel</td></tr>
          <tr><td><code>--vcsi-panel-min-width</code></td><td>450px</td><td>Minimum panel width</td></tr>
          <tr><td><code>--vcsi-panel-height</code></td><td>min(80vh, 600px)</td><td>Panel height</td></tr>
          <tr><td><code>--vcsi-layout-gap</code></td><td>2rem</td><td>Gap between columns</td></tr>
          <tr><td><code>--step-height</code></td><td>90vh</td><td>Vertical space between steps</td></tr>
          <tr><td><code>--spacer-height</code></td><td>65vh</td><td>Height of top/bottom spacers</td></tr>
        </tbody>
      </table>

      <h3>Mobile Behavior</h3>
      <p>On screens &lt;768px, the layout stacks with the sticky panel as a full-screen background and content overlaying it.</p>
    </section>

    <!-- FULLSCREEN LAYOUT -->
    <section id="fullscreen-layout">
      <h2>Fullscreen Layout</h2>
      <p>Full-viewport immersive layout for dramatic visualizations.</p>

      <div class="layout-diagram">
        <div class="diagram-fullscreen">
          <div class="diagram-panel-full">
            <div class="diagram-label">sticky-panel (100vh)</div>
            <div class="diagram-viz">Full-screen Visualization</div>
          </div>
          <div class="diagram-content-overlay">
            <div class="diagram-step">Step</div>
          </div>
        </div>
      </div>

      <pre class="docs-code">{`<section class="fullscreen-layout">
  <div class="sticky-panel">
    <!-- Full-viewport visualization -->
  </div>
  <div class="scrolly-content">
    <!-- Overlaid step boxes -->
  </div>
</section>`}</pre>

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-step-max-width</code></td><td>500px</td><td>Max width of step boxes</td></tr>
          <tr><td><code>--vcsi-step-padding</code></td><td>2rem</td><td>Padding inside steps</td></tr>
        </tbody>
      </table>
    </section>

    <!-- DASHBOARD LAYOUT -->
    <section id="dashboard-layout">
      <h2>Dashboard Layout</h2>
      <p>Sidebar + main content for interactive data dashboards.</p>

      <div class="layout-diagram">
        <div class="diagram-dashboard">
          <div class="diagram-sidebar">
            <div class="diagram-label">sidebar</div>
            <div class="diagram-controls">Controls</div>
          </div>
          <div class="diagram-main">
            <div class="diagram-label">main</div>
            <div class="diagram-viz">Chart / Visualization</div>
          </div>
        </div>
      </div>

      <pre class="docs-code">{`<article class="dashboard-layout">
  <aside class="dashboard-sidebar">
    <button class="sidebar-toggle">...</button>
    <div class="sidebar-content">
      <!-- Filters, controls -->
    </div>
  </aside>
  <main class="dashboard-main">
    <!-- Visualization -->
  </main>
</article>`}</pre>

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-sidebar-width</code></td><td>280px</td><td>Sidebar width when open</td></tr>
          <tr><td><code>--vcsi-sidebar-collapsed-width</code></td><td>48px</td><td>Sidebar width when collapsed</td></tr>
          <tr><td><code>--vcsi-sidebar-bg</code></td><td>#ebe6e1</td><td>Sidebar background</td></tr>
        </tbody>
      </table>

      <h3>Collapsible Sidebar</h3>
      <p>Toggle <code>.sidebar-collapsed</code> class on <code>.dashboard-layout</code> to collapse/expand.</p>

      <h3>Mobile Behavior</h3>
      <p>On mobile, sidebar becomes a slide-down drawer. Toggle <code>.sidebar-open</code> class to show.</p>
    </section>

    <!-- STEP STYLING -->
    <section id="step-styling">
      <h2>Step Styling</h2>
      <p>Step boxes in scrolly layouts use these CSS variables for colors and sizing. These apply to both <code>.split-layout</code> and <code>.fullscreen-layout</code>.</p>

      <div class="layout-diagram">
        <div class="diagram-themes">
          <div class="diagram-theme diagram-theme-light">
            <div class="diagram-label">Light Theme</div>
            <div class="diagram-step-preview active">Active Step</div>
            <div class="diagram-step-preview inactive">Inactive Step</div>
          </div>
          <div class="diagram-theme diagram-theme-dark">
            <div class="diagram-label">Dark Theme</div>
            <div class="diagram-step-preview active">Active Step</div>
            <div class="diagram-step-preview inactive">Inactive Step</div>
          </div>
        </div>
      </div>

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
      <pre class="docs-code">{`<section class="split-layout" style="
  --story-step-bg: #154734;
  --story-step-fg: #fff;
">
  ...
</section>`}</pre>

      <p>For a minimal look where only text floats over the visualization:</p>
      <pre class="docs-code">{`<section class="split-layout" style="
  --story-step-bg: transparent;
  --story-step-bg-inactive: transparent;
  --step-box-shadow: none;
">
  ...
</section>`}</pre>
    </section>

    <!-- CSS VARIABLES -->
    <section id="css-variables">
      <h2>Global CSS Variables</h2>
      <p>These tokens are available throughout your project. See the full <a href="https://github.com/Vermont-Complex-Systems/vcsi-starter/blob/main/packages/scrolly-kit/src/lib/styles/tokens.css" target="_blank" rel="noopener">tokens.css source</a> for all available variables.</p>

      <h3>Colors</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-color-accent</code></td><td>Brand accent color</td></tr>
          <tr><td><code>--vcsi-bg</code></td><td>Background (respects dark mode)</td></tr>
          <tr><td><code>--vcsi-fg</code></td><td>Foreground text (respects dark mode)</td></tr>
          <tr><td><code>--vcsi-border</code></td><td>Border color</td></tr>
          <tr><td><code>--vcsi-hover</code></td><td>Hover state background</td></tr>
        </tbody>
      </table>

      <h3>Typography</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Default</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-font-sans</code></td><td>system-ui, sans-serif</td></tr>
          <tr><td><code>--vcsi-font-serif</code></td><td>Georgia, serif</td></tr>
          <tr><td><code>--vcsi-font-mono</code></td><td>ui-monospace, monospace</td></tr>
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

      <h3>Story-Specific</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--vcsi-story-bg</code></td><td>Story background color</td></tr>
          <tr><td><code>--vcsi-story-fg</code></td><td>Story text color</td></tr>
          <tr><td><code>--vcsi-story-max-width</code></td><td>Max width for prose (600px)</td></tr>
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
    margin-top: 4rem;
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

  /* Diagram styles */
  .diagram-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    min-height: 200px;
  }

  .diagram-content,
  .diagram-panel,
  .diagram-panel-full,
  .diagram-sidebar,
  .diagram-main {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
  }

  .diagram-steps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .diagram-step {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
  }

  /* Story diagram */
  .diagram-story {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: var(--vcsi-gray-50);
  }

  .diagram-prose {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    max-width: 200px;
    margin: 0 auto;
    text-align: center;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  .diagram-prose p {
    margin: 0;
  }

  .diagram-layout-break {
    background: var(--vcsi-gray-200);
    border: 1px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.75rem;
    text-align: center;
  }

  .diagram-padding-top,
  .diagram-padding-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-size: 0.7rem;
    color: var(--vcsi-gray-500);
    border: 1px dashed var(--vcsi-gray-300);
    border-radius: 4px;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      var(--vcsi-gray-100) 4px,
      var(--vcsi-gray-100) 8px
    );
  }

  .diagram-spacer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    font-size: 0.65rem;
    color: var(--vcsi-gray-400);
    border: 1px dashed var(--vcsi-gray-300);
    border-radius: 3px;
    background: var(--vcsi-gray-100);
  }

  /* Step theme diagram */
  .diagram-themes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .diagram-theme {
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .diagram-theme-light {
    background: #f8f8f8;
  }

  .diagram-theme-dark {
    background: #1a1a1a;
  }

  .diagram-theme-dark .diagram-label {
    color: #999;
  }

  .diagram-step-preview {
    border-radius: 6px;
    padding: 0.75rem 1rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .diagram-theme-light .diagram-step-preview.active {
    background: #fff;
    color: #333;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .diagram-theme-light .diagram-step-preview.inactive {
    background: #f5f5f5;
    color: #ccc;
  }

  .diagram-theme-dark .diagram-step-preview.active {
    background: #2a2a2a;
    color: #e8e8e8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .diagram-theme-dark .diagram-step-preview.inactive {
    background: #222;
    color: #666;
  }

  .diagram-viz,
  .diagram-controls {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vcsi-gray-200);
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  .diagram-fullscreen {
    position: relative;
    height: 200px;
  }

  .diagram-panel-full {
    position: absolute;
    inset: 0;
  }

  .diagram-content-overlay {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .diagram-dashboard {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 0.5rem;
    height: 200px;
  }

  /* Dark mode overrides */
  :global(.dark) code {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
  }

  :global(.dark) .diagram-step {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-fg);
  }

  :global(.dark) .diagram-viz,
  :global(.dark) .diagram-controls {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-story {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-prose {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-300);
  }

  :global(.dark) .diagram-layout-break {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .diagram-padding-top,
  :global(.dark) .diagram-padding-bottom {
    color: var(--vcsi-gray-500);
    border-color: var(--vcsi-gray-700);
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      var(--vcsi-gray-800) 4px,
      var(--vcsi-gray-800) 8px
    );
  }

  :global(.dark) .diagram-spacer {
    color: var(--vcsi-gray-500);
    border-color: var(--vcsi-gray-700);
    background: var(--vcsi-gray-800);
  }
</style>
