import { useCallback } from 'react'
import type { Layer } from '@/types'

type UsePickerToolProps = {
	layers: Layer[]
	setColor: (color: string) => void
	addToPalette: (color: string) => void
	validateCoordinates: (x: number, y: number) => boolean
}

export function usePickerTool({
	layers,
	setColor,
	addToPalette,
	validateCoordinates,
}: UsePickerToolProps) {
	const pickColor = useCallback(
		(x: number, y: number) => {
			if (!validateCoordinates(x, y)) return null

			for (let i = 0; i < layers.length; i++) {
				const layer = layers[i]
				if (!layer.isVisible) continue

				const color = layer.data[y]?.[x]
				if (color && color !== 'transparent') {
					setColor(color)
					addToPalette(color)
				}
			}

			return null
		},
		[layers, validateCoordinates, setColor, addToPalette],
	)

	return { pickColor }
}
