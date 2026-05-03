import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/header'
import { PixieTestProviders } from '@/spec/test-providers'

describe('Header', () => {
	it('opens export modal when clicking Exportar', () => {
		render(
			<PixieTestProviders>
				<Header onToggleSidebar={() => {}} />
			</PixieTestProviders>,
		)

		fireEvent.click(screen.getByRole('button', { name: 'Exportar' }))

		expect(screen.getByText('Baixar imagem')).toBeInTheDocument()
	})

	it('opens grid modal when clicking grid size button', () => {
		render(
			<PixieTestProviders>
				<Header onToggleSidebar={() => {}} />
			</PixieTestProviders>,
		)

		fireEvent.click(screen.getByTitle('Grid'))

		expect(screen.getByText('Configurar Grade')).toBeInTheDocument()
	})
})
