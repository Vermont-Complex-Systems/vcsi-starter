<script lang="ts">
  interface Column {
    key: string;
    label: string;
    isCode?: boolean;
    codeClass?: string;
  }

  interface Props {
    columns: Column[];
    rows: Record<string, string>[];
  }

  let { columns, rows }: Props = $props();
</script>

<table class="props-table">
  <thead>
    <tr>
      {#each columns as col}
        <th>{col.label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        {#each columns as col}
          <td>
            {#if col.isCode}
              <code class={col.codeClass}>{row[col.key]}</code>
            {:else}
              {row[col.key]}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .props-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .props-table th,
  .props-table td {
    padding: 0.625rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--vcsi-border);
  }

  .props-table th {
    font-weight: 600;
    background: var(--vcsi-gray-50);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .props-table code {
    background: var(--vcsi-gray-100);
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    font-size: 0.8rem;
  }

  .props-table code.type {
    color: #3b82f6;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .props-table {
      font-size: 0.8rem;
    }

    .props-table th,
    .props-table td {
      padding: 0.5rem;
    }
  }

  /* Dark mode */
  :global(.dark) .props-table th {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .props-table code {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .props-table code.type {
    color: #60a5fa;
  }
</style>
