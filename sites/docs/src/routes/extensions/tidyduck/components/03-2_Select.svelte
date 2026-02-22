<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const selected = flights
    .select('year', 'month', 'day')
    .head(6);
</script>

<LiveResult {badge}>
  {#if selected.loading}
    <p class="loading">Loading…</p>
  {:else}
    <ResultTable rows={selected.rows} />
  {/if}
</LiveResult>

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }
</style>
