import { defineAddon, defineAddonOptions } from 'sv';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DUCKDB_SINGLETON = readFileSync(join(__dirname, 'templates/duckdb.svelte.ts'), 'utf8');
const DUCK_REACTIVE    = readFileSync(join(__dirname, 'templates/duck.svelte.ts'), 'utf8');
const TIDYDUCK_BUILDER = readFileSync(join(__dirname, 'templates/tidyduck.svelte.ts'), 'utf8');

const options = defineAddonOptions()
  .add('tidyduck', {
    question: 'Include tidyduck query builder? (experimental dplyr-style API)',
    type: 'boolean',
    default: false
  })
  .build();

export default defineAddon({
  id: '@the-vcsi/duckdb',
  shortDescription: 'DuckDB-WASM with reactive query helpers for SvelteKit',
  options,

  run: ({ sv, options: opts }) => {
    // ── 1. Core files (always) ──

    sv.file('src/lib/db/duckdb.svelte.ts', (content) => {
      if (content) return content;
      return DUCKDB_SINGLETON;
    });

    sv.file('src/lib/db/duck.svelte.ts', (content) => {
      if (content) return content;
      return DUCK_REACTIVE;
    });

    // ── 2. Tidyduck builder (optional) ──

    if (opts.tidyduck) {
      sv.file('src/lib/db/tidyduck.svelte.ts', (content) => {
        if (content) return content;
        return TIDYDUCK_BUILDER;
      });
    }

    // ── 3. Add @duckdb/duckdb-wasm dependency ──

    sv.file('package.json', (content) => {
      const pkg = JSON.parse(content);
      pkg.dependencies = pkg.dependencies || {};
      if (!pkg.dependencies['@duckdb/duckdb-wasm']) {
        pkg.dependencies['@duckdb/duckdb-wasm'] = '^1.29.0';
      }
      return JSON.stringify(pkg, null, 2);
    });

    // ── 4. Exclude @duckdb/duckdb-wasm from Vite optimizeDeps ──

    sv.file('vite.config.ts', (content) => {
      if (!content) {
        console.log('\n  Warning: No vite.config.ts found.');
        console.log('  Add manually inside defineConfig():');
        console.log("    optimizeDeps: { exclude: ['@duckdb/duckdb-wasm'] }");
        return content;
      }

      if (content.includes('@duckdb/duckdb-wasm')) return content;

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

      const optimizeDepsPattern = /(optimizeDeps\s*:\s*\{)/;
      if (optimizeDepsPattern.test(content)) {
        return content.replace(
          optimizeDepsPattern,
          "$1\n\t\texclude: ['@duckdb/duckdb-wasm'],"
        );
      }

      const defineConfigPattern = /(defineConfig\s*\(\s*\{)/;
      if (defineConfigPattern.test(content)) {
        return content.replace(
          defineConfigPattern,
          "$1\n\toptimizeDeps: {\n\t\texclude: ['@duckdb/duckdb-wasm']\n\t},"
        );
      }

      console.log('\n  Warning: Could not auto-modify vite.config.ts.');
      console.log('  Add inside defineConfig():');
      console.log("    optimizeDeps: { exclude: ['@duckdb/duckdb-wasm'] }");
      return content;
    });

    // ── 5. Create static/data/.gitkeep ──

    sv.file('static/data/.gitkeep', (content) => {
      if (content != null) return content;
      return '';
    });
  },

  nextSteps: ({ options: opts }) => {
    const steps = [
      'Run npm install',
      'Place .parquet files in static/data/',
      "Import: import { duck } from '$lib/db/duck.svelte'",
      "Query:  const rows = duck(() => `SELECT * FROM 'data.parquet' LIMIT 10`)",
    ];
    if (opts.tidyduck) {
      steps.push(
        '',
        'Tidyduck builder:',
        "  import { database } from '$lib/db/tidyduck.svelte'",
        "  const db = database({ flights: 'flights.parquet' })",
        "  const q = db.from('flights').between('year', () => range).rows()"
      );
    }
    return steps;
  }
});
