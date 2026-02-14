import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from "path";
import dsv from "@rollup/plugin-dsv"; // import foo from 'foo.csv'

export default defineConfig({
	plugins: [
		sveltekit(), 
		dsv({
			processRow: (row, id) => {
				Object.keys(row).forEach((key) => {
				var value = row[key];
				row[key] = isNaN(+value) ? value : +value;
				});
			}
			})
	],
	resolve: {
		alias: {
			$data: path.resolve("./src/data"),
			$styles: path.resolve("./src/styles"),
		}
	},
});
