<!--
@component
Diagram showing the page layout with Nav, .page content, and Footer alignment.

Shows how Nav, Footer, and .page all share the same CSS variables for consistent alignment:
- `--vcsi-page-max-width` for inner content
- `--vcsi-page-inline-padding` for side padding

## Usage
```svelte
<PageLayoutDiagram />
```
-->
<div class="layout-diagram">
  <div class="diagram-page-full">
    <div class="diagram-nav-bar">
      <div class="diagram-page-padding left"><span>5%</span></div>
      <div class="diagram-inner-content">
        <div class="diagram-label">.header-inner</div>
      </div>
      <div class="diagram-page-padding right"><span>5%</span></div>
    </div>
    <div class="diagram-page-body">
      <div class="diagram-page-padding left">
        <span>5%</span>
      </div>
      <div class="diagram-page-content">
        <div class="diagram-label">.page</div>
        <div class="diagram-page-max-width">
          <span>max-width: 1200px</span>
        </div>
        <div class="diagram-page-inner">
          <p>Centered content...</p>
        </div>
      </div>
      <div class="diagram-page-padding right">
        <span>5%</span>
      </div>
    </div>
    <div class="diagram-footer-bar">
      <div class="diagram-page-padding left"><span>5%</span></div>
      <div class="diagram-inner-content">
        <div class="diagram-label">.footer-inner</div>
      </div>
      <div class="diagram-page-padding right"><span>5%</span></div>
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

  .diagram-page-full {
    display: flex;
    flex-direction: column;
    border: 2px solid --matisse-orange;
    border-radius: 4px;
    overflow: hidden;
  }

  .diagram-nav-bar {
    display: flex;
    align-items: stretch;
    background: var(--vcsi-gray-100);
    border-bottom: 1px solid var(--vcsi-border);
    min-height: 40px;
  }

  .diagram-footer-bar {
    display: flex;
    align-items: stretch;
    background: --matisse-orange;
    color: white;
    min-height: 40px;
  }

  .diagram-footer-bar .diagram-label {
    color: white;
    margin: 0;
  }

  .diagram-footer-bar .diagram-page-padding {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .diagram-footer-bar .diagram-page-padding span {
    color: rgba(255, 255, 255, 0.6);
  }

  .diagram-inner-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }

  .diagram-page-body {
    display: flex;
    min-height: 100px;
  }

  .diagram-page-padding {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-100),
      var(--vcsi-gray-100) 4px,
      var(--vcsi-gray-200) 4px,
      var(--vcsi-gray-200) 8px
    );
    border: 1px dashed var(--vcsi-gray-300);
  }

  .diagram-page-padding span {
    writing-mode: vertical-rl;
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
  }

  .diagram-page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    background: var(--vcsi-gray-50);
    position: relative;
  }

  .diagram-page-max-width {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.6rem;
    font-family: var(--vcsi-font-mono);
    color: white;
    background: --matisse-orange;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
  }

  .diagram-page-inner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  .diagram-page-inner p {
    margin: 0;
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
  }

  /* Dark mode */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-nav-bar {
    background: var(--vcsi-gray-800);
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-nav-bar .diagram-page-padding {
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-900),
      var(--vcsi-gray-900) 4px,
      var(--vcsi-gray-700) 4px,
      var(--vcsi-gray-700) 8px
    );
  }

  :global(.dark) .diagram-page-padding {
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-900),
      var(--vcsi-gray-900) 4px,
      var(--vcsi-gray-800) 4px,
      var(--vcsi-gray-800) 8px
    );
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-page-padding span {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-page-content {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-page-inner {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-300);
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }
</style>
