import { json } from '@sveltejs/kit';
import { get_sections } from '$lib/server/llms';

export const prerender = true;

export function GET() {
	return json(get_sections());
}
