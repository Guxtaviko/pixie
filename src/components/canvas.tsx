import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from 'lucide-react'
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '../config/settings'
import { useLocalStorage } from '../hooks'
import { Button } from './ui/button'

export const Canvas = () => {
	const [zoom, setZoom] = useLocalStorage<number>('canvas-zoom', DEFAULT_ZOOM)

	const increaseZoom = () => {
		setZoom((prevZoom) => Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM)) // Limita o zoom máximo a 3x
	}
	const decreaseZoom = () => {
		setZoom((prevZoom) => Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM)) // Limita o zoom mínimo a 0.5x
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
					disabled={zoom <= MIN_ZOOM}
					className='p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:text-slate-500/50'
				>
					<ZoomOutIcon size={16} />
				</Button>
				<Button
					onClick={() => setZoom(DEFAULT_ZOOM)}
					className='text-sm w-12 text-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 '
				>
					{Math.round(zoom * 100)}%
				</Button>
				<Button
					onClick={increaseZoom}
					disabled={zoom >= MAX_ZOOM}
					className='p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:text-slate-500/50'
				>
					<ZoomInIcon size={16} />
				</Button>
			</div>
		</div>
	)
}
