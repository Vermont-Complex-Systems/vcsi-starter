# @the-vcsi/msgraph

Fetch story content from SharePoint Excel files via Microsoft Graph.

## Installation

```bash
npx sv add @the-vcsi/msgraph
```

You'll be prompted for your SharePoint site ID. The add-on creates:

- `scripts/fetch-msgraph.js` -- Story copy fetch script
- `scripts/fetch-assets.js` -- Image fetch script
- `src/appSettings.js` -- Azure AD config
- `.env.example` -- Credential template

## Usage

After configuring your `.env` with Azure credentials, run:

```bash
npm run fetch:sharepoint
```

This pulls story content from your SharePoint Excel workbook into local JSON files that your stories can import.

### Images

Headshots and other pictures live in the same SharePoint site, not in the workbook, so they have their own command:

```bash
npm run fetch:headshots
```

Open `scripts/fetch-assets.js` first and edit `ASSET_FOLDERS`, which maps a folder in SharePoint to a folder under `static/`. The default pulls `assets/headshots` into `static/common/assets/members`.

Pictures saved as `.webp` are converted to `.jpg` on the way down, because the templates' member cards ask for `<id>.jpg`. The filename is what links a picture to a person: `iris-damiao.webp` becomes the picture for the member whose `id` in `members.csv` is `iris-damiao`. A picture whose name matches nobody is downloaded but never shown, so rename it in SharePoint rather than renaming it locally, or the next sync undoes your fix.
