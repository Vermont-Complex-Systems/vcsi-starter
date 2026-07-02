<script lang="ts">
  interface Section {
    id: string;
    label: string;
    children?: Section[];
  }

  interface Props {
    sections: Section[];
    title?: string;
  }

  let { sections, title = 'Content' }: Props = $props();

  let activeSection = $state('');

  // Flat list of every heading id (h2 + nested h3) for the scroll-spy observer.
  let flatIds = $derived(
    sections.flatMap((s) => [s.id, ...(s.children ?? []).map((c) => c.id)])
  );

  // The top-level section that owns the active heading — used to expand its group.
  let activeParent = $derived(
    sections.find(
      (s) => s.id === activeSection || (s.children ?? []).some((c) => c.id === activeSection)
    )?.id ?? ''
  );

  // Re-run whenever the heading set changes (e.g. navigating to another doc).
  $effect(() => {
    const ids = flatIds;
    if (ids.length === 0) return;

    activeSection = ids[0];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeSection = entry.target.id;
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });
</script>

<aside class="toc">
  <nav class="toc-nav">
    <div class="toc-header">{title}</div>
    <ul class="toc-list">
      {#each sections as section (section.id)}
        <li class="toc-item">
          <a
            href="#{section.id}"
            class="toc-parent"
            class:active={activeSection === section.id}
            class:group-active={activeParent === section.id}
          >
            {section.label}
          </a>
          {#if section.children?.length}
            <div class="toc-sub-wrap" class:open={activeParent === section.id}>
              <ul class="toc-sub">
                {#each section.children as child (child.id)}
                  <li>
                    <a
                      href="#{child.id}"
                      class="toc-child"
                      class:active={activeSection === child.id}
                    >
                      {child.label}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
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
    width: 200px;
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
    margin-bottom: 0.75rem;
  }

  .toc-list,
  .toc-sub {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc-item,
  .toc-sub li {
    margin: 0;
  }

  /* The docs prose adds an orange ● before every `.page li` (see app.css
     `.page ul li::before`). The TOC lives inside `.page`, and because these
     links are block-level that bullet lands on its own line above each entry,
     doubling the row height — kill it for the TOC lists. */
  .toc-list li::before,
  .toc-sub li::before {
    content: none;
  }

  /* Top-level (h2) links — the always-visible spine. */
  .toc-parent {
    display: block;
    padding: 0.15rem 0 0.15rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25;
    color: var(--vcsi-gray-600);
    text-decoration: none;
    border-left: 2px solid var(--vcsi-border);
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .toc-parent:hover {
    color: var(--vcsi-fg);
  }

  .toc-parent.active,
  .toc-parent.group-active {
    color: var(--vcsi-fg);
    font-weight: 600;
  }

  .toc-parent.active {
    border-left-color: var(--vcsi-color-accent, #333);
  }

  /* Collapsible group of h3 children — animates open for the active (or hovered) section. */
  .toc-sub-wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s ease;
  }

  .toc-sub-wrap.open,
  .toc-item:hover .toc-sub-wrap {
    grid-template-rows: 1fr;
  }

  .toc-sub {
    overflow: hidden;
    min-height: 0;
  }

  /* h3 links — indented, smaller, dimmer so the nesting reads at a glance. */
  .toc-child {
    display: block;
    padding: 0.1rem 0 0.1rem 1.75rem;
    font-size: 0.8125rem;
    line-height: 1.2;
    color: var(--vcsi-gray-500);
    text-decoration: none;
    border-left: 2px solid var(--vcsi-border);
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .toc-child:hover {
    color: var(--vcsi-fg);
  }

  .toc-child.active {
    color: var(--vcsi-fg);
    border-left-color: var(--vcsi-color-accent, #333);
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

  :global(.dark) .toc-parent,
  :global(.dark) .toc-child {
    border-left-color: var(--vcsi-gray-700);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .toc-parent:hover,
  :global(.dark) .toc-parent.active,
  :global(.dark) .toc-parent.group-active,
  :global(.dark) .toc-child:hover,
  :global(.dark) .toc-child.active {
    color: var(--vcsi-fg);
  }
</style>
