import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PixieTestProviders } from '../../spec/test-providers'
import { Canvas } from '../canvas'

describe('Canvas', () => {
	it('renders drawing canvas and zoom controls', () => {
		const { container } = render(
			<PixieTestProviders>
				<Canvas />
			</PixieTestProviders>,
		)

		expect(container.querySelector('canvas')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '100%' })).toBeInTheDocument()
	})
})
