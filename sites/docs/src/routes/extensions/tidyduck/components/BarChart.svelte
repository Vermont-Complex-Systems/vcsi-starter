<script lang="ts">
  import { formatNum } from './utils';

  interface Props {
    rows: Record<string, unknown>[];
    loading?: boolean;
    labelKey?: string;
    valueKey?: string;
    limit?: number;
  }

  let { rows, loading = false, labelKey = 'carrier', valueKey = 'n', limit = 10 }: Props = $props();

  const visible = $derived(rows.slice(0, limit));
  const maxN = $derived(Number(rows[0]?.[valueKey] ?? 1));
</script>

{#if loading}
  <p class="loading">Loading…</p>
{:else}
  <div class="bar-chart">
    {#each visible as row}
      <div class="bar-row">
        <span class="bar-label">{row[labelKey]}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: {(Number(row[valueKey]) / maxN) * 100}%"></div>
        </div>
        <span class="bar-value">{formatNum(row[valueKey])}</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }

  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .bar-label {
    font-family: var(--vcsi-font-mono, monospace);
    font-size: 0.75rem;
    width: 3rem;
    text-align: right;
    font-weight: 600;
  }

  .bar-track {
    flex: 1;
    height: 1.2rem;
    background: var(--vcsi-gray-100);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--matisse-blue, oklch(45% 0.18 255));
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .bar-value {
    font-size: 0.75rem;
    color: var(--vcsi-gray-500);
    width: 4rem;
    font-family: var(--vcsi-font-mono, monospace);
  }

  :global(.dark) .bar-track {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .bar-fill {
    background: #60a5fa;
  }
</style>
