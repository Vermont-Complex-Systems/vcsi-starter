<script>
    import {
        createTable,
        FlexRender,
        getCoreRowModel,
        getSortedRowModel,
        getPaginationRowModel,
    } from '@tanstack/svelte-table';

    let { data } = $props();

    const columns = [
        { accessorKey: 'title', header: 'Title', size: 280 },
        { accessorKey: 'ego_display_name', header: 'Author', size: 150 },
        { accessorKey: 'college', header: 'College', size: 100 },
        { accessorKey: 'host_dept', header: 'Department', size: 140 },
        { accessorKey: 'publication_year', header: 'Year', size: 70 },
        { accessorKey: 'cited_by_count', header: 'Cited By', size: 80 },
    ];

    let sorting = $state([]);
    let pagination = $state({ pageIndex: 0, pageSize: 10 });

    const table = createTable({
        get data() { return data; },
        columns,
        state: {
            get sorting() { return sorting; },
            get pagination() { return pagination; },
        },
        onSortingChange: (updater) => {
            if (typeof updater === 'function') {
                sorting = updater(sorting);
            } else {
                sorting = updater;
            }
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                pagination = updater(pagination);
            } else {
                pagination = updater;
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
</script>

<div class="table-wrapper">
    <table>
        <thead>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <tr>
                    {#each headerGroup.headers as header (header.id)}
                        <th
                            style:width="{header.getSize()}px"
                            class:sortable={header.column.getCanSort()}
                            onclick={header.column.getToggleSortingHandler()}
                        >
                            {#if !header.isPlaceholder}
                                <FlexRender
                                    content={header.column.columnDef.header}
                                    context={header.getContext()}
                                />
                                {#if header.column.getIsSorted() === 'asc'}
                                    <span class="sort-icon"> ↑</span>
                                {:else if header.column.getIsSorted() === 'desc'}
                                    <span class="sort-icon"> ↓</span>
                                {/if}
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </thead>
        <tbody>
            {#each table.getRowModel().rows as row (row.id)}
                <tr>
                    {#each row.getVisibleCells() as cell (cell.id)}
                        <td>
                            <FlexRender
                                content={cell.column.columnDef.cell}
                                context={cell.getContext()}
                            />
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="pagination">
        <span class="page-info">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            ({data.length} rows)
        </span>
        <div class="page-buttons">
            <button onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
            </button>
            <button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
            </button>
        </div>
    </div>
</div>

<style>
    .table-wrapper {
        padding: 0 var(--vcsi-space-lg, 1.5rem) var(--vcsi-space-lg, 1.5rem);
        overflow-x: auto;
        flex-shrink: 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-small, 14px);
    }

    thead {
        position: sticky;
        top: 0;
    }

    th {
        text-align: left;
        padding: 0.5rem 0.75rem;
        font-weight: 600;
        font-size: var(--vcsi-font-size-xs, 12px);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--vcsi-gray-700, rgb(78, 78, 78));
        border-bottom: 2px solid var(--vcsi-border, #ddd);
        white-space: nowrap;
        user-select: none;
    }

    th.sortable {
        cursor: pointer;
    }

    th.sortable:hover {
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
    }

    .sort-icon {
        font-size: 0.75rem;
    }

    td {
        padding: 0.45rem 0.75rem;
        border-bottom: 1px solid var(--vcsi-border, #ddd);
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 250px;
    }

    tbody tr:hover {
        background: rgba(0, 0, 0, 0.03);
    }

    .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--vcsi-space-md, 1rem);
        gap: 1rem;
    }

    .page-info {
        font-size: var(--vcsi-font-size-xs, 12px);
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
    }

    .page-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .page-buttons button {
        padding: 0.35rem 0.75rem;
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        border: 1px solid var(--vcsi-border, #ddd);
        border-radius: 4px;
        background: white;
        cursor: pointer;
        color: var(--vcsi-gray-700, rgb(78, 78, 78));
    }

    .page-buttons button:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.03);
        border-color: var(--vcsi-gray-500, rgb(128, 128, 128));
    }

    .page-buttons button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
</style>
