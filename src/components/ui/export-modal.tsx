import { useState } from 'react'
import { GridContext } from '../../contexts/grid-context'
import { LayerContext } from '../../contexts/layer-context'
import { useSafeContext } from '../../hooks'
import { Button } from './button'
import { Modal } from './modal'

interface ExportModalProps {
	onClose: () => void
}

export const ExportModal = ({ onClose }: ExportModalProps) => {
	const [scale, setScale] = useState(1)
	const { getMerged } = useSafeContext(LayerContext)
	const { width, height } = useSafeContext(GridContext)

	const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newScale = parseInt(e.target.value, 10)
		setScale(newScale)
	}

	const handleExport = () => {
		const merged = getMerged()

		const canvas = document.createElement('canvas')
		canvas.width = width * scale
		canvas.height = height * scale

		const ctx = canvas.getContext('2d')
		if (!ctx) return
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const color = merged[y]?.[x] || 'transparent'
				ctx.fillStyle = color
				ctx.fillRect(x * scale, y * scale, scale, scale)
			}
		}

		const link = document.createElement('a')
		link.download = `pixie-${Date.now()}.png`
		link.href = canvas.toDataURL()

		link.click()
		onClose()
	}

	return (
		<Modal onClose={onClose}>
			<h2 className='text-lg font-bold'>Baixar imagem</h2>
			<p className='text-sm mb-4 text-slate-700 dark:text-slate-300'>
				Você pode mudar as dimensões da imagem antes de baixar.
			</p>
			<input
				type='range'
				id='scale'
				value={scale}
				onChange={handleScaleChange}
				min={1}
				max={100}
				step={1}
				className='slider appearance-none w-full h-1 bg-slate-600 dark:bg-slate-400 rounded-full  cursor-pointer my-4'
			/>
			<div className='flex justify-between text-sm text-slate-500'>
				<label htmlFor='scale' className='font-medium'>
					Escala: <span className='font-bold'>{scale}x</span>
				</label>
				<span>
					{width * scale}
					<span className='font-bold'>x</span>
					{height * scale}
				</span>
			</div>
			<div className='flex justify-end mt-4'>
				<Button
					title='Export'
					onClick={handleExport}
					className='px-4 py-2 rounded-lg bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-950 hover:bg-cyan-400 hover:text-slate-50 transition-all transform active:scale-95 font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500 mt-6'
				>
					Exportar
				</Button>
			</div>
		</Modal>
	)
}
