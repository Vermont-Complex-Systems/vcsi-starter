// src/lib/db/sql.svelte.ts
import { getDB, registerParquet, loadExtension } from './duckdb.svelte';
import { untrack } from 'svelte';

interface QueryResult<T = Record<string, unknown>> {
  readonly rows: T[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly queryTime: number;
  refresh: () => Promise<void>;
}

// Extensions to load before any query executes (deferred until first browser query)
const pendingExtensions: string[] = [];
let extensionBarrier: Promise<void> | null = null;

/** Require a DuckDB extension (INSTALL + LOAD). Queries will wait for it. */
export function requireExtension(name: string) {
  if (!pendingExtensions.includes(name)) {
    pendingExtensions.push(name);
    extensionBarrier = null; // reset so next query re-resolves
  }
}

/** Lazily load all required extensions (only runs in browser, on first query). */
async function ensureExtensions() {
  if (pendingExtensions.length === 0) return;
  if (!extensionBarrier) {
    extensionBarrier = Promise.all(
      pendingExtensions.map(name => loadExtension(name))
    ).then(() => {});
  }
  await extensionBarrier;
}

// Deduplicate concurrent parquet registrations (5 duck() queries fire on mount)
const registering = new Map<string, Promise<void>>();

async function ensureParquet(sql: string) {
  const matches = sql.matchAll(/'([^']+\.parquet)'/g);
  for (const [, filename] of matches) {
    if (!registering.has(filename)) {
      registering.set(filename, registerParquet(filename, `/data/${filename}`));
    }
    await registering.get(filename);
  }
}


export function duck<T = Record<string, unknown>>(
  buildSQL: () => string
): QueryResult<T> {
  let rows = $state<T[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let queryTime = $state(0);

  async function execute() {
    const sql = buildSQL();
    loading = true;
    error = null;
    const start = performance.now();

    try {
      await ensureExtensions();
      await ensureParquet(sql);
      const conn = await getDB();
      const result = await conn.query(sql);
      rows = result.toArray().map((r: any) => {
        const json = r.toJSON();
        for (const k of Object.keys(json)) {
          if (typeof json[k] === 'bigint') json[k] = Number(json[k]);
        }
        return json;
      });
      queryTime = Math.round((performance.now() - start) * 100) / 100;
    } catch (e) {
      error = String(e);
      rows = [];
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    // buildSQL() accesses reactive state, so this auto-tracks
    buildSQL();
    untrack(() => { execute(); });
  });

  return {
    get rows() { return rows; },
    get loading() { return loading; },
    get error() { return error; },
    get queryTime() { return queryTime; },
    refresh: execute
  };
}

/**
 * Scalar query — returns a single value (COUNT, MIN, MAX, SUM, etc.)
 * Usage: `const total = duck_val(() => \`SELECT COUNT(*) FROM ...\`)`
 *        then use `total.value`
 */
export function duck_val<T = number>(
  buildSQL: () => string,
  defaultValue?: T
): { readonly value: T; readonly loading: boolean; readonly error: string | null } {
  const q = duck<Record<string, T>>(buildSQL);
  return {
    get value() {
      const row = q.rows[0];
      if (!row) return defaultValue as T;
      const vals = Object.values(row);
      return vals[0] ?? defaultValue as T;
    },
    get loading() { return q.loading; },
    get error() { return q.error; }
  };
}

/**
 * Single-column query — returns an array of values.
 * Usage: `const colleges = duck_col(() => \`SELECT DISTINCT college FROM ...\`)`
 *        then use `colleges.items`
 */
export function duck_col<T = string>(
  buildSQL: () => string
): { readonly items: T[]; readonly loading: boolean; readonly error: string | null } {
  const q = duck<Record<string, T>>(buildSQL);
  return {
    get items() {
      if (q.rows.length === 0) return [];
      const key = Object.keys(q.rows[0])[0];
      return q.rows.map(r => r[key]);
    },
    get loading() { return q.loading; },
    get error() { return q.error; }
  };
}