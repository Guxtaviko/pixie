import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PixieTestProviders } from '../../../spec/test-providers'
import { Layers } from '../layers'

describe('Layers', () => {
	it('adds a new layer from add button', () => {
		render(
			<PixieTestProviders>
				<Layers />
			</PixieTestProviders>,
		)

		const addButton = screen.getByTitle('Adicionar camada')
		fireEvent.click(addButton)

		expect(screen.getAllByDisplayValue(/Camada/i).length).toBeGreaterThan(1)
	})
})
