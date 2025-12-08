import { createContext } from 'react'
import { MAX_HISTORY_LENGTH } from '../config/settings'
import { useLocalStorage } from '../hooks'
import type { Layer } from '../types'

type HistoryContextType = {
	undo: () => Layer[] | null
	redo: () => Layer[] | null
	canUndo: boolean
	canRedo: boolean
	saveToHistory: (state: Layer[]) => void
	history: Layer[][]
}

const HistoryContext = createContext<HistoryContextType>({
	undo: () => [],
	redo: () => [],
	canUndo: false,
	canRedo: false,
	saveToHistory: (_state: Layer[]) => {},
	history: [],
})

const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
	const [history, setHistory] = useLocalStorage<Layer[][]>('history', [])
	const [index, setIndex] = useLocalStorage<number>('history-index', -1)

	const canUndo = index > 0
	const canRedo = index < history.length - 1

	const deepCopy = (raw: Layer[]) =>
		raw.map((l) => ({
			...l,
			data: l.data?.map((row) => row?.slice() || []),
		}))

	const saveToHistory = (layers: Layer[]) => {
		const newHistory = history.slice(0, index + 1)
		const state = deepCopy(layers)
		newHistory.push(state)

		if (newHistory.length > MAX_HISTORY_LENGTH) newHistory.shift()

		setHistory(newHistory)
		setIndex(newHistory.length - 1)
	}

	const undo = () => {
		if (!canUndo) return null
		const newIndex = index - 1
		const restoredState = deepCopy(history[newIndex])

		setIndex(newIndex)
		return restoredState
	}

	const redo = () => {
		if (!canRedo) return null
		const newIndex = index + 1
		const restoredState = deepCopy(history[newIndex])

		setIndex(newIndex)
		return restoredState
	}

	return (
		<HistoryContext.Provider
			value={{ undo, redo, canUndo, canRedo, saveToHistory, history }}
		>
			{children}
		</HistoryContext.Provider>
	)
}

export { HistoryProvider, HistoryContext }
