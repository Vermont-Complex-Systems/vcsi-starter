import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineAddon, defineAddonOptions } from 'sv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSkill = (relativePath) =>
	fs.readFileSync(path.join(__dirname, 'skills', relativePath), 'utf-8');

const options = defineAddonOptions().build();

export default defineAddon({
	id: '@the-vcsi/svelte-d3-charting',
	shortDescription: 'Claude Code skill for Svelte + D3 charting best practices',
	options,

	run: ({ sv }) => {
		sv.file('.claude/skills/svelte-d3-charting/SKILL.md', () => readSkill('svelte-d3-charting/SKILL.md'));
	},

	nextSteps: () => [
		'The svelte-d3-charting skill is now available to Claude Code',
		'Claude will use it when you ask to create or edit chart components',
		'Covers responsive sizing, reactive scales, CSS transitions, Svelte Tween, and more'
	]
});
