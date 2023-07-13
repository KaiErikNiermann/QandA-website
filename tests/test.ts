import { expect, test } from '@playwright/test';

test('very basic page rendering', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('button', { hasText: 'Request Data from GET endpoint' })).toBeVisible();
});

test('verify the WebSocket connection', async ({ page }) => {
	await page.goto('/');
	await page.locator('button', { hasText: 'Request Data from GET endpoint' }).click();
	await page.waitForLoadState('networkidle');
	// get ul element which has a specific class 
	const logElement = await page.locator('ul.event_list');
	const logHtml = await logElement.innerHTML();
	// console.log('Log HTML', logHtml);
	expect(logHtml).toContain('[websocket] connection open');
	expect(logHtml).toContain('[websocket] message received:');
	expect(logHtml).toContain('[websocket] message received: Hello from the GET handler');
});