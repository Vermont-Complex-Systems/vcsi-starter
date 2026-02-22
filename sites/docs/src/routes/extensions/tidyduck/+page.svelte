<script lang="ts">
  import { base } from '$app/paths';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
  import LinkableHeader from '$lib/components/LinkableHeader.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import { from } from '$lib/db/duck.svelte';
  import HeadTable from './components/01-1_HeadTable.svelte';
  import GlimpseView from './components/01-2_GlimpseView.svelte';
  import DescribeTable from './components/01-3_DescribeTable.svelte';
  import FilterDelay from './components/02-1a_Filter.svelte';
  import FilterMonths from './components/02-1b_Filter.svelte';
  import FilterSearch from './components/02-1c_Filter.svelte';
  import Distinct from './components/02-3_Distinct.svelte';
  import Count from './components/02-4_Count.svelte';
  import SummarizeStats from './components/04-1a_Summarize.svelte';
  import SummarizeDest from './components/04-1b_Summarize.svelte';
  import GroupedCount from './components/04-2_GroupedCount.svelte';
  import Demo from './components/05_Demo.svelte';
  import { formatNum } from './components/utils';

  const sections = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'rows', label: '2. Rows' },
    { id: 'columns', label: '3. Columns' },
    { id: 'groups', label: '4. Groups' },
  ];

  const flights = from("'nycflights13_flights.parquet'");
  const totalCount = flights.count();
</script>

<svelte:head>
  <title>tidyduck - Extensions - scrolly-kit</title>
</svelte:head>

<div class="reference-layout">
  <article class="page">
    <nav class="breadcrumb">
      <a href="{base}/extensions">Extensions</a>
      <span class="separator">/</span>
      <span class="current">tidyduck</span>
    </nav>

    <h1>Data Transformation</h1>
    <p class="subtitle">A tidyverse-inspired API for querying data in the browser with DuckDB-WASM and Svelte 5.</p>

    <TableOfContents {sections} />

    <!-- ============================================================ -->
    <section id="introduction">
      <LinkableHeader id="introduction">Introduction</LinkableHeader>

      <p>
        If you've used R's tidyverse, you know the joy of piping data through a chain of verbs:
        <code>filter()</code>, <code>arrange()</code>, <code>count()</code>, <code>summarize()</code>.
        <strong>tidyduck</strong> brings that same fluency to the browser.
        Instead of tibbles and dplyr, you get <strong>parquet files</strong> and a <strong>reactive query builder</strong> powered by DuckDB-WASM and Svelte 5.
      </p>

      <p>
        The goal of this chapter is to give you an overview of the key tools for transforming data in the browser.
        We'll start with functions that operate on <strong>rows</strong>, then on <strong>columns</strong>, and finally on <strong>groups</strong>.
        Along the way, we'll compare the tidyverse equivalent so you can map your existing knowledge to this new API.
      </p>

      <!-- 1.1 Prerequisites -->
      <h3 id="prerequisites">Prerequisites</h3>

      <p>Install the add-on into any SvelteKit project:</p>
      <CopyCodeBlock language="bash" command="npx sv add @the-vcsi/tidyduck" />

      <p>This drops three files into <code>src/lib/db/</code>:</p>
      <table class="docs-table">
        <thead>
          <tr><th>File</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>duckdb.svelte.ts</code></td><td>DuckDB-WASM singleton — lazy-loads the engine on first query</td></tr>
          <tr><td><code>sql.svelte.ts</code></td><td>Reactive primitives: <code>duck()</code>, <code>duck_val()</code>, <code>duck_col()</code></td></tr>
          <tr><td><code>duck.svelte.ts</code></td><td>Query builder + composable SQL helpers</td></tr>
        </tbody>
      </table>

      <p>
        Place your data file in <code>static/data/</code>.
        For this guide, we use <code>nycflights13_flights.parquet</code>.
        Then import and start querying:
      </p>

      <CopyCodeBlock language="typescript" command={`import { from } from '$lib/db/duck.svelte';

const flights = from("'nycflights13_flights.parquet'");`} />

      <p>
        That's the tidyduck equivalent of <code>library(tidyverse)</code> and <code>flights</code>.
        The <code>from()</code> function creates a <strong>query builder</strong> — nothing runs until you materialize it with a verb like <code>.rows()</code>.
      </p>

      <!-- 1.2 nycflights13 -->
      <h3 id="nycflights13">nycflights13</h3>

      <p>
        We use the <a href="https://github.com/tidyverse/nycflights13" target="_blank" rel="noopener">nycflights13</a> dataset throughout —
        all {formatNum(totalCount.value)} flights that departed from New York City in 2013.
        The same dataset used in <a href="https://r4ds.hadley.nz/data-transform" target="_blank" rel="noopener">R for Data Science</a>.
        Except here, the data lives in a <code>.parquet</code> file and is queried entirely in your browser.
      </p>

      <p>In R, typing <code>flights</code> prints the first few rows of the tibble. The tidyduck equivalent is <code>.head()</code>:</p>

      <CopyCodeBlock language="typescript" command={`const preview = flights.head();  // first 6 rows (default)`} />

      <HeadTable {flights} badge="live 1.1" />

      <p>
        For a transposed view showing every column with its type and sample values — like R's <code>glimpse()</code> — use <code>.glimpse()</code>:
      </p>

      <CopyCodeBlock language="typescript" command={`const info = flights.glimpse();
// info.columns → [{ name, type, sample }, ...]
// info.nRows, info.nCols`} />

      <GlimpseView {flights} badge="live 1.2" />

      <p>
        Finally, for a statistical overview of every column — like R's <code>summary()</code> or Observable's table summary — use <code>.describe()</code>.
        It runs DuckDB's <code>SUMMARIZE</code> under the hood, giving you min, max, quantiles, and null percentages in one call:
      </p>

      <CopyCodeBlock language="typescript" command={`const summary = flights.describe();
// summary.rows → [{ column_name, column_type, min, max, q25, q50, q75, avg, ... }, ...]`} />

      <DescribeTable {flights} badge="live 1.3" />

      <!-- 1.3 dplyr basics -->
      <h3 id="dplyr-basics">dplyr basics</h3>

      <p>
        In dplyr, every verb takes a data frame as its first argument and returns a new data frame.
        The pipe <code>|></code> threads them together.
        In tidyduck, <code>from()</code> creates an immutable builder.
        Each method returns a <strong>new builder</strong> — the original is never modified:
      </p>

      <CopyCodeBlock language="typescript" command={`// dplyr:  flights |> filter(...) |> arrange(...)
// tidyduck:
const q = flights
  .between('year', () => selectedYear)
  .in('carrier', () => selectedCarriers)
  .eq('origin', () => selectedOrigin);`} />

      <p>
        Filter methods — <code>.where()</code>, <code>.between()</code>, <code>.in()</code>, <code>.ilike()</code>, <code>.eq()</code> — add reactive clauses.
        Materialization methods — <code>.rows()</code>, <code>.count()</code>, <code>.distinct()</code>, <code>.summarize()</code> — actually run the query and return reactive results.
      </p>

      <p>Because each filter method takes a <strong>function</strong> (not a raw value), the query automatically re-runs when your Svelte state changes. No manual subscriptions, no <code>useEffect</code> — just Svelte 5 runes doing their thing.</p>

      <div class="comparison-box">
        <h4>dplyr → tidyduck</h4>
        <table class="docs-table">
          <thead>
            <tr><th>Concept</th><th>dplyr</th><th>tidyduck</th></tr>
          </thead>
          <tbody>
            <tr><td>Data source</td><td><code>flights</code> (tibble)</td><td><code>from("'flights.parquet'")</code></td></tr>
            <tr><td>Chaining</td><td><code>|></code> pipe</td><td>Method chaining (<code>.where().in()</code>)</td></tr>
            <tr><td>Immutability</td><td>Each verb returns a new tibble</td><td>Each method returns a new builder</td></tr>
            <tr><td>Lazy evaluation</td><td>Eager (runs immediately)</td><td>Lazy until <code>.rows()</code>, <code>.count()</code>, etc.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ============================================================ -->
    <section id="rows">
      <LinkableHeader id="rows">Rows</LinkableHeader>

      <p>
        The most important verbs that operate on rows are
        <code>filter()</code> (keep rows matching a condition),
        <code>arrange()</code> (reorder rows), and
        <code>distinct()</code> (find unique rows).
        Here's how each maps to tidyduck.
      </p>

      <!-- filter -->
      <h3 id="filter"><code>filter()</code> → <code>.where()</code>, <code>.eq()</code>, <code>.in()</code>, <code>.between()</code>, <code>.ilike()</code></h3>

      <p>
        dplyr's <code>filter()</code> keeps rows based on conditions.
        In tidyduck, the builder offers several specialized filter methods that handle common patterns and automatically skip inactive filters:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr: flights that departed more than 120 minutes late
flights |> filter(dep_delay > 120)`} />

      <CopyCodeBlock language="typescript" command={`// tidyduck
const delayed = flights.where(() => "dep_delay > 120").rows();`} />

      <FilterDelay {flights} badge="live 2.1" />

      <p>
        The <code>.where()</code> method accepts any SQL expression. For common patterns, use the specialized helpers:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr: flights in January or February
flights |> filter(month %in% c(1, 2))`} />

      <CopyCodeBlock language="typescript" command={`// tidyduck: .in() works for string columns
// For numeric columns like month, use .where() with raw SQL:
let selectedMonths = $state([1, 2]);

const janFeb = flights
  .where(() => selectedMonths.length === 0
    ? null
    : \`month IN (\${selectedMonths.join(', ')})\`
  )
  .rows();`} />

      <FilterMonths {flights} badge="live 2.2" />

      <p>Here's the full set of filter helpers and when to reach for each:</p>

      <table class="docs-table">
        <thead><tr><th>Method</th><th>SQL generated</th><th>Skips when</th></tr></thead>
        <tbody>
          <tr><td><code>.eq(col, () => val)</code></td><td><code>col = 'val'</code></td><td>value is <code>null</code></td></tr>
          <tr><td><code>.in(col, () => arr)</code></td><td><code>col IN ('a','b')</code></td><td>array is empty</td></tr>
          <tr><td><code>.between(col, () => [lo,hi])</code></td><td><code>col BETWEEN lo AND hi</code></td><td>matches full range</td></tr>
          <tr><td><code>.ilike(col, () => str)</code></td><td><code>col ILIKE '%str%'</code></td><td>string is empty</td></tr>
          <tr><td><code>.where(() => expr)</code></td><td>any SQL expression</td><td>returns <code>null</code></td></tr>
        </tbody>
      </table>

      <p class="tip">
        <strong>Automatic skip behavior.</strong> Every filter method gracefully handles "no selection" states.
        An empty array in <code>.in()</code>, a blank string in <code>.ilike()</code>, or <code>null</code> in <code>.eq()</code> means the filter is simply ignored — no <code>if</code> statements needed.
        This is one of tidyduck's most powerful features: your query adapts to the UI state automatically.
      </p>

      <!-- Combining with or -->
      <h4>Combining conditions with <code>or()</code></h4>

      <p>
        Chained filters combine with AND, just like comma-separated conditions in dplyr's <code>filter()</code>.
        For OR logic, use the <code>or()</code> helper inside <code>.where()</code>:
      </p>

      <CopyCodeBlock language="typescript" command={`// Search across multiple columns at once
let search = $state('');

const results = flights
  .where(() => or(
    ilike('carrier', search),
    ilike('dest', search),
    ilike('origin', search)
  ))
  .count();`} />

      <FilterSearch {flights} badge="live 2.3" />

      <!-- arrange -->
      <h3 id="arrange"><code>arrange()</code></h3>

      <p>
        dplyr's <code>arrange()</code> reorders rows.
        In tidyduck, <code>.arrange()</code> sets the <code>ORDER BY</code> clause.
        Use plain column names for ascending order, or wrap with <code>desc()</code> for descending — just like dplyr.
        NULLs always sort last, matching R's behavior:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr: most delayed flights first
flights |> arrange(desc(dep_delay))`} />

      <CopyCodeBlock language="typescript" command={`import { from, desc } from '$lib/db/duck.svelte';

// tidyduck: same pattern
const mostDelayed = flights.arrange(desc('dep_delay')).rows();

// multiple columns
const sorted = flights.arrange('carrier', desc('dep_delay')).rows();`} />

      <p>
        <code>.arrange()</code> returns a new builder — the original is unmodified.
        It applies to <code>.rows()</code> and <code>.head()</code>. For grouped queries, use <code>.sql()</code> with <code>ORDER BY</code> directly.
      </p>

      <!-- distinct -->
      <h3 id="distinct"><code>distinct()</code></h3>

      <p>
        dplyr's <code>distinct()</code> finds unique values.
        In tidyduck, <code>.distinct(col)</code> returns a reactive list of unique values for a single column — perfect for populating dropdowns and filter controls:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr: unique carriers
flights |> distinct(carrier)`} />

      <CopyCodeBlock language="typescript" command={`const carriers = flights.distinct('carrier');
// carriers.items → ['AA', 'B6', 'DL', 'EV', 'UA', ...]`} />

      <Distinct {flights} badge="live 2.4" />

      <p class="tip">
        <strong>Note.</strong> <code>.distinct()</code> currently works on a single column and returns sorted, non-null values.
        For multi-column distinct, use <code>.sql()</code>.
      </p>

      <!-- count -->
      <h3 id="count"><code>count()</code></h3>

      <p>
        In dplyr, <code>count()</code> is overloaded: with no arguments it gives the total number of rows,
        and with column names it gives grouped counts sorted in descending order.
        tidyduck works the same way:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr: count by origin and destination, sorted
flights |> count(origin, dest, sort = TRUE)`} />

      <CopyCodeBlock language="typescript" command={`const byRoute = flights.count('origin', 'dest');
// byRoute.rows → [{ origin: 'JFK', dest: 'LAX', n: 11262 }, ...]`} />

      <Count {flights} badge="live 2.5" />
    </section>

    <!-- ============================================================ -->
    <section id="columns">
      <LinkableHeader id="columns">Columns</LinkableHeader>

      <p>
        In dplyr, <code>select()</code> picks columns, <code>mutate()</code> creates new ones, and <code>rename()</code> changes names.
        In tidyduck, column operations happen through SQL expressions in <code>.sql()</code>:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr: create new columns
flights |> mutate(
  speed = distance / air_time * 60,
  gain = dep_delay - arr_delay
)`} />

      <CopyCodeBlock language="typescript" command={`// tidyduck: select + mutate via .sql()
const withSpeed = flights
  .sql((where) => \`
    SELECT year, month, day, carrier, dest,
      distance / air_time * 60 AS speed,
      dep_delay - arr_delay AS gain
    FROM 'nycflights13_flights.parquet'
    \${where}
  \`);`} />

      <p>
        The <code>.rows()</code> method always does <code>SELECT *</code>.
        When you need specific columns or computed columns, reach for <code>.sql()</code>.
        Column-level verbs (<code>.select()</code>, <code>.mutate()</code>, <code>.rename()</code>) are planned as future additions to the builder API.
      </p>
    </section>

    <!-- ============================================================ -->
    <section id="groups">
      <LinkableHeader id="groups">Groups</LinkableHeader>

      <p>
        In dplyr, <code>group_by()</code> + <code>summarize()</code> is the core pattern for computing aggregates per group.
        In tidyduck, grouped operations use <code>.count()</code> for counting and <code>.summarize()</code> for custom aggregations.
      </p>

      <h3 id="summarize"><code>summarize()</code></h3>

      <p>
        The <code>.summarize()</code> method takes a dictionary of <code>{'{alias: "SQL_EXPRESSION"}'}</code> pairs:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr
flights |> summarize(
  avg_delay = mean(arr_delay, na.rm = TRUE),
  max_delay = max(arr_delay, na.rm = TRUE),
  n = n()
)`} />

      <CopyCodeBlock language="typescript" command={`const stats = flights.summarize({
  avg_delay: 'ROUND(AVG(arr_delay), 2)',
  max_delay: 'MAX(arr_delay)',
  total: 'COUNT(*)'
});`} />

      <SummarizeStats {flights} badge="live 4.1" />

      <p>
        For <strong>grouped summaries</strong>, combine with <code>.sql()</code>:
      </p>

      <CopyCodeBlock language="r" command={`# dplyr: average delay by destination
flights |>
  group_by(dest) |>
  summarize(avg_delay = mean(arr_delay, na.rm = TRUE), n = n()) |>
  filter(n > 100)`} />

      <CopyCodeBlock language="typescript" command={`const byDest = flights.sql((where) => \`
  SELECT dest,
    ROUND(AVG(arr_delay), 1) AS avg_delay,
    COUNT(*) AS n
  FROM 'nycflights13_flights.parquet'
  \${where}
  GROUP BY dest
  HAVING COUNT(*) > 100
  ORDER BY avg_delay DESC
\`);`} />

      <SummarizeDest {flights} badge="live 4.2" />

      <h3 id="count-groups">Grouped <code>count()</code></h3>

      <CopyCodeBlock language="r" command={`# dplyr
flights |> count(carrier, sort = TRUE)`} />

      <CopyCodeBlock language="typescript" command={`const byCarrier = flights.count('carrier');`} />

      <GroupedCount {flights} badge="live 4.3" />
    </section>

    <!-- ============================================================ -->
    <section id="putting-it-together" class="closing">
      <LinkableHeader id="putting-it-together">Putting It All Together</LinkableHeader>

      <p>
        The real power of tidyduck is that every query is <strong>reactive</strong>.
        Bind your Svelte state to the builder, and the UI updates automatically when filters change.
        Try it — filter by carrier and search for an airport:
      </p>

      <Demo {flights} />

      <CopyCodeBlock language="svelte" command={`<script lang="ts">
  import { from, or, ilike } from '$lib/db/duck.svelte';

  const flights = from("'nycflights13_flights.parquet'");

  let search = $state('');
  let selectedCarriers = $state<string[]>([]);

  const q = flights
    .in('carrier', () => selectedCarriers)
    .where(() => or(
      ilike('origin', search),
      ilike('dest', search)
    ));

  const total  = q.count();
  const byDest = q.count('dest');
<\/script>

<p>{total.value} flights match your filters</p>

{#each byDest.rows.slice(0, 10) as route}
  <p>{route.dest}: {route.n}</p>
{/each}`} />

      <p>
        No <code>useEffect</code>. No manual query invalidation.
        Change <code>search</code> or <code>selectedCarriers</code>, and every materialized query re-runs automatically.
      </p>

      <div class="comparison-box">
        <h4>Quick reference: dplyr → tidyduck</h4>
        <table class="docs-table">
          <thead><tr><th>dplyr</th><th>tidyduck</th></tr></thead>
          <tbody>
            <tr><td><code>filter(col == val)</code></td><td><code>.eq('col', () => val)</code></td></tr>
            <tr><td><code>filter(col %in% c(...))</code></td><td><code>.in('col', () => [...])</code></td></tr>
            <tr><td><code>filter(col >= lo & col {'<='} hi)</code></td><td><code>.between('col', () => [lo, hi])</code></td></tr>
            <tr><td><code>filter(str_detect(col, pat))</code></td><td><code>.ilike('col', () => pat)</code></td></tr>
            <tr><td><code>filter(a | b)</code></td><td><code>.where(() => or(a, b))</code></td></tr>
            <tr><td><code>arrange(desc(col))</code></td><td><code>.arrange(desc('col'))</code></td></tr>
            <tr><td><code>distinct(col)</code></td><td><code>.distinct('col')</code></td></tr>
            <tr><td><code>count(col, sort=T)</code></td><td><code>.count('col')</code></td></tr>
            <tr><td><code>summarize(avg = mean(x))</code></td><td><code>.summarize({'{ avg: "AVG(x)" }'})</code></td></tr>
            <tr><td><code>group_by() |> summarize()</code></td><td><code>.sql(w => `... GROUP BY ...`)</code></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </article>
</div>

<style>
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  .breadcrumb a {
    color: #6b7280;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb .separator {
    color: var(--vcsi-gray-400);
  }

  .breadcrumb .current {
    color: var(--vcsi-gray-600);
  }

  .subtitle {
    color: var(--vcsi-gray-600);
    font-size: 1.1rem;
    margin: 0 0 2rem;
    line-height: 1.6;
  }

  section {
    margin: 3rem 0;
  }

  h3 {
    margin-top: 2.5rem;
  }

  h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  /* ── Comparison box ── */
  .comparison-box {
    border: 1px solid var(--vcsi-border);
    border-radius: 8px;
    padding: 1.25rem;
    margin: 1.5rem 0;
    background: var(--vcsi-gray-50);
  }

  .comparison-box h4 {
    margin: 0 0 1rem;
    font-size: 0.95rem;
  }

  .comparison-box .docs-table {
    margin: 0;
  }

  .closing {
    margin-bottom: 4rem;
  }

  /* ── Dark mode ── */
  :global(.dark) .subtitle {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .breadcrumb a {
    color: #60a5fa;
  }

  :global(.dark) .breadcrumb .current {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .comparison-box {
    background: var(--vcsi-gray-900);
  }

</style>
