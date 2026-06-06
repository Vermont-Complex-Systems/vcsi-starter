---
title: msgraph - Extensions - scrolly-kit
---

<div class="breadcrumb"><a href="{base}/extensions">Extensions</a> / msgraph</div>

<script>
  import { base } from '$app/paths';
</script>

# @the-vcsi/msgraph

<p class="subtitle">Fetch story content from SharePoint Excel files via Microsoft Graph.</p>

## Installation

```bash
npx sv add @the-vcsi/msgraph
```

You'll be prompted for your SharePoint site ID. The add-on creates:

- `scripts/fetch-msgraph.js` -- Fetch script
- `src/appSettings.js` -- Azure AD config
- `.env.example` -- Credential template

## Usage

After configuring your `.env` with Azure credentials, run:

```bash
npm run fetch:sharepoint
```

This pulls story content from your SharePoint Excel workbook into local JSON files that your stories can import.
