import { defineAddon, defineAddonOptions } from 'sv/core';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read templates from files (testable, lintable)
const POPULATE_SCRIPT = readFileSync(join(__dirname, 'templates/populate-openalex-db.js'), 'utf8');
const SCHEMA_ADDITION = readFileSync(join(__dirname, 'templates/schema-addition.ts'), 'utf8');

const options = defineAddonOptions()
  .add('email', {
    question: 'Contact email for OpenAlex API (polite pool):',
    type: 'string'
  })
  .build();

export default defineAddon({
  id: '@the-vcsi/openalex',
  options,

  setup: ({ dependsOn }) => {
    dependsOn('drizzle');
  },

  run: ({ sv, options: opts }) => {
    // Create the populate script with user's email
    const populateScript = POPULATE_SCRIPT.replace(/__CONTACT_EMAIL__/g, opts.email || 'your-email@example.com');
    sv.file('scripts/populate-openalex-db.js', () => populateScript);

    // Create separate OpenAlex schema file
    sv.file('src/lib/server/db/openalex-schema.ts', (content) => {
      if (content) return content; // Already exists
      return SCHEMA_ADDITION;
    });

    // Re-export from main schema
    sv.file('src/lib/server/db/schema.ts', (content) => {
      const reexport = "export * from './openalex-schema';";
      if (content && content.includes('openalex-schema')) {
        return content; // Already has re-export
      }
      return (content || '') + '\n' + reexport + '\n';
    });

    // Create template members.csv if it doesn't exist
    sv.file('src/data/members.csv', (content) => {
      if (content) return content; // Already exists
      return `id,name,role,openAlexId
alice,Alice Smith,Researcher,A5012345678
bob,Bob Jones,Graduate Student,A5087654321
`;
    });

    // Add npm script and d3-dsv dependency
    sv.file('package.json', (content) => {
      const pkg = JSON.parse(content);
      pkg.scripts = pkg.scripts || {};
      pkg.scripts['db:populate-openalex'] = 'node scripts/populate-openalex-db.js';

      // Add d3-dsv for CSV parsing
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['d3-dsv'] = '^3.0.0';

      return JSON.stringify(pkg, null, 2);
    });

    console.log('\n  OpenAlex integration added!');
    console.log('  1. Ensure drizzle is set up with better-sqlite3');
    console.log('  2. Add openAlexId column to your members.csv');
    console.log('  3. Run: npm run db:push (to create tables)');
    console.log('  4. Run: npm run db:populate-openalex');
  }
});
