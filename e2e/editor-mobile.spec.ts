import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		window.localStorage.setItem('help-modal-seen', 'true')
	})

	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto('/')
})

test('mobile layout opens and closes sidebar panel', async ({ page }) => {
	await page
		.locator('.color-selector-wrapper')
		.first()
		.locator('.color-selector-activator')
		.click()
	const toolbarSelector = page.locator('.color-selector-panel:visible').first()
	await expect(toolbarSelector).toBeVisible()

	const centered = await toolbarSelector.evaluate((el) => {
		const rect = el.getBoundingClientRect()
		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2
		const viewportCenterX = window.innerWidth / 2
		const viewportCenterY = window.innerHeight / 2

		return (
			Math.abs(centerX - viewportCenterX) < window.innerWidth * 0.25 &&
			Math.abs(centerY - viewportCenterY) < window.innerHeight * 0.25
		)
	})
	await expect(centered).toBe(true)
	await page.keyboard.press('Escape')

	await page.getByTitle('Abrir painel').click()
	await expect(page.getByTitle('Fechar painel')).toBeVisible()
	await expect(
		page.locator('aside').last().getByRole('heading', { name: 'Cores' }),
	).toBeVisible()

	await page
		.locator('aside')
		.last()
		.locator('.color-selector-activator')
		.first()
		.click()
	await expect(page.locator('.color-selector-panel').last()).toBeVisible()
	await page.keyboard.press('Escape')
	await expect(page.locator('.color-selector-panel').last()).toBeHidden()

	await page.getByTitle('Fechar painel').click()
	await expect(page.getByTitle('Fechar painel')).toBeHidden()
})
