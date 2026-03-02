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

      // Use jsDelivr CDN bundles to avoid MIME type issues on servers
      // that don't serve .wasm files with application/wasm
      const bundles = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(bundles);

      const worker = await duckdb.createWorker(bundle.mainWorker!);
      const logger = new duckdb.ConsoleLogger();
      dbInstance = new duckdb.AsyncDuckDB(logger, worker);
      await dbInstance.instantiate(bundle.mainModule);
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

// Deduplicate extension loading (INSTALL + LOAD are idempotent but slow)
const extensions = new Map<string, Promise<void>>();

export async function loadExtension(name: string) {
  if (!extensions.has(name)) {
    extensions.set(name, (async () => {
      const conn = await getDB();
      await conn.query(`INSTALL ${name};`);
      await conn.query(`LOAD ${name};`);
    })());
  }
  return extensions.get(name)!;
}

export async function registerParquet(name: string, url: string) {
  const duckdb = await import('@duckdb/duckdb-wasm');
  const conn = await getDB();
  // Resolve to absolute URL so the CDN-hosted worker can fetch from our origin
  const absoluteUrl = new URL(url, window.location.origin).href;
  await dbInstance.registerFileURL(
    name,
    absoluteUrl,
    duckdb.DuckDBDataProtocol.HTTP,
    false
  );
}