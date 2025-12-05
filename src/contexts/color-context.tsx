import { createContext, useCallback } from 'react'
import { DEFAULT_PALETTE } from '../config/settings'
import { useLocalStorage } from '../hooks'
import { UseHotkey } from '../hooks/use-hotkey'

type ColorContextType = {
	primary: string
	secondary: string
	setColor: (color: string) => void
	toggleActiveColor: () => void
}

const ColorContext = createContext<ColorContextType>({
	primary: DEFAULT_PALETTE[0],
	secondary: DEFAULT_PALETTE[1],
	setColor: () => null,
	toggleActiveColor: () => null,
})

const ColorProvider = ({ children }: { children: React.ReactNode }) => {
	const [primary, setPrimary] = useLocalStorage<string>(
		'primary-color',
		DEFAULT_PALETTE[0],
	)
	const [secondary, setSecondary] = useLocalStorage<string>(
		'secondary-color',
		DEFAULT_PALETTE[1],
	)

	const toggleActiveColor = useCallback(() => {
		setPrimary((prev) => {
			const temp = secondary
			setSecondary(prev)
			return temp
		})
	}, [secondary, setPrimary, setSecondary])

	UseHotkey('x', toggleActiveColor)

	return (
		<ColorContext.Provider
			value={{ primary, secondary, setColor: setPrimary, toggleActiveColor }}
		>
			{children}
		</ColorContext.Provider>
	)
}

export { ColorProvider, ColorContext }
