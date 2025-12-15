import { createContext, useCallback, useState } from 'react'
import {
	DEFAULT_PALETTE,
	DEFAULT_PRIMARY_COLOR,
	DEFAULT_SECONDARY_COLOR,
} from '../config/settings'
import { UseHotkey, useLocalStorage } from '../hooks'
import { hexToHSB, hsbToHex } from '../utils/color-converter'

type ColorContextType = {
	primary: string
	secondary: string
	palette: string[]
	setColor: (color: string) => void
	toggleActiveColor: () => void
	addToPalette: (color: string) => void
}

const ColorContext = createContext<ColorContextType>({
	primary: DEFAULT_PRIMARY_COLOR,
	secondary: DEFAULT_SECONDARY_COLOR,
	palette: [],
	setColor: () => null,
	toggleActiveColor: () => null,
	addToPalette: () => null,
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

	const normalizedPalette = DEFAULT_PALETTE.map(hexToHSB).map(hsbToHex)
	const [palette, setPalette] = useState<string[]>(normalizedPalette)

	const addToPalette = (color: string) => {
		setPalette((prev) => {
			if (prev.includes(color)) return prev
			return [...prev, color]
		})
	}

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
			value={{
				primary,
				secondary,
				palette,
				setColor: setPrimary,
				toggleActiveColor,
				addToPalette,
			}}
		>
			{children}
		</ColorContext.Provider>
	)
}

export { ColorProvider, ColorContext }
