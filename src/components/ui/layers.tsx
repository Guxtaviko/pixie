import {
	Copy as CloneIcon,
	Trash2 as DeleteIcon,
	EyeOff as HiddenIcon,
	Layers as LayersIcon,
	Lock as LockIcon,
	Plus as PlusIcon,
	LockOpen as UnlockIcon,
	Eye as VisibleIcon,
} from 'lucide-react'
import { LayerContext } from '../../contexts/layer-context'
import { useSafeContext } from '../../hooks'
import { Button } from './button'

export const Layers = () => {
	const {
		layers,
		currentLayerId,
		setCurrentLayerId,
		addLayer,
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
		<div className='border-t border-slate-200 dark:border-slate-800'>
			<div className='flex items-center justify-between my-4'>
				<h2 className='text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2'>
					<LayersIcon size={16} />
					<span>Camadas</span>
				</h2>
				<Button
					onClick={addLayer}
					className='p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-cyan-500/25 hover:text-cyan-400 rounded-lg transition-colors'
				>
					<PlusIcon size={16} />
				</Button>
			</div>
			<div className='flex flex-col gap-1'>
				{layers.map((layer) => (
					<Button
						key={layer.id}
						onClick={() => setCurrentLayerId(layer.id)}
						className={`flex items-center p-2 rounded-lg border transition-all group ${
							currentLayerId === layer.id
								? 'border-cyan-500 bg-cyan-500/10'
								: 'border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'
						}`}
					>
						<Button
							onClick={(e) => handleVisibilityToggle(e, layer.id)}
							className='p-1.5 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 rounded transition-colors'
						>
							{layer.isVisible ? (
								<VisibleIcon size={14} />
							) : (
								<HiddenIcon size={14} className='text-slate-500' />
							)}
						</Button>
						<Button
							onClick={(e) => handleLockToggle(e, layer.id)}
							className='p-1.5 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 rounded transition-colors'
						>
							{layer.isLocked ? (
								<LockIcon size={14} className='text-cyan-500' />
							) : (
								<UnlockIcon size={14} />
							)}
						</Button>
						<input
							id={`layer-${layer.id}-name`}
							onChange={(e) => {
								updateLayer(layer.id, { name: e.currentTarget.value })
							}}
							value={layer.name}
							className='ml-2 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap outline-none bg-transparent text-left text-sm'
						/>
						<Button
							onClick={(e) => handleClone(e, layer.id)}
							className='p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 rounded transition-colors'
						>
							<CloneIcon size={14} />
						</Button>
						{layers.length > 1 && (
							<Button
								onClick={(e) => handleRemove(e, layer.id)}
								className='p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 rounded transition-colors'
							>
								<DeleteIcon size={14} />
							</Button>
						)}
					</Button>
				))}
			</div>
		</div>
	)
}
