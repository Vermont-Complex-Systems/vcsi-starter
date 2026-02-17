<script>
  import { base } from '$app/paths';
  import categories from './categories.json';
</script>

<svelte:head>
  <title>Components - scrolly-kit</title>
</svelte:head>

<div class="components-page">
  <header class="page-header">
    <h1>Components</h1>
    <p>Reusable Svelte components for scrollytelling and data-driven stories.</p>
  </header>

  {#each categories as category}
    <section class="category" id={category.id}>
      <h2>{category.label}</h2>
      <p class="category-desc">{category.description}</p>

      <div class="component-grid">
        {#each category.components as component}
          <a href="{base}/components/{component.id}" class="component-card">
            <h3>{component.id}</h3>
            <p>{component.desc}</p>
          </a>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .components-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
  }

  .page-header {
    margin-bottom: 3rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem;
  }

  .page-header p {
    color: var(--vcsi-gray-600);
    font-size: 1.1rem;
    margin: 0;
  }

  .category {
    margin-bottom: 3rem;
    scroll-margin-top: 5rem;
  }

  .category h2 {
    margin: 0 0 0.25rem;
    font-size: 1.5rem;
  }

  .category-desc {
    color: var(--vcsi-gray-600);
    margin: 0 0 1.25rem;
  }

  /* Component grid */
  .component-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .component-card {
    display: block;
    padding: 1.25rem;
    border: 1px solid var(--vcsi-border);
    border-radius: 8px;
    background: var(--vcsi-gray-50);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }

  .component-card:hover {
    border-color: #6b7280;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .component-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-family: var(--vcsi-font-mono);
    color: #6b7280;
  }

  .component-card p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--vcsi-gray-600);
    line-height: 1.4;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .components-page {
      padding: 1rem;
    }

    .component-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Dark mode */
  :global(.dark) .page-header p,
  :global(.dark) .category-desc {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .component-card {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .component-card:hover {
    border-color: #60a5fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  :global(.dark) .component-card h3 {
    color: #60a5fa;
  }

  :global(.dark) .component-card p {
    color: var(--vcsi-gray-400);
  }
</style>
