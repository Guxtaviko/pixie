import { createContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks'
import type { Theme } from '../types'

type ThemeContextType = {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	setTheme: () => null,
})

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const initalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
	const [theme, setTheme] = useLocalStorage<Theme>('theme', initalTheme)

	useEffect(() => {
		const isDark = theme === 'dark'

		const root = window.document.documentElement
		root.classList.toggle('dark', isDark)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export { ThemeProvider, ThemeContext }
