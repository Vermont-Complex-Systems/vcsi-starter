<script lang="ts">
  import { formatNum } from './utils';
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const preview = flights.head(6);
  const total = flights.count();
  const nCols = $derived(Object.keys(preview.rows[0] ?? {}).length);
</script>

<LiveResult {badge}>
  {#if preview.loading}
    <p class="loading">Loading…</p>
  {:else}
    <p class="muted"># A parquet file: {formatNum(total.value)} × {nCols} columns</p>
    <ResultTable rows={preview.rows} />
  {/if}
</LiveResult>

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
</style>
