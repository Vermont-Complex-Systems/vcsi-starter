<!--
  Story page — renders any story from $lib/stories/{slug}/.

  The load function (+page.ts) provides the component and slug.
  The remote function (story.remote.ts) provides the data.

  Awaiting the remote function here is hydration-safe: the prerendered
  result is serialized into the page and reused during hydration (verified
  against production builds with a headless probe). Don't move this fetch
  into load() — remote functions are the pattern this template models.
-->
<script lang="ts">
  import { page } from '$app/state';
  import { getStory } from '$lib/story.remote.js';
  import Meta from '$lib/components/Meta.svelte';

  // Component and slug come from the load function in +page.ts
  let { data } = $props();
  const StoryComponent = $derived(data.component);

  // Data comes from the remote function
  const { story, copyData } = await getStory(page.params.slug);
</script>

<Meta
  title={story.title}
  description={story.description}
/>

<StoryComponent {story} data={copyData} />
