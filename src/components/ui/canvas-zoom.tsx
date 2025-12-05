import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import type { SetStateAction } from 'react'
import {
	DEFAULT_ZOOM,
	MAX_ZOOM,
	MIN_ZOOM,
	ZOOM_STEP,
} from '../../config/settings'
import { Button } from './button'

interface CanvasZoomProps {
	zoom: number
	setZoom: (zoom: SetStateAction<number>) => void
}

export const CanvasZoom = ({ zoom, setZoom }: CanvasZoomProps) => {
	const increaseZoom = () => {
		setZoom((prevZoom) => Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM))
	}
	const decreaseZoom = () => {
		setZoom((prevZoom) => Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM))
	}

	return (
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
	)
}
