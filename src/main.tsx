import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { ColorProvider } from './contexts/color-context.tsx'
import { ThemeProvider } from './contexts/theme-context.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Failed to find the root element')

createRoot(root).render(
	<StrictMode>
		<ThemeProvider>
			<ColorProvider>
				<App />
			</ColorProvider>
		</ThemeProvider>
	</StrictMode>,
)
