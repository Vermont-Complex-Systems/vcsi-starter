<script>
    let { stats = {}, totalCount = 0 } = $props();
</script>

<div class="cards">
    <div class="card">
        <span class="card-label">Papers</span>
        <span class="card-value">{stats?.paper_count ?? 0}</span>
        <span class="card-detail">of {totalCount} total</span>
    </div>
    <div class="card">
        <span class="card-label">Authors</span>
        <span class="card-value">{stats?.author_count ?? 0}</span>
        <span class="card-detail">researchers</span>
    </div>
    <div class="card">
        <span class="card-label">Departments</span>
        <span class="card-value">{stats?.dept_count ?? 0}</span>
        <span class="card-detail">represented</span>
    </div>
    <div class="card">
        <span class="card-label">Colleges</span>
        <span class="card-value">{stats?.college_count ?? 0}</span>
        <span class="card-detail">represented</span>
    </div>
</div>

<style>
    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--vcsi-space-md, 1rem);
        padding: var(--vcsi-space-lg, 1.5rem);
        padding-bottom: 0;
        flex-shrink: 0;
    }

    .card {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: var(--vcsi-space-md, 1rem);
        background: var(--vcsi-sidebar-bg, #ebe6e1);
        border-radius: var(--vcsi-radius-md, 6px);
        border: 1px solid var(--vcsi-border, #ddd);
    }

    .card-label {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--vcsi-gray-700, rgb(78, 78, 78));
    }

    .card-value {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: 1.75rem;
        font-weight: 700;
        line-height: 1;
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
    }

    .card-detail {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
    }

    @media (max-width: 768px) {
        .cards {
            display: none;
        }
    }
</style>
