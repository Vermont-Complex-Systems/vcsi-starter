// src/lib/db/duckdb.svelte.ts
import { browser } from '$app/environment';

let dbInstance: any = null;
let connInstance: any = null;
let initPromise: Promise<any> | null = null;

export async function getDB() {
  if (!browser) throw new Error('DuckDB-WASM is browser-only');

  if (connInstance) return connInstance;

  if (!initPromise) {
    initPromise = (async () => {
      const duckdb = await import('@duckdb/duckdb-wasm');
      const { default: DuckDBWorker } = await import(
        '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker'
      );
      const duckdb_wasm = (await import(
        '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
      )).default;

      const worker = new DuckDBWorker();
      const logger = new duckdb.ConsoleLogger();
      dbInstance = new duckdb.AsyncDuckDB(logger, worker);
      await dbInstance.instantiate(duckdb_wasm);
      connInstance = await dbInstance.connect();

      return connInstance;
    })();
  }

  return initPromise;
}

export async function query<T = Record<string, unknown>>(
  sql: string
): Promise<T[]> {
  const conn = await getDB();
  const result = await conn.query(sql);
  return result.toArray().map((r: any) => r.toJSON());
}

export async function registerParquet(name: string, url: string) {
  const duckdb = await import('@duckdb/duckdb-wasm');
  const conn = await getDB();
  await dbInstance.registerFileURL(
    name,
    url,
    duckdb.DuckDBDataProtocol.HTTP,
    false
  );
}