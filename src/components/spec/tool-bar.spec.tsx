import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToolBar } from '@/components/tool-bar'
import { PixieTestProviders } from '@/spec/test-providers'

describe('ToolBar', () => {
	it('renders app version using APP_VERSION constant', () => {
		render(
			<PixieTestProviders>
				<ToolBar />
			</PixieTestProviders>,
		)

		expect(screen.getByText(`v${APP_VERSION}`)).toBeInTheDocument()
	})

	it('allows selecting brush tool', () => {
		render(
			<PixieTestProviders>
				<ToolBar />
			</PixieTestProviders>,
		)

		const brushButton = screen.getByRole('button', { name: 'Pincel' })
		fireEvent.click(brushButton)

		expect(brushButton.className).toContain('bg-cyan-500')
	})

	it('updates active state when switching tools', () => {
		render(
			<PixieTestProviders>
				<ToolBar />
			</PixieTestProviders>,
		)

		const eraserButton = screen.getByRole('button', { name: 'Borracha' })
		const pickerButton = screen.getByRole('button', { name: 'Conta-gotas' })

		fireEvent.click(eraserButton)
		expect(eraserButton.className).toContain('bg-cyan-500')

		fireEvent.click(pickerButton)
		expect(pickerButton.className).toContain('bg-cyan-500')
		expect(eraserButton.className).not.toContain('bg-cyan-500')
	})

	it('renders all tool buttons', () => {
		render(
			<PixieTestProviders>
				<ToolBar />
			</PixieTestProviders>,
		)

		expect(screen.getByRole('button', { name: 'Pincel' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Borracha' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Balde' })).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: 'Conta-gotas' }),
		).toBeInTheDocument()
	})
})
