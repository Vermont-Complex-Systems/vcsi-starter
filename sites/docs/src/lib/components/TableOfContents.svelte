<script lang="ts">
  import { onMount } from 'svelte';

  interface Section {
    id: string;
    label: string;
  }

  interface Props {
    sections: Section[];
    title?: string;
  }

  let { sections, title = 'Content' }: Props = $props();

  let activeSection = $state('');

  onMount(() => {
    // Set initial active section
    if (sections.length > 0) {
      activeSection = sections[0].id;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });
</script>

<aside class="toc">
  <nav class="toc-nav">
    <div class="toc-header">{title}</div>
    <ul>
      {#each sections as { id, label } (id)}
        <li>
          <a
            href="#{id}"
            class:active={activeSection === id}
          >
            {label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<style>
  .toc {
    position: absolute;
    top: 0;
    left: calc(100% + 2rem);
    width: 180px;
    height: 100%;
  }

  .toc-nav {
    position: sticky;
    top: 5rem;
  }

  .toc-header {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--vcsi-gray-500);
    margin-bottom: 1rem;
  }

  .toc-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border-left: 1px solid var(--vcsi-border);
  }

  .toc-nav li {
    margin: 0;
  }

  .toc-nav a {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    color: var(--vcsi-gray-600);
    text-decoration: none;
    border-left: 2px solid transparent;
    margin-left: -1px;
    transition: all 0.15s ease;
  }

  .toc-nav a:hover {
    color: var(--vcsi-fg);
  }

  .toc-nav a.active {
    color: var(--vcsi-fg);
    border-left-color: var(--vcsi-color-accent, #333);
    font-weight: 500;
  }

  /* Hide on narrower screens */
  @media (max-width: 1100px) {
    .toc {
      display: none;
    }
  }

  /* Dark mode */
  :global(.dark) .toc-header {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .toc-nav ul {
    border-left-color: var(--vcsi-gray-700);
  }

  :global(.dark) .toc-nav a {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .toc-nav a:hover,
  :global(.dark) .toc-nav a.active {
    color: var(--vcsi-fg);
  }
</style>
