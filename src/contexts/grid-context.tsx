import { createContext } from 'react'
import {
	DEFAULT_GRID_SIZE,
	DEFAULT_PIXEL_SIZE,
	DEFAULT_SHOW_GRID,
} from '../config/settings'
import { useLocalStorage } from '../hooks'

type GridContextType = {
	width: number
	height: number
	showGrid: boolean
	pixelSize: number
	toggleGrid: () => void
	setSize: (width: number, height: number) => void
}

const GridContext = createContext<GridContextType>({
	width: DEFAULT_GRID_SIZE,
	height: DEFAULT_GRID_SIZE,
	showGrid: DEFAULT_SHOW_GRID,
	pixelSize: DEFAULT_PIXEL_SIZE,
	toggleGrid: () => {},
	setSize: (_width: number, _height: number) => {},
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
	const [pixelSize, _setPixelSize] = useLocalStorage<number>(
		'pixel-size',
		DEFAULT_PIXEL_SIZE,
	)

	const toggleGrid = () => {
		setShowGrid((prev) => !prev)
	}

	const setSize = (newWidth: number, newHeight: number) => {
		setWidth(newWidth)
		setHeight(newHeight)
	}

	return (
		<GridContext.Provider
			value={{ width, height, showGrid, pixelSize, toggleGrid, setSize }}
		>
			{children}
		</GridContext.Provider>
	)
}

export { GridProvider, GridContext }
