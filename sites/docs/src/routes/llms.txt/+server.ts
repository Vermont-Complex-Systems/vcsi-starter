import { get_all_content } from '$lib/server/llms';

export const prerender = true;

export function GET() {
	return new Response('# scrolly-kit Documentation\n\n' + get_all_content(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
