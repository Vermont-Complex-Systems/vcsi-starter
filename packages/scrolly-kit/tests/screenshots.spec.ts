import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5199';

/** Let fonts, images, and the initial IntersectionObserver pass settle. */
async function settle(page: Page) {
	await page.waitForLoadState('networkidle');
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(400);
}

test.describe('kitchen sink (bare typography + Nav)', () => {
	test('desktop light', async ({ page }) => {
		await page.goto(`${BASE}/`);
		await settle(page);
		await expect(page).toHaveScreenshot('kitchen-sink-desktop-light.png', { fullPage: true });
	});

	test('desktop dark', async ({ page, browser }) => {
		const ctx = await browser.newContext({ colorScheme: 'dark', reducedMotion: 'reduce' });
		const darkPage = await ctx.newPage();
		await darkPage.setViewportSize({ width: 1200, height: 800 });
		await darkPage.goto(`${BASE}/`);
		await settle(darkPage);
		await expect(darkPage).toHaveScreenshot('kitchen-sink-desktop-dark.png', { fullPage: true });
		await ctx.close();
	});

	test('mobile (Nav hamburger + logo)', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 700 });
		await page.goto(`${BASE}/`);
		await settle(page);
		await expect(page).toHaveScreenshot('kitchen-sink-mobile.png', { fullPage: true });
	});
});

test.describe('story (layouts + steps + theming)', () => {
	test('desktop, light story theme', async ({ page }) => {
		await page.goto(`${BASE}/story`);
		await settle(page);
		await expect(page).toHaveScreenshot('story-desktop-light.png', { fullPage: true });
	});

	test('desktop, dark story theme (data-theme toggle + matched Footer)', async ({ page }) => {
		await page.goto(`${BASE}/story`);
		await settle(page);
		await page.getByRole('button', { name: /story theme/i }).click();
		await page.waitForTimeout(200);
		await expect(page).toHaveScreenshot('story-desktop-dark.png', { fullPage: true });
	});

	test('mobile (collapsed split-layout)', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 700 });
		await page.goto(`${BASE}/story`);
		await settle(page);
		await expect(page).toHaveScreenshot('story-mobile.png', { fullPage: true });
	});
});

test.describe('story theme isolation (leak detector)', () => {
	// The same baseline is asserted under global-light AND global-dark: stories
	// are isolated from the global toggle, so any pixel difference means a
	// semantic token is missing from the isolation lists in layouts.css.
	// The floating global ThemeToggle legitimately differs (sun/moon), so mask it.
	for (const scheme of ['light', 'dark'] as const) {
		test(`story is identical under global ${scheme} mode`, async ({ browser }) => {
			const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: 'reduce' });
			const page = await ctx.newPage();
			await page.setViewportSize({ width: 1200, height: 800 });
			await page.goto(`${BASE}/story`);
			await settle(page);
			await expect(page).toHaveScreenshot('story-isolation.png', {
				fullPage: true,
				mask: [page.locator('.playground-theme-toggle')]
			});
			await ctx.close();
		});
	}
});
