<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const carriers = flights.distinct('carrier');
  const origins = flights.distinct('origin');
</script>

<LiveResult {badge}>
  {#if carriers.loading}
    <p class="loading">Loading…</p>
  {:else}
    <p><strong>{carriers.items.length}</strong> unique carriers: <code>{carriers.items.join(', ')}</code></p>
    <p><strong>{origins.items.length}</strong> unique origins: <code>{origins.items.join(', ')}</code></p>
  {/if}
</LiveResult>

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
  }
</style>
