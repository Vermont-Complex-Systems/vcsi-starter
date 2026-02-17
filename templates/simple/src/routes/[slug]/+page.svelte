<script>
  import { page } from '$app/state';
  import { getStory } from '$lib/story.remote.js';
  import { error } from '@sveltejs/kit';

  // Explicit glob - Vite knows exactly what to bundle
  // https://vite.dev/guide/features#glob-import
  const storyModules = import.meta.glob(
    '$lib/stories/*/components/Index.svelte',
  );

  const modulePath = `/src/lib/stories/${page.params.slug}/components/Index.svelte`;

  if (!(modulePath in storyModules)) {
    error(404, `Story "${page.params.slug}" not found`);
  }

  // Load story data and component in parallel
  const [storyData, storyModule] = await Promise.all([
    getStory(page.params.slug),
    storyModules[modulePath]()
  ]);

  const { story, copyData } = storyData;
  const StoryComponent = /** @type {{ default: import('svelte').Component }} */ (storyModule).default;
</script>

<StoryComponent {story} data={copyData} />
