import use_cases from '$lib/docs/use_cases.json';
// The package changelog rides along as its own section, from its single source of truth.
import changelog from '../../../../../packages/scrolly-kit/CHANGELOG.md?raw';

// All docs live in src/lib/docs/ as pure markdown
const all_docs = import.meta.glob('/src/lib/docs/**/*.md', {
	query: '?raw',
	eager: true
}) as Record<string, { default: string }>;

// Build slug → content map
const content_map: Record<string, string> = {};
for (const [path, mod] of Object.entries(all_docs)) {
	content_map[path.replace('/src/lib/docs/', '').replace('.md', '')] = mod.default;
}
content_map['changelog'] = changelog;

// Extract title from first # heading
function get_title(content: string): string {
	const match = content.match(/^#\s+(.+)$/m);
	return match ? match[1] : 'Untitled';
}

export interface Section {
	title: string;
	slug: string;
	use_cases: string;
}

export function get_sections(): Section[] {
	const summaries = use_cases as Record<string, string>;

	// Top-level docs (not under components/)
	const top_level = Object.entries(content_map)
		.filter(([slug]) => !slug.startsWith('components/'))
		.map(([slug, content]) => ({
			title: get_title(content),
			slug,
			use_cases: summaries[slug] ?? ''
		}));

	// Components as a single aggregated section
	const component_slugs = Object.keys(content_map).filter((s) => s.startsWith('components/'));
	if (component_slugs.length > 0) {
		top_level.push({
			title: 'Components',
			slug: 'components',
			use_cases: component_slugs
				.map((s) => summaries[s] ?? '')
				.filter(Boolean)
				.join(', ')
		});
	}

	return top_level;
}

export function get_section_content(slug: string): string | null {
	if (content_map[slug]) return content_map[slug];

	// "components" → concatenate all component docs
	if (slug === 'components') {
		return Object.entries(content_map)
			.filter(([k]) => k.startsWith('components/'))
			.map(([, v]) => v.trim())
			.join('\n\n---\n\n');
	}

	return null;
}

export function get_all_content(): string {
	return get_sections()
		.map((s) => `## ${s.title}\n\n${get_section_content(s.slug) ?? ''}`)
		.join('\n\n---\n\n');
}
