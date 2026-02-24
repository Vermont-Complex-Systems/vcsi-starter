<script lang="ts">
  import { base } from '$app/paths';
  import { CopyCodeBlock, CodeBlock } from '@the-vcsi/scrolly-kit';
  import LinkableHeader from '$lib/components/LinkableHeader.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import { database } from '$lib/db/duck.svelte';
  import HeadTable from './components/01-1_HeadTable.svelte';
  import GlimpseView from './components/01-2_GlimpseView.svelte';
  import DescribeTable from './components/01-3_DescribeTable.svelte';
  import FilterDelay from './components/02-1a_Filter.svelte';
  import FilterMonths from './components/02-1b_Filter.svelte';
  import FilterSearch from './components/02-1c_Filter.svelte';
  import Distinct from './components/02-3_Distinct.svelte';
  import Count from './components/02-4_Count.svelte';
  import MutateDemo from './components/03-1_Mutate.svelte';
  import SelectDemo from './components/03-2_Select.svelte';
  import RenameDemo from './components/03-3_Rename.svelte';
  import SummarizeStats from './components/04-1a_Summarize.svelte';
  import SummarizeDest from './components/04-1b_Summarize.svelte';
  import GroupedCount from './components/04-2_GroupedCount.svelte';
  import GroupedSummarize from './components/05-1_GroupedSummarize.svelte';
  import SliceMax from './components/05-2_SliceMax.svelte';
  import Demo from './components/05_Demo.svelte';
  import LeftJoin from './components/06-1_LeftJoin.svelte';
  import LeftJoinAirports from './components/06-2_LeftJoinAirports.svelte';
  import { formatNum } from './components/utils';

  const sections = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'rows', label: '2. Rows' },
    { id: 'columns', label: '3. Columns' },
    { id: 'the-pipe', label: '4. The Pipe' },
    { id: 'groups', label: '5. Groups' },
    { id: 'joins', label: '6. Joins' },
  ];

  const db = database({
    flights: 'flights.parquet',
    airlines: 'airlines.parquet',
    airports: 'airports.parquet',
    planes: 'planes.parquet',
    weather: 'weather.parquet'
  });
    
  const flights = db.from('flights');
  const totalCount = flights.count();
</script>

<svelte:head>
  <title>tidyduck - Extensions - scrolly-kit</title>
</svelte:head>


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
        <code>filter()</code>, <code>mutate()</code>, <code>select()</code>, <code>arrange()</code>, <code>count()</code>, <code>summarize()</code>.
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
        Place your data files in <code>static/data/</code>.
        For this guide, we use <code>flights.parquet</code>.
        Then import <code>database()</code> and register your tables — similar to Observable's <code>DuckDBClient.of()</code>:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      import { database } from '$lib/db/duck.svelte';

      const db = database({
        flights: 'flights.parquet'
      });

      const flights = db.from('flights');
      `} />

      <p>
        That's the tidyduck equivalent of <code>library(tidyverse)</code> and <code>flights</code>.
        The <code>database()</code> function creates a <strong>named registry</strong> that maps table names to parquet file paths in <code>static/data/</code>.
        Calling <code>db.from()</code> returns a <strong>query builder</strong> — nothing runs until you materialize it with a verb like <code>.rows()</code>.
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

      <CodeBlock filename="svelte" language="typescript" code={`const preview = flights.head();  // first 6 rows (default)`} />

      <HeadTable {flights} badge="live 1.1" />

      <p>
        For a transposed view showing every column with its type and sample values — like R's <code>glimpse()</code> — use <code>.glimpse()</code>:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      const info = flights.glimpse();
      // info.columns → [{ name, type, sample }, ...]
      // info.nRows, info.nCols
      `} />

      <GlimpseView {flights} badge="live 1.2" />

      <p>
        Finally, for a statistical overview of every column — like R's <code>summary()</code> or Observable's table summary — use <code>.describe()</code>.
        It runs DuckDB's <code>SUMMARIZE</code> under the hood, giving you min, max, quantiles, and null percentages in one call:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      const summary = flights.describe();
      // summary.rows → [{ column_name, column_type, min, max, q25, q50, q75, avg, ... }, ...]
      `} />

      <DescribeTable {flights} badge="live 1.3" />

      <!-- 1.3 dplyr basics -->
      <h3 id="dplyr-basics">dplyr basics</h3>

      <p>
        In dplyr, every verb takes a data frame as its first argument and returns a new data frame.
        The pipe <code>|></code> threads them together.
        In tidyduck, <code>db.from()</code> creates an immutable builder.
        Each method returns a <strong>new builder</strong> — the original is never modified:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // dplyr:  flights |> filter(...) |> arrange(...)
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
            <tr><td>Data source</td><td><code>flights</code> (tibble)</td><td><code>db.from('flights')</code></td></tr>
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

      <CodeBlock filename="r" language="r" code={`
      # dplyr: flights that departed more than 120 minutes late
      flights |> 
        filter(dep_delay > 120)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck
      const delayed = flights.where(() => "dep_delay > 120").rows();
      `} />

      <FilterDelay {flights} badge="live 2.1" />

      <p>
        The <code>.where()</code> method accepts any SQL expression. For common patterns, use the specialized helpers:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: flights in January or February
      flights |> filter(month %in% c(1, 2))
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck: .in() works for string columns
      // For numeric columns like month, use .where() with raw SQL:
      let selectedMonths = $state([1, 2]);

      const janFeb = flights
        .where(() => selectedMonths.length === 0
          ? null
          : \`month IN (\${selectedMonths.join(', ')})\`
        )
        .rows();
        `} />

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

      <CodeBlock filename="svelte" language="typescript" code={`
      // Search across multiple columns at once
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

      <CodeBlock filename="r" language="r" code={`
      # dplyr: most delayed flights first
      flights |> arrange(desc(dep_delay))
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      import { database, desc } from '$lib/db/duck.svelte';

      // tidyduck: same pattern
      const mostDelayed = flights.arrange(desc('dep_delay')).rows();

      // multiple columns
      const sorted = flights.arrange('carrier', desc('dep_delay')).rows();
      `} />

      <p>
        <code>.arrange()</code> returns a new builder — the original is unmodified.
        It applies to <code>.rows()</code> and <code>.head()</code>. For grouped queries, use <code>.sql()</code> with <code>ORDER BY</code> directly.
      </p>

      <!-- distinct -->
      <h3 id="distinct"><code>distinct()</code></h3>

      <p>
        dplyr's <code>distinct()</code> finds unique rows.
        In tidyduck, <code>.distinct()</code> is overloaded just like in dplyr:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: unique carriers
      flights |> distinct(carrier)
      # unique origin-dest combos
      flights |> distinct(origin, dest)`} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // Single column → { items } (flat array, perfect for dropdowns)
      const carriers = flights.distinct('carrier');
      // carriers.items → ['AA', 'B6', 'DL', 'EV', 'UA', ...]

      // Multiple columns → { rows } (unique combinations)
      const routes = flights.distinct('origin', 'dest');
      // routes.rows → [{ origin: 'EWR', dest: 'ALB' }, ...]

      // No args → all unique rows
      const unique = flights.distinct();`} />

      <Distinct {flights} badge="live 2.4" />

      <p class="tip">
        <strong>Note.</strong> Single-column <code>.distinct('col')</code> returns sorted, non-null values as a flat array — ideal for populating filter chips and dropdowns.
        Multi-column and no-arg forms return rows, like <code>.rows()</code>.
      </p>

      <!-- count -->
      <h3 id="count"><code>count()</code></h3>

      <p>
        In dplyr, <code>count()</code> is overloaded: with no arguments it gives the total number of rows,
        and with column names it gives grouped counts sorted in descending order.
        tidyduck works the same way:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: count by origin and destination, sorted
      flights |> count(origin, dest, sort = TRUE)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      const byRoute = flights.count('origin', 'dest');
      // byRoute.rows → [{ origin: 'JFK', dest: 'LAX', n: 11262 }, ...]
      `} />

      <Count {flights} badge="live 2.5" />
    </section>

    <!-- ============================================================ -->
    <section id="columns">
      <LinkableHeader id="columns">Columns</LinkableHeader>

      <p>
        The most important verbs that affect the columns without changing the rows are
        <code>mutate()</code> (creates new columns from existing ones),
        <code>select()</code> (picks which columns to keep), and
        <code>rename()</code> (changes column names).
        Here's how each maps to tidyduck.
      </p>

      <!-- mutate -->
      <h3 id="mutate"><code>mutate()</code></h3>

      <p>
        dplyr's <code>mutate()</code> adds new columns that are calculated from existing columns.
        In tidyduck, <code>.mutate()</code> takes an object of <code>{'{alias: "SQL expression"}'}</code> pairs and appends them to <code>SELECT *</code>:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr
      flights |> mutate(
        gain = dep_delay - arr_delay,
        speed = distance / air_time * 60
      )`} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck
      const withComputed = flights.mutate({
        gain: 'dep_delay - arr_delay',
        speed: 'ROUND(distance / air_time * 60, 1)'
      });
      // .rows() → SELECT *, dep_delay - arr_delay AS gain, ... FROM ...
      `} />

      <MutateDemo {flights} badge="live 3.1" />

      <p>
        Like all builder methods, <code>.mutate()</code> returns a new builder — the original is never modified.
        Multiple <code>.mutate()</code> calls accumulate:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // Chain multiple mutate calls
      const computed = flights
        .mutate({ gain: 'dep_delay - arr_delay' })
        .mutate({ hours: 'air_time / 60' });
        `} />

      <p class="tip">
        <strong>Keep or select.</strong> In dplyr, <code>.keep = "used"</code> retains only the columns used in the expression.
        In tidyduck, combine <code>.mutate()</code> with <code>.select()</code> to pick which columns to keep alongside your new ones.
      </p>

      <!-- select -->
      <h3 id="select"><code>select()</code></h3>

      <p>
        dplyr's <code>select()</code> lets you zoom in on specific columns.
        In tidyduck, <code>.select()</code> replaces <code>SELECT *</code> with your chosen columns:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: select columns by name
      flights |> select(year, month, day)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck
      const subset = flights.select('year', 'month', 'day');
      // .rows() → SELECT year, month, day FROM ...
      `} />

      <SelectDemo {flights} badge="live 3.2" />

      <p>
        You can also rename columns as you select them, using SQL's <code>AS</code> syntax — just like dplyr's <code>select(new_name = old_name)</code>:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // Rename while selecting
      const renamed = flights.select('tailnum AS tail_num', 'carrier', 'dest');
      `} />

      <p>
        For dplyr-style helpers like <code>starts_with()</code> or <code>contains()</code>, use DuckDB's <code>COLUMNS</code> expression in <code>.sql()</code>:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // DuckDB COLUMNS regex — like select(contains("delay"))
      const delays = flights.sql((where) =>
        \`SELECT COLUMNS('.*delay.*') FROM 'flights.parquet' \${where}\`
      );
      `} />

      <!-- rename -->
      <h3 id="rename"><code>rename()</code></h3>

      <p>
        dplyr's <code>rename()</code> changes column names while keeping all columns.
        In tidyduck, <code>.rename()</code> uses DuckDB's <code>EXCLUDE</code> syntax under the hood:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr
      flights |> rename(tail_num = tailnum)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck
      const renamed = flights.rename({ tail_num: 'tailnum' });
      // .rows() → SELECT * EXCLUDE (tailnum), tailnum AS tail_num FROM ...
      `} />

      <RenameDemo {flights} badge="live 3.3" />

      <p class="tip">
        <strong>Note.</strong> dplyr also has <code>relocate()</code> to move columns around.
        In browser-side data analysis, column order rarely matters since you control how data is displayed in your Svelte components.
        If you need a specific order, use <code>.select()</code> to list columns in the desired sequence.
      </p>
    </section>

    <!-- ============================================================ -->
    <section id="the-pipe">
      <LinkableHeader id="the-pipe">The Pipe</LinkableHeader>

      <p>
        In R, the pipe <code>|></code> lets you chain verbs into readable pipelines.
        In tidyduck, <strong>method chaining is the pipe</strong>.
        Because each method returns a new builder, you can thread operations together naturally:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: find fastest flights to Houston
      flights |>
        filter(dest == "IAH") |>
        mutate(speed = distance / air_time * 60) |>
        select(year:day, dep_time, carrier, flight, speed) |>
        arrange(desc(speed))
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck: same pipeline
      import { database, desc } from '$lib/db/duck.svelte';

      const fastest = flights
        .where(() => "dest = 'IAH'")
        .mutate({ speed: 'ROUND(distance / air_time * 60, 1)' })
        .select('year', 'month', 'day', 'dep_time', 'carrier', 'flight', 'speed')
        .arrange(desc('speed'))
        .head(10);
      `} />

      <p>
        Even though this pipeline has five steps, it's easy to read because each method starts a new line.
        Without chaining, you'd need to write raw SQL:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // Without the builder — same query, harder to compose
      const fastest = duck(() => \`
        SELECT year, month, day, dep_time, carrier, flight,
          ROUND(distance / air_time * 60, 1) AS speed
        FROM 'flights.parquet'
        WHERE dest = 'IAH'
        ORDER BY speed DESC
        LIMIT 10
      \`);`} />

      <p>
        The builder approach has two advantages: <strong>readability</strong> (each verb is a clear step)
        and <strong>composability</strong> (you can fork a builder to create multiple views of the same data):
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // Fork from a shared base
      const houston = flights.where(() => "dest = 'IAH'");

      const topCarriers = houston.count('carrier');  // who flies there most?
      const delays      = houston.summarize({ avg: 'ROUND(AVG(arr_delay), 1)' });
      const fastest     = houston
        .mutate({ speed: 'ROUND(distance / air_time * 60, 1)' })
        .arrange(desc('speed'))
        .head(5);
      `} />
    </section>

    <!-- ============================================================ -->
    <section id="groups">
      <LinkableHeader id="groups">Groups</LinkableHeader>

      <p>
        So far you've learned about functions that work with rows and columns.
        The builder gets even more powerful when you add in the ability to work with <strong>groups</strong>.
        In this section, we'll focus on <code>group_by()</code>, <code>summarize()</code>, and the <code>slice_</code> family.
      </p>

      <!-- group_by -->
      <h3 id="group-by"><code>group_by()</code></h3>

      <p>
        In dplyr, <code>group_by()</code> is a separate step that marks a data frame for subsequent grouped operations.
        In tidyduck, there's no separate <code>group_by()</code> — instead, <strong>grouping is always per-operation</strong>,
        just like dplyr's newer <code>.by</code> argument.
        You pass grouping columns directly to <code>.summarize()</code>, <code>.count()</code>, or <code>.sliceMax()</code>:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: two equivalent ways
      flights |> group_by(month) |> summarize(avg = mean(dep_delay, na.rm = TRUE))
      flights |> summarize(avg = mean(dep_delay, na.rm = TRUE), .by = month)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck: grouping is always inline (like .by)
      const monthly = flights.summarize({
        avg_delay: 'ROUND(AVG(dep_delay), 1)'
      }, 'month');
      `} />

      <p>
        This means you never need to <code>ungroup()</code> — each operation is self-contained.
        This is simpler and avoids the common dplyr pitfall of forgetting to ungroup.
      </p>

      <!-- summarize -->
      <h3 id="summarize"><code>summarize()</code></h3>

      <p>
        The <code>.summarize()</code> method takes a dictionary of <code>{'{alias: "SQL_EXPRESSION"}'}</code> pairs.
        Without a <code>by</code> argument, it aggregates the whole table:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: overall summary
      flights |> summarize(
        avg_delay = mean(arr_delay, na.rm = TRUE),
        max_delay = max(arr_delay, na.rm = TRUE),
        n = n()
      )
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      const stats = flights.summarize({
        avg_delay: 'ROUND(AVG(arr_delay), 2)',
        max_delay: 'MAX(arr_delay)',
        total: 'COUNT(*)'
      });
      `} />

      <SummarizeStats {flights} badge="live 5.1" />

      <p>
        Add a <code>by</code> argument to group — the result has one row per group, sorted by the grouping columns:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: grouped summary
      flights |>
        group_by(month) |>
        summarize(
          avg_delay = mean(dep_delay, na.rm = TRUE),
          n = n()
        )
        `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck: pass grouping column(s) as second argument
      const monthly = flights.summarize({
        avg_delay: 'ROUND(AVG(dep_delay), 1)',
        n: 'COUNT(*)'
      }, 'month');
      `} />

      <GroupedSummarize {flights} badge="live 5.2" />

      <p class="tip">
        <strong>A note on missing values.</strong> In R, <code>mean(x)</code> returns <code>NA</code> if any value is missing — you must explicitly opt in with <code>na.rm = TRUE</code>.
        SQL takes the opposite default: aggregate functions like <code>AVG</code>, <code>SUM</code>, <code>MIN</code>, and <code>MAX</code> silently skip <code>NULL</code>s.
        This is convenient, but means missing data won't loudly announce itself the way R encourages.
        If your analysis depends on understanding missingness, use <code>.describe()</code> to check <code>null_percentage</code> per column before aggregating.
      </p>

      <p>
        For <strong>multiple grouping variables</strong>, pass an array:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // Group by origin and destination
      const byRoute = flights.summarize({
        avg_delay: 'ROUND(AVG(arr_delay), 1)',
        n: 'COUNT(*)'
      }, ['origin', 'dest']);
      `} />

      <p>
        In dplyr, you can keep piping after <code>summarize()</code> — e.g., <code>filter(n > 100)</code> to drop small groups.
        In tidyduck, <code>.summarize()</code> is a <strong>terminal verb</strong> that materializes results, so you can't chain further.
        For post-aggregation filtering (<code>HAVING</code>) or custom ordering, use <code>.sql()</code> — it gives you full SQL and still respects your builder's <code>WHERE</code> clause:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: filter after grouping
      flights |>
        group_by(dest) |>
        summarize(avg_delay = mean(arr_delay, na.rm = TRUE), n = n()) |>
        filter(n > 100)
        `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck: use .sql() for HAVING and custom ordering
      const byDest = flights.sql((where) => \`
        SELECT dest,
          ROUND(AVG(arr_delay), 1) AS avg_delay,
          COUNT(*) AS n
        FROM 'flights.parquet'
        \${where}
        GROUP BY dest
        HAVING COUNT(*) > 100
        ORDER BY avg_delay DESC
      \`);
      `} />

      <SummarizeDest {flights} badge="live 5.3" />

      <!-- slice functions -->
      <h3 id="slice"><code>sliceMax()</code> and <code>sliceMin()</code></h3>

      <p>
        dplyr has a family of <code>slice_</code> functions for extracting specific rows within groups.
        The most useful are <code>slice_max()</code> and <code>slice_min()</code>, which find the rows with the largest or smallest values.
        tidyduck provides <code>.sliceMax()</code> and <code>.sliceMin()</code>:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr: most delayed flight per destination
      flights |>
        group_by(dest) |>
        slice_max(arr_delay, n = 1)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck: same, with per-operation grouping
      const mostDelayed = flights.sliceMax('arr_delay', 1, 'dest');

      // Without grouping — just the overall top N
      const top5 = flights.sliceMax('arr_delay', 5);

      // Bottom N works the same way
      const shortest = flights.sliceMin('air_time', 5);
      `} />

      <SliceMax {flights} badge="live 5.4" />

      <p>
        By default, tidyduck breaks ties arbitrarily (one row per rank).
        Like dplyr's <code>with_ties</code> argument, pass <code>{'{ withTies: true }'}</code> to keep all tied rows:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // Keep all ties (uses RANK instead of ROW_NUMBER)
      const mostDelayed = flights.sliceMax('arr_delay', 1, 'dest', { withTies: true });
      `} />

      <!-- count -->
      <h3 id="count-groups">Grouped <code>count()</code></h3>

      <p>
        <code>.count()</code> with column names is the quickest way to see group sizes, sorted in descending order — just like dplyr:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr
      flights |> count(carrier, sort = TRUE)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      const byCarrier = flights.count('carrier');
      // byCarrier.rows → [{ carrier: 'UA', n: 58665 }, { carrier: 'B6', n: 54635 }, ...]
      `} />

      <GroupedCount {flights} badge="live 5.5" />

      <p>
        Multiple grouping variables work too — you can count by as many columns as you need:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      // Daily flight counts
      const daily = flights.count('year', 'month', 'day');
      `} />
    </section>

    <!-- ============================================================ -->
    <section id="joins">
      <LinkableHeader id="joins">Joins</LinkableHeader>

      <p>
        It's rare that an analysis involves only a single table.
        The nycflights13 dataset actually has five related tables — <code>flights</code>, <code>airlines</code>, <code>airports</code>, <code>planes</code>, and <code>weather</code> — connected through shared keys like <code>carrier</code>, <code>tailnum</code>, and <code>faa</code>.
      </p>

      <p>
        This is where <code>database()</code> shines.
        Register all your tables upfront, then use <code>db.sql()</code> for joins:
      </p>

      <CodeBlock filename="svelte" language="typescript" code={`
      import { database } from '$lib/db/duck.svelte';

      const db = database({
        flights: 'flights.parquet',
        airlines: 'airlines.parquet',
        airports: 'airports.parquet',
        planes: 'planes.parquet',
        weather: 'weather.parquet'
      });
      `} />

      <!-- mutating joins -->
      <h3 id="mutating-joins">Mutating joins</h3>

      <p>
        A <strong>mutating join</strong> adds columns from one table based on matching keys — like dplyr's <code>left_join()</code>.
        In tidyduck, you write SQL joins via <code>db.sql()</code>.
      </p>

      <p>For example, adding the full airline name to flights:</p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr
      flights2 |> left_join(airlines)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck
      const withAirline = db.sql(t =>
        \`SELECT f.*, a.name as airline_name
        FROM \${t.flights} f
        LEFT JOIN \${t.airlines} a ON f.carrier = a.carrier\`
      );
      `} />

      <LeftJoin {db} badge="live 6.1" />

      <p>Or finding out what size of plane was flying:</p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr
      flights2 |>
        left_join(planes |> select(tailnum, type, engines, seats))
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck
      const withPlane = db.sql(t =>
        \`SELECT f.year, f.month, f.day, f.carrier, f.flight,
                p.type, p.engines, p.seats
        FROM \${t.flights} f
        LEFT JOIN \${t.planes} p ON f.tailnum = p.tailnum\`
      );
      `} />

      <p>
        When keys have <strong>different names</strong> across tables, you specify them explicitly in the <code>ON</code> clause.
        For example, joining flights to airports by destination:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr — keys have different names
      flights2 |> left_join(airports, join_by(dest == faa))
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck — ON spells out the mapping
      const withAirport = db.sql(t =>
        \`SELECT f.*, a.name, a.lat, a.lon
        FROM \${t.flights} f
        LEFT JOIN \${t.airports} a ON f.dest = a.faa\`
      );
      `} />

      <LeftJoinAirports {db} badge="live 6.2" />

      <p>
        When <code>LEFT JOIN</code> fails to find a match, it fills the new columns with <code>NULL</code> — just like dplyr fills with <code>NA</code>.
        For example, filtering to a specific tail number that's missing from the <code>planes</code> table:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr
      flights2 |>
        filter(tailnum == "N3ALAA") |>
        left_join(planes |> select(tailnum, type, engines, seats))
        `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck — combine builder filter with db.sql() join
      const mystery = db.sql(t =>
        \`SELECT f.year, f.time_hour, f.origin, f.dest, f.tailnum, f.carrier,
                p.type, p.engines, p.seats
        FROM \${t.flights} f
        LEFT JOIN \${t.planes} p ON f.tailnum = p.tailnum
        WHERE f.tailnum = 'N3ALAA'
        LIMIT 6\`
      );
      `} />

      <p>
        The <code>type</code>, <code>engines</code>, and <code>seats</code> columns are all <code>NULL</code> — plane <code>N3ALAA</code> isn't in the <code>planes</code> table.
      </p>

      <div class="comparison-box">
        <h4>Specifying join keys</h4>
        <p>
          In dplyr, <code>left_join()</code> automatically matches on shared column names (a "natural" join).
          In SQL you're always explicit: <code>ON f.carrier = a.carrier</code>.
          This avoids the pitfall where <code>flights</code> and <code>planes</code> both have a <code>year</code> column meaning different things.
        </p>
      </div>

      <!-- filtering joins -->
      <h3 id="filtering-joins">Filtering joins</h3>

      <p>
        <strong>Filtering joins</strong> keep or drop rows based on whether they match another table — without adding columns.
      </p>

      <p>
        A <strong>semi-join</strong> keeps rows in <code>x</code> that have a match in <code>y</code>.
        For example, finding airports that are actual destinations:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr
      airports |> semi_join(flights2, join_by(faa == dest))`} />

            <CodeBlock filename="svelte" language="typescript" code={
      `// tidyduck — semi-join via WHERE EXISTS
      const destAirports = db.sql(t =>
        \`SELECT a.*
        FROM \${t.airports} a
        WHERE EXISTS (
          SELECT 1 FROM \${t.flights} f WHERE f.dest = a.faa
        )\`
      );
      `} />

      <p>
        An <strong>anti-join</strong> is the opposite: rows in <code>x</code> that <em>don't</em> match <code>y</code>.
        Useful for finding missing data:
      </p>

      <CodeBlock filename="r" language="r" code={`
      # dplyr — destinations not in airports table
      flights2 |>
        anti_join(airports, join_by(dest == faa)) |>
        distinct(dest)
      `} />

      <CodeBlock filename="svelte" language="typescript" code={`
      // tidyduck — anti-join via WHERE NOT EXISTS
      const missingAirports = db.sql<{ dest: string }>(t =>
        \`SELECT DISTINCT f.dest
        FROM \${t.flights} f
        WHERE NOT EXISTS (
          SELECT 1 FROM \${t.airports} a WHERE a.faa = f.dest
        )\`
      );
      `} />

      <div class="comparison-box">
        <h4>dplyr joins → tidyduck SQL</h4>
        <table class="docs-table">
          <thead><tr><th>dplyr</th><th>tidyduck (<code>db.sql()</code>)</th></tr></thead>
          <tbody>
            <tr><td><code>left_join(y)</code></td><td><code>LEFT JOIN y ON ...</code></td></tr>
            <tr><td><code>inner_join(y)</code></td><td><code>INNER JOIN y ON ...</code></td></tr>
            <tr><td><code>right_join(y)</code></td><td><code>RIGHT JOIN y ON ...</code></td></tr>
            <tr><td><code>full_join(y)</code></td><td><code>FULL OUTER JOIN y ON ...</code></td></tr>
            <tr><td><code>semi_join(y)</code></td><td><code>WHERE EXISTS (SELECT 1 FROM y ...)</code></td></tr>
            <tr><td><code>anti_join(y)</code></td><td><code>WHERE NOT EXISTS (SELECT 1 FROM y ...)</code></td></tr>
            <tr><td><code>cross_join(y)</code></td><td><code>CROSS JOIN y</code></td></tr>
          </tbody>
        </table>
      </div>

      <p>
        Joins are where the builder hands off to raw SQL — and that's by design.
        SQL's <code>JOIN</code> syntax is already concise and universally understood.
        The <code>database()</code> registry handles the tedious part (file paths), and <code>db.sql()</code> gives you the full power of DuckDB's SQL engine, including inequality joins, <code>ASOF</code> joins, and CTEs.
      </p>
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

      <CodeBlock filename="svelte" language="svelte" code={`
      <script lang="ts">
      import { database, or, ilike } from '$lib/db/duck.svelte';

      const db = database({ flights: 'flights.parquet' });
      const flights = db.from('flights');

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
    {/each}
    `} />

      <p>
        No <code>useEffect</code>. No manual query invalidation.
        Change <code>search</code> or <code>selectedCarriers</code>, and every materialized query re-runs automatically.
      </p>

      <div class="comparison-box">
        <h4>Quick reference: dplyr → tidyduck</h4>
        <table class="docs-table">
          <thead><tr><th>dplyr</th><th>tidyduck</th></tr></thead>
          <tbody>
            <tr><td><code>DBI::dbConnect(...)</code></td><td><code>database({'{ name: "file.parquet" }'})</code></td></tr>
            <tr><td><code>filter(col == val)</code></td><td><code>.eq('col', () => val)</code></td></tr>
            <tr><td><code>filter(col %in% c(...))</code></td><td><code>.in('col', () => [...])</code></td></tr>
            <tr><td><code>filter(col >= lo & col {'<='} hi)</code></td><td><code>.between('col', () => [lo, hi])</code></td></tr>
            <tr><td><code>filter(str_detect(col, pat))</code></td><td><code>.ilike('col', () => pat)</code></td></tr>
            <tr><td><code>filter(a | b)</code></td><td><code>.where(() => or(a, b))</code></td></tr>
            <tr><td><code>arrange(desc(col))</code></td><td><code>.arrange(desc('col'))</code></td></tr>
            <tr><td><code>distinct(col)</code></td><td><code>.distinct('col')</code></td></tr>
            <tr><td><code>mutate(speed = dist/time)</code></td><td><code>.mutate({'{ speed: "dist/time" }'})</code></td></tr>
            <tr><td><code>select(year, month)</code></td><td><code>.select('year', 'month')</code></td></tr>
            <tr><td><code>rename(new = old)</code></td><td><code>.rename({'{ new: "old" }'})</code></td></tr>
            <tr><td><code>count(col, sort=T)</code></td><td><code>.count('col')</code></td></tr>
            <tr><td><code>summarize(avg = mean(x))</code></td><td><code>.summarize({'{ avg: "AVG(x)" }'})</code></td></tr>
            <tr><td><code>group_by(col) |> summarize()</code></td><td><code>.summarize({'{...}'}, 'col')</code></td></tr>
            <tr><td><code>slice_max(col, n=1, by=grp)</code></td><td><code>.sliceMax('col', 1, 'grp')</code></td></tr>
            <tr><td><code>slice_max(with_ties=TRUE)</code></td><td><code>.sliceMax('col', 1, 'grp', {'{ withTies: true }'})</code></td></tr>
            <tr><td><code>slice_min(col, n=1, by=grp)</code></td><td><code>.sliceMin('col', 1, 'grp')</code></td></tr>
            <tr><td><code>left_join(y, join_by(k))</code></td><td><code>db.sql(t => `... LEFT JOIN ...`)</code></td></tr>
            <tr><td><code>semi_join(y)</code></td><td><code>db.sql(t => `... WHERE EXISTS ...`)</code></td></tr>
            <tr><td><code>anti_join(y)</code></td><td><code>db.sql(t => `... WHERE NOT EXISTS ...`)</code></td></tr>
          </tbody>
        </table>
      </div>
    </section>
</article>

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
