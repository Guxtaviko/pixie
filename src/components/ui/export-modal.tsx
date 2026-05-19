import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { GridContext } from '@/contexts/grid-context'
import { LayerContext } from '@/contexts/layer-context'
import { useSafeContext } from '@/hooks'

interface ExportModalProps {
	onClose: () => void
}

const scalePresets = [2, 3, 5, 10]
const fitPresets = [480, 720, 1080]

const presets = [
	...scalePresets.map((s) => ({ type: `scale`, value: s })),
	...fitPresets.map((h) => ({ type: 'fit', value: h })),
]

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
				max={64}
				step={1}
				className='slider appearance-none w-full h-1 bg-slate-600 dark:bg-slate-400 rounded-full  cursor-pointer my-4'
			/>
			<div className='flex flex-wrap gap-2 mb-4 mt-1 justify-around'>
				{presets.map(({ type, value }) => {
					const label = type === 'scale' ? `${value}x` : `${value}px`
					const calculatedScale =
						type === 'scale' ? value : Math.max(1, Math.ceil(value / height))

					const isSelected = scale === calculatedScale

					return (
						<button
							type='button'
							key={value}
							onClick={() => setScale(calculatedScale)}
							className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
								isSelected
									? 'bg-cyan-500 text-slate-50'
									: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-cyan-500 hover:text-slate-50'
							}`}
						>
							{label}
						</button>
					)
				})}
			</div>
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
