import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { ColorProvider } from './contexts/color-context.tsx'
import { GridProvider } from './contexts/grid-context.tsx'
import { HistoryProvider } from './contexts/history-context.tsx'
import { LayerProvider } from './contexts/layer-context.tsx'
import { ThemeProvider } from './contexts/theme-context.tsx'
import { ToolProvider } from './contexts/tool-context.tsx'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Failed to find the root element')

createRoot(root).render(
	<StrictMode>
		<ThemeProvider>
			<ToolProvider>
				<ColorProvider>
					<HistoryProvider>
						<LayerProvider>
							<GridProvider>
								<App />
							</GridProvider>
						</LayerProvider>
					</HistoryProvider>
				</ColorProvider>
			</ToolProvider>
		</ThemeProvider>
	</StrictMode>,
)
