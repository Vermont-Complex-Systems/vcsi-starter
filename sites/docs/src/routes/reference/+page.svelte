<svelte:head>
  <title>Reference - scrolly-kit</title>
</svelte:head>

<article class="page">
  <h1>Reference</h1>
  <p>Layout patterns and CSS variables for scrollytelling stories.</p>

  <nav class="toc">
    <strong>Contents:</strong>
    <a href="#story">Story Container</a> |
    <a href="#split-layout">Split Layout</a> |
    <a href="#fullscreen-layout">Fullscreen Layout</a> |
    <a href="#dashboard-layout">Dashboard Layout</a> |
    <a href="#css-variables">CSS Variables</a>
  </nav>

  <!-- STORY CONTAINER -->
  <section id="story">
    <h2>Story Container</h2>
    <p>The <code>.story</code> class is the main container for scrollytelling content. It provides:</p>
    <ul>
      <li>Centered prose by default (max-width 600px)</li>
      <li>Light theme isolation from global dark mode</li>
      <li>Padding and spacing for readability</li>
    </ul>

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
      <div class="diagram-split">
        <div class="diagram-content">
          <div class="diagram-label">scrolly-content</div>
          <div class="diagram-steps">
            <div class="diagram-step">Step 1</div>
            <div class="diagram-step">Step 2</div>
            <div class="diagram-step">Step 3</div>
          </div>
        </div>
        <div class="diagram-panel">
          <div class="diagram-label">sticky-panel</div>
          <div class="diagram-viz">Visualization</div>
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

  <!-- CSS VARIABLES -->
  <section id="css-variables">
    <h2>Global CSS Variables</h2>
    <p>These tokens are available throughout your project.</p>

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
        <tr><td><code>--story-step-bg</code></td><td>Active step background</td></tr>
        <tr><td><code>--story-step-fg</code></td><td>Active step text</td></tr>
      </tbody>
    </table>
  </section>
</article>

<style>
  .toc {
    background: var(--vcsi-gray-100);
    padding: 1rem;
    border-radius: 6px;
    margin: 1.5rem 0;
  }

  .toc a {
    margin: 0 0.25rem;
  }

  section {
    margin-top: 4rem;
    padding-top: 1rem;
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

  /* Diagram styles */
  .diagram-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    height: 200px;
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
</style>
