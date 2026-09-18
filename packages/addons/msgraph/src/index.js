import { defineAddon, defineAddonOptions } from 'sv';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read templates from files (testable, lintable)
const FETCH_SCRIPT = readFileSync(join(__dirname, 'templates/fetch-msgraph.js'), 'utf8');
const APP_SETTINGS = readFileSync(join(__dirname, 'templates/appSettings.js'), 'utf8');
const ASSETS_SCRIPT = readFileSync(join(__dirname, 'templates/fetch-assets.js'), 'utf8');
const ENV_EXAMPLE = readFileSync(join(__dirname, 'templates/.env.example'), 'utf8');

const options = defineAddonOptions()
  .add('siteId', {
    question: 'SharePoint site ID (get from Graph Explorer or Azure Portal):',
    type: 'string'
  })
  .build();

// sv.file hands us the file's current contents, or nothing when it does not
// exist yet. Everything this add-on writes is edited afterwards: appSettings.js
// carries the siteId, fetch-assets.js carries ASSET_FOLDERS, and either fetch
// script may be tuned per site. So a re-run must leave an existing file alone.
//
// `sv add` scaffolds a project; it does not update one. To adopt a newer
// version of these scripts, diff this package's templates against your copy and
// port the change deliberately.
const keepExisting = (generated) => (content) =>
  content && content.trim() ? content : generated;

export default defineAddon({
  id: '@the-vcsi/msgraph',
  shortDescription: 'Microsoft Graph / SharePoint integration for fetching story content',
  options,

  run: ({ sv, options: opts }) => {
    // Create the fetch script
    sv.file('scripts/fetch-msgraph.js', keepExisting(FETCH_SCRIPT));

    // Pull binary assets (headshots, logos) out of the same SharePoint site
    sv.file('scripts/fetch-assets.js', keepExisting(ASSETS_SCRIPT));

    // Create app settings config with user-provided siteId
    const appSettings = APP_SETTINGS.replace(/__SITE_ID__/g, opts.siteId || 'YOUR_SITE_ID');
    sv.file('src/appSettings.js', keepExisting(appSettings));

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
      pkg.scripts['fetch:headshots'] = 'node scripts/fetch-assets.js';

      // Add required dependencies
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['@azure/identity'] = '^4.0.0';
      pkg.dependencies['@microsoft/microsoft-graph-client'] = '^3.0.0';
      pkg.dependencies['dotenv'] = '^16.0.0';
      // fetch-assets.js converts SharePoint's .webp to the .jpg the templates request
      pkg.dependencies['sharp'] = '^0.34.5';

      return JSON.stringify(pkg, null, 2);
    });

  },

  nextSteps: () => [
    'Copy .env.example to .env',
    'Get credentials from Azure Portal > App registrations',
    'Run npm install',
    'Run npm run fetch:sharepoint to pull story copy',
    'Run npm run fetch:headshots to pull images (edit ASSET_FOLDERS first)',
    'Re-running this add-on keeps any of these files you already have'
  ]
});
