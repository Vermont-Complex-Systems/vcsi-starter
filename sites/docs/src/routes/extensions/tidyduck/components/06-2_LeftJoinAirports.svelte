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

  const withAirport = db.sql<{
    year: number; time_hour: string; origin: string;
    dest: string; tailnum: string; carrier: string;
    name: string; lat: number; lon: number;
  }>(t =>
    `SELECT f.year, f.time_hour, f.origin, f.dest, f.tailnum, f.carrier,
            a.name, a.lat, a.lon
     FROM ${t.flights} f
     LEFT JOIN ${t.airports} a ON f.dest = a.faa
     LIMIT 6`
  );

  const total = db.from('flights').count();
</script>

<LiveResult {badge}>
  {#if withAirport.loading}
    <p class="loading">Loading…</p>
  {:else}
    <p class="muted"># Joining dest = faa — {formatNum(total.value)} × {Object.keys(withAirport.rows[0] ?? {}).length} columns</p>
    <ResultTable rows={withAirport.rows} />
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
