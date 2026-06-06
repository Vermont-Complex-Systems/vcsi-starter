import { error } from '@sveltejs/kit';
import { get_sections, get_section_content } from '$lib/server/llms';

export const prerender = true;

export function entries() {
	return get_sections().map((s) => ({ path: s.slug }));
}

export function GET({ params }) {
	const content = get_section_content(params.path);

	if (!content) {
		error(404, 'Section not found');
	}

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
