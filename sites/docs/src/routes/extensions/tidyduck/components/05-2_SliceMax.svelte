<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const mostDelayed = flights
    .select('dest', 'carrier', 'flight', 'arr_delay', 'month', 'day')
    .sliceMax('arr_delay', 1, 'dest');
</script>

<LiveResult {badge}>
  {#if mostDelayed.loading}
    <p class="loading">Loading…</p>
  {:else}
    <ResultTable rows={mostDelayed.rows.slice(0, 10)} label="Most delayed arrival per destination (showing first 10):" />
  {/if}
</LiveResult>

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }
</style>
