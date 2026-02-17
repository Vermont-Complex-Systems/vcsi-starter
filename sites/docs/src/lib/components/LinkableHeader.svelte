<script lang="ts">
  import { Link } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    level?: 2 | 3 | 4;
    children: Snippet;
  }

  let { id, level = 2, children }: Props = $props();

  let copied = $state(false);

  function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<svelte:element this={`h${level}`} {id} class="linkable-header">
  <a href={`#${id}`} class="header-anchor" onclick={copyLink} aria-label="Copy link to section">
    {@render children()}
    <span class="link-icon" class:copied>
      {#if copied}
        <span class="copied-text">Copied!</span>
      {:else}
        <Link size={level === 2 ? 18 : 16} />
      {/if}
    </span>
  </a>
</svelte:element>

<style>
  .linkable-header {
    position: relative;
  }

  .header-anchor {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: inherit;
    text-decoration: none;
  }

  .header-anchor:hover {
    text-decoration: none;
  }

  .link-icon {
    opacity: 0;
    transition: opacity 0.15s ease;
    color: var(--vcsi-gray-400);
    display: inline-flex;
    align-items: center;
  }

  .header-anchor:hover .link-icon,
  .link-icon.copied {
    opacity: 1;
  }

  .link-icon:hover {
    color: var(--matisse-primary, var(--vcsi-gray-600));
  }

  .copied-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--matisse-accent, #22c55e);
  }

  /* Dark mode */
  :global(.dark) .link-icon {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .link-icon:hover {
    color: var(--vcsi-gray-300);
  }
</style>
