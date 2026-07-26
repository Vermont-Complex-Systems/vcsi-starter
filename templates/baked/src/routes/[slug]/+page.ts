import { getStory } from '$lib/story.remote.js';
import { loadStoryComponent } from '$lib/story-loader.js';

// Fetching here (not via top-level `await` in +page.svelte) keeps the page
// component synchronous — an async page component hydrates out of sync with
// its SSR output and triggers hydration_mismatch on every story.
export async function load({ params }) {
	const [component, { story, copyData }] = await Promise.all([
		loadStoryComponent(params.slug),
		getStory(params.slug)
	]);

	return { component, slug: params.slug, story, copyData };
}
