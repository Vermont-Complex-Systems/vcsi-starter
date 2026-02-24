<script>
  import { base } from '$app/paths';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
</script>

<svelte:head>
  <title>openalex - Extensions - scrolly-kit</title>
</svelte:head>

<article class="page">
  <nav class="breadcrumb">
    <a href="{base}/extensions">Extensions</a>
    <span class="separator">/</span>
    <span class="current">openalex</span>
  </nav>

  <h1>@the-vcsi/openalex</h1>
  <p class="subtitle">Populate your database with OpenAlex author and paper data.</p>

  <section>
    <h2>Installation</h2>
    <CopyCodeBlock code="npx sv add @the-vcsi/openalex" lang="bash" />

    <p>You'll be prompted for your email (required by the OpenAlex API). The add-on creates:</p>
    <ul>
      <li><code>scripts/populate-openalex-db.js</code> &mdash; Database population script</li>
      <li>Appends author/paper tables to <code>src/lib/server/db/schema.ts</code></li>
    </ul>
    <p>If Drizzle isn't already installed, it will be added automatically.</p>
  </section>

  <section>
    <h2>Usage</h2>
    <p>After installation, populate the database:</p>
    <CopyCodeBlock code="npm run db:populate-openalex" lang="bash" />
    <p>This fetches author and publication data from the <a href="https://openalex.org" target="_blank" rel="noopener">OpenAlex</a> API and stores it in your local SQLite database via Drizzle ORM.</p>
  </section>
</article>

<style>
  .page {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
  }

  .breadcrumb {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
    color: var(--vcsi-gray-500);
  }

  .breadcrumb a {
    color: var(--matisse-blue);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb .separator {
    margin: 0 0.4rem;
  }

  .subtitle {
    color: var(--vcsi-gray-600);
    font-size: 1.1rem;
    margin-top: -0.5rem;
    margin-bottom: 2rem;
  }

  section {
    margin-bottom: 2rem;
  }

  :global(.dark) .subtitle {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .breadcrumb a {
    color: #60a5fa;
  }

  :global(.dark) .breadcrumb .current {
    color: var(--vcsi-gray-400);
  }
</style>
