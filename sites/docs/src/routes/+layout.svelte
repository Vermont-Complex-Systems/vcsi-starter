<script>
  import '$lib/styles/app.css';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let { children } = $props();
</script>

<nav class="docs-nav">
  <a href="{base}/" class="docs-nav-logo">scrolly-kit</a>
  <ul class="docs-nav-links">
    <li><a href="{base}/" aria-current={$page.url.pathname === base + '/' ? 'page' : undefined}>Getting Started</a></li>
    <li><a href="{base}/reference" aria-current={$page.url.pathname === base + '/reference' ? 'page' : undefined}>Reference</a></li>
    <li><a href="https://vcsi.cmplxsys.w3.uvm.edu/" target="_blank" rel="noopener">Examples</a></li>
  </ul>
</nav>

<main>
  {@render children?.()}
</main>
