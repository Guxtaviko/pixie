import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PixieTestProviders } from '../../spec/test-providers'
import { ToolBar } from '../tool-bar'

describe('ToolBar', () => {
	it('renders app version and allows selecting eraser tool', () => {
		render(
			<PixieTestProviders>
				<ToolBar />
			</PixieTestProviders>,
		)

		expect(screen.getByText('v1.0.0')).toBeInTheDocument()

		const eraserButton = screen.getByRole('button', { name: 'Borracha' })
		fireEvent.click(eraserButton)

		expect(eraserButton.className).toContain('bg-cyan-500')
	})
})
