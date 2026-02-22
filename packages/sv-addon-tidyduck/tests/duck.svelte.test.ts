import { describe, it, expect, vi } from 'vitest';

// Mock the DuckDB singleton — we're testing SQL generation, not execution
vi.mock('../src/templates/duckdb.svelte', () => ({
  getDB: vi.fn(),
  registerParquet: vi.fn(),
}));

import { ilike, between, inList, eq, or, and, database } from '../src/templates/duck.svelte';

const db = database({ test: 'test.parquet' });

// ── SQL fragment helpers ──────────────────────────────────────────────

describe('ilike', () => {
  it('returns ILIKE clause for non-empty string', () => {
    expect(ilike('title', 'hello')).toBe("title ILIKE '%hello%'");
  });

  it('trims whitespace', () => {
    expect(ilike('title', '  hello  ')).toBe("title ILIKE '%hello%'");
  });

  it('returns null for empty string', () => {
    expect(ilike('title', '')).toBeNull();
  });

  it('returns null for whitespace-only string', () => {
    expect(ilike('title', '   ')).toBeNull();
  });

  it("escapes single quotes", () => {
    expect(ilike('title', "it's")).toBe("title ILIKE '%it''s%'");
  });
});

describe('between', () => {
  it('returns BETWEEN clause for range', () => {
    expect(between('year', [2000, 2020])).toBe('year BETWEEN 2000 AND 2020');
  });

  it('collapses to = when lo === hi', () => {
    expect(between('year', [2015, 2015])).toBe('year = 2015');
  });

  it('returns null for empty array', () => {
    expect(between('year', [])).toBeNull();
  });

  it('returns null for wrong-length array', () => {
    expect(between('year', [2000])).toBeNull();
  });

  it('returns null when value matches fullRange', () => {
    expect(between('year', [2000, 2025], [2000, 2025])).toBeNull();
  });

  it('returns clause when value differs from fullRange', () => {
    expect(between('year', [2005, 2020], [2000, 2025]))
      .toBe('year BETWEEN 2005 AND 2020');
  });
});

describe('inList', () => {
  it('returns IN clause', () => {
    expect(inList('college', ['CAS', 'CEMS']))
      .toBe("college IN ('CAS', 'CEMS')");
  });

  it('returns null for empty array', () => {
    expect(inList('college', [])).toBeNull();
  });

  it("escapes single quotes in values", () => {
    expect(inList('name', ["O'Brien"]))
      .toBe("name IN ('O''Brien')");
  });
});

describe('eq', () => {
  it('returns = clause for string', () => {
    expect(eq('college', 'CAS')).toBe("college = 'CAS'");
  });

  it('returns = clause for number', () => {
    expect(eq('year', 2020)).toBe('year = 2020');
  });

  it('returns null for null', () => {
    expect(eq('year', null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(eq('year', undefined)).toBeNull();
  });

  it("escapes single quotes", () => {
    expect(eq('name', "O'Brien")).toBe("name = 'O''Brien'");
  });
});

describe('or', () => {
  it('combines clauses with OR', () => {
    expect(or("a = 1", "b = 2")).toBe("(a = 1 OR b = 2)");
  });

  it('returns single clause unwrapped', () => {
    expect(or("a = 1")).toBe("a = 1");
  });

  it('filters out nulls', () => {
    expect(or(null, "a = 1", null)).toBe("a = 1");
  });

  it('returns null when all clauses are null', () => {
    expect(or(null, null)).toBeNull();
  });

  it('returns null with no arguments', () => {
    expect(or()).toBeNull();
  });
});

describe('and', () => {
  it('combines clauses with AND', () => {
    expect(and("a = 1", "b = 2")).toBe("(a = 1 AND b = 2)");
  });

  it('returns single clause unwrapped', () => {
    expect(and("a = 1")).toBe("a = 1");
  });

  it('filters out nulls', () => {
    expect(and(null, "a = 1", null)).toBe("a = 1");
  });

  it('returns null when all clauses are null', () => {
    expect(and(null, null)).toBeNull();
  });
});

// ── Composability ─────────────────────────────────────────────────────

describe('composability', () => {
  it('or(ilike, ilike) composes search across columns', () => {
    const result = or(ilike('title', 'test'), ilike('author', 'test'));
    expect(result).toBe("(title ILIKE '%test%' OR author ILIKE '%test%')");
  });

  it('or with one empty ilike returns the other', () => {
    const result = or(ilike('title', 'test'), ilike('author', ''));
    expect(result).toBe("title ILIKE '%test%'");
  });

  it('or with all empty ilikes returns null', () => {
    const result = or(ilike('title', ''), ilike('author', ''));
    expect(result).toBeNull();
  });

  it('and(between, inList) composes filters', () => {
    const result = and(
      between('year', [2000, 2020]),
      inList('college', ['CAS', 'CEMS'])
    );
    expect(result).toBe("(year BETWEEN 2000 AND 2020 AND college IN ('CAS', 'CEMS'))");
  });
});

// ── DuckQuery builder — SQL generation ────────────────────────────────

describe('DuckQuery builder', () => {
  it('db.from() creates a builder with table reference', () => {
    const q = db.from('test');
    expect(q.whereSQL).toBe('');
    expect(q.isFiltered).toBe(false);
  });

  it('.where() adds a filter', () => {
    const q = db.from('test').where(() => "year = 2020");
    expect(q.whereSQL).toBe('WHERE year = 2020');
    expect(q.isFiltered).toBe(true);
  });

  it('.where() returning null is skipped', () => {
    const q = db.from('test').where(() => null);
    expect(q.whereSQL).toBe('');
    expect(q.isFiltered).toBe(false);
  });

  it('chained .where() clauses are ANDed', () => {
    const q = db.from('test')
      .where(() => "a = 1")
      .where(() => "b = 2");
    expect(q.whereSQL).toBe('WHERE a = 1 AND b = 2');
  });

  it('.between() generates correct clause', () => {
    const q = db.from('test')
      .between('year', () => [2000, 2020]);
    expect(q.whereSQL).toBe('WHERE year BETWEEN 2000 AND 2020');
  });

  it('.between() with fullRange skips when values match', () => {
    const q = db.from('test')
      .between('year', () => [2000, 2025], () => [2000, 2025]);
    expect(q.whereSQL).toBe('');
  });

  it('.in() generates IN clause', () => {
    const q = db.from('test')
      .in('college', () => ['CAS', 'CEMS']);
    expect(q.whereSQL).toBe("WHERE college IN ('CAS', 'CEMS')");
  });

  it('.in() with empty array is skipped', () => {
    const q = db.from('test')
      .in('college', () => []);
    expect(q.whereSQL).toBe('');
  });

  it('.ilike() generates ILIKE clause', () => {
    const q = db.from('test')
      .ilike('title', () => 'test');
    expect(q.whereSQL).toBe("WHERE title ILIKE '%test%'");
  });

  it('.eq() generates = clause', () => {
    const q = db.from('test')
      .eq('college', () => 'CAS');
    expect(q.whereSQL).toBe("WHERE college = 'CAS'");
  });

  it('multiple filter verbs combine with AND', () => {
    const q = db.from('test')
      .between('year', () => [2000, 2020])
      .in('college', () => ['CAS'])
      .ilike('title', () => 'test');
    expect(q.whereSQL).toBe(
      "WHERE year BETWEEN 2000 AND 2020 AND college IN ('CAS') AND title ILIKE '%test%'"
    );
  });

  it('inactive filters are excluded from WHERE', () => {
    const q = db.from('test')
      .between('year', () => [2000, 2025], () => [2000, 2025]) // full range → skip
      .in('college', () => [])  // empty → skip
      .ilike('title', () => '') // empty → skip
      .eq('type', () => null);  // null → skip
    expect(q.whereSQL).toBe('');
    expect(q.isFiltered).toBe(false);
  });

  it('.where() with or(ilike, ilike) for multi-column search', () => {
    const q = db.from('test')
      .where(() => or(
        ilike('title', 'machine'),
        ilike('author', 'machine'),
        ilike('abstract', 'machine')
      ));
    expect(q.whereSQL).toBe(
      "WHERE (title ILIKE '%machine%' OR author ILIKE '%machine%' OR abstract ILIKE '%machine%')"
    );
  });

  it('builder is immutable — each verb returns a new instance', () => {
    const base = db.from('test');
    const filtered = base.where(() => "a = 1");
    expect(base.whereSQL).toBe('');
    expect(filtered.whereSQL).toBe('WHERE a = 1');
  });
});
