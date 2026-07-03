import { defineConfig } from '@playwright/test';

/**
 * Visual smoke tests over the dev playground (the package's untweaked defaults).
 * Baselines are platform-specific (font rendering differs across OSes) — they
 * are generated and checked on Linux. Update intentionally with:
 *   npm run test:visual:update
 */
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	reporter: [['list']],
	use: {
		// We ship prefers-reduced-motion support; using it here also makes
		// screenshots deterministic (no mid-transition captures).
		contrast: 'no-preference',
		reducedMotion: 'reduce',
		deviceScaleFactor: 1,
		viewport: { width: 1200, height: 800 }
	},
	expect: {
		toHaveScreenshot: {
			animations: 'disabled',
			// tolerate sub-pixel antialiasing jitter, fail on anything real
			maxDiffPixels: 100
		}
	},
	webServer: {
		command: 'npm run dev -- --port 5199 --strictPort',
		url: 'http://localhost:5199',
		reuseExistingServer: true,
		timeout: 30_000
	}
});
