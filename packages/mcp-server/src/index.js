import { McpServer } from 'tmcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import * as v from 'valibot';
import { tool } from 'tmcp/utils';

const DOCS_BASE_URL =
	process.env.SCROLLY_DOCS_URL || 'https://vermont-complex-systems.github.io/vcsi-starter';

async function fetch_json(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
	return res.json();
}

async function fetch_text(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
	return res.text();
}

// sections.json changes only on docs deploys — cache it briefly so every
// tool call doesn't re-fetch it.
const SECTIONS_TTL_MS = 5 * 60 * 1000;
let sections_cache = null;
let sections_fetched_at = 0;

async function fetch_sections() {
	if (sections_cache && Date.now() - sections_fetched_at < SECTIONS_TTL_MS) {
		return sections_cache;
	}
	sections_cache = await fetch_json(`${DOCS_BASE_URL}/sections.json`);
	sections_fetched_at = Date.now();
	return sections_cache;
}

// --- Server ---

export const server = new McpServer(
	{
		name: 'scrolly-mcp',
		version: '0.1.0',
		description: 'MCP server for @the-vcsi/scrolly-kit documentation and code analysis',
	},
	{
		adapter: new ValibotJsonSchemaAdapter(),
		capabilities: {
			tools: {},
		},
		instructions:
			'This is the scrolly-kit MCP server. Use it when building scrollytelling stories with @the-vcsi/scrolly-kit. Call list-sections first to discover available documentation, then get-documentation to fetch relevant sections.',
	},
);

// --- Tools ---

// list-sections

export async function list_sections_handler() {
	const sections = await fetch_sections();
	return sections
		.map((s) => `- title: ${s.title}, use_cases: ${s.use_cases}, path: ${s.slug}`)
		.join('\n');
}

server.tool(
	{
		name: 'list-sections',
		description:
			'Lists all available scrolly-kit documentation sections. Each section includes a "use_cases" field describing when it is useful. Call this FIRST, then use get-documentation to fetch relevant sections.',
		annotations: {
			title: 'List Sections',
			readOnlyHint: true,
		},
	},
	async () => {
		const content = await list_sections_handler();
		return tool.text(content);
	},
);

// get-documentation

const get_documentation_schema = v.object({
	section: v.pipe(
		v.union([v.string(), v.array(v.string())]),
		v.description(
			'Section slug(s) to retrieve (e.g., "reference", "components"). Supports single string or array.',
		),
	),
});

export async function get_documentation_handler({ section }) {
	const slugs = Array.isArray(section) ? section : [section];

	// Fetch available sections for matching
	const available = await fetch_sections();

	const results = await Promise.allSettled(
		slugs.map(async (requested) => {
			// Match by slug or title (case-insensitive)
			const matched = available.find(
				(s) =>
					s.slug === requested ||
					s.title.toLowerCase() === requested.toLowerCase(),
			);

			if (matched) {
				const content = await fetch_text(`${DOCS_BASE_URL}/${matched.slug}/llms.txt`);
				return `## ${matched.title}\n\n${content}`;
			}

			// Fuzzy match
			const lower = requested.toLowerCase();
			const similar = available.filter(
				(s) =>
					s.title.toLowerCase().includes(lower) ||
					s.slug.includes(lower) ||
					s.use_cases.toLowerCase().includes(lower),
			);

			if (similar.length > 0) {
				const list = similar.map((s) => `- ${s.title} (${s.slug})`).join('\n');
				return `Section "${requested}" not found. Similar sections:\n${list}`;
			}

			return `Section "${requested}" not found.`;
		}),
	);

	return results
		.map((r) => (r.status === 'fulfilled' ? r.value : `Error: ${r.reason}`))
		.join('\n\n---\n\n');
}

server.tool(
	{
		name: 'get-documentation',
		description:
			'Retrieves documentation for scrolly-kit sections. Accepts section slugs (e.g., "reference", "components") or titles. Call list-sections first to discover available sections.',
		schema: get_documentation_schema,
		annotations: {
			title: 'Get Documentation',
			readOnlyHint: true,
		},
	},
	async ({ section }) => {
		const content = await get_documentation_handler({ section });
		return tool.text(content);
	},
);
