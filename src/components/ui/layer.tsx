import { useSortable } from '@dnd-kit/sortable'
import {
	Copy as CloneIcon,
	Trash2 as DeleteIcon,
	EyeOff as HiddenIcon,
	Lock as LockIcon,
	LockOpen as UnlockIcon,
	Eye as VisibleIcon,
} from 'lucide-react'
import { LayerContext } from '../../contexts/layer-context'
import { useSafeContext } from '../../hooks'
import type { Layer as LayerI } from '../../types'
import { Button } from './button'

interface LayerProps {
	data: LayerI
	allowDelete?: boolean
}

export const Layer = ({ data, allowDelete = false }: LayerProps) => {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: data.id,
	})

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				transition,
			}
		: undefined

	const {
		currentLayerId,
		setCurrentLayerId,
		removeLayer,
		toggleLayerVisibility,
		toggleLayerLock,
		updateLayer,
		cloneLayer,
	} = useSafeContext(LayerContext)

	const handleVisibilityToggle = (e: React.MouseEvent, id: string) => {
		e.stopPropagation()
		toggleLayerVisibility(id)
	}

	const handleLockToggle = (e: React.MouseEvent, id: string) => {
		e.stopPropagation()
		toggleLayerLock(id)
	}

	const handleClone = (e: React.MouseEvent, id: string) => {
		e.stopPropagation()
		cloneLayer(id)
	}

	const handleRemove = (e: React.MouseEvent, id: string) => {
		e.stopPropagation()
		removeLayer(id)
	}

	return (
		// biome-ignore lint/a11y: button inside button situation
		<div
			ref={setNodeRef}
			onClick={() => setCurrentLayerId(data.id)}
			className={`flex items-center p-2 rounded-lg border transition-colors group ${
				currentLayerId === data.id
					? 'border-cyan-500 bg-cyan-500/10'
					: 'border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'
			} ${isDragging ? 'cursor-grabbing z-50 opacity-80' : 'z-40'}`}
			{...attributes}
			{...listeners}
			style={style}
		>
			<Button
				onClick={(e) => handleVisibilityToggle(e, data.id)}
				className='p-1.5 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 rounded transition-colors'
			>
				{data.isVisible ? (
					<VisibleIcon size={14} />
				) : (
					<HiddenIcon size={14} className='text-slate-500' />
				)}
			</Button>
			<Button
				onClick={(e) => handleLockToggle(e, data.id)}
				className='p-1.5 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 rounded transition-colors'
			>
				{data.isLocked ? (
					<LockIcon size={14} className='text-cyan-500' />
				) : (
					<UnlockIcon size={14} />
				)}
			</Button>
			<input
				id={`data-${data.id}-name`}
				onChange={(e) => {
					updateLayer(data.id, { name: e.currentTarget.value })
				}}
				value={data.name}
				className='ml-2 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap outline-none bg-transparent text-left text-sm'
			/>
			<Button
				onClick={(e) => handleClone(e, data.id)}
				className='p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 rounded transition-colors'
			>
				<CloneIcon size={14} />
			</Button>
			{allowDelete && (
				<Button
					onClick={(e) => handleRemove(e, data.id)}
					className='p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 rounded transition-colors'
				>
					<DeleteIcon size={14} />
				</Button>
			)}
		</div>
	)
}
