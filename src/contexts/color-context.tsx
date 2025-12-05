import { createContext, useCallback } from 'react'
import {
	DEFAULT_PRIMARY_COLOR,
	DEFAULT_SECONDARY_COLOR,
} from '../config/settings'
import { UseHotkey, useLocalStorage } from '../hooks'

type ColorContextType = {
	primary: string
	secondary: string
	setColor: (color: string) => void
	toggleActiveColor: () => void
}

const ColorContext = createContext<ColorContextType>({
	primary: DEFAULT_PRIMARY_COLOR,
	secondary: DEFAULT_SECONDARY_COLOR,
	setColor: () => null,
	toggleActiveColor: () => null,
})

const ColorProvider = ({ children }: { children: React.ReactNode }) => {
	const [primary, setPrimary] = useLocalStorage<string>(
		'primary-color',
		DEFAULT_PRIMARY_COLOR,
	)
	const [secondary, setSecondary] = useLocalStorage<string>(
		'secondary-color',
		DEFAULT_SECONDARY_COLOR,
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
