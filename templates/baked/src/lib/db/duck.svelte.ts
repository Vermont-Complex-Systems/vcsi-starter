// src/lib/db/duck.svelte.ts
//
// Reactive query builder for DuckDB-WASM + Svelte 5.
//
// Two layers:
//   1. Composable SQL fragment helpers (ilike, between, inList, eq, or, and)
//   2. DuckQuery builder that chains filters and materializes reactive queries
//
// Usage:
//   import { database, ilike, or } from '$lib/db/duck.svelte';
//
//   const db = database({
//     papers: 'my-file.parquet',
//   });
//
//   const src = db.from('papers');
//   const allRows = src.rows();
//
//   const q = src
//     .between('year', () => selectedYear)
//     .in('college', () => [...selectedColleges])
//     .where(() => or(
//       ilike('title', searchQuery),
//       ilike('ego_display_name', searchQuery)
//     ));
//
//   const filtered = q.rows();
//   const stats    = q.summarize({ n: 'COUNT(*)' });

import { duck, duck_val, duck_col } from './sql.svelte';

// ── SQL fragment helpers (pure functions, composable) ──

/** col ILIKE '%term%'. Returns null if value is empty. */
export function ilike(col: string, value: string): string | null {
  if (!value || !value.trim()) return null;
  return `${col} ILIKE '%${value.trim().replace(/'/g, "''")}%'`;
}

/**
 * col BETWEEN lo AND hi. Returns null if value is invalid.
 * Collapses to `col = val` when lo === hi.
 * Skips if value matches fullRange.
 */
export function between(col: string, value: number[], fullRange?: number[]): string | null {
  if (!value || value.length !== 2) return null;
  if (fullRange && value[0] === fullRange[0] && value[1] === fullRange[1]) return null;
  return value[0] === value[1]
    ? `${col} = ${value[0]}`
    : `${col} BETWEEN ${value[0]} AND ${value[1]}`;
}

/** col IN ('a', 'b', ...). Returns null if array is empty. */
export function inList(col: string, values: string[]): string | null {
  if (!values || values.length === 0) return null;
  const list = values.map(x => `'${String(x).replace(/'/g, "''")}'`).join(', ');
  return `${col} IN (${list})`;
}

/** col = value. Returns null if value is null/undefined. */
export function eq(col: string, value: unknown): string | null {
  if (value == null) return null;
  return typeof value === 'string'
    ? `${col} = '${value.replace(/'/g, "''")}'`
    : `${col} = ${value}`;
}

/** Combine clauses with OR. Filters out nulls. Returns null if none active. */
export function or(...clauses: (string | null)[]): string | null {
  const valid = clauses.filter((c): c is string => c != null);
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];
  return `(${valid.join(' OR ')})`;
}

/** Combine clauses with AND. Filters out nulls. Returns null if none active. */
export function and(...clauses: (string | null)[]): string | null {
  const valid = clauses.filter((c): c is string => c != null);
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];
  return `(${valid.join(' AND ')})`;
}

/** Mark a column for descending order in arrange(). Like R's desc(). */
export function desc(col: string): string {
  return `${col} DESC`;
}

// ── Query builder ──

type FilterFn = () => string | null;

class DuckQuery {
  _table: string;
  _filters: FilterFn[];
  _orderBy: string[];
  _selectCols: string[] | null;
  _mutations: [string, string][];

  constructor(
    table: string,
    filters: FilterFn[] = [],
    orderBy: string[] = [],
    selectCols: string[] | null = null,
    mutations: [string, string][] = []
  ) {
    this._table = table;
    this._filters = filters;
    this._orderBy = orderBy;
    this._selectCols = selectCols;
    this._mutations = mutations;
  }

  // ── Filter verbs (immutable — each returns a new DuckQuery) ──
  // These are sugar for .where(() => helper(col, valueFn()))

  /** col BETWEEN lo AND hi. Skips when value is empty or matches fullRangeFn. */
  between(col: string, valueFn: () => number[], fullRangeFn?: () => number[]) {
    return this._add(() => between(col, valueFn(), fullRangeFn?.()));
  }

  /** col IN ('a', 'b', ...). Skips when array is empty. */
  in(col: string, valueFn: () => string[]) {
    return this._add(() => inList(col, valueFn()));
  }

  /** col ILIKE '%term%'. Skips when string is empty. */
  ilike(col: string, valueFn: () => string) {
    return this._add(() => ilike(col, valueFn()));
  }

  /** col = value. Skips when value is null/undefined. */
  eq(col: string, valueFn: () => unknown) {
    return this._add(() => eq(col, valueFn()));
  }

  /** Arbitrary reactive clause. Return null to skip. */
  where(clauseFn: () => string | null) {
    return this._add(clauseFn);
  }

  /** ORDER BY columns. Use 'col' for ASC, desc('col') for DESC. NULLs sort last (like R). */
  arrange(...cols: string[]) {
    return new DuckQuery(this._table, this._filters, cols, this._selectCols, this._mutations);
  }

  // ── Column verbs (immutable — each returns a new DuckQuery) ──

  /** Pick specific columns. Like dplyr's select(). Use 'old AS new' to rename inline. */
  select(...cols: string[]) {
    return new DuckQuery(this._table, this._filters, this._orderBy, cols, this._mutations);
  }

  /** Add computed columns (keeps all existing). Like dplyr's mutate(). */
  mutate(exprs: Record<string, string>) {
    const newMuts: [string, string][] = Object.entries(exprs);
    return new DuckQuery(this._table, this._filters, this._orderBy, this._selectCols, [...this._mutations, ...newMuts]);
  }

  /** Rename columns. Like dplyr's rename(). Keeps all columns. */
  rename(mapping: Record<string, string>) {
    const excludes = Object.values(mapping);
    const aliases = Object.entries(mapping).map(([newName, oldCol]) => `${oldCol} AS ${newName}`);
    const select = `* EXCLUDE (${excludes.join(', ')}), ${aliases.join(', ')}`;
    return new DuckQuery(this._table, this._filters, this._orderBy, [select], this._mutations);
  }

  // ── Materializations (each calls duck/duck_val/duck_col internally) ──

  /** SELECT columns → { rows, loading, error, queryTime, refresh } */
  rows<T = Record<string, unknown>>() {
    return duck<T>(() => `SELECT ${this._buildSelect()} FROM ${this._table} ${this._where()} ${this._order()}`);
  }

  /** First N rows (like R's tibble print). Default 6. */
  head<T = Record<string, unknown>>(n: number = 6) {
    return duck<T>(() => `SELECT ${this._buildSelect()} FROM ${this._table} ${this._where()} ${this._order()} LIMIT ${n}`);
  }

  /**
   * Column statistics via SUMMARIZE (like R's summary() or Observable's table summary).
   * Returns { rows, loading, error } where each row is a column's stats:
   * column_name, column_type, min, max, approx_unique, avg, std, q25, q50, q75, count, null_percentage.
   */
  describe() {
    return duck<{
      column_name: string; column_type: string;
      min: string | null; max: string | null;
      approx_unique: number; avg: string | null; std: string | null;
      q25: string | null; q50: string | null; q75: string | null;
      count: number; null_percentage: number;
    }>(() => `SUMMARIZE SELECT * FROM ${this._table} ${this._where()}`);
  }

  /**
   * Column metadata + sample values (like R's glimpse()).
   * Returns { columns, nRows, nCols, loading, error }.
   */
  glimpse(sampleSize: number = 5) {
    const describe = duck<{ column_name: string; column_type: string }>(() =>
      `DESCRIBE SELECT * FROM ${this._table}`
    );
    const total = duck_val<number>(() =>
      `SELECT COUNT(*) FROM ${this._table} ${this._where()}`, 0
    );
    const sample = duck<Record<string, unknown>>(() =>
      `SELECT * FROM ${this._table} ${this._where()} LIMIT ${sampleSize}`
    );

    return {
      get columns(): { name: string; type: string; sample: unknown[] }[] {
        return describe.rows.map(col => ({
          name: col.column_name,
          type: col.column_type,
          sample: sample.rows.map(row => row[col.column_name])
        }));
      },
      get nRows() { return Number(total.value); },
      get nCols() { return describe.rows.length; },
      get loading() { return describe.loading || total.loading || sample.loading; },
      get error() { return describe.error || total.error || sample.error; }
    };
  }

  /** count() → scalar total. count('col1', 'col2') → grouped counts, sorted desc. */
  count(): { readonly value: number; readonly loading: boolean; readonly error: string | null };
  count(...cols: string[]): { readonly rows: Record<string, unknown>[]; readonly loading: boolean; readonly error: string | null; readonly queryTime: number; refresh: () => Promise<void> };
  count(...cols: string[]) {
    if (cols.length === 0) {
      return duck_val(() => `SELECT COUNT(*) FROM ${this._table} ${this._where()}`, 0);
    }
    const groupCols = cols.join(', ');
    return duck(() =>
      `SELECT ${groupCols}, COUNT(*) as n FROM ${this._table} ${this._where()} GROUP BY ${groupCols} ORDER BY n DESC`
    );
  }

  /** distinct('col') → { items } for dropdowns. distinct('a','b') → { rows } for unique combos. distinct() → all unique rows. */
  distinct<T = string>(col: string): { readonly items: T[]; readonly loading: boolean; readonly error: string | null };
  distinct(...cols: string[]): { readonly rows: Record<string, unknown>[]; readonly loading: boolean; readonly error: string | null; readonly queryTime: number; refresh: () => Promise<void> };
  distinct(...cols: string[]) {
    if (cols.length === 0) {
      return duck(() => `SELECT DISTINCT * FROM ${this._table} ${this._where()}`);
    }
    if (cols.length === 1) {
      const col = cols[0];
      return duck_col(() =>
        `SELECT DISTINCT ${col} FROM ${this._table} ${this._where([`${col} IS NOT NULL`])} ORDER BY ${col}`
      );
    }
    const colList = cols.join(', ');
    const notNull = cols.map(c => `${c} IS NOT NULL`);
    return duck(() =>
      `SELECT DISTINCT ${colList} FROM ${this._table} ${this._where(notNull)} ORDER BY ${colList}`
    );
  }

  /** SELECT MIN(col) → { value, loading, error } */
  min(col: string, defaultValue?: number) {
    return duck_val(() =>
      `SELECT MIN(${col}) FROM ${this._table} ${this._where([`${col} IS NOT NULL`])}`,
      defaultValue
    );
  }

  /** SELECT MAX(col) → { value, loading, error } */
  max(col: string, defaultValue?: number) {
    return duck_val(() =>
      `SELECT MAX(${col}) FROM ${this._table} ${this._where([`${col} IS NOT NULL`])}`,
      defaultValue
    );
  }

  /** Aggregate the whole table or per group. Like dplyr's summarize(.by = ...). */
  summarize(aggs: Record<string, string>, by?: string | string[]) {
    const select = Object.entries(aggs)
      .map(([alias, expr]) => `${expr} as ${alias}`)
      .join(', ');
    if (!by) {
      return duck(() => `SELECT ${select} FROM ${this._table} ${this._where()}`);
    }
    const groups = Array.isArray(by) ? by : [by];
    const groupCols = groups.join(', ');
    return duck(() =>
      `SELECT ${groupCols}, ${select} FROM ${this._table} ${this._where()} GROUP BY ${groupCols} ORDER BY ${groupCols}`
    );
  }

  /** Top N rows by column, optionally per group. Like dplyr's slice_max(). */
  sliceMax(col: string, n: number = 1, by?: string | string[], opts?: { withTies?: boolean }) {
    const rankFn = opts?.withTies ? 'RANK' : 'ROW_NUMBER';
    if (!by) {
      return duck(() =>
        `SELECT ${this._buildSelect()} FROM ${this._table} ${this._where()} ORDER BY ${col} DESC NULLS LAST LIMIT ${n}`
      );
    }
    const groups = Array.isArray(by) ? by : [by];
    const partition = groups.join(', ');
    return duck(() =>
      `SELECT ${this._buildSelect()} FROM ${this._table} ${this._where()} QUALIFY ${rankFn}() OVER (PARTITION BY ${partition} ORDER BY ${col} DESC NULLS LAST) <= ${n}`
    );
  }

  /** Bottom N rows by column, optionally per group. Like dplyr's slice_min(). */
  sliceMin(col: string, n: number = 1, by?: string | string[], opts?: { withTies?: boolean }) {
    const rankFn = opts?.withTies ? 'RANK' : 'ROW_NUMBER';
    if (!by) {
      return duck(() =>
        `SELECT ${this._buildSelect()} FROM ${this._table} ${this._where()} ORDER BY ${col} ASC NULLS LAST LIMIT ${n}`
      );
    }
    const groups = Array.isArray(by) ? by : [by];
    const partition = groups.join(', ');
    return duck(() =>
      `SELECT ${this._buildSelect()} FROM ${this._table} ${this._where()} QUALIFY ${rankFn}() OVER (PARTITION BY ${partition} ORDER BY ${col} ASC NULLS LAST) <= ${n}`
    );
  }

  /** Raw SQL with the builder's WHERE injected. */
  sql<T = Record<string, unknown>>(buildSQL: (where: string) => string) {
    return duck<T>(() => buildSQL(this._where()));
  }

  // ── Reactive getters ──

  /** Are any filters currently active? (reactive) */
  get isFiltered(): boolean {
    return this._clauses().length > 0;
  }

  /** The current WHERE clause as a string (reactive). Empty string if no filters. */
  get whereSQL(): string {
    return this._where();
  }

  // ── Internal ──

  _add(filter: FilterFn): DuckQuery {
    return new DuckQuery(this._table, [...this._filters, filter], this._orderBy, this._selectCols, this._mutations);
  }

  _clauses(): string[] {
    return this._filters.map(f => f()).filter((c): c is string => c != null);
  }

  _where(extraClauses: string[] = []): string {
    const all = [...this._clauses(), ...extraClauses];
    return all.length > 0 ? `WHERE ${all.join(' AND ')}` : '';
  }

  _buildSelect(): string {
    if (this._selectCols) {
      // When select is active, inline mutation expressions for matching aliases
      const mutMap = new Map(this._mutations);
      const cols = this._selectCols.map(col => {
        const expr = mutMap.get(col);
        return expr ? `${expr} AS ${col}` : col;
      });
      return cols.join(', ');
    }
    if (this._mutations.length === 0) return '*';
    const muts = this._mutations.map(([alias, expr]) => `${expr} AS ${alias}`).join(', ');
    return `*, ${muts}`;
  }

  _order(): string {
    if (this._orderBy.length === 0) return '';
    const clauses = this._orderBy.map(col => `${col} NULLS LAST`);
    return `ORDER BY ${clauses.join(', ')}`;
  }
}

/** Exported type so components can type props as `DuckQuery`. */
export type { DuckQuery };

/**
 * Create a named table registry (like Observable's DuckDBClient.of()).
 * Maps friendly names to parquet file paths, enabling `db.from('flights')`.
 *
 * Usage:
 *   const db = database({
 *     flights: 'nycflights13_flights.parquet',
 *     airports: 'airports.parquet'
 *   });
 *
 *   const q = db.from('flights');           // same builder API
 *   const joined = db.sql<T>(sql => ...);   // raw SQL with all tables available
 */
export function database(tables: Record<string, string>) {
  const registry = new Map(
    Object.entries(tables).map(([name, path]) => [
      name,
      path.startsWith("'") ? path : `'${path}'`
    ])
  );

  return {
    /** Get a DuckQuery builder for a registered table. */
    from(name: string): DuckQuery {
      const path = registry.get(name);
      if (!path) throw new Error(`Unknown table "${name}". Registered: ${[...registry.keys()].join(', ')}`);
      return new DuckQuery(path);
    },

    /** Raw SQL with access to all registered tables. Use table names directly in your query. */
    sql<T = Record<string, unknown>>(buildSQL: (tables: Record<string, string>) => string) {
      const tableMap = Object.fromEntries(registry);
      return duck<T>(() => buildSQL(tableMap));
    },

    /** List registered table names. */
    get tables(): string[] {
      return [...registry.keys()];
    }
  };
}
