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

			// Ignore if focus is on an input, textarea, or contenteditable element
			const target = e.target as HTMLElement
			const tagName = target.tagName.toLowerCase()
			const isContentEditable = target.isContentEditable
			if (tagName === 'input' || tagName === 'textarea' || isContentEditable) {
				return
			}

			callback()
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [key, callback, allowRepeat])
}
