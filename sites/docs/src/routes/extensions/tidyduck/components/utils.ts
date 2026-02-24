/** Format a number for display (handles BigInt from DuckDB COUNT) */
export function formatNum(n: unknown): string {
  if (n == null) return '…';
  return Number(n).toLocaleString();
}

export function toNum(n: unknown): number {
  return Number(n);
}

/** Map DuckDB types to R-style short labels */
export function typeLabel(t: string): string {
  const map: Record<string, string> = {
    'INTEGER': 'int', 'BIGINT': 'int', 'SMALLINT': 'int', 'TINYINT': 'int',
    'DOUBLE': 'dbl', 'FLOAT': 'dbl', 'DECIMAL': 'dbl',
    'VARCHAR': 'chr', 'TEXT': 'chr',
    'BOOLEAN': 'lgl',
    'DATE': 'date', 'TIMESTAMP': 'dttm', 'TIMESTAMP WITH TIME ZONE': 'dttm',
  };
  return map[t.toUpperCase()] ?? t.toLowerCase();
}

/** Format a glimpse sample value */
export function fmtSample(v: unknown): string {
  if (v == null) return 'NA';
  if (typeof v === 'bigint') return String(Number(v));
  if (typeof v === 'string') return `"${v}"`;
  return String(v);
}

/** Is this DuckDB type numeric? */
export function isNumericType(t: string): boolean {
  return /^(INTEGER|BIGINT|SMALLINT|TINYINT|DOUBLE|FLOAT|DECIMAL|HUGEINT|UBIGINT|UINTEGER|USMALLINT|UTINYINT)/i.test(t);
}
