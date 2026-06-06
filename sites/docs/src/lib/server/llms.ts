import { components, type ComponentDoc } from '$lib/data/components';

// Raw markdown imports for prose pages
import getting_started_raw from '../../routes/+page.md?raw';
import reference_raw from '../../routes/reference/+page.md?raw';
import msgraph_raw from '../../routes/extensions/msgraph/+page.md?raw';
import openalex_raw from '../../routes/extensions/openalex/+page.md?raw';

function clean(md: string): string {
	return md
		.replace(/^---[\s\S]*?---\s*/, '')
		.replace(/<script[\s\S]*?<\/script>\s*/gi, '')
		.trim();
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

export function serialize_component(comp: ComponentDoc): string {
	const lines: string[] = [];

	lines.push(`# ${comp.name}`);
	lines.push('');
	lines.push(comp.description);
	lines.push('');
	lines.push(`Category: ${comp.category}`);
	lines.push('');

	if (comp.props.length > 0) {
		lines.push('## Props');
		lines.push('');
		for (const p of comp.props) {
			lines.push(`- \`${p.name}\` (${p.type}, default: ${p.default}) — ${p.description}`);
		}
		lines.push('');
	}

	if (comp.cssVars && comp.cssVars.length > 0) {
		lines.push('## CSS Variables');
		lines.push('');
		for (const v of comp.cssVars) {
			lines.push(`- \`${v.name}\` (default: ${v.default}) — ${v.description}`);
		}
		lines.push('');
	}

	lines.push('## Import');
	lines.push('');
	lines.push(`import { ${comp.name} } from '@the-vcsi/scrolly-kit';`);
	lines.push('');

	if (comp.usage) {
		lines.push('## Usage');
		lines.push('');
		lines.push(comp.usage);
		lines.push('');
	}

	return lines.join('\n');
}

export function serialize_all_components(): string {
	return Object.values(components)
		.map(serialize_component)
		.join('\n---\n\n');
}

const section_content: Record<string, () => string> = {
	'getting-started': () => clean(getting_started_raw),
	'reference': () => clean(reference_raw),
	'components': () => serialize_all_components(),
	'extensions/msgraph': () => clean(msgraph_raw),
	'extensions/openalex': () => clean(openalex_raw)
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
