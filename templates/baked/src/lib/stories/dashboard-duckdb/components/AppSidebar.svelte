<script>
    import { Sidebar, SimpleSelect } from '@the-vcsi/scrolly-kit';
    import Legend from './Legend.svelte';

    let {
        searchQuery = $bindable(''),
        selectedYear = $bindable('all'),
        selectedColleges = $bindable(new Set()),
        colleges,
        years,
        colorScale,
    } = $props();

    let yearItems = $derived([
        { value: 'all', label: 'All years' },
        ...years.map(y => ({ value: String(y), label: String(y) })).reverse()
    ]);
</script>

<Sidebar.Content>
    <Sidebar.Header>
        <h2 class="sidebar-title">UVM Research Explorer</h2>
    </Sidebar.Header>

    <Sidebar.Group label="Search">
        <input
            id="search-input"
            type="text"
            placeholder="Paper title..."
            bind:value={searchQuery}
            class="search-input"
        />
    </Sidebar.Group>

    <Sidebar.Group label="Year">
        <SimpleSelect items={yearItems} bind:value={selectedYear} placeholder="Select year" />
    </Sidebar.Group>

    <Sidebar.Group label="Colleges">
        <Legend {colleges} {colorScale} bind:selectedColleges />
    </Sidebar.Group>

    <Sidebar.Footer>
        <a class="footer-link" href="https://openalex.org" target="_blank" rel="noopener">
            <svg class="footer-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Data from OpenAlex
        </a>
    </Sidebar.Footer>
</Sidebar.Content>

<Sidebar.Trigger />

<style>
    .sidebar-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
    }

    .search-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--color-uvm-green, #007155);
        box-shadow: 0 0 0 2px rgba(0, 113, 85, 0.1);
    }

    .footer-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
        text-decoration: none;
    }

    .footer-link:hover {
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
    }

    .footer-icon {
        flex-shrink: 0;
    }
</style>
