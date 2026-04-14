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
	shortDescription: 'Claude Code skills for scrolly-kit and Svelte 5',
	options,

	run: ({ sv }) => {
		// --- scrolly-kit skill (core + reference files) ---
		sv.file('.claude/skills/scrolly-kit/SKILL.md', (content) => {
			if (content) return content;
			return readSkill('scrolly-kit/SKILL.md');
		});
		sv.file('.claude/skills/scrolly-kit/COMPONENTS.md', (content) => {
			if (content) return content;
			return readSkill('scrolly-kit/COMPONENTS.md');
		});
		sv.file('.claude/skills/scrolly-kit/LAYOUTS.md', (content) => {
			if (content) return content;
			return readSkill('scrolly-kit/LAYOUTS.md');
		});
		sv.file('.claude/skills/scrolly-kit/PATTERNS.md', (content) => {
			if (content) return content;
			return readSkill('scrolly-kit/PATTERNS.md');
		});

		// --- svelte-code-writer skill ---
		sv.file('.claude/skills/svelte-code-writer/SKILL.md', (content) => {
			if (content) return content;
			return readSkill('svelte-code-writer/SKILL.md');
		});

		// --- svelte-core-bestpractices skill + references ---
		sv.file('.claude/skills/svelte-core-bestpractices/SKILL.md', (content) => {
			if (content) return content;
			return readSkill('svelte-core-bestpractices/SKILL.md');
		});

		const refs = [
			'@attach.md',
			'@render.md',
			'$inspect.md',
			'await-expressions.md',
			'bind.md',
			'each.md',
			'hydratable.md',
			'snippet.md',
			'svelte-reactivity.md'
		];
		for (const ref of refs) {
			sv.file(`.claude/skills/svelte-core-bestpractices/references/${ref}`, (content) => {
				if (content) return content;
				return readSkill(`svelte-core-bestpractices/references/${ref}`);
			});
		}
	},

	nextSteps: () => [
		'Skills are now available to Claude Code',
		'Claude will auto-detect when to use them based on your requests',
		'No manual setup needed — just ask Claude to build a story'
	]
});
