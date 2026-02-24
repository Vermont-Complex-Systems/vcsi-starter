<script lang="ts">
  import { formatNum } from './utils';
  import type { database } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    db: ReturnType<typeof database>;
    badge?: string;
  }

  let { db, badge = 'live' }: Props = $props();

  const withAirline = db.sql<{
    year: number; time_hour: string; origin: string;
    dest: string; tailnum: string; carrier: string; name: string;
  }>(t =>
    `SELECT f.year, f.time_hour, f.origin, f.dest, f.tailnum, f.carrier, a.name
     FROM ${t.flights} f
     LEFT JOIN ${t.airlines} a ON f.carrier = a.carrier
     LIMIT 6`
  );

  const total = db.from('flights').count();
</script>

<LiveResult {badge}>
  {#if withAirline.loading}
    <p class="loading">Loading…</p>
  {:else}
    <p class="muted"># Joining with carrier — {formatNum(total.value)} × {Object.keys(withAirline.rows[0] ?? {}).length} columns</p>
    <ResultTable rows={withAirline.rows} />
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
