<script lang="ts">
  import { formatNum } from './utils';

  interface StatDef {
    label: string;
    value: unknown;
    suffix?: string;
  }

  interface Props {
    stats: StatDef[];
    loading?: boolean;
  }

  let { stats, loading = false }: Props = $props();
</script>

{#if loading}
  <p class="loading">Loading…</p>
{:else}
  <div class="stat-grid">
    {#each stats as s}
      <div class="stat-card">
        <span class="stat-label">{s.label}</span>
        <span class="stat-value">{formatNum(s.value)}{s.suffix ?? ''}</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    text-align: center;
    padding: 0.75rem;
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 6px;
  }

  .stat-label {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--vcsi-gray-500);
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 1.3rem;
    font-weight: 700;
    font-family: var(--vcsi-font-mono, monospace);
    color: var(--matisse-blue, oklch(45% 0.18 255));
  }

  :global(.dark) .stat-card {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .stat-value {
    color: #60a5fa;
  }
</style>
