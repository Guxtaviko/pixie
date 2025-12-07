interface HSB {
	h: number
	s: number
	b: number
}

export const hexToHSB = (hex: string): HSB => {
	hex = hex.startsWith('#') ? hex : `#${hex}`

	const r = parseInt(hex.slice(1, 3), 16) / 255
	const g = parseInt(hex.slice(3, 5), 16) / 255
	const b = parseInt(hex.slice(5, 7), 16) / 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const delta = max - min

	let hue = 0
	const saturation = max === 0 ? 0 : delta / max
	const brightness = max

	if (delta !== 0) {
		switch (max) {
			case r:
				hue = (g - b) / delta + (g < b ? 6 : 0)
				break
			case g:
				hue = (b - r) / delta + 2
				break
			case b:
				hue = (r - g) / delta + 4
				break
		}

		hue /= 6
	}

	return {
		h: Math.round(hue * 360),
		s: Math.round(saturation * 100),
		b: Math.round(brightness * 100),
	}
}

export const hsbToHex = ({ h, s, b }: HSB): string => {
	s /= 100
	b /= 100

	// c = chroma, x = second largest component, m = match brightness
	const c = b * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = b - c

	const sector = Math.floor(h / 60) % 6
	const combos = [
		[c, x, 0],
		[x, c, 0],
		[0, c, x],
		[0, x, c],
		[x, 0, c],
		[c, 0, x],
	]

	let [red, green, blue] = combos[sector]

	red = Math.round((red + m) * 255)
	green = Math.round((green + m) * 255)
	blue = Math.round((blue + m) * 255)

	const toHex = (value: number) => value.toString(16).padStart(2, '0')

	return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}
