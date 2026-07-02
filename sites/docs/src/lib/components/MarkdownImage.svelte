<script lang="ts">
  import { base } from '$app/paths';

  interface Props {
    href?: string;
    title?: string;
    text?: string;
  }

  let { href = '', title = undefined, text = '' }: Props = $props();

  // Theme-adaptive diagram SVGs are inlined so they inherit the page's `currentColor`
  // and follow the dark/light toggle. Any other image renders as a plain <img>.
  const diagrams = import.meta.glob('/src/lib/diagrams/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true
  }) as Record<string, string>;

  const bySlug: Record<string, string> = {};
  for (const [path, raw] of Object.entries(diagrams)) {
    const name = path.split('/').pop()?.replace('.svg', '') ?? '';
    bySlug[name] = raw;
  }

  let slug = $derived(href.replace(/^.*\/diagrams\//, '').replace('.svg', ''));
  let inlineSvg = $derived(bySlug[slug]);

  // Root-relative asset paths need the base prefix (GitHub Pages) for real <img>s.
  let src = $derived(href.startsWith('/') ? `${base}${href}` : href);
</script>

<figure class="md-figure">
  {#if inlineSvg}
    <div class="md-diagram">{@html inlineSvg}</div>
  {:else}
    <img {src} alt={text} {title} loading="lazy" decoding="async" />
  {/if}
  {#if title}
    <figcaption>{title}</figcaption>
  {/if}
</figure>

<style>
  .md-figure {
    margin: 1.75rem 0;
    text-align: center;
  }

  .md-figure img {
    max-width: 100%;
    height: auto;
  }

  /* Inline diagrams read the page text colour for their currentColor-based palette. */
  .md-diagram {
    color: var(--vcsi-fg);
  }

  .md-diagram :global(svg) {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
  }

  .md-figure figcaption {
    margin-top: 0.5rem;
    font-size: 0.8125rem;
    color: var(--vcsi-muted, var(--vcsi-gray-500));
  }
</style>
