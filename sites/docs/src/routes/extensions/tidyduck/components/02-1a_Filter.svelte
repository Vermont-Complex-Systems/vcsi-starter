<script lang="ts">
  import { formatNum } from './utils';
  import type { from } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: ReturnType<typeof from>;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  let threshold = $state(120);

  const delayed = $derived(
    flights.where(() => `dep_delay > ${threshold}`).rows<Record<string, any>>()
  );
</script>

<LiveResult {badge}>
  <div class="input-row">
    <label for="delay-threshold">dep_delay &gt;</label>
    <input
      id="delay-threshold"
      type="range"
      min={0}
      max={600}
      step={10}
      bind:value={threshold}
    />
    <span class="threshold-value">{threshold} min</span>
  </div>
  <p><strong>{formatNum(delayed.rows.length)}</strong> flights with dep_delay &gt; {threshold}</p>
  <ResultTable
    rows={delayed.rows}
    loading={delayed.loading}
    columns={['year','month','day','carrier','flight','origin','dest','dep_delay']}
    limit={5}
  />
</LiveResult>

<style>
  .input-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
  }

  input[type="range"] {
    flex: 1;
    max-width: 200px;
    accent-color: var(--matisse-accent, #e67e22);
  }

  .threshold-value {
    font-family: var(--vcsi-font-mono, monospace);
    font-size: 0.8rem;
    min-width: 5rem;
    color: var(--vcsi-gray-600);
  }
</style>
