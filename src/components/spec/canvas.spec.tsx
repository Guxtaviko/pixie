import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../config/settings', async () => {
	const actual = await vi.importActual('../../config/settings')
	return {
		...actual,
		GRID_FIT_MULTIPLIER: 0.8,
	}
})

import { Canvas } from '@/components/canvas'
import { PixieTestProviders } from '@/spec/test-providers'

describe('Canvas', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		localStorage.clear()
	})

	const installResizeObserver = (width: number, height: number) => {
		class MockResizeObserver {
			private readonly callback: ResizeObserverCallback

			constructor(callback: ResizeObserverCallback) {
				this.callback = callback
			}

			observe = (target: Element) => {
				this.callback(
					[
						{
							target,
							contentRect: { width, height } as DOMRectReadOnly,
						} as ResizeObserverEntry,
					],
					this as unknown as ResizeObserver,
				)
			}

			unobserve = () => {}

			disconnect = () => {}
		}

		vi.stubGlobal('ResizeObserver', MockResizeObserver)
	}

	it('renders drawing canvas and zoom controls', () => {
		installResizeObserver(640, 480)

		const { container } = render(
			<PixieTestProviders>
				<Canvas />
			</PixieTestProviders>,
		)

		expect(container.querySelector('canvas')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '100%' })).toBeInTheDocument()
	})

	it('auto-fits the canvas when available space is measured', async () => {
		installResizeObserver(640, 480)

		const { container } = render(
			<PixieTestProviders>
				<Canvas />
			</PixieTestProviders>,
		)

		const canvas = container.querySelector('canvas')
		expect(canvas).toBeInTheDocument()

		await waitFor(() => {
			expect(canvas).toHaveAttribute('width', '384')
			expect(canvas).toHaveAttribute('height', '384')
		})
	})

	it('keeps a manual pixel size override active', async () => {
		localStorage.setItem('pixel-size-mode', JSON.stringify('manual'))
		localStorage.setItem('pixel-size', JSON.stringify(20))
		installResizeObserver(640, 480)

		const { container } = render(
			<PixieTestProviders>
				<Canvas />
			</PixieTestProviders>,
		)

		const canvas = container.querySelector('canvas')
		expect(canvas).toBeInTheDocument()

		await waitFor(() => {
			expect(canvas).toHaveAttribute('width', '320')
			expect(canvas).toHaveAttribute('height', '320')
		})
	})
})
