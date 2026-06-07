import { prerender } from '$app/server';
import * as v from 'valibot';

const docs = import.meta.glob('/src/lib/docs/**/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;

const content_map: Record<string, string> = {};
for (const [path, mod] of Object.entries(docs)) {
	content_map[path.replace('/src/lib/docs/', '').replace('.md', '')] = mod.default;
}

const slugs = Object.keys(content_map);

export const get_doc = prerender(
	v.string(),
	async (slug) => content_map[slug] ?? null,
	{ inputs: () => slugs }
);

export const get_doc_slugs = prerender(async () => slugs);
