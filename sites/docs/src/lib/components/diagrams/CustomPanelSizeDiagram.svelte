<!--
@component
Diagram showing how to customize panel size in split layouts.

Shows:
- Custom column sizing (60% panel width)
- Max-width cap on the panel
- Narrower content column

## Usage
```svelte
<CustomPanelSizeDiagram />
```
-->
<div class="layout-diagram">
  <div class="diagram-custom-split">
    <div class="diagram-column-labels">
      <span class="diagram-col-label">1fr (remaining)</span>
      <span class="diagram-col-label custom">minmax(400px, 60%)</span>
    </div>
    <div class="diagram-custom-grid">
      <div class="diagram-content-narrow">
        <div class="diagram-label">scrolly-content</div>
        <div class="diagram-step">Steps...</div>
      </div>
      <div class="diagram-gap-indicator">
        <span>2rem</span>
      </div>
      <div class="diagram-panel-wide">
        <div class="diagram-label">sticky-panel</div>
        <div class="diagram-max-width-cap">
          <span>max-width: 700px</span>
        </div>
        <div class="diagram-viz">Visualization (larger)</div>
      </div>
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

  .diagram-custom-split {
    border: 1px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    background: var(--vcsi-gray-50);
  }

  .diagram-column-labels {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .diagram-col-label {
    font-size: 0.65rem;
    font-family: var(--vcsi-font-mono);
    color: var(--vcsi-gray-500);
    text-align: center;
    padding: 0.125rem 0.25rem;
    background: var(--vcsi-gray-100);
    border-radius: 3px;
  }

  .diagram-col-label.custom {
    background: --matisse-orange;
    color: white;
  }

  .diagram-custom-grid {
    display: grid;
    grid-template-columns: 1fr auto 1.5fr;
    gap: 0;
    min-height: 120px;
  }

  .diagram-content-narrow,
  .diagram-panel-wide {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .diagram-panel-wide {
    position: relative;
  }

  .diagram-max-width-cap {
    position: absolute;
    top: -0.5rem;
    right: 0.5rem;
    font-size: 0.6rem;
    font-family: var(--vcsi-font-mono);
    color: white;
    background: --matisse-orange;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
  }

  .diagram-gap-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    position: relative;
  }

  .diagram-gap-indicator span {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
    white-space: nowrap;
  }

  .diagram-gap-indicator::before,
  .diagram-gap-indicator::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 1px;
    height: 30%;
    background: var(--vcsi-gray-300);
    border-style: dashed;
  }

  .diagram-gap-indicator::before {
    top: 0;
  }

  .diagram-gap-indicator::after {
    bottom: 0;
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
  }

  .diagram-step {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
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

  /* Dark mode */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-custom-split {
    background: var(--vcsi-gray-900);
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-col-label {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-content-narrow,
  :global(.dark) .diagram-panel-wide {
    border-color: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-gap-indicator span {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-gap-indicator::before,
  :global(.dark) .diagram-gap-indicator::after {
    background: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-step {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-fg);
  }

  :global(.dark) .diagram-viz {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }
</style>
