import { createContext, useEffect, useState } from 'react'
import { DEFAULT_LAYER_OPTIONS } from '../config/settings'
import { useLocalStorage } from '../hooks'
import type { Layer } from '../types'

type LayerContextType = {
	layers: Layer[]
	currentLayerId: string | null
	setCurrentLayerId: (id: string | null) => void
	addLayer: () => void
	toggleLayerVisibility: (id: string) => void
	removeLayer: (id: string) => void
	toggleLayerLock: (id: string) => void
	updateLayer: (id: string, updatedLayer: Partial<Layer>) => void
	cloneLayer: (id: string) => void
}

const LayerContext = createContext<LayerContextType>({
	layers: [],
	currentLayerId: null,
	setCurrentLayerId: () => null,
	addLayer: () => null,
	removeLayer: () => null,
	toggleLayerVisibility: () => null,
	toggleLayerLock: () => null,
	updateLayer: () => null,
	cloneLayer: () => null,
})

const LayerProvider = ({ children }: { children: React.ReactNode }) => {
	const [layers, setLayers] = useLocalStorage<Layer[]>('layers', [
		{
			id: crypto.randomUUID(),
			name: 'Camada 1',
			...DEFAULT_LAYER_OPTIONS,
		},
	])
	const [currentLayerId, setCurrentLayerId] = useState<string | null>(
		layers[0]?.id || null,
	)

	const addLayer = () => {
		const layer: Layer = {
			id: crypto.randomUUID(),
			name: `Camada ${layers.length + 1}`,
			...DEFAULT_LAYER_OPTIONS,
		}
		setLayers((prevLayers) => [layer, ...prevLayers])
		setCurrentLayerId(layer.id)
	}

	const removeLayer = (id: string) => {
		if (layers.length === 1) return // Prevent removing the last layer
		setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== id))
		if (currentLayerId === id) setCurrentLayerId(layers[0]?.id || null)
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

		setLayers((prevLayers) => [clonedLayer, ...prevLayers])
		setCurrentLayerId(clonedLayer.id)
	}

	return (
		<LayerContext.Provider
			value={{
				layers,
				currentLayerId,
				setCurrentLayerId,
				addLayer,
				removeLayer,
				toggleLayerVisibility,
				toggleLayerLock,
				updateLayer,
				cloneLayer,
			}}
		>
			{children}
		</LayerContext.Provider>
	)
}

export { LayerProvider, LayerContext }
