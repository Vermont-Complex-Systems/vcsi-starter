# DashboardShell

Dashboard wrapper with a collapsible sidebar, using a snippet-based API. An alternative to the raw `.dashboard-layout` CSS classes. For finer control, use the `Sidebar.*` compound components (`import { Sidebar } from '@the-vcsi/scrolly-kit'`).

**Category:** Dashboard

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| collapsed | boolean | false | Sidebar collapsed state (bindable) |
| sidebarWidth | string | '280px' | Width when expanded |
| collapsedWidth | string | '48px' | Width when collapsed |
| id | string | — | Optional id for the root element |
| sidebar | Snippet | — | Sidebar content (required) |
| children | Snippet | — | Main content (required) |
| class | string | '' | Optional CSS class |

## Usage

```svelte
<script>
  import { DashboardShell } from '@the-vcsi/scrolly-kit';
</script>

<DashboardShell id="my-dashboard">
  {#snippet sidebar()}
    <h2>Filters</h2>
    <!-- selects, toggles, sliders -->
  {/snippet}

  <div class="chart">...</div>
</DashboardShell>
```
