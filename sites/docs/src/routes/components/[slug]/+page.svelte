<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
  import { components } from '$lib/data/components';
  import PropsTable from '$lib/components/PropsTable.svelte';

  let { data } = $props();

  const sourceBase = 'https://github.com/Vermont-Complex-Systems/vcsi-starter/blob/main/packages/scrolly-kit/src/lib/components';

  let activeSourceTab = $state('main');

  // Get dependency names from loaded data
  let dependencyNames = $derived(Object.keys(data.dependencies || {}));
  let hasDependencies = $derived(dependencyNames.length > 0);

  let slug = $derived($page.params.slug);
  let component = $derived(components[slug]);

  // Column definitions for tables
  const propsColumns = [
    { key: 'name', label: 'Prop', isCode: true },
    { key: 'type', label: 'Type', isCode: true, codeClass: 'type' },
    { key: 'default', label: 'Default', isCode: true },
    { key: 'description', label: 'Description' }
  ];

  const cssVarsColumns = [
    { key: 'name', label: 'Variable', isCode: true },
    { key: 'default', label: 'Default', isCode: true },
    { key: 'description', label: 'Description' }
  ];
</script>

<svelte:head>
  <title>{component?.name ?? 'Component'} - scrolly-kit</title>
</svelte:head>

{#if component}
  <div class="component-page">
    <nav class="breadcrumb">
      <a href="{base}/components">Components</a>
      <span class="separator">/</span>
      <span class="current">{component.name}</span>
    </nav>

    <header>
      <span class="category-badge">{component.category}</span>
      <h1>{component.name}</h1>
      <p class="description">{component.description}</p>
    </header>

    <section>
      <h2>Props</h2>
      {#if component.props && component.props.length > 0}
        <PropsTable columns={propsColumns} rows={component.props} />
      {:else}
        <p class="no-props">No props - uses internal state.</p>
      {/if}
    </section>

    {#if component.types}
      <section>
        <h2>Supported Types</h2>
        <ul class="types-list">
          {#each component.types as type}
            <li><code>{type}</code></li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if component.cssVars}
      <section>
        <h2>CSS Variables</h2>
        <PropsTable columns={cssVarsColumns} rows={component.cssVars} />
      </section>
    {/if}

    <section class="import-section">
      <h2>Import</h2>
      <CopyCodeBlock command={`import { ${component.name} } from '@the-vcsi/scrolly-kit';`} language="javascript" />
    </section>

    <section>
      <h2>Usage</h2>
      <CopyCodeBlock command={component.usage} language="svelte" />
    </section>

    {#if component.hasLiveExample}
      <section>
        <h2>Live Example</h2>
        <CopyCodeBlock command="npm install @the-vcsi/scrolly-kit" language="bash" label="Try copying this" />
      </section>
    {/if}

    {#if data.source}
      <section class="source-section">
        <h2>Full Source</h2>
        <p class="tip">💡 Components rely on <code>--vcsi-*</code> tokens from <a href="https://github.com/Vermont-Complex-Systems/vcsi-starter/blob/main/packages/scrolly-kit/src/lib/styles/tokens.css" target="_blank" rel="noopener">tokens.css</a>. You'd need to either need to <code>@import '@the-vcsi/scrolly-kit/styles/tokens.css';</code> to access the CSS variables or define equivalent variables in your <code>app.css</code>. We also are using types here to provide hints when users are using the components in their project.</p>
        {#if hasDependencies}
          <div class="source-tabs">
            <button
              class="source-tab"
              class:active={activeSourceTab === 'main'}
              onclick={() => activeSourceTab = 'main'}
            >
              {component.name}.svelte
            </button>
            {#each dependencyNames as dep (dep)}
              <button
                class="source-tab"
                class:active={activeSourceTab === dep}
                onclick={() => activeSourceTab = dep}
              >
                {dep}.svelte
              </button>
            {/each}
          </div>
          {#if activeSourceTab === 'main'}
            <CopyCodeBlock command={data.source} language="svelte" />
          {:else}
            <CopyCodeBlock command={data.dependencies[activeSourceTab]} language="svelte" />
          {/if}
        {:else}
          <CopyCodeBlock command={data.source} language="svelte" />
        {/if}
      </section>
    {/if}
  </div>
{:else}
  <div class="not-found">
    <h1>Component not found</h1>
    <p>The component "{slug}" doesn't exist.</p>
    <a href="{base}/components">Back to Components</a>
  </div>
{/if}

<style>
  .component-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  .breadcrumb a {
    color: #6b7280;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb .separator {
    color: var(--vcsi-gray-400);
  }

  .breadcrumb .current {
    color: var(--vcsi-gray-600);
  }

  header {
    margin-bottom: 2rem;
  }

  .category-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  header h1 {
    margin: 0 0 0.75rem;
    font-family: var(--vcsi-font-mono);
  }

  .description {
    color: var(--vcsi-gray-600);
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }

  section {
    margin: 2.5rem 0;
  }

  section h2 {
    font-size: 1.1rem;
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--vcsi-border);
  }

  .no-props {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }

  .types-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .types-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--vcsi-border);
  }

  .types-list li:last-child {
    border-bottom: none;
  }

  .types-list code {
    background: var(--vcsi-gray-100);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.875rem;
  }

  /* Source section */
  .source-section {
    margin-top: 2.5rem;
  }

  .source-section h2 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--vcsi-border);
  }

  /* Source tabs - sits on top of code block */
  .source-tabs {
    display: flex;
    gap: 2px;
  }

  .source-tab {
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: 1px solid transparent;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    font-family: var(--vcsi-font-mono);
    font-size: 0.75rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .source-tab:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .source-tab.active {
    background: #f6f8fa;
    border-color: #d1d5db;
    color: #374151;
    font-weight: 500;
  }

  /* Remove top border-radius and margin from code block when tabs are present */
  .source-tabs + :global(.code-block-wrapper) {
    margin-top: 0;
  }

  .source-tabs + :global(.code-block-wrapper) :global(pre) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .source-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding: 0.75rem 1.25rem;
    background: var(--vcsi-gray-100);
    border-radius: 6px;
    color: #6b7280;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .source-link:hover {
    background: var(--vcsi-gray-200);
  }

  /* Not found */
  .not-found {
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    text-align: center;
  }

  .not-found h1 {
    margin: 0 0 0.5rem;
  }

  .not-found p {
    color: var(--vcsi-gray-600);
    margin: 0 0 1.5rem;
  }

  .not-found a {
    color: #6b7280;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .component-page {
      padding: 1rem;
    }
  }

  /* Dark mode */
  :global(.dark) .category-badge {
    background: rgba(96, 165, 250, 0.15);
    color: #60a5fa;
  }

  :global(.dark) .description {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .breadcrumb a {
    color: #60a5fa;
  }

  :global(.dark) .breadcrumb .current {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .types-list code {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .source-link {
    background: var(--vcsi-gray-800);
    color: #60a5fa;
  }

  :global(.dark) .source-link:hover {
    background: var(--vcsi-gray-700);
  }

  :global(.dark) .source-tabs {
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global(.dark) .source-tab {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .source-tab:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  :global(.dark) .source-tab.active {
    background: #161b22;
    border-color: #30363d;
    color: #60a5fa;
  }
</style>
