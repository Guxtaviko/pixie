export const colorBrightness = (hexColor: string): 'light' | 'dark' => {
	const hex = hexColor.replace('#', '')

	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	const brightness = (r * 299 + g * 587 + b * 114) / 1000

	// Return 'light' or 'dark' based on brightness threshold
	return brightness > 155 ? 'light' : 'dark'
}
