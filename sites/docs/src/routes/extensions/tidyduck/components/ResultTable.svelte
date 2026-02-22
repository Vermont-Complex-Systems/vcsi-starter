<script lang="ts">
  import { formatNum, fmtSample } from './utils';

  interface Props {
    rows: Record<string, unknown>[];
    loading?: boolean;
    columns?: string[];
    limit?: number;
    label?: string;
  }

  let { rows, loading = false, columns, limit, label }: Props = $props();

  const cols = $derived(columns ?? Object.keys(rows[0] ?? {}));
  const visible = $derived(limit ? rows.slice(0, limit) : rows);
</script>

{#if loading}
  <p class="loading">Loading…</p>
{:else}
  {#if label}
    <p>{label}</p>
  {/if}
  <div class="result-table-wrap">
    <table class="result-table">
      <thead><tr>{#each cols as col}<th>{col}</th>{/each}</tr></thead>
      <tbody>
        {#each visible as row}
          <tr>{#each cols as col}<td>{fmtSample(row[col])}</td>{/each}</tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if limit && rows.length > limit}
    <p class="muted">Showing {limit} of {formatNum(rows.length)} rows</p>
  {/if}
{/if}

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }

  .muted {
    color: var(--vcsi-gray-500);
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .result-table-wrap {
    overflow-x: auto;
  }

  .result-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    font-family: var(--vcsi-font-mono, monospace);
  }

  .result-table th,
  .result-table td {
    padding: 0.4rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--vcsi-border);
  }

  .result-table th {
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--vcsi-gray-500);
  }
</style>
