<!--
  Story page — renders any story from $lib/stories/{slug}/.

  Component discovery and data fetching both live in story.remote.ts:
    - loadStoryComponent(slug) → Svelte component (plain helper)
    - getStory(slug)            → { story, copyData } (remote function)
-->
<script lang="ts">
  import { page } from '$app/state';
  import { getStory } from '$lib/story.remote.js';
  import { loadStoryComponent } from '$lib/story-loader.js';

  const slug = page.params.slug;

  // Fetch component + data in parallel.
  const [StoryComponent, { story, copyData }] = await Promise.all([
    loadStoryComponent(slug),
    getStory(slug)
  ]);
</script>

<StoryComponent {story} data={copyData} />
