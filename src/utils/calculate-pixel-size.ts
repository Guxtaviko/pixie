import {
	DEFAULT_PIXEL_SIZE,
	GRID_FIT_MULTIPLIER,
	MIN_PIXEL_SIZE,
} from '@/config/settings'

interface CalculatePixelSizeParams {
	availableWidth: number
	availableHeight: number
	gridWidth: number
	gridHeight: number
	fitMultiplier?: number
}

export const calculatePixelSize = ({
	availableWidth,
	availableHeight,
	gridWidth,
	gridHeight,
	fitMultiplier = GRID_FIT_MULTIPLIER,
}: CalculatePixelSizeParams): number => {
	if (gridWidth <= 0 || gridHeight <= 0) return DEFAULT_PIXEL_SIZE

	const fitWidth = (availableWidth * fitMultiplier) / gridWidth
	const fitHeight = (availableHeight * fitMultiplier) / gridHeight
	const fitSize = Math.floor(Math.min(fitWidth, fitHeight))

	return Math.max(fitSize, MIN_PIXEL_SIZE)
}
