<script>
  import { base } from '$app/paths';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
</script>

<svelte:head>
  <title>msgraph - Extensions - scrolly-kit</title>
</svelte:head>

<article class="page">
  <nav class="breadcrumb">
    <a href="{base}/extensions">Extensions</a>
    <span class="separator">/</span>
    <span class="current">msgraph</span>
  </nav>

  <h1>@the-vcsi/msgraph</h1>
  <p class="subtitle">Fetch story content from SharePoint Excel files via Microsoft Graph.</p>

  <section>
    <h2>Installation</h2>
    <CopyCodeBlock code="npx sv add @the-vcsi/msgraph" lang="bash" />

    <p>You'll be prompted for your SharePoint site ID. The add-on creates:</p>
    <ul>
      <li><code>scripts/fetch-msgraph.js</code> &mdash; Fetch script</li>
      <li><code>src/appSettings.js</code> &mdash; Azure AD config</li>
      <li><code>.env.example</code> &mdash; Credential template</li>
    </ul>
  </section>

  <section>
    <h2>Usage</h2>
    <p>After configuring your <code>.env</code> with Azure credentials, run:</p>
    <CopyCodeBlock code="npm run fetch:sharepoint" lang="bash" />
    <p>This pulls story content from your SharePoint Excel workbook into local JSON files that your stories can import.</p>
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
