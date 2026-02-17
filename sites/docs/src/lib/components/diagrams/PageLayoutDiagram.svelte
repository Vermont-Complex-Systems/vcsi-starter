<!--
@component
Diagram showing the page layout with Nav, .page content, and Footer alignment.

Shows the body flex layout structure:
- `body` is flex column with `min-height: 100dvh` and `gap`
- `main` has `flex: 1` to fill available space
- Nav, Footer, and .page share CSS variables for alignment

## Usage
```svelte
<PageLayoutDiagram />
```
-->
<div class="layout-diagram">
  <!-- Body container label -->
  <div class="diagram-body-label">
    <code>body</code>
    <span class="diagram-props">flex-direction: column; min-height: 100dvh; gap: 3rem</span>
  </div>

  <div class="diagram-body-wrapper">
    <!-- Nav -->
    <div class="diagram-nav-bar">
      <div class="diagram-page-padding left"><span>5%</span></div>
      <div class="diagram-inner-content">
        <div class="diagram-label">&lt;Nav /&gt;</div>
      </div>
      <div class="diagram-page-padding right"><span>5%</span></div>
    </div>

    <!-- Main with flex: 1 -->
    <div class="diagram-main-wrapper">
      <div class="diagram-main-label">
        <code>main</code>
        <span class="diagram-props">flex: 1</span>
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
    </div>

    <!-- Gap indicator -->
    <div class="diagram-gap">
      <span>gap: 3rem</span>
    </div>

    <!-- Footer -->
    <div class="diagram-footer-bar">
      <div class="diagram-page-padding left"><span>5%</span></div>
      <div class="diagram-inner-content">
        <div class="diagram-label">&lt;Footer /&gt;</div>
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

  /* Body wrapper label */
  .diagram-body-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .diagram-body-label code {
    font-size: 0.8rem;
    font-weight: 600;
    background: var(--vcsi-gray-200);
    padding: 0.125rem 0.5rem;
    border-radius: 3px;
  }

  .diagram-props {
    font-size: 0.65rem;
    font-family: var(--vcsi-font-mono);
    color: var(--vcsi-gray-500);
  }

  .diagram-body-wrapper {
    display: flex;
    flex-direction: column;
    border: 2px dashed var(--vcsi-gray-400);
    border-radius: 4px;
    overflow: hidden;
    min-height: 280px;
  }

  /* Main wrapper */
  .diagram-main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 2px solid var(--matisse-orange, #e07b39);
    border-radius: 4px;
    margin: 0.5rem;
    overflow: hidden;
  }

  .diagram-main-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: var(--matisse-orange, #e07b39);
    color: white;
  }

  .diagram-main-label code {
    font-size: 0.7rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.1rem 0.35rem;
    border-radius: 2px;
    color: white;
  }

  .diagram-main-label .diagram-props {
    color: rgba(255, 255, 255, 0.7);
  }

  /* Gap indicator */
  .diagram-gap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    margin: 0 0.5rem;
    border-left: 2px dashed var(--vcsi-gray-400);
    border-right: 2px dashed var(--vcsi-gray-400);
    position: relative;
  }

  .diagram-gap::before,
  .diagram-gap::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    transform: translateX(-50%);
  }

  .diagram-gap::before {
    top: 0;
    border-top: 6px solid var(--vcsi-gray-400);
  }

  .diagram-gap::after {
    bottom: 0;
    border-bottom: 6px solid var(--vcsi-gray-400);
  }

  .diagram-gap span {
    font-size: 0.65rem;
    font-family: var(--vcsi-font-mono);
    color: var(--vcsi-gray-500);
    background: var(--vcsi-gray-50);
    padding: 0.125rem 0.5rem;
    border-radius: 3px;
  }

  .diagram-nav-bar {
    display: flex;
    align-items: stretch;
    background: var(--vcsi-gray-100);
    min-height: 40px;
    margin: 0.5rem 0.5rem 0;
    border-radius: 4px;
  }

  .diagram-footer-bar {
    display: flex;
    align-items: stretch;
    background: var(--vcsi-gray-100);
    min-height: 40px;
    margin: 0 0.5rem 0.5rem;
    border-radius: 4px;
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
    flex: 1;
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
    color: var(--vcsi-gray-600);
    background: var(--vcsi-gray-200);
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

  :global(.dark) .diagram-body-label code {
    background: var(--vcsi-gray-700);
    color: var(--vcsi-gray-200);
  }

  :global(.dark) .diagram-body-wrapper {
    border-color: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-gap span {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-gap::before {
    border-top-color: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-gap::after {
    border-bottom-color: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-nav-bar,
  :global(.dark) .diagram-footer-bar {
    background: var(--vcsi-gray-800);
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

  :global(.dark) .diagram-page-max-width {
    background: var(--vcsi-gray-700);
    color: var(--vcsi-gray-300);
  }

  :global(.dark) .diagram-page-inner {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-300);
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }
</style>
