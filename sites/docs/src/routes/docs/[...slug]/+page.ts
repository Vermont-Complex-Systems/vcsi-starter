import { get_doc } from '$lib/docs.remote';
import { error } from '@sveltejs/kit';

// Glob at build time to discover all doc slugs for prerendering
const docs = import.meta.glob('/src/lib/docs/**/*.md', { query: '?raw' });
const slugs = Object.keys(docs).map((path) =>
	path.replace('/src/lib/docs/', '').replace('.md', '')
);

export function entries() {
	return slugs.map((slug) => ({ slug }));
}

export async function load({ params }) {
	const content = await get_doc(params.slug);
	if (!content) error(404, 'Page not found');
	return { content, slug: params.slug };
}
