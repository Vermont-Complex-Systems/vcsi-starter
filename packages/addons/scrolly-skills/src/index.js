import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineAddon, defineAddonOptions } from 'sv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSkill = (relativePath) =>
	fs.readFileSync(path.join(__dirname, 'skills', relativePath), 'utf-8');

const options = defineAddonOptions().build();

export default defineAddon({
	id: '@the-vcsi/scrolly-skills',
	shortDescription: 'Claude Code skills and MCP config for scrolly-kit',
	options,

	run: ({ sv }) => {
		// --- scrolly-kit skill (core + reference files) ---
		sv.file('.claude/skills/scrolly-kit/SKILL.md', () => readSkill('scrolly-kit/SKILL.md'));
		sv.file('.claude/skills/scrolly-kit/COMPONENTS.md', () => readSkill('scrolly-kit/COMPONENTS.md'));
		sv.file('.claude/skills/scrolly-kit/LAYOUTS.md', () => readSkill('scrolly-kit/LAYOUTS.md'));
		sv.file('.claude/skills/scrolly-kit/PATTERNS.md', () => readSkill('scrolly-kit/PATTERNS.md'));

		// --- MCP server config ---
		sv.file('.mcp.json', (content) => {
			const config = content ? JSON.parse(content) : {};
			config.mcpServers = config.mcpServers || {};
			if (!config.mcpServers['scrolly-kit']) {
				config.mcpServers['scrolly-kit'] = {
					command: 'npx',
					args: ['@the-vcsi/mcp']
				};
			}
			return JSON.stringify(config, null, '\t');
		});
	},

	nextSteps: () => [
		'scrolly-kit skill installed — Claude will auto-detect when to use it',
		'scrolly-kit MCP server configured in .mcp.json',
		'For Svelte 5 docs, connect to the Svelte MCP separately (npx @sveltejs/mcp)'
	]
});
