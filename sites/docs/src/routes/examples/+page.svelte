<svelte:head>
  <title>Examples - scrolly-kit</title>
</svelte:head>

<article class="page">
  <h1>Examples</h1>
  <p>Stories built with scrolly-kit. View the source code to see how they're structured.</p>

  <div class="examples-grid">
    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/scrolly-story-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Split Layout</div>
      <div class="example-card-content">
        <h3>Scrolly Story 1</h3>
        <p>Basic split layout with line chart visualization that responds to scroll steps.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/scrolly-story-2" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Split Layout</div>
      <div class="example-card-content">
        <h3>Scrolly Story 2</h3>
        <p>Scatter plot with regression lines, demonstrating data-driven scrollytelling.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/geo-story-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Fullscreen Layout</div>
      <div class="example-card-content">
        <h3>Geo Story</h3>
        <p>Geographic visualization with fullscreen map background.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/scrolly-explainer" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Split Layout</div>
      <div class="example-card-content">
        <h3>Scrolly Explainer</h3>
        <p>Educational explainer format with code examples.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/dashboard-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Dashboard Layout</div>
      <div class="example-card-content">
        <h3>Dashboard</h3>
        <p>Interactive dashboard with collapsible sidebar and data filters.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/thematic-story-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Custom Layout</div>
      <div class="example-card-content">
        <h3>Thematic Story</h3>
        <p>Long-form narrative with custom theming and multiple sections.</p>
      </div>
    </a>
  </div>
</article>

<style>
  .example-card {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .example-card-placeholder {
    height: 180px;
    background: var(--vcsi-gray-100);
    border-bottom: 1px solid var(--vcsi-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: var(--vcsi-gray-500);
  }
</style>
