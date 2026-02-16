<script>
  import { getStory } from '$lib/story.remote.js';
  import { error } from '@sveltejs/kit';

  const { params } = $props();
  const slug = params.slug;

  // Explicit glob - Vite knows exactly whatna to bundle
  // https://vite.dev/guide/features#glob-import
  const storyModules = import.meta.glob(
    '$lib/stories/*/components/Index.svelte',
  );

  const modulePath = `/src/lib/stories/${slug}/components/Index.svelte`;

  if (!(modulePath in storyModules)) {
    error(404, `Story "${slug}" not found`);
  }

  // Load story data and component in parallel
  const [storyData, storyModule] = await Promise.all([
    getStory(slug),
    storyModules[modulePath]()
  ]);

  const { story, copyData } = storyData;
  const StoryComponent = /** @type {{ default: import('svelte').Component }} */ (storyModule).default;
</script>

<StoryComponent {story} data={copyData} />
