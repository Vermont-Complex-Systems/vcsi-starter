<script>
  import { base } from '$app/paths';

  const extensions = [
    {
      id: 'tidyduck',
      name: '@the-vcsi/tidyduck',
      desc: 'Tidyverse-inspired reactive DuckDB-WASM query builder for Svelte 5.',
      install: 'npx sv add @the-vcsi/tidyduck',
    },
    {
      id: 'msgraph',
      name: '@the-vcsi/msgraph',
      desc: 'Fetch story content from SharePoint Excel files via Microsoft Graph.',
      install: 'npx sv add @the-vcsi/msgraph',
    },
    {
      id: 'openalex',
      name: '@the-vcsi/openalex',
      desc: 'Populate your database with OpenAlex author and paper data.',
      install: 'npx sv add @the-vcsi/openalex',
    },
  ];
</script>

<svelte:head>
  <title>Extensions - scrolly-kit</title>
</svelte:head>

<div class="extensions-page">
  <header class="page-header">
    <h1>Extensions</h1>
    <p>Optional sv add-ons that integrate with your SvelteKit project in one command.</p>
  </header>

  <div class="extension-grid">
    {#each extensions as ext}
      <a href="{base}/extensions/{ext.id}" class="extension-card">
        <h3>{ext.name}</h3>
        <p>{ext.desc}</p>
        <code class="install-cmd">{ext.install}</code>
      </a>
    {/each}
  </div>
</div>

<style>
  .extensions-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
  }

  .page-header {
    margin-bottom: 3rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem;
    color: var(--matisse-blue);
  }

  .page-header p {
    color: var(--vcsi-gray-600);
    font-size: 1.1rem;
    margin: 0;
  }

  .extension-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .extension-card {
    display: block;
    padding: 1.25rem;
    border: 1px solid var(--vcsi-border);
    border-radius: 8px;
    background: var(--vcsi-gray-50);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }

  .extension-card:hover {
    border-color: #6b7280;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .extension-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-family: var(--vcsi-font-mono);
    color: #6b7280;
  }

  .extension-card p {
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    color: var(--vcsi-gray-600);
    line-height: 1.4;
  }

  .install-cmd {
    display: block;
    font-size: 0.8rem;
    color: var(--matisse-orange);
    background: transparent;
    padding: 0;
  }

  @media (max-width: 600px) {
    .extensions-page {
      padding: 1rem;
    }

    .extension-grid {
      grid-template-columns: 1fr;
    }
  }

  :global(.dark) .page-header h1 {
    color: oklch(70% 0.14 255);
  }

  :global(.dark) .page-header p {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .extension-card {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .extension-card:hover {
    border-color: #60a5fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  :global(.dark) .extension-card h3 {
    color: #60a5fa;
  }

  :global(.dark) .extension-card p {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .install-cmd {
    color: oklch(75% 0.14 55);
  }
</style>
