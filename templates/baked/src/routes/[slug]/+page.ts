import { loadStoryComponent } from '$lib/story-loader.js';

// The load function only handles the routing concern:
// resolve the right component for this slug (unknown slugs 404 in story-loader).
// Data fetching lives in story.remote.ts, awaited by the page component.
export async function load({ params }) {
	return { component: await loadStoryComponent(params.slug), slug: params.slug };
}
