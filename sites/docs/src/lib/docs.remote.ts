import { prerender } from '$app/server';
import * as v from 'valibot';

// The package changelog is served as a docs page from its single source of truth.
import changelog from '../../../../packages/scrolly-kit/CHANGELOG.md?raw';

const docs = import.meta.glob('/src/lib/docs/**/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;

const content_map: Record<string, string> = {};
for (const [path, mod] of Object.entries(docs)) {
	content_map[path.replace('/src/lib/docs/', '').replace('.md', '')] = mod.default;
}
content_map['changelog'] = changelog;

const slugs = Object.keys(content_map);

export const get_doc = prerender(
	v.string(),
	async (slug) => content_map[slug] ?? null,
	{ inputs: () => slugs }
);

export const get_doc_slugs = prerender(async () => slugs);
