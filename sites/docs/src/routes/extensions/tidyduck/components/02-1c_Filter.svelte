<script lang="ts">
  import { formatNum } from './utils';
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import { ilike, or } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  let search = $state('');

  const searchResults = flights
    .where(() => or(
      ilike('carrier', search),
      ilike('dest', search),
      ilike('origin', search)
    ))
    .count();
</script>

<LiveResult {badge}>
  <div class="input-row">
    <label for="search-input">Search carriers, origins, or destinations:</label>
    <input id="search-input" type="text" bind:value={search} placeholder="Try 'JFK' or 'UA' or 'LAX'" class="text-input" />
  </div>
  <p>
    {#if search.trim()}
      <strong>{formatNum(searchResults.value)}</strong> flights matching "{search}"
    {:else}
      <strong>{formatNum(searchResults.value)}</strong> flights (no filter — type to search)
    {/if}
  </p>
</LiveResult>

<style>
  .input-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .input-row > label:first-child {
    font-size: 0.85rem;
    font-weight: 500;
    min-width: fit-content;
  }

  .text-input {
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--vcsi-border);
    border-radius: 6px;
    font-size: 0.85rem;
    background: white;
    flex: 1;
    max-width: 300px;
  }

  :global(.dark) .text-input {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
    border-color: var(--vcsi-gray-700);
  }
</style>
