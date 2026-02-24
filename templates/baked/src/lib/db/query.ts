// src/lib/db/query.ts
import { browser } from '$app/environment';

// Set this based on your deployment mode
// Could come from an env var: PUBLIC_QUERY_ENGINE=duckdb|server
const ENGINE = import.meta.env.PUBLIC_QUERY_ENGINE ?? 'duckdb';

export async function storyQuery<T = Record<string, unknown>>(
  slug: string,
  sql: string
): Promise<T[]> {
  const { query, registerParquet } = await import('./duckdb.svelte');
  await registerParquet(`${slug}.parquet`, `/data/${slug}.parquet`);
  return query<T>(sql);
}
