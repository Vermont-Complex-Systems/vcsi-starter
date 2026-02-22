<script lang="ts">
  import { formatNum, typeLabel, fmtSample } from './utils';
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const info = flights.glimpse();
</script>

<LiveResult {badge}>
  {#if info.loading}
    <p class="loading">Loading…</p>
  {:else}
    <pre class="glimpse"><code>Rows: {formatNum(info.nRows)}
Columns: {info.nCols}
{#each info.columns as col}$ {col.name.padEnd(16)}{@html `<span class="glimpse-type">&lt;${typeLabel(col.type)}&gt;</span>`} {col.sample.map(fmtSample).join(', ')}…
{/each}</code></pre>
  {/if}
</LiveResult>

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
    padding: 1rem 1.25rem;
  }

  pre.glimpse {
    margin: 0;
    padding: 1rem 1.25rem;
    font-size: 0.75rem;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre;
  }

  pre.glimpse code {
    font-family: var(--vcsi-font-mono, monospace);
  }

  :global(.glimpse-type) {
    color: var(--vcsi-gray-500);
  }
</style>
