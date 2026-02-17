<!--
@component
Diagram showing the .story container with prose and layout breaks.

Shows how:
- Prose content is centered (max-width 600px)
- Layout classes break out to full width while maintaining padding
- Top/bottom padding provides breathing room

## Usage
```svelte
<StoryContainerDiagram />
```
-->
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
      <div class="diagram-padding-side left"></div>
      <div class="diagram-layout-inner">
        <div class="diagram-label">Layout (breaks prose, keeps padding)</div>
      </div>
      <div class="diagram-padding-side right"></div>
    </div>
    <div class="diagram-prose">
      <p>More prose content...</p>
    </div>
    <div class="diagram-padding-bottom">
      <span>padding-bottom: 2rem</span>
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

  .diagram-story {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: var(--vcsi-gray-50);
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
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
    display: flex;
    align-items: stretch;
    border: 1px dashed var(--vcsi-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .diagram-padding-side {
    width: 24px;
    min-height: 50px;
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-100),
      var(--vcsi-gray-100) 4px,
      var(--vcsi-gray-200) 4px,
      var(--vcsi-gray-200) 8px
    );
    border: 1px dashed var(--vcsi-gray-300);
    position: relative;
  }

  .diagram-padding-side::after {
    content: '2rem';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
    white-space: nowrap;
  }

  .diagram-layout-inner {
    flex: 1;
    background: var(--vcsi-gray-200);
    padding: 0.75rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
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

  /* Dark mode */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-story {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-prose {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-300);
  }

  :global(.dark) .diagram-layout-break {
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-layout-inner {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .diagram-padding-side {
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-900),
      var(--vcsi-gray-900) 4px,
      var(--vcsi-gray-800) 4px,
      var(--vcsi-gray-800) 8px
    );
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-padding-side::after {
    color: var(--vcsi-gray-500);
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

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }
</style>
