import { useEffect } from 'react'

export function UseHotkey(
	key: string,
	callback: () => void,
	allowRepeat = false,
) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() !== key.toLowerCase()) return
			if (!allowRepeat && e.repeat) return

			callback()
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [key, callback, allowRepeat])
}
