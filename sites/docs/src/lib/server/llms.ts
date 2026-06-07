// Raw markdown imports for prose pages (mdsvex routes)
import getting_started_raw from '../../routes/+page.md?raw';
import reference_raw from '../../routes/reference/+page.md?raw';
import msgraph_raw from '../../routes/extensions/msgraph/+page.md?raw';
import openalex_raw from '../../routes/extensions/openalex/+page.md?raw';

// Raw markdown imports for component docs (pure markdown in src/lib/docs/)
const component_docs = import.meta.glob('/src/lib/docs/components/*.md', {
	query: '?raw',
	eager: true
}) as Record<string, { default: string }>;

function clean_mdsvex(md: string): string {
	return md
		.replace(/^---[\s\S]*?---\s*/, '')
		.replace(/<script[\s\S]*?<\/script>\s*/gi, '')
		.trim();
}

function all_components(): string {
	return Object.values(component_docs)
		.map((mod) => mod.default.trim())
		.join('\n\n---\n\n');
}

export interface Section {
	title: string;
	slug: string;
	use_cases: string;
}

export function get_sections(): Section[] {
	return [
		{
			title: 'Getting Started',
			slug: 'getting-started',
			use_cases: 'setup, installation, scaffolding, new project, quick start'
		},
		{
			title: 'Reference',
			slug: 'reference',
			use_cases:
				'layouts, CSS variables, split layout, fullscreen, dashboard, story theming, scrolly styling, gotchas'
		},
		{
			title: 'Components',
			slug: 'components',
			use_cases:
				'scrolly, scroll detection, story header, navigation, footer, markdown, code blocks, theme toggle, tooltips'
		},
		{
			title: 'Extensions - msgraph',
			slug: 'extensions/msgraph',
			use_cases: 'SharePoint, Excel, content sync, Microsoft Graph'
		},
		{
			title: 'Extensions - openalex',
			slug: 'extensions/openalex',
			use_cases: 'academic data, papers, authors, OpenAlex, database'
		}
	];
}

const section_content: Record<string, () => string> = {
	'getting-started': () => clean_mdsvex(getting_started_raw),
	'reference': () => clean_mdsvex(reference_raw),
	'components': () => all_components(),
	'extensions/msgraph': () => clean_mdsvex(msgraph_raw),
	'extensions/openalex': () => clean_mdsvex(openalex_raw)
};

export function get_section_content(slug: string): string | null {
	const fn = section_content[slug];
	return fn ? fn() : null;
}

export function get_all_content(): string {
	return get_sections()
		.map((s) => `## ${s.title}\n\n${get_section_content(s.slug)}`)
		.join('\n\n---\n\n');
}
