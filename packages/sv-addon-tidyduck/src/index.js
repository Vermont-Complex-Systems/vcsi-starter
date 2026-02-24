import { defineAddon, defineAddonOptions } from 'sv/core';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read templates from files (testable, lintable)
const DUCKDB_SINGLETON = readFileSync(join(__dirname, 'templates/duckdb.svelte.ts'), 'utf8');
const SQL_REACTIVE     = readFileSync(join(__dirname, 'templates/sql.svelte.ts'), 'utf8');
const DUCK_BUILDER     = readFileSync(join(__dirname, 'templates/duck.svelte.ts'), 'utf8');

const options = defineAddonOptions().build();

export default defineAddon({
  id: '@the-vcsi/tidyduck',
  options,

  run: ({ sv }) => {
    // ── 1. Drop the three db/ files ──

    sv.file('src/lib/db/duckdb.svelte.ts', (content) => {
      if (content) return content; // Don't overwrite existing
      return DUCKDB_SINGLETON;
    });

    sv.file('src/lib/db/sql.svelte.ts', (content) => {
      if (content) return content;
      return SQL_REACTIVE;
    });

    sv.file('src/lib/db/duck.svelte.ts', (content) => {
      if (content) return content;
      return DUCK_BUILDER;
    });

    // ── 2. Add @duckdb/duckdb-wasm dependency ──

    sv.file('package.json', (content) => {
      const pkg = JSON.parse(content);
      pkg.dependencies = pkg.dependencies || {};
      if (!pkg.dependencies['@duckdb/duckdb-wasm']) {
        pkg.dependencies['@duckdb/duckdb-wasm'] = '^1.29.0';
      }
      return JSON.stringify(pkg, null, 2);
    });

    // ── 3. Modify vite.config.ts to exclude @duckdb/duckdb-wasm from optimizeDeps ──

    sv.file('vite.config.ts', (content) => {
      if (!content) {
        console.log('\n  Warning: No vite.config.ts found.');
        console.log('  Add manually inside defineConfig():');
        console.log("    optimizeDeps: { exclude: ['@duckdb/duckdb-wasm'] }");
        return content;
      }

      // Already present — nothing to do
      if (content.includes('@duckdb/duckdb-wasm')) return content;

      // Case 1: Has an exclude array — append to it
      const excludePattern = /(exclude\s*:\s*\[)([\s\S]*?)(\])/;
      const excludeMatch = content.match(excludePattern);
      if (excludeMatch) {
        const items = excludeMatch[2].trimEnd();
        const needsComma = items.trim().length > 0 && !items.trimEnd().endsWith(',');
        const separator = needsComma ? ',' : '';
        return content.replace(
          excludePattern,
          `$1${items}${separator}\n\t\t\t'@duckdb/duckdb-wasm'\n\t\t$3`
        );
      }

      // Case 2: Has optimizeDeps but no exclude
      const optimizeDepsPattern = /(optimizeDeps\s*:\s*\{)/;
      if (optimizeDepsPattern.test(content)) {
        return content.replace(
          optimizeDepsPattern,
          "$1\n\t\texclude: ['@duckdb/duckdb-wasm'],"
        );
      }

      // Case 3: Has defineConfig({ — add optimizeDeps at the top
      const defineConfigPattern = /(defineConfig\s*\(\s*\{)/;
      if (defineConfigPattern.test(content)) {
        return content.replace(
          defineConfigPattern,
          "$1\n\toptimizeDeps: {\n\t\texclude: ['@duckdb/duckdb-wasm']\n\t},"
        );
      }

      // Fallback — could not locate a safe insertion point
      console.log('\n  Warning: Could not auto-modify vite.config.ts.');
      console.log('  Add inside defineConfig():');
      console.log("    optimizeDeps: { exclude: ['@duckdb/duckdb-wasm'] }");
      return content;
    });

    // ── 4. Create static/data/.gitkeep for parquet file placement ──

    sv.file('static/data/.gitkeep', (content) => {
      if (content != null) return content;
      return '';
    });

    // ── 5. Post-install instructions ──

    console.log('\n  DuckDB-WASM integration added!');
    console.log('  1. Run: npm install');
    console.log('  2. Place .parquet files in static/data/');
    console.log('  3. Import the query builder:');
    console.log("     import { database } from '$lib/db/duck.svelte';");
    console.log('  4. Register tables and query:');
    console.log("     const db = database({ mydata: 'my-file.parquet' });");
    console.log("     const data = db.from('mydata');");
    console.log('     const allRows = data.rows();');
    console.log('     const total = data.count();');
    console.log("     const filtered = data.between('year', () => range).rows();");
  }
});
