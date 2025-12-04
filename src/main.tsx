import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Failed to find the root element')

createRoot(root).render(
	<StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</StrictMode>,
)
