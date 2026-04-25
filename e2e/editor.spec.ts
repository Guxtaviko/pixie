import { expect, test } from '@playwright/test'

const readTopLeftPixel = async (page: import('@playwright/test').Page) => {
	return page.evaluate(() => {
		const canvas = document.querySelector('canvas')
		if (!(canvas instanceof HTMLCanvasElement)) return null

		const ctx = canvas.getContext('2d')
		if (!ctx) return null

		const [r, g, b, a] = ctx.getImageData(12, 12, 1, 1).data
		return [r, g, b, a]
	})
}

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		window.localStorage.setItem('help-modal-seen', 'true')
	})

	await page.goto('/')
})

test('draw + undo + redo flow works', async ({ page }) => {
	const before = await readTopLeftPixel(page)
	await expect(before).not.toBeNull()

	const canvas = page.locator('canvas')
	const box = await canvas.boundingBox()
	if (!box) throw new Error('Canvas bounding box not found')

	await page.mouse.click(box.x + 12, box.y + 12)

	const afterDraw = await readTopLeftPixel(page)
	await expect(afterDraw).not.toEqual(before)

	await page.getByTitle('Undo', { exact: true }).click()
	const afterUndo = await readTopLeftPixel(page)
	await expect(afterUndo).toEqual(before)

	await page.getByTitle('Redo', { exact: true }).click()
	const afterRedo = await readTopLeftPixel(page)
	await expect(afterRedo).toEqual(afterDraw)
})

test('drag drawing paints multiple pixels', async ({ page }) => {
	const canvas = page.locator('canvas')
	const box = await canvas.boundingBox()
	if (!box) throw new Error('Canvas bounding box not found')

	const countPainted = async () => {
		return page.evaluate(() => {
			const canvas = document.querySelector('canvas')
			if (!(canvas instanceof HTMLCanvasElement)) return 0

			const ctx = canvas.getContext('2d')
			if (!ctx) return 0

			let painted = 0
			for (let i = 0; i < 7; i++) {
				const x = 12 + i * 16
				const [r, g, b, a] = ctx.getImageData(x, 12, 1, 1).data
				const isDefaultCell = r > 220 && g > 220 && b > 220
				if (a > 0 && !isDefaultCell) painted++
			}

			return painted
		})
	}

	await page.mouse.move(box.x + 12, box.y + 12)
	await page.mouse.down()
	await page.mouse.move(box.x + 108, box.y + 12, { steps: 10 })
	await page.mouse.up()

	const paintedCount = await countPainted()
	await expect(paintedCount).toBeGreaterThan(2)
})

test('layer flow supports adding a new layer', async ({ page }) => {
	const layerNames = page.locator("input[id^='data-'][id$='-name']")
	await expect(layerNames).toHaveCount(1)

	await page.getByTitle('Adicionar camada').click()
	await expect(layerNames).toHaveCount(2)
})

test('export baseline triggers png download', async ({ page }) => {
	await page.getByRole('button', { name: 'Exportar' }).click()
	await expect(page.getByText('Baixar imagem')).toBeVisible()

	const downloadPromise = page.waitForEvent('download')
	await page.getByTitle('Export', { exact: true }).click()
	const download = await downloadPromise

	await expect(download.suggestedFilename()).toMatch(/^pixie-\d+\.png$/)
})
