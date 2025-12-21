import { useCallback, useEffect, useRef, useState } from 'react'
import { ColorContext } from '../../contexts/color-context'
import { UseHotkey, useSafeContext } from '../../hooks'
import { hexToHSB, hsbToHex } from '../../utils/color-converter'

interface ColorSelectorProps {
	showPreview?: boolean
	handleClose: () => void
	onColorChange: (color: string) => void
}

export const ColorSelector = ({
	handleClose,
	onColorChange,
	showPreview = false,
}: ColorSelectorProps) => {
	const { primary } = useSafeContext(ColorContext)
	const [customColor, setCustomColor] = useState(primary)
	const hsb = hexToHSB(customColor)
	const [hue, setHue] = useState(hsb.h)
	const [saturation, setSaturation] = useState(hsb.s)
	const [brightness, setBrightness] = useState(hsb.b)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			const activator = target.closest('.color-selector-activator')
			const wrapper = activator?.closest('.color-selector-wrapper')
			const wrapperMatches = wrapper?.querySelector('#color-selector')

			if (target.closest('#color-selector') || wrapperMatches) return

			handleClose()
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handleClose])

	UseHotkey('Escape', handleClose)

	useEffect(() => {
		const hex = hsbToHex({ h: hue, s: saturation, b: brightness })
		setCustomColor(hex)
		onColorChange(hex)
	}, [hue, saturation, brightness, onColorChange])

	const colorRef = useRef<HTMLDivElement>(null)
	const pickerRef = useRef<HTMLDivElement>(null)
	const hueRef = useRef<HTMLDivElement>(null)

	const isDragging = useRef(false)

	const setPickerPosition = useCallback(() => {
		if (!colorRef.current || !pickerRef.current) return

		const rect = colorRef.current.getBoundingClientRect()
		const x = (hsb.s / 100) * rect.width
		const y = ((100 - hsb.b) / 100) * rect.height

		const { width, height } = pickerRef.current.getBoundingClientRect()

		pickerRef.current.style.left = `${x - width / 2}px`
		pickerRef.current.style.top = `${y - height / 2}px`
	}, [hsb])

	useEffect(() => {
		setPickerPosition()
	}, [setPickerPosition])

	const updateColor = (e: React.MouseEvent) => {
		if (!colorRef.current || !pickerRef.current) return

		const rect = colorRef.current.getBoundingClientRect()
		let x = e.clientX - rect.left
		let y = e.clientY - rect.top

		x = Math.max(0, Math.min(x, rect.width))
		y = Math.max(0, Math.min(y, rect.height))

		const newSaturation = Math.round((x / rect.width) * 100)
		const newBrightness = 100 - Math.round((y / rect.height) * 100)

		setSaturation(newSaturation)
		setBrightness(newBrightness)

		setPickerPosition()
	}

	const updateHue = (e: React.MouseEvent) => {
		if (!hueRef.current) return

		const rect = hueRef.current.getBoundingClientRect()
		let x = e.clientX - rect.left

		x = Math.max(0, Math.min(x, rect.width))

		const newHue = Math.round((x / rect.width) * 360)
		setHue(newHue)
	}

	const handleMouseDown =
		(action: 'hue' | 'color') => (e: React.MouseEvent) => {
			isDragging.current = true
			return action === 'hue' ? updateHue(e) : updateColor(e)
		}

	const handleMouseMove =
		(action: 'hue' | 'color') => (e: React.MouseEvent) => {
			if (!isDragging.current) return

			return action === 'hue' ? updateHue(e) : updateColor(e)
		}

	const handleMouseUp = () => {
		isDragging.current = false
	}

	const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value
		setCustomColor(raw)

		const value = raw.startsWith('#') ? raw : `#${raw}`

		if (/^#([0-9A-Fa-f]{6})$/.test(value)) {
			const newHSB = hexToHSB(value)
			setHue(newHSB.h)
			setSaturation(newHSB.s)
			setBrightness(newHSB.b)
		}
	}

	return (
		<div
			id='color-selector'
			className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 w-fit flex gap-4'
		>
			<div className='flex flex-col gap-3'>
				<div
					role='application'
					ref={colorRef}
					onMouseDown={handleMouseDown('color')}
					onMouseMove={handleMouseMove('color')}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					className={`relative min-w-36 w-full h-36 cursor-crosshair rounded-md`}
					style={{
						backgroundColor: `hsl(${hue}, 100%, 50%)`,
						backgroundImage: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)`,
					}}
				>
					<div
						ref={pickerRef}
						className='absolute w-3.5 h-3.5 rounded-full border-2 border-white'
					/>
				</div>
				<div
					role='application'
					ref={hueRef}
					onMouseDown={handleMouseDown('hue')}
					onMouseMove={handleMouseMove('hue')}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					className='relative w-full h-2 rounded'
					style={{
						backgroundImage: `
              linear-gradient(in hsl longer hue 90deg, red 0 100%),
              linear-gradient(
                90deg,
                rgba(255, 0, 0, 1) 0%,
                rgba(255, 154, 0, 1) 10%,
                rgba(208, 222, 33, 1) 20%,
                rgba(79, 220, 74, 1) 30%,
                rgba(63, 218, 216, 1) 40%,
                rgba(47, 201, 226, 1) 50%,
                rgba(28, 127, 238, 1) 60%,
                rgba(95, 21, 242, 1) 70%,
                rgba(186, 12, 248, 1) 80%,
                rgba(251, 7, 217, 1) 90%,
                rgba(255, 0, 0, 1) 100%)
              `,
					}}
				>
					<div
						className='absolute -top-[3.5px] w-3.5 h-3.5 rounded-full border-2 border-white'
						style={{ left: `calc(${(hue / 360) * 100}% - 7px)` }}
					/>
				</div>
				<div className='flex gap-2'>
					{showPreview && (
						// Color preview box
						<div
							className='min-w-10 h-full mb-2 rounded-md border-2 border-slate-200 dark:border-slate-800'
							style={{
								backgroundColor: customColor,
							}}
						/>
					)}
					<input
						type='text'
						value={customColor}
						maxLength={7}
						onChange={handleColorInputChange}
						className='w-36 p-1 text-center text-sm rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none'
					/>
				</div>
			</div>
		</div>
	)
}
