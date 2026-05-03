import { createContext, useState } from 'react'
import {
	DEFAULT_GRID_SIZE,
	DEFAULT_PIXEL_SIZE,
	DEFAULT_PIXEL_SIZE_MODE,
	DEFAULT_SHOW_GRID,
	type PixelSizeMode,
} from '@/config/settings'
import { useLocalStorage } from '@/hooks'

type GridContextType = {
	width: number
	height: number
	showGrid: boolean
	pixelSize: number
	pixelSizeMode: PixelSizeMode
	manualPixelSize: number
	toggleGrid: () => void
	setSize: (width: number, height: number) => void
	setPixelSize: (pixelSize: number) => void
	setPixelSizeMode: (mode: PixelSizeMode) => void
	resetPixelSize: () => void
	setAutoPixelSize: (pixelSize: number) => void
}

const GridContext = createContext<GridContextType>({
	width: DEFAULT_GRID_SIZE,
	height: DEFAULT_GRID_SIZE,
	showGrid: DEFAULT_SHOW_GRID,
	pixelSize: DEFAULT_PIXEL_SIZE,
	manualPixelSize: DEFAULT_PIXEL_SIZE,
	pixelSizeMode: DEFAULT_PIXEL_SIZE_MODE,
	toggleGrid: () => {},
	setSize: (_width: number, _height: number) => {},
	setPixelSize: (_pixelSize: number) => {},
	setPixelSizeMode: (_mode: PixelSizeMode) => {},
	resetPixelSize: () => {},
	setAutoPixelSize: (_pixelSize: number) => {},
})

const GridProvider = ({ children }: { children: React.ReactNode }) => {
	const [width, setWidth] = useLocalStorage<number>(
		'grid-width',
		DEFAULT_GRID_SIZE,
	)
	const [height, setHeight] = useLocalStorage<number>(
		'grid-height',
		DEFAULT_GRID_SIZE,
	)
	const [showGrid, setShowGrid] = useLocalStorage<boolean>(
		'show-grid',
		DEFAULT_SHOW_GRID,
	)
	const [pixelSizeMode, setPixelSizeMode] = useLocalStorage<PixelSizeMode>(
		'pixel-size-mode',
		DEFAULT_PIXEL_SIZE_MODE,
	)
	const [manualPixelSize, setManualPixelSize] = useLocalStorage<number>(
		'pixel-size',
		DEFAULT_PIXEL_SIZE,
	)
	const [autoPixelSize, setAutoPixelSize] = useState<number>(DEFAULT_PIXEL_SIZE)

	const pixelSize = pixelSizeMode === 'auto' ? autoPixelSize : manualPixelSize

	const toggleGrid = () => {
		setShowGrid((prev) => !prev)
	}

	const setPixelSize = (newPixelSize: number) => {
		setManualPixelSize(newPixelSize)
		setPixelSizeMode('manual')
	}

	const resetPixelSize = () => {
		setManualPixelSize(DEFAULT_PIXEL_SIZE)
	}

	const setSize = (newWidth: number, newHeight: number) => {
		setWidth(newWidth)
		setHeight(newHeight)
	}

	return (
		<GridContext.Provider
			value={{
				width,
				height,
				showGrid,
				pixelSize,
				pixelSizeMode,
				manualPixelSize,
				toggleGrid,
				setSize,
				setPixelSize,
				setPixelSizeMode,
				resetPixelSize,
				setAutoPixelSize,
			}}
		>
			{children}
		</GridContext.Provider>
	)
}

export { GridProvider, GridContext }
