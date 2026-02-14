#!/usr/bin/env node

import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import settings from '../src/appSettings.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORIES_DIR = join(__dirname, '..', 'src', 'lib', 'stories');
const DATA_STORY_FILE = 'data-story.xlsx';

function createClient() {
  const credential = new ClientSecretCredential(
    settings.tenantId || process.env.tenantId,
    settings.clientId || process.env.clientId,
    settings.clientSecret || process.env.clientSecret
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: settings.scopes,
  });

  return Client.initWithMiddleware({ authProvider });
}

function sanitizeFilename(name) {
  return name
    .replace(/\.(xlsx|xlsm|xls)$/i, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();
}

function excelDateToString(serial) {
  const utcDays = Math.floor(serial - 25569);
  const date = new Date(utcDays * 86400 * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function convertToStoryJson(rows) {
  const [header, ...dataRows] = rows;

  const result = {
    title: '',
    subtitle: '',
    authors: [],
    date: '',
    SectionTitle: ''
  };

  let currentAuthor = {};

  for (const row of dataRows) {
    const section = String(row[0] || '').trim().toLowerCase();
    const key = String(row[1] || '').trim();
    const value = row[2];

    if (!section || !key) continue;

    if (section === 'meta') {
      const keyLower = key.toLowerCase();
      if (keyLower === 'title') result.title = value;
      else if (keyLower === 'subtitle') result.subtitle = value;
      else if (keyLower === 'sectiontitle') result.SectionTitle = value;
      else if (keyLower === 'date') {
        result.date = typeof value === 'number' ? excelDateToString(value) : value;
      }
    } else if (section === 'author') {
      if (key.toLowerCase() === 'name') {
        currentAuthor = { name: value };
      } else if (key.toLowerCase() === 'url') {
        currentAuthor.url = value;
        result.authors.push(currentAuthor);
        currentAuthor = {};
      }
    } else {
      if (!result[section]) {
        result[section] = [];
      }
      result[section].push({ type: key, value: String(value) });
    }
  }

  return result;
}

async function main() {
  const client = createClient();

  let site;
  try {
    site = await client.api(`/sites/${settings.siteId}`).get();
  } catch (error) {
    console.error(`Error: ${error.code} - ${error.message}`);
    throw error;
  }

  console.log(`Site: ${site.webUrl}`);

  const drives = await client.api(`/sites/${site.id}/drives`).get();
  const driveId = drives.value[0].id;

  const items = await client.api(`/drives/${driveId}/root/children`).get();
  const dataStoryFile = items.value.find(
    (item) => item.file && item.name.toLowerCase() === DATA_STORY_FILE.toLowerCase()
  );

  if (!dataStoryFile) {
    console.log(`\n${DATA_STORY_FILE} not found`);
    return;
  }

  console.log(`\nProcessing: ${dataStoryFile.name}`);

  const worksheets = await client
    .api(`/drives/${driveId}/items/${dataStoryFile.id}/workbook/worksheets`)
    .get();

  for (const sheet of worksheets.value) {
    console.log(`  Sheet: ${sheet.name}`);

    try {
      const usedRange = await client
        .api(
          `/drives/${driveId}/items/${dataStoryFile.id}/workbook/worksheets/${sheet.id}/usedRange`
        )
        .get();

      const values = usedRange.values || [];

      if (values.length === 0) {
        console.log(`    (empty sheet, skipping)`);
        continue;
      }

      const sheetName = sanitizeFilename(sheet.name);
      const storyDir = join(STORIES_DIR, sheetName, 'data');
      mkdirSync(storyDir, { recursive: true });

      const json = convertToStoryJson(values);
      const filepath = join(storyDir, 'copy.json');
      writeFileSync(filepath, JSON.stringify(json, null, '\t'), 'utf8');

      console.log(`    -> ${filepath}`);
    } catch (error) {
      console.error(`    Error reading sheet: ${error.message}`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
