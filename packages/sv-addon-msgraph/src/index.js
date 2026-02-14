import { defineAddon, defineAddonOptions } from 'sv/core';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read templates from files (testable, lintable)
const FETCH_SCRIPT = readFileSync(join(__dirname, 'templates/fetch-msgraph.js'), 'utf8');
const APP_SETTINGS = readFileSync(join(__dirname, 'templates/appSettings.js'), 'utf8');
const ENV_EXAMPLE = readFileSync(join(__dirname, 'templates/.env.example'), 'utf8');

const options = defineAddonOptions()
  .add('siteId', {
    question: 'SharePoint site ID (get from Graph Explorer or Azure Portal):',
    type: 'string'
  })
  .build();

export default defineAddon({
  id: '@the-vcsi/msgraph',
  options,

  run: ({ sv, options: opts }) => {
    // Create the fetch script
    sv.file('scripts/fetch-msgraph.js', () => FETCH_SCRIPT);

    // Create app settings config with user-provided siteId
    const appSettings = APP_SETTINGS.replace(/__SITE_ID__/g, opts.siteId || 'YOUR_SITE_ID');
    sv.file('src/appSettings.js', () => appSettings);

    // Append to .env.example (or create if doesn't exist)
    sv.file('.env.example', (content) => {
      if (content && content.includes('tenantId')) {
        return content; // Already has msgraph config
      }
      return (content || '') + '\n' + ENV_EXAMPLE;
    });

    // Add npm script and dependencies
    sv.file('package.json', (content) => {
      const pkg = JSON.parse(content);
      pkg.scripts = pkg.scripts || {};
      pkg.scripts['fetch:sharepoint'] = 'node scripts/fetch-msgraph.js';

      // Add required dependencies
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['@azure/identity'] = '^4.0.0';
      pkg.dependencies['@microsoft/microsoft-graph-client'] = '^3.0.0';
      pkg.dependencies['dotenv'] = '^16.0.0';

      return JSON.stringify(pkg, null, 2);
    });

    console.log('\n  Microsoft Graph integration added!');
    console.log('  1. Copy .env.example to .env');
    console.log('  2. Get credentials from Azure Portal > App registrations:');
    console.log('     - tenantId: Directory (tenant) ID');
    console.log('     - clientId: Application (client) ID');
    console.log('     - clientSecret: Certificates & secrets > New client secret');
    console.log('  3. Run: npm install');
    console.log('  4. Run: npm run fetch:sharepoint');
  }
});
