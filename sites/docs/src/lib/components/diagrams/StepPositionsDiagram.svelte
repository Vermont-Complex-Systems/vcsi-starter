<!--
@component
Diagram showing step positioning options in fullscreen layouts.

Shows:
- Left-aligned steps
- Center-aligned steps (default)

## Usage
```svelte
<StepPositionsDiagram />
```
-->
<div class="layout-diagram">
  <div class="diagram-step-positions">
    <div class="diagram-position left">
      <div class="diagram-step-mini">Step</div>
      <span class="diagram-position-label">Left</span>
    </div>
    <div class="diagram-position center">
      <div class="diagram-step-mini">Step</div>
      <span class="diagram-position-label">Center (default)</span>
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

  .diagram-step-positions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    background: var(--vcsi-gray-100);
    border-radius: 4px;
    border: 2px solid --matisse-orange;
  }

  .diagram-position {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    min-height: 80px;
  }

  .diagram-position.left {
    align-items: flex-start;
  }

  .diagram-position.right {
    align-items: flex-end;
  }

  .diagram-step-mini {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }

  .diagram-position-label {
    font-size: 0.65rem;
    color: var(--vcsi-gray-500);
    font-family: var(--vcsi-font-mono);
  }

  .diagram-position.center .diagram-position-label {
    color: --matisse-orange;
    font-weight: 600;
  }

  /* Dark mode */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-step-positions {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-step-mini {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
    border-color: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-position-label {
    color: var(--vcsi-gray-500);
  }
</style>
