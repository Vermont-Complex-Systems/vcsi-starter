<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const monthly = flights.summarize({
    avg_delay: 'ROUND(AVG(dep_delay), 1)',
    n: 'COUNT(*)'
  }, 'month');
</script>

<LiveResult {badge}>
  {#if monthly.loading}
    <p class="loading">Loading…</p>
  {:else}
    <ResultTable rows={monthly.rows} label="Average departure delay by month:" />
  {/if}
</LiveResult>

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }
</style>
