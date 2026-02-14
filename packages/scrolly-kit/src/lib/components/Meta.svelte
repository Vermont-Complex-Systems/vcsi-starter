<!-- SEO meta tags component for pages and stories -->
<script>
  import { page } from "$app/state";
  import { base } from "$app/paths";

  let {
    title,
    description,
    baseUrl = "",
    siteName = "",
    keywords = "",
    image = "/default-og-image.jpg",
    author = ""
  } = $props();

  // Normalize pathname to remove base and ensure clean path
  let pathname = $derived(page.url.pathname.replace(base, '').replace(/^\/+/, '/'));
  let url = $derived(baseUrl ? `${baseUrl}${pathname}` : pathname);
  let fullImageUrl = $derived(image.startsWith('http') ? image : (baseUrl ? `${baseUrl}${image}` : image));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if author}
    <meta name="author" content={author} />
  {/if}
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}

  <meta property="og:title" content={title} />
  {#if siteName}
    <meta property="og:site_name" content={siteName} />
  {/if}
  <meta property="og:url" content={url} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content={fullImageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="628" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={fullImageUrl} />

  <link rel="canonical" href={url} />
  <meta name="robots" content="index, follow, max-image-preview:large" />
</svelte:head>
