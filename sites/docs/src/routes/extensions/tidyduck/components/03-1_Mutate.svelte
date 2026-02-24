<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const withComputed = flights
    .mutate({
      gain: 'dep_delay - arr_delay',
      speed: 'ROUND(distance / air_time * 60, 1)'
    })
    .select('year', 'month', 'day', 'carrier', 'dep_delay', 'arr_delay', 'gain', 'speed')
    .head(8);
</script>

<LiveResult {badge}>
  {#if withComputed.loading}
    <p class="loading">Loading…</p>
  {:else}
    <ResultTable rows={withComputed.rows} />
  {/if}
</LiveResult>

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }
</style>
