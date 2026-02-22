<script lang="ts">
  import { formatNum } from './utils';
  import type { from } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';

  interface Props {
    flights: ReturnType<typeof from>;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  let selectedMonths = $state<number[]>([1, 2]);

  const filtered = $derived(
    flights
      .where(() => {
        if (selectedMonths.length === 0) return null;
        return `month IN (${selectedMonths.join(', ')})`;
      })
      .rows<Record<string, any>>()
  );
</script>

<LiveResult {badge}>
  <div class="input-row">
    <label>Select months:</label>
    {#each [1,2,3,4,5,6,7,8,9,10,11,12] as m}
      <label class="chip" class:active={selectedMonths.includes(m)}>
        <input
          type="checkbox"
          checked={selectedMonths.includes(m)}
          onchange={() => {
            if (selectedMonths.includes(m)) {
              selectedMonths = selectedMonths.filter(x => x !== m);
            } else {
              selectedMonths = [...selectedMonths, m].sort((a, b) => a - b);
            }
          }}
        />
        {m}
      </label>
    {/each}
  </div>
  <p><strong>{formatNum(filtered.rows.length)}</strong> flights in month(s) {selectedMonths.join(', ') || 'none'}</p>
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

  :global(.dark) .chip.active {
    background: color-mix(in oklch, #60a5fa 15%, transparent);
    border-color: #60a5fa;
    color: #60a5fa;
  }
</style>
