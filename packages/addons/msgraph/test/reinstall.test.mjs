/**
 * `sv add` scaffolds a project; people then edit what it wrote (the siteId in
 * appSettings.js, ASSET_FOLDERS in fetch-assets.js). Re-running the add-on must
 * not throw that away. Run with: npm test
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import addon from '../src/index.js';

const BASE_PKG = JSON.stringify({ name: 'demo', scripts: { dev: 'vite dev' }, dependencies: {} }, null, 2);

/** Drive the real run() against an in-memory project. */
function runAddon(files) {
  const sv = { file: (p, cb) => { files[p] = cb(files[p]); } };
  addon.run({ sv, options: { siteId: 'SITE-FROM-PROMPT' } });
  return files;
}

test('a fresh install writes every file and wires package.json', () => {
  const files = runAddon({ 'package.json': BASE_PKG });
  assert.match(files['src/appSettings.js'], /SITE-FROM-PROMPT/);
  assert.match(files['scripts/fetch-assets.js'], /ASSET_FOLDERS/);
  assert.match(files['scripts/fetch-msgraph.js'], /data-story\.xlsx/);

  const pkg = JSON.parse(files['package.json']);
  assert.equal(pkg.scripts['fetch:sharepoint'], 'node scripts/fetch-msgraph.js');
  assert.equal(pkg.scripts['fetch:headshots'], 'node scripts/fetch-assets.js');
  assert.equal(pkg.dependencies.sharp, '^0.34.5');
  assert.equal(pkg.scripts.dev, 'vite dev', 'must not drop existing scripts');
});

test('re-running keeps files the site has already edited', () => {
  const files = runAddon({ 'package.json': BASE_PKG });
  files['src/appSettings.js'] = 'export const settings = { siteId: process.env.siteId };';
  files['scripts/fetch-assets.js'] = "const ASSET_FOLDERS = { 'assets/team': 'common/team' };";
  files['scripts/fetch-msgraph.js'] = '// tuned for this site';
  const before = { ...files };

  runAddon(files);

  for (const path of ['src/appSettings.js', 'scripts/fetch-assets.js', 'scripts/fetch-msgraph.js']) {
    assert.equal(files[path], before[path], `${path} was overwritten by a re-run`);
  }
});

test('an empty file counts as missing, so a botched install self-heals', () => {
  const files = runAddon({ 'package.json': BASE_PKG });
  files['src/appSettings.js'] = '   \n';
  runAddon(files);
  assert.match(files['src/appSettings.js'], /SITE-FROM-PROMPT/);
});
