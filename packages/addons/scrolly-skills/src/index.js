import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineAddon, defineAddonOptions } from 'sv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSkill = (relativePath) =>
	fs.readFileSync(path.join(__dirname, 'skills', relativePath), 'utf-8');
const readAgent = (relativePath) =>
	fs.readFileSync(path.join(__dirname, 'agents', relativePath), 'utf-8');

const options = defineAddonOptions().build();

export default defineAddon({
	id: '@the-vcsi/scrolly-skills',
	shortDescription: 'Claude Code skills and MCP config for scrolly-kit',
	options,

	run: ({ sv }) => {
		// --- scrolly-kit skill (principles + reference deep-dives) ---
		sv.file('.claude/skills/scrolly-kit/SKILL.md', () => readSkill('scrolly-kit/SKILL.md'));
		sv.file('.claude/skills/scrolly-kit/references/reactive-index.md', () => readSkill('scrolly-kit/references/reactive-index.md'));
		sv.file('.claude/skills/scrolly-kit/references/copy-json.md', () => readSkill('scrolly-kit/references/copy-json.md'));
		sv.file('.claude/skills/scrolly-kit/references/layouts.md', () => readSkill('scrolly-kit/references/layouts.md'));
		sv.file('.claude/skills/scrolly-kit/references/pages.md', () => readSkill('scrolly-kit/references/pages.md'));

		// --- scrolly-story-editor subagent ---
		sv.file('.claude/agents/scrolly-story-editor.md', () => readAgent('scrolly-story-editor.md'));

		// --- MCP server config ---
		sv.file('.mcp.json', (content) => {
			const config = content ? JSON.parse(content) : {};
			config.mcpServers = config.mcpServers || {};
			if (!config.mcpServers['scrolly-kit']) {
				config.mcpServers['scrolly-kit'] = {
					command: 'npx',
					args: ['@the-vcsi/scrolly-mcp']
				};
			}
			if (!config.mcpServers['svelte']) {
				config.mcpServers['svelte'] = {
					type: 'http',
					url: 'https://mcp.svelte.dev/mcp'
				};
			}
			return JSON.stringify(config, null, '\t');
		});
	},

	nextSteps: () => [
		'scrolly-kit skill installed — Claude will auto-detect when to use it',
		'scrolly-story-editor subagent installed in .claude/agents/ — delegate story work to it',
		'scrolly-kit and Svelte MCP servers configured in .mcp.json',
		'Restart Claude Code (or approve the new MCP servers) to pick up .mcp.json'
	]
});
