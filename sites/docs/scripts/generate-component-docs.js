/**
 * Generates markdown documentation pages from components.ts
 * Run: node scripts/generate-component-docs.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Parse components.ts by importing it dynamically via a simple extraction
// Since components.ts uses TypeScript, we extract the data with a regex approach
const src = readFileSync(join(ROOT, 'src/lib/data/components.ts'), 'utf8');

// Use a dynamic import trick: strip types and eval
// Simpler: just use Node with --experimental-strip-types or tsx
// For maximum compatibility, we'll parse the exported object ourselves
const componentBlocks = [];
const nameRegex = /^\s{2}(\w+):\s*\{/gm;
let match;
while ((match = nameRegex.exec(src)) !== null) {
	componentBlocks.push({ name: match[1], start: match.index });
}

// Extract each component's data by finding balanced braces
function extractComponent(name) {
	const props = [];
	const cssVars = [];

	// Find the component block
	const blockStart = src.indexOf(`  ${name}: {`);
	if (blockStart === -1) return null;

	// Extract description
	const descMatch = src
		.slice(blockStart)
		.match(/description:\s*'([^']*(?:\\.[^']*)*)'/);
	const description = descMatch ? descMatch[1].replace(/\\'/g, "'") : '';

	// Extract category
	const catMatch = src.slice(blockStart).match(/category:\s*'([^']*)'/);
	const category = catMatch ? catMatch[1] : '';

	// Find the closing bracket of an array, handling nested brackets
	function findArrayEnd(str, start) {
		let depth = 0;
		for (let i = start; i < str.length; i++) {
			if (str[i] === '[') depth++;
			if (str[i] === ']') { depth--; if (depth === 0) return i; }
		}
		return -1;
	}

	// Extract props array
	const propsStart = src.indexOf('props: [', blockStart);
	if (propsStart !== -1 && propsStart < blockStart + 3000) {
		const arrayStart = src.indexOf('[', propsStart);
		const propsEnd = findArrayEnd(src, arrayStart);
		const propsStr = src.slice(propsStart, propsEnd + 1);
		const propRegex =
			/\{\s*name:\s*'([^']*)',\s*type:\s*'([^']*)',\s*default:\s*'([^']*)',\s*description:\s*'([^']*)'\s*\}/g;
		let pm;
		while ((pm = propRegex.exec(propsStr)) !== null) {
			props.push({
				name: pm[1],
				type: pm[2],
				default: pm[3],
				description: pm[4],
			});
		}
	}

	// Extract cssVars array
	const cssStart = src.indexOf('cssVars: [', blockStart);
	if (cssStart !== -1 && cssStart < blockStart + 5000) {
		const cssArrayStart = src.indexOf('[', cssStart);
		const cssEnd = findArrayEnd(src, cssArrayStart);
		const cssStr = src.slice(cssStart, cssEnd + 1);
		const cssRegex =
			/\{\s*name:\s*'([^']*)',\s*default:\s*'([^']*)',\s*description:\s*'([^']*)'\s*\}/g;
		let cm;
		while ((cm = cssRegex.exec(cssStr)) !== null) {
			cssVars.push({ name: cm[1], default: cm[2], description: cm[3] });
		}
	}

	// Extract usage
	const usageStart = src.indexOf('usage: `', blockStart);
	let usage = '';
	if (usageStart !== -1 && usageStart < blockStart + 5000) {
		const usageEnd = src.indexOf('`', usageStart + 8);
		usage = src
			.slice(usageStart + 8, usageEnd)
			.replace(/\\\/script/g, '/script');
	}

	return { name, description, category, props, cssVars, usage };
}

function generateMarkdown(comp) {
	const lines = [];

	lines.push('---');
	lines.push(`title: ${comp.name} - scrolly-kit`);
	lines.push('---');
	lines.push('');
	lines.push(`<script>`);
	lines.push(`  import { base } from '$app/paths';`);
	lines.push(`</script>`);
	lines.push('');
	lines.push(
		`<div class="breadcrumb"><a href="{base}/components">Components</a> / ${comp.name}</div>`
	);
	lines.push('');
	lines.push(`# ${comp.name}`);
	lines.push('');
	lines.push(`<p class="subtitle">${comp.description}</p>`);
	lines.push('');
	lines.push(`**Category:** ${comp.category}`);
	lines.push('');

	// Remove curly braces from text to avoid mdsvex parsing issues
	function esc(str) {
		return str.replace(/\{([^}]*)\}/g, '($1)');
	}

	// Props table
	if (comp.props.length > 0) {
		lines.push('## Props');
		lines.push('');
		lines.push('| Prop | Type | Default | Description |');
		lines.push('|------|------|---------|-------------|');
		for (const p of comp.props) {
			lines.push(
				`| \`${p.name}\` | \`${esc(p.type)}\` | \`${p.default}\` | ${esc(p.description)} |`
			);
		}
		lines.push('');
	} else {
		lines.push('## Props');
		lines.push('');
		lines.push('No props -- uses internal state.');
		lines.push('');
	}

	// CSS vars table
	if (comp.cssVars.length > 0) {
		lines.push('## CSS Variables');
		lines.push('');
		lines.push('| Variable | Default | Description |');
		lines.push('|----------|---------|-------------|');
		for (const v of comp.cssVars) {
			lines.push(`| \`${v.name}\` | \`${v.default}\` | ${v.description} |`);
		}
		lines.push('');
	}

	// Note: usage examples are available via the llms.txt endpoint (serialized from components.ts)
	// We omit code blocks here because mdsvex cannot safely render Svelte syntax in fenced blocks

	return lines.join('\n');
}

// Generate all component docs
const outDir = join(ROOT, 'src/routes/components');

for (const block of componentBlocks) {
	const comp = extractComponent(block.name);
	if (!comp) continue;

	const dir = join(outDir, comp.name);
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, '+page.md'), generateMarkdown(comp));
	console.log(`  generated ${comp.name}/+page.md`);
}

console.log(`\nDone. Generated ${componentBlocks.length} component docs.`);
