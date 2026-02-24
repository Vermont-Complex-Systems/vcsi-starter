<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    badge?: string;
    children: Snippet;
  }

  let { badge = 'live', children }: Props = $props();
</script>

<div class="live-result">
  <span class="live-badge">{badge}</span>
  {@render children()}
</div>

<style>
  .live-result {
    border: 1px solid var(--vcsi-border);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin: 1rem 0 1.5rem;
    background: var(--vcsi-gray-50);
    position: relative;
  }

  .live-badge {
    position: absolute;
    top: -0.6rem;
    right: 1rem;
    background: var(--matisse-accent, #e67e22);
    color: white;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }

  :global(.dark) .live-result {
    background: var(--vcsi-gray-900);
  }
</style>
