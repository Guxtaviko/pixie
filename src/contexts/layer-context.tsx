import { createContext, useEffect } from 'react'
import { DEFAULT_LAYER_OPTIONS } from '../config/settings'
import { useLocalStorage, useSafeContext } from '../hooks'
import type { Layer } from '../types'
import { HistoryContext } from './history-context'

type LayerContextType = {
	layers: Layer[]
	setLayers: (layers: Layer[]) => void
	currentLayerId: string | null
	setCurrentLayerId: (id: string | null) => void
	addLayer: () => void
	toggleLayerVisibility: (id: string) => void
	removeLayer: (id: string) => void
	toggleLayerLock: (id: string) => void
	updateLayer: (id: string, updatedLayer: Partial<Layer>) => void
	cloneLayer: (id: string) => void
	clearLayers: () => void
}

const LayerContext = createContext<LayerContextType>({
	layers: [],
	setLayers: () => {},
	currentLayerId: null,
	setCurrentLayerId: () => null,
	addLayer: () => null,
	removeLayer: () => null,
	toggleLayerVisibility: () => null,
	toggleLayerLock: () => null,
	updateLayer: () => null,
	cloneLayer: () => null,
	clearLayers: () => null,
})

const LayerProvider = ({ children }: { children: React.ReactNode }) => {
	const [layers, setLayers] = useLocalStorage<Layer[]>('layers', [
		{
			id: crypto.randomUUID(),
			name: 'Camada 1',
			...DEFAULT_LAYER_OPTIONS,
		},
	])
	const [currentLayerId, setCurrentLayerId] = useLocalStorage<string | null>(
		'current-layer-id',
		layers[0]?.id || null,
	)
	const { saveToHistory, history } = useSafeContext(HistoryContext)

	useEffect(() => {
		if (history.length === 0) saveToHistory(layers)
	}, [history, layers, saveToHistory])

	const addLayer = () => {
		const layer: Layer = {
			id: crypto.randomUUID(),
			name: `Camada ${layers.length + 1}`,
			...DEFAULT_LAYER_OPTIONS,
		}
		const newLayers = [...layers, layer]

		setLayers(newLayers)
		setCurrentLayerId(layer.id)

		saveToHistory(newLayers)
	}

	const removeLayer = (id: string) => {
		if (layers.length === 1) return // Prevent removing the last layer

		const newLayers = layers.filter((layer) => layer.id !== id)
		setLayers(newLayers)

		if (currentLayerId === id)
			setCurrentLayerId(newLayers.find((layer) => layer.id !== id)?.id || null)

		saveToHistory(newLayers)
	}

	const toggleLayerVisibility = (id: string) => {
		setLayers((prevLayers) =>
			prevLayers.map((layer) =>
				layer.id === id ? { ...layer, isVisible: !layer.isVisible } : layer,
			),
		)
	}

	const toggleLayerLock = (id: string) => {
		setLayers((prevLayers) =>
			prevLayers.map((layer) =>
				layer.id === id ? { ...layer, isLocked: !layer.isLocked } : layer,
			),
		)
	}

	const updateLayer = (id: string, updatedLayer: Partial<Layer>) => {
		setLayers((prevLayers) =>
			prevLayers.map((layer) =>
				layer.id === id ? { ...layer, ...updatedLayer } : layer,
			),
		)
	}

	const cloneLayer = (id: string) => {
		const layerToClone = layers.find((layer) => layer.id === id)
		if (!layerToClone) return

		const clonedLayer: Layer = {
			...layerToClone,
			id: crypto.randomUUID(),
			name: `${layerToClone.name} (cópia)`,
		}

		setLayers((prevLayers) => [...prevLayers, clonedLayer])
		setCurrentLayerId(clonedLayer.id)
	}

	const clearLayers = () => {
		setLayers((prevLayers) =>
			prevLayers.map((layer) => ({ ...layer, data: [] })),
		)
	}

	return (
		<LayerContext.Provider
			value={{
				layers,
				setLayers,
				currentLayerId,
				setCurrentLayerId,
				addLayer,
				removeLayer,
				toggleLayerVisibility,
				toggleLayerLock,
				updateLayer,
				cloneLayer,
				clearLayers,
			}}
		>
			{children}
		</LayerContext.Provider>
	)
}

export { LayerProvider, LayerContext }
