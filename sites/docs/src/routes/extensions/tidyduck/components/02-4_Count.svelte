<script lang="ts">
  import type { from } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import ResultTable from './ResultTable.svelte';

  interface Props {
    flights: ReturnType<typeof from>;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const byRoute = flights.count('origin', 'dest');
</script>

<LiveResult {badge}>
  <ResultTable rows={byRoute.rows} loading={byRoute.loading} limit={10} label="Top 10 routes by frequency:" />
</LiveResult>
