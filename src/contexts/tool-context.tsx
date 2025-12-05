import { createContext } from 'react'
import { DEFAULT_TOOL } from '../config/settings'
import { useLocalStorage } from '../hooks'
import type { Tool } from '../types'

type ToolContextType = {
	tool: Tool
	setTool: (tool: Tool) => void
}

const ToolContext = createContext<ToolContextType>({
	tool: DEFAULT_TOOL,
	setTool: () => null,
})

const ToolProvider = ({ children }: { children: React.ReactNode }) => {
	const [tool, setTool] = useLocalStorage<Tool>('selected-tool', DEFAULT_TOOL)

	return (
		<ToolContext.Provider value={{ tool, setTool }}>
			{children}
		</ToolContext.Provider>
	)
}

export { ToolProvider, ToolContext }
