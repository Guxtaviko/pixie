import {
	Square as Grid16Icon,
	Grid2x2 as Grid32Icon,
	Grid3X3 as Grid64Icon,
	Minus as MinusIcon,
	Plus as PlusIcon,
} from 'lucide-react'
import { useState } from 'react'
import { GridContext } from '../../contexts/grid-context'
import { HistoryContext } from '../../contexts/history-context'
import { LayerContext } from '../../contexts/layer-context'
import { useSafeContext } from '../../hooks'
import { Button } from './button'
import { Modal } from './modal'

interface GridModalProps {
	onClose: () => void
}

const defaultOptions = [
	{
		size: 16,
		icon: Grid16Icon,
	},
	{
		size: 32,
		icon: Grid32Icon,
	},
	{
		size: 64,
		icon: Grid64Icon,
	},
]

export const GridModal = ({ onClose }: GridModalProps) => {
	const {
		width: currentWidth,
		height: currentHeight,
		setSize,
	} = useSafeContext(GridContext)
	const { clearLayers } = useSafeContext(LayerContext)
	const { clearHistory } = useSafeContext(HistoryContext)
	const [width, setWidth] = useState<number>(currentWidth)
	const [height, setHeight] = useState<number>(currentHeight)

	const handleOptionChange = (size: number) => {
		setWidth(size)
		setHeight(size)
	}

	const handleSizeChange = () => {
		if (width === currentWidth && height === currentHeight) {
			onClose()
			return
		}

		setSize(width, height)
		clearLayers()
		clearHistory()
		onClose()
	}

	return (
		<Modal onClose={onClose}>
			<h2 className='text-lg font-bold'>Configurar Grade</h2>
			<p className='text-sm text-slate-700 dark:text-slate-300'>
				Mudar o tamanho reiniciará todas as camadas.
			</p>
			<div className='grid grid-cols-3 gap-3 my-6'>
				{defaultOptions.map(({ size, icon: Icon }) => (
					<Button
						key={size}
						onClick={() => handleOptionChange(size)}
						className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
							width === size && height === size
								? 'border-cyan-500 text-cyan-400'
								: 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-950'
						}`}
					>
						<Icon size={20} />
						<span className='font-mono text-sm'>
							{size}x{size}
						</span>
					</Button>
				))}
			</div>
			<div className='flex items-center gap-3'>
				<div className='flex flex-col gap-2'>
					<span className='text-sm text-slate-500'>Largura</span>
					<div className='flex items-center gap-2'>
						<Button
							disabled={width <= 1}
							className='custom-grid-button'
							onClick={() => setWidth(Math.max(1, width - 1))}
						>
							<MinusIcon size={20} />
						</Button>
						{/* <span className='mx-2 font-mono text-lg'>{width}</span> */}
						<input
							type='number'
							value={width}
							onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
							className='custom-grid-input '
							min={1}
						/>
						<Button
							className='custom-grid-button'
							onClick={() => setWidth(width + 1)}
						>
							<PlusIcon size={20} />
						</Button>
					</div>
				</div>
				<div className='flex flex-col gap-2'>
					<span className='text-sm text-slate-500'>Altura</span>
					<div className='flex items-center gap-2'>
						<Button
							disabled={height <= 1}
							className='custom-grid-button'
							onClick={() => setHeight(Math.max(1, height - 1))}
						>
							<MinusIcon size={20} />
						</Button>
						<input
							type='number'
							value={height}
							onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
							className='custom-grid-input '
							min={1}
						/>
						<Button
							className='custom-grid-button'
							onClick={() => setHeight(height + 1)}
						>
							<PlusIcon size={20} />
						</Button>
					</div>
				</div>
				<Button
					title='Apply'
					onClick={handleSizeChange}
					className='px-4 py-2 rounded-lg bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-950 hover:bg-cyan-400 hover:text-slate-50 transition-all transform active:scale-95 font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500 ml-auto self-end'
				>
					Aplicar
				</Button>
			</div>
		</Modal>
	)
}
