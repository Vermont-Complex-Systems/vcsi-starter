<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import BarChart from './BarChart.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const byCarrier = flights.count('carrier');
</script>

<LiveResult {badge}>
  <BarChart rows={byCarrier.rows} loading={byCarrier.loading} labelKey="carrier" />
</LiveResult>
