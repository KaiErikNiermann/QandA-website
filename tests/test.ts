import { expect, test } from '@playwright/test';

test('test1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('button', { hasText: "Request Data from GET endpoint" })).toBeVisible();
});
