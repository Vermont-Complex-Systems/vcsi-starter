<!--
@component
Diagram showing the fullscreen layout with edge-to-edge visualization.

Shows:
- Full viewport width (100vw)
- Sticky panel fills the viewport
- Step boxes are constrained and overlaid
- Margin breakout technique

## Usage
```svelte
<FullscreenLayoutDiagram />
```
-->
<div class="layout-diagram">
  <div class="diagram-fullscreen-wrapper">
    <div class="diagram-width-label">
      <span>100vw (edge-to-edge)</span>
    </div>
    <div class="diagram-fullscreen">
      <div class="diagram-panel-full">
        <div class="diagram-label">sticky-panel (100vh)</div>
        <div class="diagram-viz">Full-screen Visualization</div>
      </div>
      <div class="diagram-content-overlay">
        <div class="diagram-step-constrained">
          <div class="diagram-step-width-label">max-width: 500px</div>
          <div class="diagram-step">Step (overlaid)</div>
        </div>
      </div>
    </div>
    <div class="diagram-breakout-note">
      <code>margin-left: calc(-50vw + 50%)</code> breaks out of container
    </div>
  </div>
</div>

<style>
  .layout-diagram {
    border: 1px solid var(--vcsi-border);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    background: var(--vcsi-gray-50);
  }

  .diagram-fullscreen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .diagram-width-label {
    text-align: center;
    font-size: 0.7rem;
    font-family: var(--vcsi-font-mono);
    color: var(--vcsi-gray-500);
    padding: 0.25rem 0.5rem;
    background: var(--vcsi-gray-100);
    border-radius: 3px;
    align-self: center;
  }

  .diagram-fullscreen {
    position: relative;
    height: 200px;
    border: 2px solid var(--matisse-orange);
    border-radius: 4px;
  }

  .diagram-panel-full {
    position: absolute;
    inset: 0;
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

  .diagram-viz {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vcsi-gray-200);
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  .diagram-content-overlay {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .diagram-step-constrained {
    position: relative;
  }

  .diagram-step-width-label {
    position: absolute;
    top: -1.25rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.6rem;
    font-family: var(--vcsi-font-mono);
    color: white;
    background: var(--matisse-orange);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    white-space: nowrap;
  }

  .diagram-step {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
  }

  .diagram-breakout-note {
    text-align: center;
    font-size: 0.7rem;
    color: var(--vcsi-gray-500);
  }

  .diagram-breakout-note code {
    font-size: 0.65rem;
    background: var(--vcsi-gray-100);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
  }

  /* Dark mode */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-width-label {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-fullscreen {
    border-color: var(--matisse-orange);
  }

  :global(.dark) .diagram-viz {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-step {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-fg);
  }

  :global(.dark) .diagram-breakout-note {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-breakout-note code {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }
</style>
