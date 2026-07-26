<!--
  Story page — renders any story from $lib/stories/{slug}/.

  Component discovery and data fetching both live in the load function
  (+page.ts) — NOT as top-level await here: an async page component hydrates
  out of sync with its SSR output (hydration_mismatch), forcing a client
  re-render of every story.
-->
<script lang="ts">
  import Meta from '$lib/components/Meta.svelte';

  let { data } = $props();
  const StoryComponent = $derived(data.component);
  const story = $derived(data.story);
  const copyData = $derived(data.copyData);
</script>

<Meta
  title={story.title}
  description={story.description}
/>

<StoryComponent {story} data={copyData} />
