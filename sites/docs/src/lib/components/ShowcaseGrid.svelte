<script>
  import { base } from '$app/paths';

  /**
   * @typedef {Object} Example
   * @property {string} title - Example title
   * @property {string} url - Link to the example
   * @property {string} thumbnail - Path to thumbnail image (relative, e.g., "/hello.jpg")
   * @property {string} [source] - Source attribution (e.g., "The Pudding")
   */

  /** @type {{ examples: Example[] }} */
  let { examples } = $props();
</script>

<div class="showcase-grid">
  {#each examples as example (example.url)}
    <a href={example.url} target="_blank" rel="noopener noreferrer" class="showcase-card">
      <div class="card-image">
        <img src="{base}{example.thumbnail}" alt={example.title} />
      </div>
      <div class="card-content">
        <h4>{example.title}</h4>
        {#if example.source}
          <span class="card-source">{example.source}</span>
        {/if}
      </div>
    </a>
  {/each}
</div>

<style>
  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .showcase-card {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    background: var(--vcsi-gray-50);
    border: 1px solid var(--vcsi-border);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .showcase-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .card-image {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--vcsi-gray-200);
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .showcase-card:hover .card-image img {
    transform: scale(1.05);
  }

  .card-content {
    padding: 1rem;
  }

  .card-content h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .card-source {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--vcsi-gray-500);
  }

  /* Dark mode */
  :global(.dark) .showcase-card {
    background: var(--vcsi-gray-900);
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .showcase-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  :global(.dark) .card-image {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .card-source {
    color: var(--vcsi-gray-400);
  }
</style>
