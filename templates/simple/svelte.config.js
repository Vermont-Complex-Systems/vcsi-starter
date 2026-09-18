import adapter from '@sveltejs/adapter-static'
import { readFileSync } from 'fs';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// Example of how to dynamically prerender members in static web app.
// There might be a better way to do that at some point.
const membersCSV = readFileSync('src/lib/data/members.csv', 'utf-8');
const memberIds = membersCSV.split(/\r?\n/).slice(1).filter(line => line.trim()).map(line => line.split(',')[0]);

// Parse one CSV line, honouring "quoted, comma-containing" fields.
function parseCsvLine(line) {
	const cols = [];
	let cur = '', inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const c = line[i];
		if (inQuotes) {
			if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
			else if (c === '"') inQuotes = false;
			else cur += c;
		} else if (c === '"') inQuotes = true;
		else if (c === ',') { cols.push(cur); cur = ''; }
		else cur += c;
	}
	cols.push(cur);
	return cols;
}

const storiesCSV = readFileSync('src/lib/data/stories.csv', 'utf-8');
const storiesLines = storiesCSV.split(/\r?\n/).filter(line => line.trim());
// Look columns up by header name, so adding a column can't shift the filters.
const storiesHeader = parseCsvLine(storiesLines[0]);
const storyCol = (cols, name) => cols[storiesHeader.indexOf(name)] ?? '';
// ishidden=true means unlisted AND unbuilt: no page is emitted for it.
const storiesIds = storiesLines.slice(1)
	.map(parseCsvLine)
	.filter(cols => storyCol(cols, 'ishidden') !== 'true')
	.map(cols => storyCol(cols, 'slug'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		prerender: {
			entries: [
				'*',
				...memberIds.map(id => `/about/${id}`),
				...storiesIds.map(id => `/${id}`)
			],
			// /[slug] may legitimately have zero entries (every story hidden or
			// external), which is not an error.
			handleUnseenRoutes: 'ignore'
		},
		adapter: adapter(),
		experimental: {
			remoteFunctions: true,
		},
	},
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
	vitePlugin: {
		inspector: true,
	},
}

export default config