<script lang="ts">
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';
  import StatCards from './StatCards.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const stats = flights.summarize({
    avg_delay: 'ROUND(AVG(arr_delay), 2)',
    max_delay: 'MAX(arr_delay)',
    total: 'COUNT(*)'
  }) as unknown as { rows: { avg_delay: number; max_delay: number; total: number }[]; loading: boolean; error: string | null };
</script>

<LiveResult {badge}>
  <StatCards
    loading={stats.loading}
    stats={stats.rows[0] ? [
      { label: 'avg arr_delay', value: stats.rows[0].avg_delay, suffix: ' min' },
      { label: 'max arr_delay', value: stats.rows[0].max_delay, suffix: ' min' },
      { label: 'total flights', value: stats.rows[0].total }
    ] : []}
  />
</LiveResult>
