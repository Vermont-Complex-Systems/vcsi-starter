---
title: openalex - Extensions - scrolly-kit
---

<div class="breadcrumb"><a href="{base}/extensions">Extensions</a> / openalex</div>

<script>
  import { base } from '$app/paths';
</script>

# @the-vcsi/openalex

<p class="subtitle">Populate your database with OpenAlex author and paper data.</p>

## Installation

```bash
npx sv add @the-vcsi/openalex
```

You'll be prompted for your email (required by the OpenAlex API). The add-on creates:

- `scripts/populate-openalex-db.js` -- Database population script
- Appends author/paper tables to `src/lib/server/db/schema.ts`

If Drizzle isn't already installed, it will be added automatically.

## Usage

After installation, populate the database:

```bash
npm run db:populate-openalex
```

This fetches author and publication data from the [OpenAlex](https://openalex.org) API and stores it in your local SQLite database via Drizzle ORM.
