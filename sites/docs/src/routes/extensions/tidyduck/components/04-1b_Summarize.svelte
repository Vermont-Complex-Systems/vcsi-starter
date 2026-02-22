<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const byDest = flights
    .sql<{ dest: string; avg_delay: number; n: number }>((where) => `
      SELECT
        dest,
        ROUND(AVG(arr_delay), 1) AS avg_delay,
        COUNT(*) AS n
      FROM 'nycflights13_flights.parquet'
      ${where}
      GROUP BY dest
      HAVING COUNT(*) > 100
      ORDER BY avg_delay DESC
      LIMIT 15
    `);
</script>

<LiveResult {badge}>
  <ResultTable rows={byDest.rows} loading={byDest.loading} label="Destinations with 100+ flights, sorted by avg arrival delay:" />
</LiveResult>
