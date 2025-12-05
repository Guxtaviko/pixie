import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from 'lucide-react'
import { useLocalStorage } from '../hooks'
import { Button } from './ui/button'

const maxZoom = 3
const minZoom = 0.5
const zoomStep = 0.25

export const Canvas = () => {
	const [zoom, setZoom] = useLocalStorage<number>('canvas-zoom', 1)

	const increaseZoom = () => {
		setZoom((prevZoom) => Math.min(prevZoom + zoomStep, maxZoom)) // Limita o zoom máximo a 3x
	}
	const decreaseZoom = () => {
		setZoom((prevZoom) => Math.max(prevZoom - zoomStep, minZoom)) // Limita o zoom mínimo a 0.5x
	}

	return (
		<div className='flex-1 relative overflow-hidden flex items-center justify-center p-8 cursor-crosshair touch-none bg-radial-[at_50%_50%] from-slate-200 to-slate-50 dark:from-slate-800 dark:to-slate-950 '>
			<div
				className='relative transition-transform duration-200'
				style={{ transform: `scale(${zoom})`, imageRendering: 'pixelated' }}
			>
				<canvas width={512} height={512} className='bg-slate-950' />
			</div>

			<div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 border section rounded-full px-3 py-1.5 backdrop-blur-xs'>
				<Button
					onClick={decreaseZoom}
					disabled={zoom <= minZoom}
					className='p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:text-slate-500/50'
				>
					<ZoomOutIcon size={16} />
				</Button>
				<Button
					onClick={() => setZoom(1)}
					className='text-sm w-12 text-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 '
				>
					{Math.round(zoom * 100)}%
				</Button>
				<Button
					onClick={increaseZoom}
					disabled={zoom >= maxZoom}
					className='p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:text-slate-500/50'
				>
					<ZoomInIcon size={16} />
				</Button>
			</div>
		</div>
	)
}
