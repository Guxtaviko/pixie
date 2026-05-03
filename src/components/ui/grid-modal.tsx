import {
	Square as Grid16Icon,
	Grid2x2 as Grid32Icon,
	Grid3X3 as Grid64Icon,
	Minus as MinusIcon,
	Plus as PlusIcon,
	RotateCcw as RestoreIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { DEFAULT_PIXEL_SIZE } from '@/config/settings'
import { GridContext } from '@/contexts/grid-context'
import { HistoryContext } from '@/contexts/history-context'
import { LayerContext } from '@/contexts/layer-context'
import { useSafeContext } from '@/hooks'

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
		pixelSize,
		pixelSizeMode,
		manualPixelSize,
		setPixelSize,
		setPixelSizeMode,
		resetPixelSize,
	} = useSafeContext(GridContext)
	const { resetLayers } = useSafeContext(LayerContext)
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
		resetLayers()
		clearHistory()
		onClose()
	}

	const handlePixelSizeChange = (value: number) => {
		setPixelSize(Math.max(1, value))
	}

	return (
		<Modal onClose={onClose}>
			<h2 className='text-lg font-bold'>Configurar Grade</h2>
			<p className='text-sm text-slate-500 mb-5'>
				Configure o tamanho da grade e os pixels.
			</p>
			<h3 className='font-semibold text-slate-900 dark:text-slate-100 mb-3'>
				Tamanho dos pixels
			</h3>
			<div className='flex flex-wrap gap-2 mb-3'>
				<Button
					onClick={() => setPixelSizeMode('auto')}
					className={`px-3 py-2 rounded-lg border-2 text-sm transition-colors ${pixelSizeMode === 'auto' ? 'border-cyan-500 text-cyan-400' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-950'}`}
				>
					Auto-fit
				</Button>
				<Button
					onClick={() => setPixelSizeMode('manual')}
					className={`px-3 py-2 rounded-lg border-2 text-sm transition-colors ${pixelSizeMode === 'manual' ? 'border-cyan-500 text-cyan-400' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-950'}`}
				>
					Manual
				</Button>
			</div>
			{pixelSizeMode === 'auto' ? (
				<p className='text-sm text-slate-500 mb-5'>
					Auto-fit ativo. Tamanho atual: {pixelSize}px.
				</p>
			) : (
				<div className='flex items-center gap-2 mb-5'>
					<Button
						disabled={manualPixelSize <= 1}
						className='custom-grid-button'
						onClick={() => handlePixelSizeChange(manualPixelSize - 1)}
					>
						<MinusIcon size={20} />
					</Button>
					<input
						type='number'
						value={manualPixelSize}
						onChange={(e) => handlePixelSizeChange(Number(e.target.value) || 1)}
						className='custom-grid-input'
						min={1}
					/>
					<Button
						className='custom-grid-button'
						onClick={() => handlePixelSizeChange(manualPixelSize + 1)}
					>
						<PlusIcon size={20} />
					</Button>
					{manualPixelSize !== DEFAULT_PIXEL_SIZE && (
						<Button
							onClick={resetPixelSize}
							className='inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors ml-2'
						>
							<RestoreIcon size={16} />
						</Button>
					)}
				</div>
			)}
			<h3 className='font-semibold text-slate-900 dark:text-slate-100 mt-6'>
				Dimensões da grade
			</h3>
			<p className='text-sm text-slate-500 mb-5'>
				Mudar o tamanho reiniciará todas as camadas.
			</p>
			<div className='grid grid-cols-3 gap-3 mb-6'>
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
			<div className='flex items-center justify-between gap-5 sm:gap-3 flex-wrap sm:flex-nowrap'>
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
					className='px-4 py-2 rounded-lg bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-950 hover:bg-cyan-400 hover:text-slate-50 transition-all transform active:scale-95 font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500 self-end w-full'
				>
					Aplicar
				</Button>
			</div>
		</Modal>
	)
}
