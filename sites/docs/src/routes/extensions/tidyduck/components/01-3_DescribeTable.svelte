<script lang="ts">
  import { formatNum, typeLabel, isNumericType } from './utils';
  import type { DuckQuery } from '$lib/db/duck.svelte';
  import LiveResult from './LiveResult.svelte';

  interface Props {
    flights: DuckQuery;
    badge?: string;
  }

  let { flights, badge = 'live' }: Props = $props();

  const summary = flights.describe();
</script>

<LiveResult {badge}>
  {#if summary.loading}
    <p class="loading">Loading…</p>
  {:else}
    <div class="describe-table-wrap">
      <table class="describe-table">
        <thead>
          <tr>
            <th class="col-name">column</th>
            <th class="col-type">type</th>
            <th class="col-dist">distribution</th>
            <th class="col-stats">stats</th>
            <th class="col-null">null %</th>
          </tr>
        </thead>
        <tbody>
          {#each summary.rows as col}
            {@const numeric = isNumericType(col.column_type)}
            {@const min = Number(col.min)}
            {@const max = Number(col.max)}
            {@const range = max - min || 1}
            <tr>
              <td class="col-name"><code>{col.column_name}</code></td>
              <td class="col-type"><span class="type-badge">{typeLabel(col.column_type)}</span></td>
              <td class="col-dist">
                {#if numeric && !isNaN(min) && !isNaN(max)}
                  <div class="box-plot" title="min={col.min} q25={col.q25} median={col.q50} q75={col.q75} max={col.max}">
                    <div class="box-whisker" style="left: 0; width: 100%"></div>
                    <div class="box-iqr" style="left: {((Number(col.q25) - min) / range) * 100}%; width: {((Number(col.q75) - Number(col.q25)) / range) * 100}%"></div>
                    <div class="box-median" style="left: {((Number(col.q50) - min) / range) * 100}%"></div>
                  </div>
                  <div class="box-labels">
                    <span>{col.min}</span>
                    <span>{col.max}</span>
                  </div>
                {:else}
                  <div class="cat-summary">
                    <span class="unique-badge">{formatNum(col.approx_unique)} unique</span>
                  </div>
                {/if}
              </td>
              <td class="col-stats">
                {#if numeric && col.avg}
                  <span class="stat-mini">avg {Number(col.avg).toFixed(1)}</span>
                {:else}
                  <span class="stat-mini">{formatNum(col.approx_unique)} distinct</span>
                {/if}
              </td>
              <td class="col-null">
                {#if Number(col.null_percentage) > 0}
                  <div class="null-bar-wrap">
                    <div class="null-bar" style="width: {col.null_percentage}%"></div>
                  </div>
                  <span class="null-pct">{Number(col.null_percentage).toFixed(1)}%</span>
                {:else}
                  <span class="null-pct zero">0%</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</LiveResult>

<style>
  .loading {
    color: var(--vcsi-gray-500);
    font-style: italic;
    padding: 1rem 1.25rem;
  }

  .describe-table-wrap {
    overflow-x: auto;
  }

  .describe-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.78rem;
    font-family: var(--vcsi-font-mono, monospace);
  }

  .describe-table th {
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--vcsi-gray-500);
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 2px solid var(--vcsi-border);
  }

  .describe-table td {
    padding: 0.45rem 0.75rem;
    border-bottom: 1px solid var(--vcsi-border);
    vertical-align: middle;
  }

  .describe-table .col-name {
    white-space: nowrap;
    font-weight: 600;
  }

  .describe-table .col-type {
    white-space: nowrap;
  }

  .type-badge {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    font-size: 0.65rem;
    font-weight: 600;
    background: color-mix(in oklch, var(--matisse-blue, oklch(45% 0.18 255)) 12%, transparent);
    color: var(--matisse-blue, oklch(45% 0.18 255));
  }

  .describe-table .col-dist {
    min-width: 140px;
    width: 30%;
  }

  .describe-table .col-stats {
    white-space: nowrap;
    font-size: 0.72rem;
    color: var(--vcsi-gray-600);
  }

  .describe-table .col-null {
    white-space: nowrap;
    width: 80px;
  }

  /* ── Box plot ── */
  .box-plot {
    position: relative;
    height: 12px;
    margin: 2px 0;
  }

  .box-whisker {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 1px;
    background: var(--vcsi-gray-400);
  }

  .box-iqr {
    position: absolute;
    top: 1px;
    height: 10px;
    background: color-mix(in oklch, var(--matisse-blue, oklch(45% 0.18 255)) 30%, transparent);
    border: 1px solid color-mix(in oklch, var(--matisse-blue, oklch(45% 0.18 255)) 60%, transparent);
    border-radius: 2px;
    min-width: 2px;
  }

  .box-median {
    position: absolute;
    top: 0;
    height: 12px;
    width: 2px;
    background: var(--matisse-blue, oklch(45% 0.18 255));
    border-radius: 1px;
    transform: translateX(-1px);
  }

  .box-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
    margin-top: 1px;
    line-height: 1;
  }

  /* ── Categorical summary ── */
  .cat-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .unique-badge {
    font-size: 0.7rem;
    color: var(--vcsi-gray-600);
    font-weight: 500;
  }

  .stat-mini {
    font-size: 0.72rem;
    color: var(--vcsi-gray-600);
  }

  /* ── Null percentage bar ── */
  .null-bar-wrap {
    width: 40px;
    height: 4px;
    background: var(--vcsi-gray-200);
    border-radius: 2px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.35rem;
  }

  .null-bar {
    height: 100%;
    background: var(--matisse-accent, #e67e22);
    border-radius: 2px;
  }

  .null-pct {
    font-size: 0.68rem;
    color: var(--vcsi-gray-500);
  }

  .null-pct.zero {
    color: var(--vcsi-gray-400);
  }

  /* ── Dark mode ── */
  :global(.dark) .type-badge {
    background: color-mix(in oklch, #60a5fa 15%, transparent);
    color: #60a5fa;
  }

  :global(.dark) .box-iqr {
    background: color-mix(in oklch, #60a5fa 25%, transparent);
    border-color: color-mix(in oklch, #60a5fa 50%, transparent);
  }

  :global(.dark) .box-median {
    background: #60a5fa;
  }

  :global(.dark) .null-bar-wrap {
    background: var(--vcsi-gray-700);
  }
</style>
