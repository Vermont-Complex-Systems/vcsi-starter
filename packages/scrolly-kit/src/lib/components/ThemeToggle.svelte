<script lang="ts">
  import { toggleMode, mode } from 'mode-watcher';
  import { Sun, Moon } from '@lucide/svelte';
</script>

<button onclick={toggleMode} class="theme-toggle" aria-label="Toggle dark mode">
  {#if mode.current === 'dark'}
    <Sun size={20} />
  {:else}
    <Moon size={20} />
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--nav-fg, var(--fg));
    border: none;
    cursor: pointer;
    transition: all var(--transition-medium);
  }

  .theme-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(1.1);
  }

  :global(.dark) .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Mobile: match icon-button sizing in Nav */
  @media (max-width: 768px) {
    .theme-toggle {
      width: 3.5rem;
      height: 3.5rem;
    }

    .theme-toggle :global(svg) {
      width: 24px;
      height: 24px;
    }
  }
</style>
