// src/lib/db/duck.svelte.ts
//
// Reactive query builder for DuckDB-WASM + Svelte 5.
//
// Two layers:
//   1. Composable SQL fragment helpers (ilike, between, inList, eq, or, and)
//   2. DuckQuery builder that chains filters and materializes reactive queries
//
// Usage:
//   import { from, ilike, or } from '$lib/db/duck.svelte';
//
//   const src = from(`'my-file.parquet'`);
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

// ── Query builder ──

type FilterFn = () => string | null;

class DuckQuery {
  _table: string;
  _filters: FilterFn[];

  constructor(table: string, filters: FilterFn[] = []) {
    this._table = table;
    this._filters = filters;
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

  // ── Materializations (each calls duck/duck_val/duck_col internally) ──

  /** SELECT * → { rows, loading, error, queryTime, refresh } */
  rows<T = Record<string, unknown>>() {
    return duck<T>(() => `SELECT * FROM ${this._table} ${this._where()}`);
  }

  /** First N rows (like R's tibble print). Default 6. */
  head<T = Record<string, unknown>>(n: number = 6) {
    return duck<T>(() => `SELECT * FROM ${this._table} ${this._where()} LIMIT ${n}`);
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

  /** SELECT DISTINCT col → { items, loading, error } */
  distinct<T = string>(col: string) {
    return duck_col<T>(() =>
      `SELECT DISTINCT ${col} FROM ${this._table} ${this._where([`${col} IS NOT NULL`])} ORDER BY ${col}`
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

  /** SELECT expr1 as alias1, expr2 as alias2, ... → { rows, loading, error } */
  summarize(aggs: Record<string, string>) {
    const select = Object.entries(aggs)
      .map(([alias, expr]) => `${expr} as ${alias}`)
      .join(', ');
    return duck(() => `SELECT ${select} FROM ${this._table} ${this._where()}`);
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
    return new DuckQuery(this._table, [...this._filters, filter]);
  }

  _clauses(): string[] {
    return this._filters.map(f => f()).filter((c): c is string => c != null);
  }

  _where(extraClauses: string[] = []): string {
    const all = [...this._clauses(), ...extraClauses];
    return all.length > 0 ? `WHERE ${all.join(' AND ')}` : '';
  }
}

/** Create a reactive query builder for a DuckDB table/parquet source. */
export function from(table: string): DuckQuery {
  return new DuckQuery(table);
}
