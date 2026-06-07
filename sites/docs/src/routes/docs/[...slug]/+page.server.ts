import { error } from '@sveltejs/kit';

const docs = import.meta.glob('/src/lib/docs/**/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;

const content_map: Record<string, string> = {};
for (const [path, mod] of Object.entries(docs)) {
	const slug = path.replace('/src/lib/docs/', '').replace('.md', '');
	content_map[slug] = mod.default;
}

export function entries() {
	return Object.keys(content_map).map((slug) => ({ slug }));
}

export function load({ params }) {
	const content = content_map[params.slug];
	if (!content) error(404, 'Page not found');
	return { content, slug: params.slug };
}
