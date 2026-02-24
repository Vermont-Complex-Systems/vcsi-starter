<script lang="ts">
  import { formatNum } from './utils';
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import { ilike, or } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import BarChart from './BarChart.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'interactive demo' }: Props = $props();

  let search = $state('');
  let selectedCarriers = $state<string[]>([]);

  const carriers = flights.distinct('carrier');

  const q = flights
    .in('carrier', () => selectedCarriers)
    .where(() => or(
      ilike('origin', search),
      ilike('dest', search)
    ));

  const total = q.count();
  const byDest = q.count('dest');
</script>

<LiveResult {badge}>
  <div class="demo-controls">
    <div class="input-row">
      <label for="demo-search">Search origin/dest:</label>
      <input id="demo-search" type="text" bind:value={search} placeholder="e.g. JFK, LAX, SFO" class="text-input" />
    </div>
    <div class="input-row">
      <label>Filter carriers:</label>
      <div class="chip-wrap">
        {#each carriers.items as c}
          <label class="chip" class:active={selectedCarriers.includes(c)}>
            <input
              type="checkbox"
              checked={selectedCarriers.includes(c)}
              onchange={() => {
                if (selectedCarriers.includes(c)) {
                  selectedCarriers = selectedCarriers.filter(x => x !== c);
                } else {
                  selectedCarriers = [...selectedCarriers, c];
                }
              }}
            />
            {c}
          </label>
        {/each}
      </div>
    </div>
  </div>

  <p class="demo-count">
    <strong>{formatNum(total.value)}</strong> flights match
    {#if selectedCarriers.length > 0 || search.trim()}
      your filters
    {:else}
      (no filters active — try selecting some carriers)
    {/if}
  </p>

  {#if byDest.rows.length > 0}
    <p>Top destinations:</p>
    <BarChart rows={byDest.rows} labelKey="dest" limit={8} />
  {/if}
</LiveResult>

<style>
  .demo-controls {
    margin-bottom: 1rem;
  }

  .demo-count {
    font-size: 1.1rem;
    margin: 1rem 0;
  }

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

  .chip-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    user-select: none;
    transition: all 0.15s;
    font-family: var(--vcsi-font-mono, monospace);
  }

  .chip input[type="checkbox"] {
    display: none;
  }

  .chip:hover {
    border-color: var(--matisse-accent, #e67e22);
  }

  .chip.active {
    background: color-mix(in oklch, var(--matisse-accent, #e67e22) 15%, transparent);
    border-color: var(--matisse-accent, #e67e22);
    color: var(--matisse-accent, #e67e22);
    font-weight: 600;
  }

  :global(.dark) .text-input {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .chip.active {
    background: color-mix(in oklch, #60a5fa 15%, transparent);
    border-color: #60a5fa;
    color: #60a5fa;
  }
</style>
